package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.Users;
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

    public List<Users> getAllUsers() {
        return userRepo.findAll(); // Automatically provided by JpaRepository
    }

    public Users register(Users users) {
        // Hash the user's password before saving
        String encodedPassword = passwordEncoder.encode(users.getPassword());
        users.setPassword(encodedPassword);
        return userRepo.save(users); // Automatically provided by JpaRepository
    }

    public boolean isUserExists(String email) {
        Users users = userRepo.getUserByEmail(email);
        return users != null;
    }

    public Users login(String email, String password) {
        Users users = userRepo.getUserByEmail(email);
//        if (passwordEncoder.matches(password, user.getPassword())) {
//            return user;
//        }
        if (users.getPassword().equals(password)) {
            return users;
        }
        return null;
    }
}
