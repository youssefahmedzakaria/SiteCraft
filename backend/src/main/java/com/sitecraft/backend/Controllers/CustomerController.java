package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.Models.Address;
import com.sitecraft.backend.Models.Customer;
import com.sitecraft.backend.Models.Order;
import com.sitecraft.backend.Repositories.AddressRepo;
import com.sitecraft.backend.Repositories.CustomerRepo;
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
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
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


    //----------------------------------------(E-commerce)----------------------------------------

    @GetMapping("/getInfo")
    public ResponseEntity getCustomerInfo(HttpSession session) {
        try {
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Customer ID not found in session."));
            }

            Customer customer = customerService.getCustomerInfo(customerId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "customer", customer
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/getAddresses")
    public ResponseEntity getCustomerAddresses(HttpSession session) {
        try {
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Customer ID not found in session."));
            }

            List<Address> addresses = customerService.getCustomerAddresses(customerId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "addresses", addresses
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/updateCustomerInfo")
    public ResponseEntity<?> updateCustomerInfo(@RequestBody Customer updatedCustomer, HttpSession session) {
        try {
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Customer ID not found in session."));
            }

            customerService.updateCustomerInfo(customerId, updatedCustomer);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Customer profile updated successfully."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody Map<String,String> passwords, HttpSession session) {
        try {
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Customer ID not found in session."
                ));
            }

            customerService.changePassword(customerId, passwords);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Password updated successfully."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/addAddress")
    public ResponseEntity<?> addAddress(@RequestBody Address address, HttpSession session) {
        try {
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Customer ID not found in session."
                ));
            }

            customerService.addAddress(customerId, address);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Address added successfully."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/updateAddress/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody Address address, HttpSession session) {
        try {
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Customer ID not found in session."
                ));
            }

            customerService.updateAddress(customerId, id, address);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Address updated successfully."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/deleteAddress/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id, HttpSession session) {
        try {
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Customer ID not found in session."
                ));
            }

            customerService.deleteAddress(customerId, id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Address deleted successfully."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/setSession")
    public ResponseEntity setSession(HttpSession session, @RequestBody Customer customer) {
        session.setAttribute("customerId", customer.getId());
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body("Session Updated Successfully.");
    }

    @GetMapping("/getSession")
    public ResponseEntity getSession(HttpSession session) {
        Map<String, Object> sessionData = new HashMap<>();
        sessionData.put("customerId", session.getAttribute("customerId"));
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(sessionData);
    }
}
