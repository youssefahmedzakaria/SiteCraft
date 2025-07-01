package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.Customer;
import com.sitecraft.backend.Models.OTP;
import com.sitecraft.backend.Models.ShoppingCart;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.WishList;
import com.sitecraft.backend.Repositories.CustomerRepo;
import com.sitecraft.backend.Repositories.OTPRepo;
import com.sitecraft.backend.Repositories.StoreRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EcommerceAuthServiceTest {

    @Mock
    private CustomerRepo customerRepo;

    @Mock
    private StoreRepo storeRepo;

    @Mock
    private OTPRepo otpRepo;

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EcommerceAuthService ecommerceAuthService;

    private Customer customer;
    private Store store;
    private OTP otp;

    @BeforeEach
    void setUp() {
        // Setup Store
        store = new Store();
        store.setId(1L);
        store.setStoreName("Test Store");

        // Setup Customer
        customer = new Customer();
        customer.setId(1L);
        customer.setName("John Doe");
        customer.setEmail("john@example.com");
        customer.setPassword("password123");
        customer.setPhone("1234567890");
        customer.setGender("Male");
        customer.setStatus("active");
        customer.setStore(store);

        // Setup OTP
        otp = new OTP();
        otp.setId(1L);
        otp.setCode("123456");
        otp.setUserId("1");
        otp.setUserType("customer");
        otp.setActive(true);
        otp.setCreatedAt(LocalDateTime.now());
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
    }

    @Test
    void testIsCustomerExists_WithStoreId_Exists() {
        // Arrange
        when(customerRepo.findByEmailAndStoreId("john@example.com", 1L)).thenReturn(customer);

        // Act
        boolean result = ecommerceAuthService.isCustomerExists("john@example.com", 1L);

        // Assert
        assertTrue(result);
        verify(customerRepo).findByEmailAndStoreId("john@example.com", 1L);
    }

    @Test
    void testIsCustomerExists_WithStoreId_NotExists() {
        // Arrange
        when(customerRepo.findByEmailAndStoreId("nonexistent@example.com", 1L)).thenReturn(null);

        // Act
        boolean result = ecommerceAuthService.isCustomerExists("nonexistent@example.com", 1L);

        // Assert
        assertFalse(result);
        verify(customerRepo).findByEmailAndStoreId("nonexistent@example.com", 1L);
    }

    @Test
    void testIsCustomerExists_WithoutStoreId_Exists() {
        // Arrange
        when(customerRepo.findByEmail("john@example.com")).thenReturn(customer);

        // Act
        boolean result = ecommerceAuthService.isCustomerExists("john@example.com");

        // Assert
        assertTrue(result);
        verify(customerRepo).findByEmail("john@example.com");
    }

    @Test
    void testIsCustomerExists_WithoutStoreId_NotExists() {
        // Arrange
        when(customerRepo.findByEmail("nonexistent@example.com")).thenReturn(null);

        // Act
        boolean result = ecommerceAuthService.isCustomerExists("nonexistent@example.com");

        // Assert
        assertFalse(result);
        verify(customerRepo).findByEmail("nonexistent@example.com");
    }

    @Test
    void testRegister_Success() {
        // Arrange
        Customer newCustomer = new Customer();
        newCustomer.setName("Jane Doe");
        newCustomer.setEmail("jane@example.com");
        newCustomer.setPassword("password123");
        newCustomer.setPhone("0987654321");
        newCustomer.setGender("Female");

        when(storeRepo.findById(1L)).thenReturn(Optional.of(store));
        when(customerRepo.findByEmailAndStoreId("jane@example.com", 1L)).thenReturn(null);
        when(customerRepo.save(any(Customer.class))).thenAnswer(invocation -> {
            Customer savedCustomer = invocation.getArgument(0);
            savedCustomer.setId(2L);
            return savedCustomer;
        });

        // Act
        Customer result = ecommerceAuthService.register(newCustomer, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("jane@example.com", result.getEmail());
        assertEquals("active", result.getStatus());
        assertEquals(store, result.getStore());
        assertNotNull(result.getWishList());
        assertNotNull(result.getShoppingCart());
        assertTrue(result.getPassword().startsWith("$2a$")); // BCrypt encoded

        verify(storeRepo).findById(1L);
        verify(customerRepo).findByEmailAndStoreId("jane@example.com", 1L);
        verify(customerRepo).save(any(Customer.class));
    }

    @Test
    void testRegister_StoreNotFound() {
        // Arrange
        Customer newCustomer = new Customer();
        newCustomer.setEmail("jane@example.com");
        newCustomer.setPassword("password123");

        when(storeRepo.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ecommerceAuthService.register(newCustomer, 999L));

        assertEquals("Store not found", exception.getMessage());
        verify(storeRepo).findById(999L);
        verify(customerRepo, never()).save(any());
    }

    @Test
    void testRegister_CustomerAlreadyExists() {
        // Arrange
        Customer newCustomer = new Customer();
        newCustomer.setEmail("john@example.com");
        newCustomer.setPassword("password123");

        when(storeRepo.findById(1L)).thenReturn(Optional.of(store));
        when(customerRepo.findByEmailAndStoreId("john@example.com", 1L)).thenReturn(customer);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ecommerceAuthService.register(newCustomer, 1L));

        assertEquals("Customer with this email already exists in this store", exception.getMessage());
        verify(storeRepo).findById(1L);
        verify(customerRepo).findByEmailAndStoreId("john@example.com", 1L);
        verify(customerRepo, never()).save(any());
    }

    @Test
    void testLogin_Success() {
        // Arrange
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode("password123");
        customer.setPassword(encodedPassword);

        when(customerRepo.findByEmailAndStoreId("john@example.com", 1L)).thenReturn(customer);

        // Act
        Customer result = ecommerceAuthService.login("john@example.com", "password123", 1L);

        // Assert
        assertNotNull(result);
        assertEquals(customer, result);
        verify(customerRepo).findByEmailAndStoreId("john@example.com", 1L);
    }

    @Test
    void testLogin_CustomerNotFound() {
        // Arrange
        when(customerRepo.findByEmailAndStoreId("nonexistent@example.com", 1L)).thenReturn(null);

        // Act
        Customer result = ecommerceAuthService.login("nonexistent@example.com", "password123", 1L);

        // Assert
        assertNull(result);
        verify(customerRepo).findByEmailAndStoreId("nonexistent@example.com", 1L);
    }

    @Test
    void testLogin_WrongPassword() {
        // Arrange
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode("password123");
        customer.setPassword(encodedPassword);

        when(customerRepo.findByEmailAndStoreId("john@example.com", 1L)).thenReturn(customer);

        // Act
        Customer result = ecommerceAuthService.login("john@example.com", "wrongpassword", 1L);

        // Assert
        assertNull(result);
        verify(customerRepo).findByEmailAndStoreId("john@example.com", 1L);
    }

    @Test
    void testGetCustomerById_Success() {
        // Arrange
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));

        // Act
        Customer result = ecommerceAuthService.getCustomerById(1L, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(customer, result);
        verify(customerRepo).findById(1L);
    }

    @Test
    void testGetCustomerById_CustomerNotFound() {
        // Arrange
        when(customerRepo.findById(999L)).thenReturn(Optional.empty());

        // Act
        Customer result = ecommerceAuthService.getCustomerById(999L, 1L);

        // Assert
        assertNull(result);
        verify(customerRepo).findById(999L);
    }

    @Test
    void testGetCustomerById_WrongStore() {
        // Arrange
        Store wrongStore = new Store();
        wrongStore.setId(2L);
        customer.setStore(wrongStore);

        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));

        // Act
        Customer result = ecommerceAuthService.getCustomerById(1L, 1L);

        // Assert
        assertNull(result);
        verify(customerRepo).findById(1L);
    }

    @Test
    void testUpdateCustomerProfile_Success() {
        // Arrange
        Customer updateData = new Customer();
        updateData.setName("Updated Name");
        updateData.setPhone("9876543210");
        updateData.setGender("Female");
        updateData.setPassword("newpassword123");

        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(customerRepo.save(any(Customer.class))).thenReturn(customer);

        // Act
        Customer result = ecommerceAuthService.updateCustomerProfile(1L, 1L, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Name", result.getName());
        assertEquals("9876543210", result.getPhone());
        assertEquals("Female", result.getGender());
        assertTrue(result.getPassword().startsWith("$2a$")); // BCrypt encoded

        verify(customerRepo).findById(1L);
        verify(customerRepo).save(any(Customer.class));
    }

    @Test
    void testUpdateCustomerProfile_CustomerNotFound() {
        // Arrange
        Customer updateData = new Customer();
        updateData.setName("Updated Name");

        when(customerRepo.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ecommerceAuthService.updateCustomerProfile(999L, 1L, updateData));

        assertEquals("Customer not found or does not belong to this store", exception.getMessage());
        verify(customerRepo).findById(999L);
        verify(customerRepo, never()).save(any());
    }

    @Test
    void testUpdateCustomerProfile_WrongStore() {
        // Arrange
        Store wrongStore = new Store();
        wrongStore.setId(2L);
        customer.setStore(wrongStore);

        Customer updateData = new Customer();
        updateData.setName("Updated Name");

        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> ecommerceAuthService.updateCustomerProfile(1L, 1L, updateData));

        assertEquals("Customer not found or does not belong to this store", exception.getMessage());
        verify(customerRepo).findById(1L);
        verify(customerRepo, never()).save(any());
    }

    @Test
    void testUpdateCustomerProfile_PartialUpdate() {
        // Arrange
        Customer updateData = new Customer();
        updateData.setName("Updated Name");
        // Phone and gender are null

        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(customerRepo.save(any(Customer.class))).thenReturn(customer);

        // Act
        Customer result = ecommerceAuthService.updateCustomerProfile(1L, 1L, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Name", result.getName());
        assertEquals("1234567890", result.getPhone()); // Original value preserved
        assertEquals("Male", result.getGender()); // Original value preserved

        verify(customerRepo).findById(1L);
        verify(customerRepo).save(any(Customer.class));
    }

    @Test
    void testSendCustomerOTP_Success() {
        // Arrange
        List<OTP> oldOtps = Arrays.asList(otp);
        when(customerRepo.findByEmail("john@example.com")).thenReturn(customer);
        when(otpRepo.findByUserIdAndActiveTrue("1")).thenReturn(oldOtps);
        when(otpRepo.saveAll(any())).thenReturn(oldOtps);
        when(otpRepo.save(any(OTP.class))).thenReturn(otp);
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        // Act
        ecommerceAuthService.sendCustomerOTP("john@example.com");

        // Assert
        verify(customerRepo).findByEmail("john@example.com");
        verify(otpRepo).findByUserIdAndActiveTrue("1");
        verify(otpRepo).saveAll(oldOtps);
        verify(otpRepo).save(any(OTP.class));
        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void testSendCustomerOTP_CustomerNotFound() {
        // Arrange
        when(customerRepo.findByEmail("nonexistent@example.com")).thenReturn(null);

        // Act
        ecommerceAuthService.sendCustomerOTP("nonexistent@example.com");

        // Assert
        verify(customerRepo).findByEmail("nonexistent@example.com");
        verify(otpRepo, never()).findByUserIdAndActiveTrue(any());
        verify(otpRepo, never()).save(any());
        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    void testVerifyCustomerOTP_Success() {
        // Arrange
        when(customerRepo.findByEmail("john@example.com")).thenReturn(customer);
        when(otpRepo.findTopByUserIdAndCodeAndActiveTrueAndExpiresAtAfterOrderByCreatedAtDesc(
                eq("1"), eq("123456"), any(LocalDateTime.class))).thenReturn(otp);
        when(otpRepo.save(otp)).thenReturn(otp);

        // Act
        ecommerceAuthService.verifyCustomerOTP("john@example.com", "123456");

        // Assert
        verify(customerRepo).findByEmail("john@example.com");
        verify(otpRepo).findTopByUserIdAndCodeAndActiveTrueAndExpiresAtAfterOrderByCreatedAtDesc(
                eq("1"), eq("123456"), any(LocalDateTime.class));
        verify(otpRepo).save(otp);
        assertFalse(otp.getActive());
    }

    @Test
    void testVerifyCustomerOTP_InvalidOTP() {
        // Arrange
        when(customerRepo.findByEmail("john@example.com")).thenReturn(customer);
        when(otpRepo.findTopByUserIdAndCodeAndActiveTrueAndExpiresAtAfterOrderByCreatedAtDesc(
                eq("1"), eq("invalid"), any(LocalDateTime.class))).thenReturn(null);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> ecommerceAuthService.verifyCustomerOTP("john@example.com", "invalid"));

        assertEquals("Failed to verify OTP: Invalid or expired OTP", exception.getMessage());
        verify(customerRepo).findByEmail("john@example.com");
        verify(otpRepo).findTopByUserIdAndCodeAndActiveTrueAndExpiresAtAfterOrderByCreatedAtDesc(
                eq("1"), eq("invalid"), any(LocalDateTime.class));
        verify(otpRepo, never()).save(any());
    }

    @Test
    void testResetCustomerPassword_Success() {
        // Arrange
        when(customerRepo.findByEmail("john@example.com")).thenReturn(customer);
        when(customerRepo.save(any(Customer.class))).thenReturn(customer);

        // Act
        ecommerceAuthService.resetCustomerPassword("john@example.com", "newpassword123");

        // Assert
        verify(customerRepo).findByEmail("john@example.com");
        verify(customerRepo).save(any(Customer.class));
        assertTrue(customer.getPassword().startsWith("$2a$")); // BCrypt encoded
    }

    @Test
    void testResetCustomerPassword_CustomerNotFound() {
        // Arrange
        when(customerRepo.findByEmail("nonexistent@example.com")).thenReturn(null);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> ecommerceAuthService.resetCustomerPassword("nonexistent@example.com", "newpassword123"));

        assertEquals("Failed to reset password: Customer not found", exception.getMessage());
        verify(customerRepo).findByEmail("nonexistent@example.com");
        verify(customerRepo, never()).save(any());
    }

    @Test
    void contextLoads() {
        MockitoAnnotations.openMocks(this);
    }
} 