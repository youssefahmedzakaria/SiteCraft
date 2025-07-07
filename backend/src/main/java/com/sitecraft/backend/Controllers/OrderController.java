package com.sitecraft.backend.Controllers;
import com.sitecraft.backend.Models.Order;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Services.OrderService;
import com.sitecraft.backend.Services.PaymobService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private PaymobService paymobService;

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

    @PutMapping("/cancelOrder/{id}")
    public ResponseEntity<?> cancelOrder(HttpSession session, @PathVariable("id") Long orderId) {
        try {
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Customer ID not found in session."));
            }
            else if (!customerId.equals(orderService.getCustomerIdOfOrder(orderId))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "This order does not belong to the customer."));
            }

            orderService.cancelOrder(orderId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Order canceled successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/create/{addressId}")
    public ResponseEntity<?> createOrder(HttpSession session, @PathVariable("addressId") Long addressId) {
        try {
            Long customerId = (Long) session.getAttribute("customerId");
            Long storeId = (Long) session.getAttribute("storeId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Customer ID not found in session."));
            }

            orderService.createOrder(customerId, addressId, storeId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Order created successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/export")
    public ResponseEntity<?> exportOrders(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            byte[] excelData = orderService.exportOrdersToExcel(storeId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "orders_export.xlsx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to export orders: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/paymob/create-session")
    public ResponseEntity<?> createPaymobSession(@RequestBody Map<String, Object> body) {
        try {
            // Extract parameters from request body
            String paymentMethod = (String) body.get("paymentMethod");
            String wallet = (String) body.get("wallet");
            String mobile = (String) body.get("mobile");
            Double amount = body.get("amount") != null ? Double.valueOf(body.get("amount").toString()) : null;
            // Add any other required parameters

            // Call PaymobService to create session and get iframe URL
            // (Assume PaymobService is implemented)
            String iframeUrl = paymobService.createPaymentSession(paymentMethod, wallet, mobile, amount);
            System.out.println(iframeUrl);
            if (iframeUrl != null) {
                return ResponseEntity.ok(Map.of("success", true, "iframeUrl", iframeUrl));
            } else {
                return ResponseEntity.status(500).body(Map.of("success", false, "message", "Failed to create Paymob session"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
