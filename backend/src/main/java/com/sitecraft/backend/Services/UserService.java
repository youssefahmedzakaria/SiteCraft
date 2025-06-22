package com.sitecraft.backend.Services;
import com.sitecraft.backend.Models.ShippingInfo;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.UserRole;
import com.sitecraft.backend.Models.Users;
import com.sitecraft.backend.Repositories.StoreRepo;
import com.sitecraft.backend.Repositories.UserRepo;
import com.sitecraft.backend.Repositories.UserRoleRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserRoleRepo userRoleRepo;

    @Autowired
    private StoreRepo storeRepo;

    private final JavaMailSender mailSender; // You need to configure this

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public List<Users> getAllUsers() {
        return userRepo.findAll();
    }

    public Users register(Users users) {
        String encodedPassword = passwordEncoder.encode(users.getPassword());
        users.setPassword(encodedPassword);
        return userRepo.save(users);
    }

    public boolean isUserExists(String email) {
        Users users = userRepo.findByEmail(email);
        return users != null;
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
