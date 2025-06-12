package com.sitecraft.backend.Controllers;
import com.sitecraft.backend.DTOs.StoreInfoDTO;
import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Services.StoreService;
import com.sitecraft.backend.Services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/store")
public class StoreController {

    @Autowired
    private StoreService storeService;
    @Autowired
    private UserService userService;

    @PostMapping("/{userId}")
    public ResponseEntity<?> createStore(@RequestBody Store store, @PathVariable Long userId) {
        try {
            Store createdStore = storeService.createStore(store, userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Store created successfully");
            response.put("store", createdStore);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // ------------------------------ Account Settings ------------------------------------------------

    @PutMapping("/updateStoreInfo")
    public ResponseEntity<?> updateStore(@RequestBody Store updatedStore, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            Store resultStore = storeService.updateStorePartial(storeId, updatedStore); // Call a new method that does partial update

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Store updated successfully");
            response.put("store", resultStore);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "An unexpected error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
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

            userService.removeStaff((Long) session.getAttribute("storeId"), staffId);

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