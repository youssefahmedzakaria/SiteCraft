package com.sitecraft.backend.Services;
import com.sitecraft.backend.Models.UserRole;
import com.sitecraft.backend.Models.Users;
import com.sitecraft.backend.Repositories.StoreRepo;
import com.sitecraft.backend.Repositories.UserRepo;
import com.sitecraft.backend.Repositories.UserRoleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private UserRoleRepo userRoleRepo;
    @Autowired
    private StoreRepo storeRepo;

    // private final JavaMailSender mailSender; // You need to configure this


    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

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

        UserRole userRole = userRoleRepo.findByUserId(user);
        Long storeId = null;
        if (userRole != null) {
            user.setRole(userRole.getRole());
            storeId = userRole.getStoreId().getId();
        }
        else {
            user.setRole("undefined");
        }
        user.setStoreId(storeId);
        return user;
    }

    // -------------------------------------------- staff management ---------------------------------------------------

//    public List<User> getAllStaffByStoreId(Long storeId) {
//        return userRoleRepository.findByRoleAndStoreId("staff", storeId)
//                .stream()
//                .map(UserRole::getUser)
//                .collect(Collectors.toList());
//    }

//    public User addStaff(Long storeId, User user) {
//        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
//            throw new RuntimeException("Email already exists");
//        }
//
//        String generatedPassword = UUID.randomUUID().toString().substring(0, 8);
//        user.setPassword(generatedPassword); // You should hash this in production
//
//        User savedUser = userRepository.save(user);
//        Store store = storeRepository.findById(storeId)
//                .orElseThrow(() -> new RuntimeException("Store not found"));
//
//        UserRole userRole = new UserRole();
//        userRole.setRole("staff");
//        userRole.setUser(savedUser);
//        userRole.setStore(store);
//        userRoleRepository.save(userRole);
//
//        sendCredentialsEmail(savedUser.getEmail(), savedUser.getEmail(), generatedPassword);
//
//        return savedUser;
//    }

//    public void removeStaff(Long storeId, Long userId) {
//        userRoleRepository.deleteByUserIdAndStoreId(userId, storeId);
//        userRepository.deleteById(userId);
//    }

//    private void sendCredentialsEmail(String to, String username, String password) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(to);
//        message.setSubject("Your Staff Account Credentials");
//        message.setText("Login Email: " + username + "\nPassword: " + password);
//        mailSender.send(message);
//    }
}
