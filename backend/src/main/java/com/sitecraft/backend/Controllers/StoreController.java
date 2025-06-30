package com.sitecraft.backend.Controllers;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sitecraft.backend.DTOs.StoreInfoDTO;
import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Services.StoreService;
import com.sitecraft.backend.Services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/store")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class StoreController {

    @Autowired
    private StoreService storeService;
    @Autowired
    private UserService userService;

    @PostMapping("/{userId}")
    public ResponseEntity<?> createStore(
            @RequestPart(value = "store") String storeJson,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @PathVariable Long userId) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            Store newStore = mapper.readValue(storeJson, Store.class);
            
            // Create the store first to get the store ID
            Store createdStore = storeService.createStore(newStore, userId);
            
            // Handle logo upload if provided
            if (logo != null && !logo.isEmpty()) {
                String originalFilename = logo.getOriginalFilename();
                String extension = originalFilename != null ?
                        originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
                String filename = "Store_Logo" + createdStore.getId() + "_" + logo.getOriginalFilename();

                String uploadDir = System.getProperty("user.dir") + "/uploads/stores/" + createdStore.getId();
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                File destFile = new File(dir, filename);
                logo.transferTo(destFile);

                // Update store with logo path
                String logoUrl = "/uploads/stores/" + createdStore.getId() + "/" + filename;
                createdStore.setLogo(logoUrl);
                createdStore = storeService.updateStorePartial(createdStore.getId(), createdStore);
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Store created successfully",
                    "store", createdStore
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "An unexpected error occurred: " + e.getMessage()
            ));
        }
    }

    // ------------------------------ Account Settings ------------------------------------------------

    @PutMapping("/updateStoreInfo")
    public ResponseEntity<?> updateStore(
            @RequestPart(value = "store") String storeJson,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            HttpSession session) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            Store updatedStore = mapper.readValue(storeJson, Store.class);
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }
            Store existingStore = storeService.getStore(storeId);
            // Delete old logo if a new one is uploaded
            if (logo != null && !logo.isEmpty()) {
                    String oldLogoPath = System.getProperty("user.dir") +existingStore.getLogo();
                    System.out.println("------------------------------------------------------------------------");
                    System.out.println(oldLogoPath);
                    System.out.println("------------------------------------------------------------------------");
                    File oldLogoFile = new File(oldLogoPath);
                    if (oldLogoFile.exists()) {
                        boolean deleted = oldLogoFile.delete();
                        System.out.println("Old logo deleted: " + deleted);
                    }


                // Generate unique filename
                String originalFilename = logo.getOriginalFilename();
                String extension = originalFilename != null ?
                        originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
                String filename = "Store_Logo" + storeId + "_" + logo.getOriginalFilename();

                String uploadDir = System.getProperty("user.dir") + "/uploads/stores/" + storeId;
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                File destFile = new File(dir, filename);
                logo.transferTo(destFile);

                // Set new logo path relative to project (or public URL if you're serving it)
                String logoUrl = "/uploads/stores/" + storeId + "/" + filename;
                updatedStore.setLogo(logoUrl);
            }

            Store resultStore = storeService.updateStorePartial(storeId, updatedStore);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Store updated successfully",
                    "store", resultStore
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "An unexpected error occurred: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/getStoreSettings")
    public ResponseEntity<?> getStoreSettings(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            Store store = storeService.getStore(storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Store retrieved successfully");
            response.put("store", store);

            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("success", false, "message", "An unexpected error occurred: " + e.getMessage())
            );
        }
    }

    // --------------------------------- Shipping Info -----------------------------------------------

    @GetMapping("/getAllShippingInfo")
    public ResponseEntity<?> getAllShippingInfo(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            List<ShippingInfo> allShippingInfo = storeService.getShippingInfosByStoreId(storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "All shipping info retrieved successfully");
            response.put("Shipping Info", allShippingInfo);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/addShippingInfo")
    public ResponseEntity<?> addShippingInfo(@RequestBody ShippingInfo bodyShipping, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            Store tempStore = new Store();
            tempStore.setId(storeId);
            bodyShipping.setStore(tempStore);

            ShippingInfo shippingInfoStore = storeService.addShippingInfo(bodyShipping);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Shipping info added successfully");
            response.put("shippingInfo", shippingInfoStore);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/updateShippingInfo/{id}")
    public ResponseEntity<?> updateShippingInfo(@PathVariable Long id, @RequestBody ShippingInfo updatedInfo, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            storeService.updateShippingInfo(id, updatedInfo, storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Shipping info updated successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/deleteShippingInfo/{id}")
    public ResponseEntity<?> deleteShippingInfo(@PathVariable Long id, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            storeService.deleteShippingInfo(id, storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Shipping info deleted successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // --------------------------------- Store Info -----------------------------------------------
    @GetMapping("/getStoreInfo")
    public ResponseEntity<?> getStoreInfo(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            StoreInfoDTO storeInfoDTO = storeService.getStoreInfoByStoreId(storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "All store info retrieved successfully");
            response.put("StoreInfo", storeInfoDTO);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/getStorePolicies")
    public ResponseEntity<?> getStorePolicies(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            List<Policy> policies = storeService.getStorePolicies(storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "All store policies retrieved successfully");
            response.put("StorePolicies", policies);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/getStorePolicyById/{policyId}")
    public ResponseEntity<?> getStorePolicyById(HttpSession session, @PathVariable Long policyId) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            Policy policy = storeService.getStorePolicyById(policyId,storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Policy retrieved successfully");
            response.put("Policy", policy);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/addPolicy")
    public ResponseEntity<?> addPolicy(@RequestBody Policy policy, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            // Attach store to policy
            Store store = new Store();
            store.setId(storeId);
            policy.setStore(store);

            Policy savedPolicy = storeService.addPolicy(policy);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Policy added successfully",
                    "policy", savedPolicy
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/updatePolicy/{policyId}")
    public ResponseEntity<?> updatePolicy(@PathVariable Long policyId, @RequestBody Policy updatedPolicy, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            storeService.updatePolicyById(policyId, updatedPolicy, storeId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Policy updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/deletePolicy/{policyId}")
    public ResponseEntity<?> deletePolicy(@PathVariable Long policyId, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            storeService.deletePolicyById(policyId, storeId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Policy deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/getStoreAboutUsList")
    public ResponseEntity<?> getStoreAboutUsList(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            List<AboutUs> aboutUsList = storeService.getAboutUsListByStoreId(storeId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "All store About Us entries retrieved successfully",
                    "aboutUsList", aboutUsList
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/getStoreAboutUsById/{id}")
    public ResponseEntity<?> getStoreAboutUsById(@PathVariable Long id, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            AboutUs aboutUs = storeService.getAboutUsById(id, storeId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "About Us entry retrieved successfully",
                    "aboutUs", aboutUs
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/addAboutUs")
    public ResponseEntity<?> addAboutUs(@RequestBody AboutUs aboutUs, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            Store store = new Store();
            store.setId(storeId);
            aboutUs.setStore(store);

            AboutUs savedAboutUs = storeService.addAboutUs(aboutUs);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "About Us entry added successfully",
                    "aboutUs", savedAboutUs
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/updateAboutUs/{id}")
    public ResponseEntity<?> updateAboutUs(@PathVariable Long id, @RequestBody AboutUs updatedAboutUs, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            storeService.updateAboutUs(id, updatedAboutUs, storeId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "About Us entry updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/deleteAboutUs/{id}")
    public ResponseEntity<?> deleteAboutUs(@PathVariable Long id, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            storeService.deleteAboutUs(id, storeId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "About Us entry deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    // --------------------------------- Staff Management -----------------------------------------------

    @GetMapping("/getStoreStaff")
    public ResponseEntity<?> getAllStaff(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            List<Users> staffMembers = userService.getAllStaffByStoreId(storeId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "All staff members are retrieved successfully",
                    "staffMembers", staffMembers
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/addStaff")
    public ResponseEntity<?> addStaff(@RequestBody Users user, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            user.setStoreId(storeId);

            Users savedUser = userService.addStaff(user);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Staff added successfully",
                    "staffMember", savedUser
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/removeStaff/{staffId}")
    public ResponseEntity<?> removeStaff(@PathVariable Long staffId, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            userService.removeStaff(storeId, staffId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Staff removed successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}