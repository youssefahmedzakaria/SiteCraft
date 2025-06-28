package com.sitecraft.backend.Controllers;
import com.sitecraft.backend.Models.Users;
import com.sitecraft.backend.Models.UserRole;
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
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
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

            Users registeredUser = userService.register(user);
            return ResponseEntity.status(HttpStatus.ACCEPTED)
                    .body(Map.of(
                            "success", true,
                            "message", "User registered successfully.",
                            "userId", registeredUser.getId()
                    ));
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
        System.out.println("🔐 Logout endpoint called");
        System.out.println("📋 Session attributes before logout: " + session.getAttributeNames());
        System.out.println("👤 User ID in session: " + session.getAttribute("userId"));
        System.out.println("🏪 Store ID in session: " + session.getAttribute("storeId"));
        
        session.invalidate(); // clears all attributes and invalidates the session
        System.out.println("✅ Session invalidated successfully");
        
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("User logged out successfully.");
    }

    @PostMapping("forgotPassword/sendOTP")
    public ResponseEntity forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        System.out.println("📧 Forgot password sendOTP called for: " + email);
        
        try {
            if (!userService.isUserExists(email)) {
                System.out.println("❌ User not found: " + email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "No User with this email exists."));
            }

            System.out.println("✅ User found, sending OTP...");
            userService.sendOTP(email);
            System.out.println("✅ OTP sent successfully to: " + email);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "OTP sent successfully"
            ));

        } catch (Exception e) {
            System.out.println("💥 Send OTP error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("forgotPassword/verifyOTP")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("otp");
        System.out.println("🔐 Forgot password verifyOTP called for: " + email + " with code: " + code);
        
        try {
            if (!userService.isUserExists(email)) {
                System.out.println("❌ User not found: " + email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "No User with this email exists."));
            }

            System.out.println("✅ User found, verifying OTP...");
            userService.verifyOTP(email, code);
            System.out.println("✅ OTP verified successfully for: " + email);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "OTP verified successfully"
            ));

        } catch (Exception e) {
            System.out.println("💥 Verify OTP error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("forgotPassword/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String newPassword = body.get("newPassword");
        System.out.println("🔐 Forgot password resetPassword called for: " + email);

        try {
            if (newPassword == null || newPassword.length() < 8) {
                System.out.println("❌ Password validation failed for: " + email);
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Password must be at least 8 characters long."));
            }

            System.out.println("✅ Password validation passed, resetting password...");
            userService.resetPassword(email, newPassword);
            System.out.println("✅ Password reset successfully for: " + email);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Password reset successfully"
            ));
        } catch (Exception e) {
            System.out.println("💥 Reset password error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/getSession")
    public ResponseEntity getSession(HttpSession session) {
        Map<String, Object> sessionData = new HashMap<>();
        Long userId = (Long) session.getAttribute("userId");
        Long storeId = (Long) session.getAttribute("storeId");
        String role = (String) session.getAttribute("role");
        
        // If we have a userId, try to get the latest role from database
        if (userId != null) {
            try {
                UserRole userRole = userService.getUserRole(userId);
                if (userRole != null) {
                    role = userRole.getRole();
                    storeId = userRole.getStoreId();
                    // Update session with latest data
                    session.setAttribute("role", role);
                    session.setAttribute("storeId", storeId);
                }
            } catch (Exception e) {
                System.out.println("⚠️ Error retrieving user role from database: " + e.getMessage());
                // Continue with session data if database lookup fails
            }
        }
        
        sessionData.put("storeId", storeId);
        sessionData.put("userId", userId);
        sessionData.put("role", role);
        
        System.out.println("🔐 getSession returning: " + sessionData);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(sessionData);
    }

    @PostMapping("/setSession")
    public void setSession(@RequestBody Map<String, Object> in, HttpSession session) {
        System.out.println("🔐 setSession endpoint called with: " + in);
        session.setAttribute("userId", in.get("userId"));
        session.setAttribute("storeId", in.get("storeId"));
        session.setAttribute("role", in.get("role"));
        System.out.println("✅ Session attributes set - userId: " + in.get("userId") + ", storeId: " + in.get("storeId") + ", role: " + in.get("role"));
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
