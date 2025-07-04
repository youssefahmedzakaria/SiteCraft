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

    // TODO: Implement tests for countNewCustomersByDateRange, countReturningCustomersByDateRange, getCustomerAddresses, updateCustomerInfo, changePassword, addAddress, updateAddress, deleteAddress
} 