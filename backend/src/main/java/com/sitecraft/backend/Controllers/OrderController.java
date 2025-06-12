package com.sitecraft.backend.Controllers;
import com.sitecraft.backend.Models.Order;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Services.OrderService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/getAllOrders")
    public ResponseEntity<?> getAllOrdersForStore(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            List<Order> orders = orderService.getAllOrders(storeId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Orders fetched successfully",
                    "orders", orders
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to fetch orders: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/getOrder/{id}")
    public ResponseEntity<?> getOrder(HttpSession session, @PathVariable("id") Long orderId) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            Order order = orderService.getOrder(orderId, storeId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Order fetched successfully",
                    "order", order
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to fetch order: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/updateOrderStatus/{id}")
    public ResponseEntity<?> updateOrderStatus(HttpSession session, @PathVariable("id") Long orderId, @RequestBody Map<String,String> body) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            String status = body.get("status");
            Order order = orderService.updateOrderStatus(orderId,status);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Order Status updated successfully",
                    "orders", order
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to update order: " + e.getMessage()
            ));
        }
    }

}
