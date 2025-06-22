package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.Models.Customer;
import com.sitecraft.backend.Services.CustomerService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @GetMapping
    public ResponseEntity getAllCustomers(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            List<Customer> customers = customerService.getAllCustomers(storeId);

            return ResponseEntity.ok(customers);
        } catch(Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/suspend/{id}")
    public ResponseEntity suspendCustomer(@PathVariable Long id, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            customerService.suspendCustomer(id, storeId);

            return ResponseEntity.status(HttpStatus.ACCEPTED)
                    .body("Customer Suspended Successfully.");
        } catch(Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
