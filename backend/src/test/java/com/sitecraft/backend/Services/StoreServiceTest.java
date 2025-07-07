package com.sitecraft.backend.Services;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import java.util.Optional;
import java.util.Collections;
import java.util.List;

public class StoreServiceTest {
    @Mock private StoreRepo storeRepo;
    @Mock private UserRoleRepo userRoleRepo;
    @Mock private ShippingInfoRepo shippingInfoRepo;
    @Mock private PolicyRepo policyRepository;
    @Mock private AboutUsRepo aboutUsRepository;

    @InjectMocks
    private StoreService storeService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateStore_Success() {
        Store store = new Store();
        store.setId(1L);
        store.setStoreName("Test Store");
        Users user = new Users();
        user.setId(2L);
        when(storeRepo.save(any(Store.class))).thenReturn(store);
        when(userRoleRepo.save(any(UserRole.class))).thenReturn(new UserRole());
        Store result = storeService.createStore(store, 2L);
        assertEquals(1L, result.getId());
    }

    @Test
    void testGetStore_Success() {
        Store store = new Store();
        store.setId(1L);
        when(storeRepo.findById(1L)).thenReturn(Optional.of(store));
        Store result = storeService.getStore(1L);
        assertEquals(1L, result.getId());
    }

    @Test
    void testGetStore_NotFound() {
        when(storeRepo.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> storeService.getStore(1L));
        assertTrue(ex.getMessage().contains("Store not found"));
    }

    @Test
    void testUpdateStorePartial_Success() {
        Store existing = new Store();
        existing.setId(1L);
        existing.setStoreName("Old Name");
        Store updated = new Store();
        updated.setStoreName("New Name");
        updated.setSocialMediaAccounts(Collections.emptyList());
        when(storeRepo.findById(1L)).thenReturn(Optional.of(existing));
        when(storeRepo.save(existing)).thenReturn(existing);
        Store result = storeService.updateStorePartial(1L, updated);
        assertEquals("New Name", result.getStoreName());
    }

    @Test
    void testUpdateStorePartial_NotFound() {
        Store updated = new Store();
        updated.setStoreName("New Name");
        updated.setSocialMediaAccounts(Collections.emptyList());
        when(storeRepo.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> storeService.updateStorePartial(1L, updated));
        assertTrue(ex.getMessage().contains("Store not found"));
    }

    // TODO: Implement tests for shipping info, policies, about us, and other edge cases
} 