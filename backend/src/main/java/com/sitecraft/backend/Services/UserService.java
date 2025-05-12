package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.User;
import com.sitecraft.backend.Repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<User> getAllUsers() {
        return userRepo.findAll(); // Automatically provided by JpaRepository
    }

    public User register(User user) {
        // Hash the user's password before saving
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        return userRepo.save(user); // Automatically provided by JpaRepository
    }

    public boolean isUserExists(String email) {
        User user = userRepo.getUserByEmail(email);
        return user != null;
    }

    public User login(String email, String password) {
        User user = userRepo.getUserByEmail(email);
//        if (passwordEncoder.matches(password, user.getPassword())) {
//            return user;
//        }
        if (user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
}
