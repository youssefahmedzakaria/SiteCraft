package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.Models.Users;
import com.sitecraft.backend.Services.UserService;
import jakarta.servlet.http.HttpSession;
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
    public ResponseEntity register(@RequestBody Users users) throws Exception {
        boolean isExist = userService.isUserExists(users.getEmail());
        if (isExist) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("User with this email exists.");
        }
        userService.register(users);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body("User registered successfully.");

    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        boolean isExist = userService.isUserExists(loginRequest.getEmail());

        if (!isExist) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User with this email does not exist.");
        }

        Users user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Incorrect password. Please try again.");
        }

        user.setPassword(null);
        if (user.getRole().equals("admin")) {
            session.setAttribute("admin", user);
        }
        session.setAttribute("owner", user);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body("User logged in successfully.");
    }

    @PostMapping("/logout")
    public ResponseEntity logout(HttpSession session) {
        session.invalidate(); // clears all attributes and invalidates the session
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("User logged out successfully.");
    }

    @GetMapping("/printRole")
    public String printRole (HttpSession session) {
        if (session.getAttribute("owner") == null && session.getAttribute("admin") == null) {
            return "Not logged in.";
        }
        String role = null;
        if (session.getAttribute("owner") != null) {
            Users user = (Users) session.getAttribute("owner");
            role = user.getRole();
        }
        if (session.getAttribute("admin") != null) {
            Users user = (Users) session.getAttribute("admin");
            role = user.getRole();
        }

        return role;
    }

    @GetMapping
    public List<Users> getUsers() {
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
