package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.Models.SiteCraftSubscription;
import com.sitecraft.backend.Services.SiteCraftSubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/subscription")
public class SiteCraftSubscriptionController {
    @Autowired
    private SiteCraftSubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<?> createSubscription(@RequestBody Map<String, Object> req, HttpSession session) {
        Long storeId = (Long) session.getAttribute("storeId");
        if (storeId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }
        try {
            String plan = (String) req.get("plan");
            String period = (String) req.get("period");
            Double price = Double.valueOf(req.get("price").toString());
            String method = (String) req.get("method");
            SiteCraftSubscription sub = subscriptionService.createSubscription(storeId, plan, period, price, method);
            return ResponseEntity.ok(sub);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentSubscription(HttpSession session) {
        Long storeId = (Long) session.getAttribute("storeId");
        if (storeId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }
        Optional<SiteCraftSubscription> sub = subscriptionService.getCurrentSubscription(storeId);
        return sub.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
} 