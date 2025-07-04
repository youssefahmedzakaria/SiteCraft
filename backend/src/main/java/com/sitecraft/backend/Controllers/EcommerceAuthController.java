package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.Models.Customer;
import com.sitecraft.backend.Models.CustomizedTemplateSection;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Services.EcommerceAuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ecommerce/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class EcommerceAuthController {
    @Autowired
    private EcommerceAuthService ecommerceAuthService;

    @PostMapping(path = "/register")
    public ResponseEntity register(@RequestBody Customer customer, @RequestParam Long storeId) throws Exception {
        try {
            boolean isExist = ecommerceAuthService.isCustomerExists(customer.getEmail(), storeId);
            if (isExist) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Customer with this email already exists in this store.");
            }
            Customer registeredCustomer = ecommerceAuthService.register(customer, storeId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Customer registered successfully"
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
            Long storeId = loginRequest.getStoreId();
            boolean isExist = ecommerceAuthService.isCustomerExists(loginRequest.getEmail(), storeId);

            if (!isExist) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Customer with this email does not exist in this store.");
            }

            Customer customer = ecommerceAuthService.login(loginRequest.getEmail(), loginRequest.getPassword(), storeId);

            if (customer == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Incorrect password. Please try again.");
            }

            // Check if customer is active
            if (!"active".equalsIgnoreCase(customer.getStatus())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Your account has been suspended. Please contact support.");
            }

            customer.setPassword(null); // Don't send password back
            session.setAttribute("customerId", customer.getId());
            session.setAttribute("storeId", storeId);
            session.setAttribute("customerEmail", customer.getEmail());
            session.setAttribute("customerName", customer.getName());
            
            return ResponseEntity.status(HttpStatus.ACCEPTED)
                    .body("Customer logged in successfully.");

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity logout(HttpSession session) {
        session.invalidate(); // clears all attributes and invalidates the session
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Customer logged out successfully.");
    }

    @GetMapping("/getSession")
    public ResponseEntity getSession(HttpSession session) {
        Map<String, Object> sessionData = new HashMap<>();
        sessionData.put("customerId", session.getAttribute("customerId"));
        sessionData.put("storeId", session.getAttribute("storeId"));
        sessionData.put("customerEmail", session.getAttribute("customerEmail"));
        sessionData.put("customerName", session.getAttribute("customerName"));
        sessionData.put("isAuthenticated", session.getAttribute("customerId") != null);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(sessionData);
    }

    @GetMapping("/profile")
    public ResponseEntity getProfile(HttpSession session) {
        try {
            Long customerId = (Long) session.getAttribute("customerId");
            Long storeId = (Long) session.getAttribute("storeId");
            
            if (customerId == null || storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Not authenticated.");
            }

            Customer customer = ecommerceAuthService.getCustomerById(customerId, storeId);
            if (customer == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Customer not found.");
            }

            customer.setPassword(null); // Don't send password
            return ResponseEntity.ok(customer);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("update/profile")
    public ResponseEntity updateProfile(@RequestBody Customer customerUpdate, HttpSession session) {
        try {
            Long customerId = (Long) session.getAttribute("customerId");
            Long storeId = (Long) session.getAttribute("storeId");
            
            if (customerId == null || storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Not authenticated.");
            }

            Customer updatedCustomer = ecommerceAuthService.updateCustomerProfile(customerId, storeId, customerUpdate);
            if (updatedCustomer == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("success", false, "message", "Update failed"));
            }
            updatedCustomer.setPassword(null); // Don't send password back
            
            return ResponseEntity.ok(updatedCustomer);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/forgotPassword/sendOTP")
    public ResponseEntity<?> sendCustomerOTP(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            if (!ecommerceAuthService.isCustomerExists(email)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "No customer with this email exists."));
            }
            ecommerceAuthService.sendCustomerOTP(email);
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

    @PostMapping("/forgotPassword/verifyOTP")
    public ResponseEntity<?> verifyCustomerOTP(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String code = body.get("otp");
            if (!ecommerceAuthService.isCustomerExists(email)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "No customer with this email exists."));
            }
            ecommerceAuthService.verifyCustomerOTP(email, code);
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

    @PostMapping("/forgotPassword/resetPassword")
    public ResponseEntity<?> resetCustomerPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String newPassword = body.get("newPassword");
            if (newPassword == null || newPassword.length() < 8) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Password must be at least 8 characters long."));
            }
            if (!ecommerceAuthService.isCustomerExists(email)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "No customer with this email exists."));
            }
            ecommerceAuthService.resetCustomerPassword(email, newPassword);
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

    public static class LoginRequest {
        private String email;
        private String password;
        private Long storeId;

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

        public Long getStoreId() {
            return storeId;
        }

        public void setStoreId(Long storeId) {
            this.storeId = storeId;
        }
    }
} 