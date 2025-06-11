package com.sitecraft.backend.Services;
import com.sitecraft.backend.Models.UserRole;
import com.sitecraft.backend.Models.Users;
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

        UserRole userRole = userRoleRepo.findByUserId(user.getId());

        if (userRole != null) {
            user.setRole(userRole.getRole());
        }
        else {
            user.setRole("undefined");
        }

        return user;
    }

}
