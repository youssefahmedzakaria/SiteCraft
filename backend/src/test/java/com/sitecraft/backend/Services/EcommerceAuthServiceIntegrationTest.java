package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.Customer;
import com.sitecraft.backend.Models.OTP;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Repositories.CustomerRepo;
import com.sitecraft.backend.Repositories.OTPRepo;
import com.sitecraft.backend.Repositories.StoreRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class EcommerceAuthServiceIntegrationTest {

    @Autowired
    private EcommerceAuthService ecommerceAuthService;

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private StoreRepo storeRepo;

    @Autowired
    private OTPRepo otpRepo;

    @MockBean
    private JavaMailSender mailSender;

    private Store store;
    private Customer customer;

    @BeforeEach
    void setUp() {
        // Create test store
        store = new Store();
        store.setStoreName("Test Store");
        store.setEmailAddress("store@test.com");
        store.setPhoneNumber("1234567890");
        store = storeRepo.save(store);

        // Create test customer with unique email
        customer = new Customer();
        customer.setName("John Doe");
        customer.setEmail("john-" + UUID.randomUUID() + "@example.com");
        customer.setPassword(new BCryptPasswordEncoder().encode("password123"));
        customer.setPhone("1234567890");
        customer.setGender("Male");
        customer.setStatus("active");
        customer.setStore(store);
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        customer = customerRepo.save(customer);

        // Mock email sending
        doNothing().when(mailSender).send(any(org.springframework.mail.SimpleMailMessage.class));
    }

    @Test
    void testRegister_Success() {
        // Arrange
        String uniqueEmail = "jane-" + UUID.randomUUID() + "@example.com";
        Customer newCustomer = new Customer();
        newCustomer.setName("Jane Doe");
        newCustomer.setEmail(uniqueEmail);
        newCustomer.setPassword("password123");
        newCustomer.setPhone("0987654321");
        newCustomer.setGender("Female");
        newCustomer.setCreatedAt(LocalDateTime.now());
        newCustomer.setUpdatedAt(LocalDateTime.now());

        // Act
        Customer result = ecommerceAuthService.register(newCustomer, store.getId());

        // Assert
        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals(uniqueEmail, result.getEmail());
        assertEquals("active", result.getStatus());
        assertEquals(store, result.getStore());
        assertNotNull(result.getWishList());
        assertNotNull(result.getShoppingCart());
        assertTrue(result.getPassword().startsWith("$2a$")); // BCrypt encoded

        // Verify saved in database
        Customer savedCustomer = customerRepo.findByEmailAndStoreId(uniqueEmail, store.getId());
        assertNotNull(savedCustomer);
        assertEquals("Jane Doe", savedCustomer.getName());
    }

    @Test
    void testRegister_CustomerAlreadyExists() {
        // Arrange
        Customer existingCustomer = new Customer();
        existingCustomer.setName("Jane Doe");
        existingCustomer.setEmail(customer.getEmail()); // Use the already created customer's email
        existingCustomer.setPassword("password123");
        existingCustomer.setCreatedAt(LocalDateTime.now());
        existingCustomer.setUpdatedAt(LocalDateTime.now());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ecommerceAuthService.register(existingCustomer, store.getId()));

        assertEquals("Customer with this email already exists in this store", exception.getMessage());
    }

    @Test
    void testRegister_StoreNotFound() {
        // Arrange
        Customer newCustomer = new Customer();
        newCustomer.setEmail("jane-" + UUID.randomUUID() + "@example.com");
        newCustomer.setPassword("password123");
        newCustomer.setCreatedAt(LocalDateTime.now());
        newCustomer.setUpdatedAt(LocalDateTime.now());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ecommerceAuthService.register(newCustomer, 999L));

        assertEquals("Store not found", exception.getMessage());
    }

    @Test
    void testLogin_Success() {
        // Act
        Customer result = ecommerceAuthService.login(customer.getEmail(), "password123", store.getId());

        // Assert
        assertNotNull(result);
        assertEquals(customer.getId(), result.getId());
        assertEquals(customer.getEmail(), result.getEmail());
    }

    @Test
    void testLogin_CustomerNotFound() {
        // Act
        Customer result = ecommerceAuthService.login("nonexistent-" + UUID.randomUUID() + "@example.com", "password123", store.getId());

        // Assert
        assertNull(result);
    }

    @Test
    void testLogin_WrongPassword() {
        // Act
        Customer result = ecommerceAuthService.login(customer.getEmail(), "wrongpassword", store.getId());

        // Assert
        assertNull(result);
    }

    @Test
    void testLogin_WrongStore() {
        // Create another store
        Store anotherStore = new Store();
        anotherStore.setStoreName("Another Store");
        anotherStore.setEmailAddress("another-" + UUID.randomUUID() + "@test.com");
        anotherStore.setPhoneNumber("0987654321");
        anotherStore = storeRepo.save(anotherStore);

        // Act
        Customer result = ecommerceAuthService.login(customer.getEmail(), "password123", anotherStore.getId());

        // Assert
        assertNull(result);
    }

    @Test
    void testIsCustomerExists_WithStoreId_Exists() {
        // Act
        boolean result = ecommerceAuthService.isCustomerExists(customer.getEmail(), store.getId());

        // Assert
        assertTrue(result);
    }

    @Test
    void testIsCustomerExists_WithStoreId_NotExists() {
        // Act
        boolean result = ecommerceAuthService.isCustomerExists("nonexistent-" + UUID.randomUUID() + "@example.com", store.getId());

        // Assert
        assertFalse(result);
    }

    @Test
    void testIsCustomerExists_WithoutStoreId_Exists() {
        // Act
        boolean result = ecommerceAuthService.isCustomerExists(customer.getEmail());

        // Assert
        assertTrue(result);
    }

    @Test
    void testIsCustomerExists_WithoutStoreId_NotExists() {
        // Act
        boolean result = ecommerceAuthService.isCustomerExists("nonexistent-" + UUID.randomUUID() + "@example.com");

        // Assert
        assertFalse(result);
    }

    @Test
    void testGetCustomerById_Success() {
        // Act
        Customer result = ecommerceAuthService.getCustomerById(customer.getId(), store.getId());

        // Assert
        assertNotNull(result);
        assertEquals(customer.getId(), result.getId());
        assertEquals(customer.getEmail(), result.getEmail());
    }

    @Test
    void testGetCustomerById_CustomerNotFound() {
        // Act
        Customer result = ecommerceAuthService.getCustomerById(999L, store.getId());

        // Assert
        assertNull(result);
    }

    @Test
    void testGetCustomerById_WrongStore() {
        // Create another store
        final Store anotherStore = new Store();
        anotherStore.setStoreName("Another Store");
        anotherStore.setEmailAddress("another-" + UUID.randomUUID() + "@test.com");
        anotherStore.setPhoneNumber("0987654321");
        final Store savedAnotherStore = storeRepo.save(anotherStore);

        // Act
        Customer result = ecommerceAuthService.getCustomerById(customer.getId(), savedAnotherStore.getId());

        // Assert
        assertNull(result);
    }

    @Test
    void testUpdateCustomerProfile_Success() {
        // Arrange
        Customer updateData = new Customer();
        updateData.setName("Updated Name");
        updateData.setPhone("9876543210");
        updateData.setGender("Female");
        updateData.setPassword("newpassword123");
        updateData.setCreatedAt(LocalDateTime.now());
        updateData.setUpdatedAt(LocalDateTime.now());

        // Act
        Customer result = ecommerceAuthService.updateCustomerProfile(customer.getId(), store.getId(), updateData);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Name", result.getName());
        assertEquals("9876543210", result.getPhone());
        assertEquals("Female", result.getGender());
        assertTrue(result.getPassword().startsWith("$2a$")); // BCrypt encoded

        // Verify updated in database
        Customer updatedCustomer = customerRepo.findById(customer.getId()).orElse(null);
        assertNotNull(updatedCustomer);
        assertEquals("Updated Name", updatedCustomer.getName());
        assertEquals("9876543210", updatedCustomer.getPhone());
        assertEquals("Female", updatedCustomer.getGender());
    }

    @Test
    void testUpdateCustomerProfile_CustomerNotFound() {
        // Arrange
        Customer updateData = new Customer();
        updateData.setName("Updated Name");
        updateData.setCreatedAt(LocalDateTime.now());
        updateData.setUpdatedAt(LocalDateTime.now());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ecommerceAuthService.updateCustomerProfile(999L, store.getId(), updateData));

        assertEquals("Customer not found or does not belong to this store", exception.getMessage());
    }

    @Test
    void testUpdateCustomerProfile_WrongStore() {
        // Create another store
        final Store anotherStore = new Store();
        anotherStore.setStoreName("Another Store");
        anotherStore.setEmailAddress("another-" + UUID.randomUUID() + "@test.com");
        anotherStore.setPhoneNumber("0987654321");
        final Store savedAnotherStore = storeRepo.save(anotherStore);

        // Arrange
        Customer updateData = new Customer();
        updateData.setName("Updated Name");
        updateData.setCreatedAt(LocalDateTime.now());
        updateData.setUpdatedAt(LocalDateTime.now());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ecommerceAuthService.updateCustomerProfile(customer.getId(), savedAnotherStore.getId(), updateData));

        assertEquals("Customer not found or does not belong to this store", exception.getMessage());
    }

    @Test
    void testUpdateCustomerProfile_PartialUpdate() {
        // Arrange
        Customer updateData = new Customer();
        updateData.setName("Updated Name");
        updateData.setCreatedAt(LocalDateTime.now());
        updateData.setUpdatedAt(LocalDateTime.now());
        // Phone and gender are null

        // Act
        Customer result = ecommerceAuthService.updateCustomerProfile(customer.getId(), store.getId(), updateData);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Name", result.getName());
        assertEquals("1234567890", result.getPhone()); // Original value preserved
        assertEquals("Male", result.getGender()); // Original value preserved
    }

    @Test
    void testSendCustomerOTP_Success() {
        // Act
        ecommerceAuthService.sendCustomerOTP(customer.getEmail());

        // Assert
        List<OTP> otps = otpRepo.findByUserIdAndActiveTrue(String.valueOf(customer.getId()));
        assertEquals(1, otps.size());
        
        OTP otp = otps.get(0);
        assertEquals("customer", otp.getUserType());
        assertTrue(otp.getActive());
        assertNotNull(otp.getCode());
        assertEquals(6, otp.getCode().length()); // 6-digit OTP
        assertTrue(otp.getExpiresAt().isAfter(LocalDateTime.now()));
    }

    @Test
    void testSendCustomerOTP_CustomerNotFound() {
        // Act
        ecommerceAuthService.sendCustomerOTP("nonexistent-" + UUID.randomUUID() + "@example.com");

        // Assert
        List<OTP> otps = otpRepo.findByUserIdAndActiveTrue("999");
        assertEquals(0, otps.size());
    }

    @Test
    void testSendCustomerOTP_DeactivatesOldOTPs() {
        // Arrange - Create old OTP
        OTP oldOtp = new OTP();
        oldOtp.setCode("123456");
        oldOtp.setUserId(String.valueOf(customer.getId()));
        oldOtp.setUserType("customer");
        oldOtp.setActive(true);
        oldOtp.setCreatedAt(LocalDateTime.now().minusMinutes(10));
        oldOtp.setExpiresAt(LocalDateTime.now().minusMinutes(5));
        otpRepo.save(oldOtp);

        // Act
        ecommerceAuthService.sendCustomerOTP(customer.getEmail());

        // Assert
        List<OTP> activeOtps = otpRepo.findByUserIdAndActiveTrue(String.valueOf(customer.getId()));
        assertEquals(1, activeOtps.size());
        
        OTP newOtp = activeOtps.get(0);
        assertNotEquals("123456", newOtp.getCode()); // Different code
        assertTrue(newOtp.getActive());
    }

    @Test
    void testVerifyCustomerOTP_Success() {
        // Arrange - Create OTP
        OTP otp = new OTP();
        otp.setCode("123456");
        otp.setUserId(String.valueOf(customer.getId()));
        otp.setUserType("customer");
        otp.setActive(true);
        otp.setCreatedAt(LocalDateTime.now());
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpRepo.save(otp);

        // Act
        ecommerceAuthService.verifyCustomerOTP(customer.getEmail(), "123456");

        // Assert
        List<OTP> activeOtps = otpRepo.findByUserIdAndActiveTrue(String.valueOf(customer.getId()));
        assertEquals(0, activeOtps.size()); // OTP should be deactivated
    }

    @Test
    void testVerifyCustomerOTP_InvalidOTP() {
        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> ecommerceAuthService.verifyCustomerOTP(customer.getEmail(), "invalid"));

        assertEquals("Failed to verify OTP: Invalid or expired OTP", exception.getMessage());
    }

    @Test
    void testVerifyCustomerOTP_ExpiredOTP() {
        // Arrange - Create expired OTP
        OTP otp = new OTP();
        otp.setCode("123456");
        otp.setUserId(String.valueOf(customer.getId()));
        otp.setUserType("customer");
        otp.setActive(true);
        otp.setCreatedAt(LocalDateTime.now().minusMinutes(10));
        otp.setExpiresAt(LocalDateTime.now().minusMinutes(5));
        otpRepo.save(otp);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> ecommerceAuthService.verifyCustomerOTP(customer.getEmail(), "123456"));

        assertEquals("Failed to verify OTP: Invalid or expired OTP", exception.getMessage());
    }

    @Test
    void testResetCustomerPassword_Success() {
        // Act
        ecommerceAuthService.resetCustomerPassword(customer.getEmail(), "newpassword123");

        // Assert
        Customer updatedCustomer = customerRepo.findByEmail(customer.getEmail());
        assertNotNull(updatedCustomer);
        assertTrue(updatedCustomer.getPassword().startsWith("$2a$")); // BCrypt encoded

        // Verify new password works
        Customer loginResult = ecommerceAuthService.login(customer.getEmail(), "newpassword123", store.getId());
        assertNotNull(loginResult);
    }

    @Test
    void testResetCustomerPassword_CustomerNotFound() {
        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> ecommerceAuthService.resetCustomerPassword("nonexistent-" + UUID.randomUUID() + "@example.com", "newpassword123"));

        assertEquals("Failed to reset password: Customer not found", exception.getMessage());
    }
} 