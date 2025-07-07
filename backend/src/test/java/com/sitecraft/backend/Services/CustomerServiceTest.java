package com.sitecraft.backend.Services;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import com.sitecraft.backend.Models.Customer;
import com.sitecraft.backend.Models.Address;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Repositories.CustomerRepo;
import com.sitecraft.backend.Repositories.AddressRepo;
import java.util.Optional;
import java.util.Collections;
import java.util.List;
import java.util.Arrays;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CustomerServiceTest {
    @Mock
    private CustomerRepo customerRepo;
    @Mock
    private AddressRepo addressRepo;

    @InjectMocks
    private CustomerService customerService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllCustomers() {
        Customer customer = mock(Customer.class);
        when(customerRepo.findByStoreId(1L)).thenReturn(Collections.singletonList(customer));
        List<Customer> result = customerService.getAllCustomers(1L);
        assertEquals(1, result.size());
        assertEquals(customer, result.get(0));
    }

    @Test
    void testGetCustomerInfo_Success() {
        Customer customer = mock(Customer.class);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        Customer result = customerService.getCustomerInfo(1L);
        assertEquals(customer, result);
    }

    @Test
    void testGetCustomerInfo_NotFound() {
        when(customerRepo.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> customerService.getCustomerInfo(1L));
        assertTrue(ex.getMessage().contains("Customer not found"));
    }

    @Test
    void testSuspendCustomer_Success() {
        Customer customer = mock(Customer.class);
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(2L);
        when(customer.getStore()).thenReturn(store);
        when(customer.getId()).thenReturn(1L);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        doNothing().when(customer).setStatus("inactive");
        doNothing().when(customer).setUpdatedAt(any(LocalDateTime.class));
        when(customerRepo.save(customer)).thenReturn(customer);
        assertDoesNotThrow(() -> customerService.suspendCustomer(1L, 2L));
        verify(customer).setStatus("inactive");
        verify(customerRepo).save(customer);
    }

    @Test
    void testSuspendCustomer_NotFound() {
        when(customerRepo.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> customerService.suspendCustomer(1L, 2L));
        assertTrue(ex.getMessage().contains("Customer not found"));
    }

    @Test
    void testSuspendCustomer_Unauthorized() {
        Customer customer = mock(Customer.class);
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(3L);
        when(customer.getStore()).thenReturn(store);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        RuntimeException ex = assertThrows(RuntimeException.class, () -> customerService.suspendCustomer(1L, 2L));
        assertTrue(ex.getMessage().contains("Access denied"));
    }

    @Test
    void testCountNewCustomersByDateRange() {
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();
        when(customerRepo.countByStoreIdAndCreatedAtBetween(1L, startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay()))
            .thenReturn(5L);
        
        long result = customerService.countNewCustomersByDateRange(startDate, endDate, 1L);
        
        assertEquals(5L, result);
        verify(customerRepo).countByStoreIdAndCreatedAtBetween(1L, startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay());
    }

    @Test
    void testCountReturningCustomersByDateRange() {
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();
        when(customerRepo.countReturningCustomersByDateRange(1L, startDate, endDate))
            .thenReturn(3L);
        
        long result = customerService.countReturningCustomersByDateRange(startDate, endDate, 1L);
        
        assertEquals(3L, result);
        verify(customerRepo).countReturningCustomersByDateRange(1L, startDate, endDate);
    }

    @Test
    void testGetCustomerAddresses_Success() {
        Customer customer = mock(Customer.class);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        
        Address address1 = new Address();
        address1.setId(1L);
        address1.setTitle("Home");
        address1.setCity("New York");
        
        Address address2 = new Address();
        address2.setId(2L);
        address2.setTitle("Work");
        address2.setCity("Boston");
        
        when(addressRepo.findByCustomerId(1L)).thenReturn(Arrays.asList(address1, address2));
        
        List<Address> result = customerService.getCustomerAddresses(1L);
        
        assertEquals(2, result.size());
        assertEquals("Home", result.get(0).getTitle());
        assertEquals("Work", result.get(1).getTitle());
        verify(customerRepo).findById(1L);
        verify(addressRepo).findByCustomerId(1L);
    }

    @Test
    void testGetCustomerAddresses_CustomerNotFound() {
        when(customerRepo.findById(1L)).thenReturn(Optional.empty());
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> customerService.getCustomerAddresses(1L));
        assertTrue(ex.getMessage().contains("Customer not found"));
        verify(customerRepo).findById(1L);
        verify(addressRepo, never()).findByCustomerId(any());
    }

    @Test
    void testGetCustomerAddresses_NoAddresses() {
        Customer customer = mock(Customer.class);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(addressRepo.findByCustomerId(1L)).thenReturn(Collections.emptyList());
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> customerService.getCustomerAddresses(1L));
        assertTrue(ex.getMessage().contains("No addresses found"));
        verify(customerRepo).findById(1L);
        verify(addressRepo).findByCustomerId(1L);
    }

    @Test
    void testUpdateCustomerInfo_Success() {
        Customer existingCustomer = new Customer();
        existingCustomer.setId(1L);
        existingCustomer.setName("Old Name");
        existingCustomer.setPhone("1234567890");
        existingCustomer.setGender("Male");
        
        Customer updateData = new Customer();
        updateData.setName("New Name");
        updateData.setPhone("9876543210");
        updateData.setGender("Female");
        
        when(customerRepo.findById(1L)).thenReturn(Optional.of(existingCustomer));
        when(customerRepo.save(any(Customer.class))).thenReturn(existingCustomer);
        
        customerService.updateCustomerInfo(1L, updateData);
        
        assertEquals("New Name", existingCustomer.getName());
        assertEquals("9876543210", existingCustomer.getPhone());
        assertEquals("Female", existingCustomer.getGender());
        assertNotNull(existingCustomer.getUpdatedAt());
        verify(customerRepo).findById(1L);
        verify(customerRepo).save(existingCustomer);
    }

    @Test
    void testUpdateCustomerInfo_CustomerNotFound() {
        Customer updateData = new Customer();
        updateData.setName("New Name");
        
        when(customerRepo.findById(1L)).thenReturn(Optional.empty());
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> customerService.updateCustomerInfo(1L, updateData));
        assertTrue(ex.getMessage().contains("Customer not found"));
        verify(customerRepo).findById(1L);
        verify(customerRepo, never()).save(any());
    }

    @Test
    void testChangePassword_Success() {
        Customer customer = new Customer();
        customer.setId(1L);
        customer.setPassword("$2a$10$encodedPassword"); // BCrypt encoded
        
        java.util.Map<String, String> passwords = new java.util.HashMap<>();
        passwords.put("currentPassword", "oldPassword");
        passwords.put("newPassword", "newPassword123");
        
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(customerRepo.save(any(Customer.class))).thenReturn(customer);
        
        // Mock BCryptPasswordEncoder
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder = 
            new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        String encodedOldPassword = encoder.encode("oldPassword");
        customer.setPassword(encodedOldPassword);
        
        customerService.changePassword(1L, passwords);
        
        assertNotNull(customer.getUpdatedAt());
        verify(customerRepo).findById(1L);
        verify(customerRepo).save(customer);
    }

    @Test
    void testChangePassword_WrongCurrentPassword() {
        Customer customer = new Customer();
        customer.setId(1L);
        customer.setPassword("$2a$10$encodedPassword");
        
        java.util.Map<String, String> passwords = new java.util.HashMap<>();
        passwords.put("currentPassword", "wrongPassword");
        passwords.put("newPassword", "newPassword123");
        
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> customerService.changePassword(1L, passwords));
        assertTrue(ex.getMessage().contains("Current password is incorrect"));
        verify(customerRepo).findById(1L);
        verify(customerRepo, never()).save(any());
    }

    @Test
    void testChangePassword_ShortNewPassword() {
        Customer customer = new Customer();
        customer.setId(1L);
        
        java.util.Map<String, String> passwords = new java.util.HashMap<>();
        passwords.put("currentPassword", "oldPassword");
        passwords.put("newPassword", "short");
        
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> customerService.changePassword(1L, passwords));
        assertTrue(ex.getMessage().contains("New password must be at least 8 characters long"));
        verify(customerRepo).findById(1L);
        verify(customerRepo, never()).save(any());
    }

    @Test
    void testAddAddress_Success() {
        Customer customer = new Customer();
        customer.setId(1L);
        
        Address newAddress = new Address();
        newAddress.setTitle("Home");
        newAddress.setCity("New York");
        newAddress.setStreetNum("123");
        newAddress.setBuildingNum("A");
        newAddress.setFloorNum("2");
        newAddress.setApartmentNum("5");
        newAddress.setLandmark("Near Park");
        
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(addressRepo.save(any(Address.class))).thenReturn(newAddress);
        
        customerService.addAddress(1L, newAddress);
        
        verify(customerRepo).findById(1L);
        verify(addressRepo).save(any(Address.class));
    }

    @Test
    void testAddAddress_CustomerNotFound() {
        Address newAddress = new Address();
        newAddress.setTitle("Home");
        
        when(customerRepo.findById(1L)).thenReturn(Optional.empty());
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> customerService.addAddress(1L, newAddress));
        assertTrue(ex.getMessage().contains("Customer not found"));
        verify(customerRepo).findById(1L);
        verify(addressRepo, never()).save(any());
    }

    @Test
    void testUpdateAddress_Success() {
        Customer customer = new Customer();
        customer.setId(1L);
        
        Address existingAddress = new Address();
        existingAddress.setId(1L);
        existingAddress.setTitle("Old Title");
        existingAddress.setCity("Old City");
        existingAddress.setCustomer(customer);
        
        Address updateData = new Address();
        updateData.setTitle("New Title");
        updateData.setCity("New City");
        
        when(addressRepo.findById(1L)).thenReturn(Optional.of(existingAddress));
        when(addressRepo.save(any(Address.class))).thenReturn(existingAddress);
        
        customerService.updateAddress(1L, 1L, updateData);
        
        assertEquals("New Title", existingAddress.getTitle());
        assertEquals("New City", existingAddress.getCity());
        verify(addressRepo).findById(1L);
        verify(addressRepo).save(existingAddress);
    }

    @Test
    void testUpdateAddress_AddressNotFound() {
        Address updateData = new Address();
        updateData.setTitle("New Title");
        
        when(addressRepo.findById(1L)).thenReturn(Optional.empty());
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> customerService.updateAddress(1L, 1L, updateData));
        assertTrue(ex.getMessage().contains("Address not found"));
        verify(addressRepo).findById(1L);
        verify(addressRepo, never()).save(any());
    }

    @Test
    void testUpdateAddress_Unauthorized() {
        Customer customer1 = new Customer();
        customer1.setId(1L);
        
        Customer customer2 = new Customer();
        customer2.setId(2L);
        
        Address existingAddress = new Address();
        existingAddress.setId(1L);
        existingAddress.setCustomer(customer2); // Different customer
        
        Address updateData = new Address();
        updateData.setTitle("New Title");
        
        when(addressRepo.findById(1L)).thenReturn(Optional.of(existingAddress));
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> customerService.updateAddress(1L, 1L, updateData));
        assertTrue(ex.getMessage().contains("Unauthorized access to this address"));
        verify(addressRepo).findById(1L);
        verify(addressRepo, never()).save(any());
    }

    @Test
    void testDeleteAddress_Success() {
        Customer customer = new Customer();
        customer.setId(1L);
        
        Address address = new Address();
        address.setId(1L);
        address.setCustomer(customer);
        
        when(addressRepo.findById(1L)).thenReturn(Optional.of(address));
        doNothing().when(addressRepo).delete(address);
        
        customerService.deleteAddress(1L, 1L);
        
        verify(addressRepo).findById(1L);
        verify(addressRepo).delete(address);
    }

    @Test
    void testDeleteAddress_AddressNotFound() {
        when(addressRepo.findById(1L)).thenReturn(Optional.empty());
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> customerService.deleteAddress(1L, 1L));
        assertTrue(ex.getMessage().contains("Address not found"));
        verify(addressRepo).findById(1L);
        verify(addressRepo, never()).delete(any());
    }

    @Test
    void testDeleteAddress_Unauthorized() {
        Customer customer1 = new Customer();
        customer1.setId(1L);
        
        Customer customer2 = new Customer();
        customer2.setId(2L);
        
        Address address = new Address();
        address.setId(1L);
        address.setCustomer(customer2); // Different customer
        
        when(addressRepo.findById(1L)).thenReturn(Optional.of(address));
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> customerService.deleteAddress(1L, 1L));
        assertTrue(ex.getMessage().contains("Unauthorized access to this address"));
        verify(addressRepo).findById(1L);
        verify(addressRepo, never()).delete(any());
    }

    @Test
    void testGetCustomer_Success() {
        Customer customer = new Customer();
        customer.setId(1L);
        customer.setName("John Doe");
        
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        
        Customer result = customerService.getCustomer(1L);
        
        assertEquals(customer, result);
        verify(customerRepo).findById(1L);
    }

    @Test
    void testGetCustomer_NotFound() {
        when(customerRepo.findById(1L)).thenReturn(Optional.empty());
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> customerService.getCustomer(1L));
        assertTrue(ex.getMessage().contains("Customer not found"));
        verify(customerRepo).findById(1L);
    }
} 