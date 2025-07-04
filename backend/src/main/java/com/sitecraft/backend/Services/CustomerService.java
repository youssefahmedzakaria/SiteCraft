// src/main/java/com/sitecraft/backend/Services/CustomerService.java
package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.Address;
import com.sitecraft.backend.Models.Customer;
import com.sitecraft.backend.Repositories.AddressRepo;
import com.sitecraft.backend.Repositories.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.List;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private AddressRepo addressRepo;


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

            // Check if customer belongs to the store
            if (customer.getStore() == null || !customer.getStore().getId().equals(storeId)) {

                throw new IllegalAccessException("Customer does not belong to your store");
            }

            customer.setStatus("inactive");
        } catch (IllegalAccessException e) {
            throw new RuntimeException("Access denied: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to suspend Customer: " + e.getMessage());
        }
    }

    public Customer getCustomerInfo(Long customerId) {
        try {
            Optional<Customer> customer = customerRepo.findById(customerId);
            if (customer.isEmpty()) {
                throw new RuntimeException("Customer not found");
            }
            return customer.get();
        }catch (Exception e) {
            throw new RuntimeException("Failed to get customer info: " + e.getMessage());
        }
    }

    public List<Address> getCustomerAddresses(Long customerId) {
        try {
            Optional<Customer> customer = customerRepo.findById(customerId);
            if (customer.isEmpty()) {
                throw new RuntimeException("Customer not found");
            }

            List<Address> addresses = addressRepo.findByCustomerId(customerId);
            if (addresses.isEmpty()) {
                throw new RuntimeException("No addresses found");
            }
            return addresses;
        }catch (Exception e) {
            throw new RuntimeException("Failed to get customer addresses: " + e.getMessage());
        }
    }

    public void updateCustomerInfo(Long customerId, Customer updatedCustomer) {
        try {
            Customer customer = customerRepo.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            if (updatedCustomer.getName() != null) customer.setName(updatedCustomer.getName());
            if (updatedCustomer.getPhone() != null) customer.setPhone(updatedCustomer.getPhone());
            if (updatedCustomer.getGender() != null) customer.setGender(updatedCustomer.getGender());
            customerRepo.save(customer);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update customer info: " + e.getMessage());
        }
    }

    public void changePassword(Long customerId, Map<String, String> passwords) {
        try {
            Customer customer = customerRepo.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            String currentPassword = passwords.get("currentPassword");
            String newPassword = passwords.get("newPassword");

            if (newPassword.length() < 8) {
                throw new RuntimeException("New password must be at least 8 characters long.");
            }

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            if (!encoder.matches(currentPassword, customer.getPassword())) {
                throw new RuntimeException("Current password is incorrect.");
            }

            customer.setPassword(encoder.encode(newPassword));
            customerRepo.save(customer);

        } catch (Exception e) {
            throw new RuntimeException("Failed to update password: " + e.getMessage());
        }
    }

    public void addAddress(Long customerId, Address newAddress) {
        try {
            Customer customer = customerRepo.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            Address address = new Address();
            address.setTitle(newAddress.getTitle());
            address.setCity(newAddress.getCity());
            address.setStreetNum(newAddress.getStreetNum());
            address.setBuildingNum(newAddress.getBuildingNum());
            address.setFloorNum(newAddress.getFloorNum());
            address.setApartmentNum(newAddress.getApartmentNum());
            address.setLandmark(newAddress.getLandmark());
            address.setCustomer(customer);
            addressRepo.save(address);
        } catch (Exception e) {
            throw new RuntimeException("Failed to add address: " + e.getMessage());
        }
    }

    public void updateAddress(Long customerId, Long addressId, Address updatedAddress) {
        try {
            Address address = addressRepo.findById(addressId)
                    .orElseThrow(() -> new RuntimeException("Address not found"));

            if (!address.getCustomer().getId().equals(customerId)) {
                throw new RuntimeException("Unauthorized access to this address.");
            }

            if (updatedAddress.getTitle() != null) address.setTitle(updatedAddress.getTitle());
            if (updatedAddress.getCity() != null) address.setCity(updatedAddress.getCity());
            if (updatedAddress.getStreetNum() != null) address.setStreetNum(updatedAddress.getStreetNum());
            if (updatedAddress.getBuildingNum() != null) address.setBuildingNum(updatedAddress.getBuildingNum());
            if (updatedAddress.getFloorNum() != null) address.setFloorNum(updatedAddress.getFloorNum());
            if (updatedAddress.getApartmentNum() != null) address.setApartmentNum(updatedAddress.getApartmentNum());
            if (updatedAddress.getLandmark() != null) address.setLandmark(updatedAddress.getLandmark());
            addressRepo.save(address);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update address: " + e.getMessage());
        }
    }

    public void deleteAddress(Long customerId, Long addressId) {
        try {
            Address address = addressRepo.findById(addressId)
                    .orElseThrow(() -> new RuntimeException("Address not found"));

            if (!address.getCustomer().getId().equals(customerId)) {
                throw new RuntimeException("Unauthorized access to this address.");
            }

            addressRepo.delete(address);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete address: " + e.getMessage());
        }
    }

    public Customer getCustomer(Long id) {
        try {
            Optional<Customer> customer = customerRepo.findById(id);
            if (customer.isEmpty()) {
                throw new RuntimeException("Customer not found");
            }
            return customer.get();
        }catch (Exception e) {
            throw new RuntimeException("Failed to get customer: " + e.getMessage());
        }
    }

//    public List<Order> getCustomerOrders(Long customerId) {
//        /* Optional sanity-check that customer exists */
//        if (!customerRepo.existsById(customerId)) {
//            throw new IllegalArgumentException("Customer not found");
//        }
//        return orderRepo.findByCustomerId(customerId);
//    }

}
