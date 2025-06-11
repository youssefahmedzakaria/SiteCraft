package com.sitecraft.backend.Controllers;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Services.StoreService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stores")
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


}