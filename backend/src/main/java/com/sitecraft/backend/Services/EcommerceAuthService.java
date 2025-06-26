package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.Customer;
import com.sitecraft.backend.Models.ShoppingCart;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.WishList;
import com.sitecraft.backend.Models.OTP;
import com.sitecraft.backend.Repositories.CustomerRepo;
import com.sitecraft.backend.Repositories.StoreRepo;
import com.sitecraft.backend.Repositories.OTPRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class EcommerceAuthService {

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private StoreRepo storeRepo;

    @Autowired
    private OTPRepo otpRepo;

    @Autowired
    private JavaMailSender mailSender;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public boolean isCustomerExists(String email, Long storeId) {
        Customer customer = customerRepo.findByEmailAndStoreId(email, storeId);
        return customer != null;
    }

    public boolean isCustomerExists(String email) {
        Customer customer = customerRepo.findByEmail(email);
        return customer != null;
    }

    @Transactional
    public Customer register(Customer customer, Long storeId) {
        // Validate store exists
        Store store = storeRepo.findById(storeId)
                .orElseThrow(() -> new IllegalArgumentException("Store not found"));

        // Check if customer already exists in this store
        if (isCustomerExists(customer.getEmail(), storeId)) {
            throw new IllegalArgumentException("Customer with this email already exists in this store");
        }

        // Encode password
        String encodedPassword = passwordEncoder.encode(customer.getPassword());
        customer.setPassword(encodedPassword);

        // Set store
        customer.setStore(store);

        // Set default status
        customer.setStatus("active");

        // Create wishlist and shopping cart for the customer
        WishList wishList = new WishList();
        wishList.setNumberOfProducts(0);

        ShoppingCart shoppingCart = new ShoppingCart();
        shoppingCart.setTotalPrice(java.math.BigDecimal.ZERO);

        customer.setWishList(wishList);
        customer.setShoppingCart(shoppingCart);

        return customerRepo.save(customer);
    }

    public Customer login(String email, String password, Long storeId) {
        Customer customer = customerRepo.findByEmailAndStoreId(email, storeId);
        if (customer == null) return null;

        if (!passwordEncoder.matches(password, customer.getPassword())) {
            return null;
        }

        return customer;
    }

    public Customer getCustomerById(Long customerId, Long storeId) {
        Customer customer = customerRepo.findById(customerId)
                .orElse(null);
        
        if (customer == null) return null;

        // Verify customer belongs to the specified store
        if (customer.getStore() == null || !customer.getStore().getId().equals(storeId)) {
            return null;
        }

        return customer;
    }

    @Transactional
    public Customer updateCustomerProfile(Long customerId, Long storeId, Customer customerUpdate) {
        Customer customer = getCustomerById(customerId, storeId);
        if (customer == null) {
            throw new IllegalArgumentException("Customer not found or does not belong to this store");
        }

        // Update allowed fields
        if (customerUpdate.getName() != null) {
            customer.setName(customerUpdate.getName());
        }
        if (customerUpdate.getPhone() != null) {
            customer.setPhone(customerUpdate.getPhone());
        }
        if (customerUpdate.getGender() != null) {
            customer.setGender(customerUpdate.getGender());
        }

        // If password is being updated, encode it
        if (customerUpdate.getPassword() != null && !customerUpdate.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(customerUpdate.getPassword());
            customer.setPassword(encodedPassword);
        }

        return customerRepo.save(customer);
    }

    public void sendCustomerOTP(String email) {
        Customer customer = customerRepo.findByEmail(email);
        if (customer == null) return;
        // Deactivate old OTPs
        List<OTP> oldOtps = otpRepo.findByUserIdAndActiveTrue(String.valueOf(customer.getId()));
        for (OTP o : oldOtps) {
            o.setActive(false);
        }
        otpRepo.saveAll(oldOtps);
        // Generate a 6-digit random OTP
        String otpCode = String.format("%06d", new Random().nextInt(999999));
        OTP otp = new OTP();
        otp.setCode(otpCode);
        otp.setActive(true);
        otp.setUserId(String.valueOf(customer.getId()));
        otp.setUserType("customer");
        otp.setCreatedAt(LocalDateTime.now());
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpRepo.save(otp);
        // Send OTP by email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(customer.getEmail());
        message.setSubject("Your OTP Code");
        message.setText("Your OTP is: " + otpCode + "\nIt is valid for 5 minutes.");
        mailSender.send(message);
    }

    public void verifyCustomerOTP(String email, String code) {
        try {
            Customer customer = customerRepo.findByEmail(email);
            OTP otp = otpRepo.findTopByUserIdAndCodeAndActiveTrueAndExpiresAtAfterOrderByCreatedAtDesc(String.valueOf(customer.getId()), code, LocalDateTime.now());
            if (otp == null) {
                throw new RuntimeException("Invalid or expired OTP");
            }
            // Deactivate OTP
            otp.setActive(false);
            otpRepo.save(otp);
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify OTP: " + e.getMessage(), e);
        }
    }

    public void resetCustomerPassword(String email, String newPassword) {
        try {
            Customer customer = customerRepo.findByEmail(email);
            if (customer == null) {
                throw new RuntimeException("Customer not found");
            }
            String encodedPassword = passwordEncoder.encode(newPassword);
            customer.setPassword(encodedPassword);
            customerRepo.save(customer);
        } catch (Exception e) {
            throw new RuntimeException("Failed to reset password: " + e.getMessage(), e);
        }
    }
} 