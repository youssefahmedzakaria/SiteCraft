package com.sitecraft.backend.Controllers;
import com.sitecraft.backend.Models.Users;
import com.sitecraft.backend.Models.UserRole;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Services.UserService;
import com.sitecraft.backend.Services.StoreService;
import com.sitecraft.backend.Repositories.UserRoleRepo;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.io.File;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private StoreService storeService;

    @Autowired
    private UserRoleRepo userRoleRepo;

    @PostMapping(path = "/register")
    public ResponseEntity register(@RequestBody Users user) throws Exception {
        try {
            // Check if user can register as owner (not already an owner)
            boolean canRegister = userService.canRegisterAsOwner(user.getEmail());
            if (!canRegister) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "User with this email is already an owner of another store."));
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
            // Check if any user exists with this email
            if (!userService.isAnyUserExists(loginRequest.getEmail())) {
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
            if (!userService.isAnyUserExists(email)) {
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
            if (!userService.isAnyUserExists(email)) {
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
        sessionData.put("storeId", storeId);
        sessionData.put("userId", userId);
        sessionData.put("role", role);
        if (storeId != null) {
            try {
                Store store = storeService.getStore(storeId);
                sessionData.put("storeStatus", store.getStatus());
            } catch (Exception e) {
                sessionData.put("storeStatus", null);
            }
        }
        System.out.println("🔐 getSession returning: " + sessionData);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(sessionData);
    }

    @PostMapping("/setSession")
    public void setSession(@RequestBody Map<String, Object> in, HttpSession session) {
        System.out.println("🔐 setSession endpoint called with: " + in);
        session.setAttribute("userId", Long.valueOf(in.get("userId").toString()));
        session.setAttribute("storeId", in.get("storeId") != null ? Long.valueOf(in.get("storeId").toString()) : null);
        session.setAttribute("role", in.get("role"));
        System.out.println("✅ Session attributes set - userId: " + in.get("userId") + ", storeId: " + in.get("storeId") + ", role: " + in.get("role"));
    }

    @PostMapping("/commitRegistration")
    public ResponseEntity commitRegistration(@RequestParam("registrationData") String registrationDataJson,
                                          @RequestParam(value = "logo") MultipartFile logo,
                                          HttpSession session) throws Exception {
        try {
            System.out.println("🚀 Commit registration endpoint called");
            
            // Parse the registration data JSON
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode registrationData = objectMapper.readTree(registrationDataJson);
            
            // Extract user data
            JsonNode userData = registrationData.get("user");
            Users user = new Users();
            user.setEmail(userData.get("email").asText());
            user.setPassword(userData.get("password").asText());
            user.setName(userData.get("name").asText());
            user.setPhone(userData.get("phone").asText());
            user.setGender(userData.get("gender").asText());
            
            // Extract store data
            JsonNode storeData = registrationData.get("store");
            
            System.out.println("📋 Parsed registration data:");
            System.out.println("- User email: " + user.getEmail());
            System.out.println("- Store name: " + storeData.get("storeName").asText());
            
            // 1. Register the user
            System.out.println("👤 Registering user...");
            Users registeredUser = userService.register(user);
            System.out.println("✅ User registered with ID: " + registeredUser.getId());
            
            // 2. Create store
            System.out.println("🏪 Creating store...");
            Store store = new Store();
            store.setStoreName(storeData.get("storeName").asText());
            store.setStoreType(storeData.get("storeType").asText());
            store.setDescription(storeData.get("description").asText());
            store.setPhoneNumber(storeData.get("phoneNumber").asText());
            store.setEmailAddress(storeData.get("emailAddress").asText());
            store.setAddress(storeData.get("address").asText());
            store.setAddressLink(storeData.get("addressLink").asText());
            store.setOpeningHours(storeData.get("openingHours").asText());
            
            // Set colors
            JsonNode colorsData = storeData.get("colors");
            if (colorsData != null) {
                store.setColors(colorsData);
            }
            
            Store savedStore = storeService.createStore(store, registeredUser.getId());
            System.out.println("✅ Store created with ID: " + savedStore.getId());
            
            // Handle logo upload if present (using same logic as StoreController)
            if (logo != null && !logo.isEmpty()) {
                System.out.println("🖼️ Uploading logo...");
                String filename = "Store_Logo" + savedStore.getId() + "_" + logo.getOriginalFilename();
                String relativePath = "/uploads/stores/" + savedStore.getId() + "/";
                String uploadDir = System.getProperty("user.dir") + relativePath;

                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();
                File destFile = new File(dir, filename);
                logo.transferTo(destFile);

                String imagePath = "http://localhost:8080" + relativePath + filename;

                // Update store with complete logo URL including server address
                savedStore.setLogo(imagePath);
                savedStore = storeService.updateStorePartial(savedStore.getId(), savedStore);
                System.out.println("✅ Logo uploaded successfully: " + imagePath);
            }
            
            // 4. Set session data
            session.setAttribute("userId", registeredUser.getId());
            session.setAttribute("storeId", savedStore.getId());
            session.setAttribute("role", "owner");
            System.out.println("✅ Session data set");
            
            // 5. Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration completed successfully");
            response.put("userId", registeredUser.getId());
            response.put("storeId", savedStore.getId());
            response.put("role", "owner");
            
            System.out.println("🎉 Registration committed successfully!");
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
            
        } catch (Exception e) {
            System.out.println("💥 Error in commit registration: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
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
