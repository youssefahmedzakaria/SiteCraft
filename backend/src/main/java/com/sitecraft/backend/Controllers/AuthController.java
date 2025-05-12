package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.Models.User;
import com.sitecraft.backend.Services.UserService;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping(path = "/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {
        boolean isExist = userService.isUserExists(loginRequest.getEmail());

        if (!isExist) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body("User with this email does not exist.");
            return "Yehia";
        }

        User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

        if (user == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body("Incorrect password. Please try again.");
            return "Yehia";
        }

        user.setPassword(null);

//        return ResponseEntity.ok(user);
        return "Yehia";
    }


    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    // Inner class for login request
    public static class LoginRequest {
        private String email;
        private String password;

        // Getters and Setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
