package com.sitecraft.backend.Controllers;
import com.sitecraft.backend.Models.Users;
import com.sitecraft.backend.Services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping(path = "/register")
    public ResponseEntity register(@RequestBody Users user) throws Exception {
        try {
            boolean isExist = userService.isUserExists(user.getEmail());
            if (isExist) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("User with this email exists.");
            }

            if (user.getPassword() == null || user.getPassword().length() < 8) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Password must be at least 8 characters long."));
            }

            userService.register(user);
            return ResponseEntity.status(HttpStatus.ACCEPTED)
                    .body("User registered successfully.");
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }

    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        try {
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
            session.setAttribute("storeId", user.getStoreId());
            session.setAttribute("userId", user.getId());
            session.setAttribute("role", user.getRole());
            return ResponseEntity.status(HttpStatus.ACCEPTED)
                    .body("User logged in successfully.");

        }catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity logout(HttpSession session) {
        session.invalidate(); // clears all attributes and invalidates the session
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("User logged out successfully.");
    }

    @PostMapping("forgotPassword/sendOTP")
    public ResponseEntity forgotPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            if (!userService.isUserExists(email)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "No User with this email exists."));
            }

            userService.sendOTP(email);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "OTP sent successfully"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("forgotPassword/verifyOTP")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String code = body.get("otp");
            if (!userService.isUserExists(email)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "No User with this email exists."));
            }

            userService.verifyOTP(email, code);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "OTP verified successfully"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }

    }

    @PostMapping("forgotPassword/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String newPassword = body.get("newPassword");



            if (newPassword == null || newPassword.length() < 8) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Password must be at least 8 characters long."));
            }

            userService.resetPassword(email, newPassword);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Password reset successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/getSession")
    public ResponseEntity getSession(HttpSession session) {
        Map<String, Object> sessionData = new HashMap<>();
        sessionData.put("storeId", session.getAttribute("storeId"));
        sessionData.put("userId", session.getAttribute("userId"));
        sessionData.put("role", session.getAttribute("role"));
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(sessionData);
    }

    @PostMapping("/setSession")
    public void setSession(@RequestBody Map<String, Long> in, HttpSession session) {
        session.setAttribute("userId", in.get("userId"));
        session.setAttribute("storeId", in.get("storeId"));
    }

    public static class LoginRequest {
        private String email;
        private String password;

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
