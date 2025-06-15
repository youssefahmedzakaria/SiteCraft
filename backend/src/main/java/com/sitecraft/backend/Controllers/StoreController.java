package com.sitecraft.backend.Controllers;
import com.sitecraft.backend.Models.ShippingInfo;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Services.StoreService;
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


    @GetMapping("/getStoreInfo")
    public ResponseEntity<?> getStoreInfo(HttpSession session) {
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
}