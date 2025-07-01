package com.sitecraft.backend.Services;
import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.OTPRepo;
import com.sitecraft.backend.Repositories.StoreRepo;
import com.sitecraft.backend.Repositories.UserRepo;
import com.sitecraft.backend.Repositories.UserRoleRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserRoleRepo userRoleRepo;

    @Autowired
    private OTPRepo otpRepo;

    @Autowired
    private StoreService storeService;

    private final JavaMailSender mailSender; // You need to configure this

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public List<Users> getAllUsers() {
        return userRepo.findAll();
    }

    @Transactional
    public Users register(Users users) {
        System.out.println("🔧 UserService.register called for: " + users.getEmail());
        
        // Check if user can register as owner (not already an owner)
        if (!canRegisterAsOwner(users.getEmail())) {
            throw new RuntimeException("User with this email is already an owner of another store");
        }
        
        // Encode password
        String encodedPassword = passwordEncoder.encode(users.getPassword());
        users.setPassword(encodedPassword);
        System.out.println("🔐 Password encoded successfully");
        
        // Save the user first
        Users savedUser = userRepo.save(users);
        System.out.println("✅ User saved with ID: " + savedUser.getId());
        
        // Note: Store will be created later in the branding flow
        // No automatic store creation during registration
        
        return savedUser;
    }

    public boolean isUserExists(String email) {
        return userRepo.findByEmail(email) != null;
    }

    public boolean isAnyUserExists(String email) {
        return !userRepo.findAllByEmail(email).isEmpty();
    }

    public boolean canRegisterAsOwner(String email) {
        // Check if user exists with 'owner' role anywhere
        List<Users> usersWithEmail = userRepo.findAllByEmail(email);
        for (Users user : usersWithEmail) {
            UserRole role = userRoleRepo.findByUser(user);
            if (role != null && "owner".equals(role.getRole())) {
                return false; // Already an owner somewhere
            }
        }
        return true; // Can register as owner
    }

    public boolean canAddAsStaff(String email, Long storeId) {
        // Check if user already has staff role in THIS specific store
        List<Users> usersWithEmail = userRepo.findAllByEmail(email);
        for (Users user : usersWithEmail) {
            UserRole role = userRoleRepo.findByStoreIdAndUser(storeId, user);
            if (role != null && "staff".equals(role.getRole())) {
                return false; // Already staff in THIS store
            }
        }
        return true; // Can add as staff in THIS store
    }

    public UserRole getUserRole(Long userId) {
        Users user = userRepo.findById(userId).orElse(null);
        if (user == null) return null;
        return userRoleRepo.findByUser(user);
    }

    public Users login(String email, String password) {
        // Find all users with this email (could be multiple due to multi-store setup)
        List<Users> usersWithEmail = userRepo.findAllByEmail(email);
        if (usersWithEmail.isEmpty()) return null;

        // Find the user with the correct password
        Users authenticatedUser = null;
        for (Users user : usersWithEmail) {
            if (passwordEncoder.matches(password, user.getPassword())) {
                authenticatedUser = user;
                break;
            }
        }

        if (authenticatedUser == null) return null;

        // Get the role for this specific user
        UserRole userRole = userRoleRepo.findByUser(authenticatedUser);
        Long storeId = null;
        if (userRole != null) {
            authenticatedUser.setRole(userRole.getRole());
            storeId = userRole.getStoreId();
        }
        else {
            authenticatedUser.setRole("undefined");
        }
        authenticatedUser.setStoreId(storeId);
        return authenticatedUser;
    }

    public void sendOTP(String email) {
        System.out.println("📧 UserService.sendOTP called for: " + email);
        // Find all users with this email and use the first one for OTP
        List<Users> usersWithEmail = userRepo.findAllByEmail(email);
        if (usersWithEmail.isEmpty()) {
            System.out.println("❌ User not found in sendOTP: " + email);
            return;
        }

        Users user = usersWithEmail.get(0); // Use the first user for OTP
        System.out.println("✅ User found, deactivating old OTPs...");
        // Deactivate old OTPs
        List<OTP> oldOtps = otpRepo.findByUserIdAndActiveTrue(String.valueOf(user.getId()));
        for (OTP o : oldOtps) {
            o.setActive(false);
        }
        otpRepo.saveAll(oldOtps);
        System.out.println("✅ Old OTPs deactivated");

        // 1. Generate a 6-digit random OTP
        String otpCode = String.format("%06d", new Random().nextInt(999999));
        System.out.println("🔐 Generated OTP code: " + otpCode);

        OTP otp = new OTP();
        otp.setCode(otpCode);
        otp.setActive(true);
        otp.setUserId(String.valueOf(user.getId()));
        otp.setUserType("user");
        otp.setCreatedAt(LocalDateTime.now());
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5)); // expires in 5 minutes
        otpRepo.save(otp);
        System.out.println("✅ OTP saved to database");

        // 3. Send OTP by email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Your OTP Code");
        message.setText("Your OTP is: " + otpCode + "\nIt is valid for 5 minutes.");
        mailSender.send(message);
        System.out.println("✅ OTP email sent to: " + user.getEmail());
    }

    public void verifyOTP(String email, String code) {
        System.out.println("🔐 UserService.verifyOTP called for: " + email + " with code: " + code);
        try {
            // Find all users with this email and use the first one for OTP verification
            List<Users> usersWithEmail = userRepo.findAllByEmail(email);
            if (usersWithEmail.isEmpty()) {
                System.out.println("❌ User not found in verifyOTP: " + email);
                throw new RuntimeException("User not found");
            }
            
            Users user = usersWithEmail.get(0); // Use the first user for OTP verification
            System.out.println("✅ User found, searching for valid OTP...");
            OTP otp = otpRepo.findTopByUserIdAndCodeAndActiveTrueAndExpiresAtAfterOrderByCreatedAtDesc(String.valueOf(user.getId()), code, LocalDateTime.now());

            if (otp == null) {
                System.out.println("❌ Invalid or expired OTP for user: " + email);
                throw new RuntimeException("Invalid or expired OTP");
            }

            System.out.println("✅ Valid OTP found, deactivating...");
            // Deactivate OTP
            otp.setActive(false);
            otpRepo.save(otp);
            System.out.println("✅ OTP deactivated successfully");

        } catch (Exception e) {
            System.out.println("💥 Verify OTP error: " + e.getMessage());
            throw new RuntimeException("Failed to verify OTP: " + e.getMessage(), e);
        }
    }

    public void resetPassword(String email, String newPassword) {
        try {
            if (newPassword == null || newPassword.length() < 8) {
                throw new RuntimeException("Password must be at least 8 characters long.");
            }
            
            // Find all users with this email and update all of them
            List<Users> usersWithEmail = userRepo.findAllByEmail(email);
            if (usersWithEmail.isEmpty()) {
                throw new RuntimeException("User not found");
            }
            
            String encodedPassword = new BCryptPasswordEncoder().encode(newPassword);
            
            // Update password for all users with this email
            for (Users user : usersWithEmail) {
            user.setPassword(encodedPassword);
            userRepo.save(user);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to reset password: " + e.getMessage(), e);
        }
    }


    // -------------------------------------------- staff management ---------------------------------------------------

    public List<Users> getAllStaffByStoreId(Long storeId) {
        try {
            return userRoleRepo.findByRoleAndStoreId("staff", storeId)
                    .stream()
                    .map(UserRole::getUser)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to get staff of the store: " + e.getMessage());
        }
    }

    public Users addStaff(Users user) {
        try {
            // Check if user can be added as staff in this store
            boolean canAdd = canAddAsStaff(user.getEmail(), user.getStoreId());
            if (!canAdd) {
                throw new RuntimeException("User with this email is already staff in this store");
            }

            // Always create a new user record for each store to maintain separate passwords
            // This ensures each store has its own user record with its own password
            String generatedPassword = UUID.randomUUID().toString().substring(0, 8);
            user.setPassword(generatedPassword);
            sendStaffCredentialsEmail(user.getEmail(), user.getStoreId(), generatedPassword);
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            Users userToSave = userRepo.save(user);

            // Create staff role for this store
            UserRole userRole = new UserRole();
            userRole.setRole("staff");
            userRole.setUser(userToSave);
            userRole.setStoreId(user.getStoreId());
            userRoleRepo.save(userRole);

            return userToSave;
        } catch (Exception e) {
            throw new RuntimeException("Failed to add staff to the store: " + e.getMessage());
        }
    }

    @Transactional
    public void removeStaff(Long storeId, Long userId) {
        try {
            Users existing = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Staff not found"));

            if (userRoleRepo.findByStoreIdAndUser(storeId, existing) == null) {
                throw new IllegalAccessException("Staff does not belong to your store");
            }

            // Remove the specific role for this store
            userRoleRepo.deleteByUserAndStoreId(existing, storeId);
            
            // Check if user has any other roles by trying to find any remaining role
            UserRole remainingRole = userRoleRepo.findByUser(existing);
            
            // Only delete the user if they have no other roles
            if (remainingRole == null) {
            userRepo.deleteById(userId);
            }
            // If user has other roles, keep the user record (they can still access other stores)
        } catch (Exception e) {
            throw new RuntimeException("Failed to remove staff from the store: " + e.getMessage());
        }
    }

    private void sendCredentialsEmail(String to, String username, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your Staff Account Credentials");
        message.setText("Login Email: " + username + "\nPassword: " + password);
        mailSender.send(message);
    }

    private void sendStaffCredentialsEmail(String email, Long storeId, String password) {
        try {
            // Get store name for the email
            String storeName = "the store";
            try {
                Store store = storeService.getStore(storeId);
                if (store != null) {
                    storeName = store.getStoreName();
                }
            } catch (Exception e) {
                System.out.println("⚠️ Could not get store name for email: " + e.getMessage());
            }
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your Staff Account Credentials for " + storeName);
            message.setText("Hello,\n\nYou have been added as a staff member to " + storeName + ".\n\n" +
                          "Your login credentials:\n" +
                          "Email: " + email + "\n" +
                          "Password: " + password + "\n\n" +
                          "You can use these credentials to log in and access this store.\n\n" +
                          "Best regards,\nSiteCraft Team");
            mailSender.send(message);
            System.out.println("✅ Staff credentials email sent to: " + email + " for store: " + storeName);
        } catch (Exception e) {
            System.out.println("⚠️ Failed to send staff credentials email: " + e.getMessage());
        }
    }
    
    /**
     * Send low stock notification email
     */
    public void sendLowStockNotificationEmail(String email, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject(subject);
            message.setText(content);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send low stock notification email: " + e.getMessage());
        }
    }
}
