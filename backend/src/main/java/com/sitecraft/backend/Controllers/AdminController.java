package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.SiteCraftSubscription;
import com.sitecraft.backend.Models.Order;
import com.sitecraft.backend.Services.StoreService;
import com.sitecraft.backend.Services.OrderService;
import com.sitecraft.backend.Services.SiteCraftSubscriptionService;
import com.sitecraft.backend.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;
import com.sitecraft.backend.Models.Users;
import com.sitecraft.backend.Models.UserRole;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/admin/stores")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class AdminController {
    @Autowired
    private StoreService storeService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private SiteCraftSubscriptionService subscriptionService;
    @Autowired
    private UserService userService;

    // DTO for overview
    public static class StoreOverviewDTO {
        public Long id;
        public String storeName;
        public String status;
        public String subscriptionType;
        public Double lastMonthSales;
        public Integer lastMonthOrders;
        public String ownerEmail;
    }

    @GetMapping("/overview")
    public ResponseEntity<List<StoreOverviewDTO>> getStoresOverview() {
        List<Store> stores = storeService.getAllStores();
        LocalDate now = LocalDate.now(ZoneId.systemDefault());
        LocalDate firstDayOfLastMonth = now.minusMonths(1).withDayOfMonth(1);
        LocalDate lastDayOfLastMonth = now.withDayOfMonth(1).minusDays(1);
        List<StoreOverviewDTO> result = new ArrayList<>();
        for (Store store : stores) {
            StoreOverviewDTO dto = new StoreOverviewDTO();
            dto.id = store.getId();
            dto.storeName = store.getStoreName();
            dto.status = store.getStatus();
            // Get subscription
            Optional<SiteCraftSubscription> sub = subscriptionService.getCurrentSubscription(store.getId());
            dto.subscriptionType = sub.map(SiteCraftSubscription::getPlan).orElse("None");
            // Get last month sales/orders
            List<Order> orders = orderService.getOrdersByStoreAndDateRange(store.getId(), firstDayOfLastMonth, lastDayOfLastMonth);
            dto.lastMonthOrders = orders.size();
            dto.lastMonthSales = orders.stream().mapToDouble(o -> o.getPrice() != null ? o.getPrice().doubleValue() : 0.0).sum();
            // Get owner email (assuming first user with owner role)
            dto.ownerEmail = storeService.getOwnerEmail(store.getId());
            result.add(dto);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/suspend")
    public ResponseEntity<?> suspendStore(@PathVariable Long id) {
        storeService.updateStoreStatus(id, "suspended");
        return ResponseEntity.ok("Store suspended successfully.");
    }

    @PostMapping("/{id}/unsuspend")
    public ResponseEntity<?> unsuspendStore(@PathVariable Long id) {
        storeService.updateStoreStatus(id, "active");
        return ResponseEntity.ok("Store unsuspended successfully.");
    }

    public static class MailRequest {
        public String subject;
        public String message;
    }

    @PostMapping("/{id}/send-mail")
    public ResponseEntity<?> sendMailToStoreOwner(@PathVariable Long id, @RequestBody MailRequest req) {
        String email = storeService.getOwnerEmail(id);
        if (email == null) return ResponseEntity.badRequest().body("Owner email not found");
        userService.sendCustomMail(email, req.subject, req.message);
        return ResponseEntity.ok("Mail sent successfully.");
    }

    // List all admin users
    @GetMapping("/admins")
    public ResponseEntity<?> getAllAdmins(HttpSession session) {
        String role = (String) session.getAttribute("role");
        if (!"admin".equals(role)) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        List<UserRole> adminRoles = userService.getAllGlobalAdmins();
        List<Users> admins = adminRoles.stream().map(UserRole::getUser).toList();
        return ResponseEntity.ok(admins);
    }

    // Add a new admin user by email
    @PostMapping("/admins")
    public ResponseEntity<?> addAdmin(@RequestBody Map<String, String> req, HttpSession session) {
        String role = (String) session.getAttribute("role");
        if (!"admin".equals(role)) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        String email = req.get("email");
        try {
            userService.addGlobalAdminByEmail(email);
            return ResponseEntity.ok("Admin added successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Remove an admin user by userId
    @DeleteMapping("/admins/{userId}")
    public ResponseEntity<?> removeAdmin(@PathVariable Long userId, HttpSession session) {
        String role = (String) session.getAttribute("role");
        if (!"admin".equals(role)) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        try {
            userService.removeGlobalAdmin(userId);
            return ResponseEntity.ok("Admin removed successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<?> getStoreStats(@PathVariable Long id, HttpSession session) {
        String role = (String) session.getAttribute("role");
        if (!"admin".equals(role)) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        try {
            return ResponseEntity.ok(storeService.getStoreStats(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 