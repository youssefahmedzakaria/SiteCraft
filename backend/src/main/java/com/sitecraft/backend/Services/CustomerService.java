package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.Customer;
import com.sitecraft.backend.Repositories.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.time.LocalDate;

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
        return customerRepo.countNewCustomersByDateRange(storeId, startDate, endDate);
    }

    /**
     * Count returning customers (who updated profile) within the given date range for the specified store.
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

            // Check if customer belongs to the store
            if (!customer.getStoreId().equals(storeId)) {
                throw new IllegalAccessException("Customer does not belong to your store");
            }

            customer.setStatus("inactive");
            // No explicit save() needed due to dirty checking in @Transactional
        } catch (IllegalAccessException e) {
            throw new RuntimeException("Access denied: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to suspend Customer: " + e.getMessage());
        }
    }
}
