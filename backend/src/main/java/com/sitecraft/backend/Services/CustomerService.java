// src/main/java/com/sitecraft/backend/Services/CustomerService.java
package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.Customer;
import com.sitecraft.backend.Repositories.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepo customerRepo;

    public List<Customer> getAllCustomers(Long storeId) {
        return customerRepo.findByStoreId(storeId);
    }

    /**
     * Count new customers registered within the given date range for the specified store.
     */
    public long countNewCustomersByDateRange(
        LocalDate startDate,
        LocalDate endDate,
        Long storeId
    ) {
        // inclusive start at 00:00, exclusive end at next day's 00:00
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end   = endDate.plusDays(1).atStartOfDay();
        return customerRepo.countByStoreIdAndCreatedAtBetween(storeId, start, end);
    }

    /**
     * Count returning customers (who placed orders before the window and again within it).
     */
    public long countReturningCustomersByDateRange(
        LocalDate startDate,
        LocalDate endDate,
        Long storeId
    ) {
        return customerRepo.countReturningCustomersByDateRange(storeId, startDate, endDate);
    }

    @Transactional
    public void suspendCustomer(Long customerId, Long storeId) {
        try {
            Customer customer = customerRepo.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

            if (!customer.getStoreId().equals(storeId)) {
                throw new IllegalAccessException("Customer does not belong to your store");
            }

            customer.setStatus("inactive");
        } catch (IllegalAccessException e) {
            throw new RuntimeException("Access denied: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to suspend Customer: " + e.getMessage());
        }
    }
}
