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
        
        // Encode password
        String encodedPassword = passwordEncoder.encode(users.getPassword());
        users.setPassword(encodedPassword);
        System.out.println("🔐 Password encoded successfully");
        
        // Save the user first
        Users savedUser = userRepo.save(users);
        System.out.println("✅ User saved with ID: " + savedUser.getId());
        
        // Create a default store for the user
        Store defaultStore = new Store();
        defaultStore.setStoreName(users.getName() + "'s Store");
        defaultStore.setStoreType("General");
        defaultStore.setDescription("Store created for " + users.getName());
        defaultStore.setEmailAddress(users.getEmail());
        defaultStore.setPhoneNumber(users.getPhone());
        defaultStore.setCreationDate(LocalDateTime.now());
        
        System.out.println("🏪 Creating store: " + defaultStore.getStoreName());
        
        // Create the store and assign user as owner
        Store createdStore = storeService.createStore(defaultStore, savedUser.getId());
        System.out.println("✅ Store created with ID: " + createdStore.getId());
        
        return savedUser;
    }

    public boolean isUserExists(String email) {
        Users users = userRepo.findByEmail(email);
        return users != null;
    }

    public UserRole getUserRole(Long userId) {
        Users user = userRepo.findById(userId).orElse(null);
        if (user == null) return null;
        return userRoleRepo.findByUser(user);
    }

    public Users login(String email, String password) {
        Users user = userRepo.findByEmail(email);
        if (user == null) return null;

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return null;
        }

        UserRole userRole = userRoleRepo.findByUser(user);
        Long storeId = null;
        if (userRole != null) {
            user.setRole(userRole.getRole());
            storeId = userRole.getStoreId();
        }
        else {
            user.setRole("undefined");
        }
        user.setStoreId(storeId);
        return user;
    }

    public void sendOTP(String email) {
        System.out.println("📧 UserService.sendOTP called for: " + email);
        Users user = userRepo.findByEmail(email);
        if (user == null) {
            System.out.println("❌ User not found in sendOTP: " + email);
            return;
        }

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
            Users user = userRepo.findByEmail(email);
            if (user == null) {
                System.out.println("❌ User not found in verifyOTP: " + email);
                throw new RuntimeException("User not found");
            }
            
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
            Users user = userRepo.findByEmail(email);
            if (user == null)
            {
                throw new RuntimeException("User not found");
            }
            String encodedPassword = new BCryptPasswordEncoder().encode(newPassword);
            user.setPassword(encodedPassword);
            userRepo.save(user);
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
            if (userRepo.findByEmail(user.getEmail()) != null) {
                throw new RuntimeException("Email already exists");
            }

            String generatedPassword = UUID.randomUUID().toString().substring(0, 8);
            user.setPassword(generatedPassword); // You should hash this in production

            sendCredentialsEmail(user.getEmail(), user.getEmail(), generatedPassword);

            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);

            Users savedUser = userRepo.save(user);

            UserRole userRole = new UserRole();
            userRole.setRole("staff");
            userRole.setUser(savedUser);
            userRole.setStoreId(user.getStoreId());
            userRoleRepo.save(userRole);

            return savedUser;
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

            userRoleRepo.deleteByUserAndStoreId(existing, storeId);
            userRepo.deleteById(userId);
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
}
