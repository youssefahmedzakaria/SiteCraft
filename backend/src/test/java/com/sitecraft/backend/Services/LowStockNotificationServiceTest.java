package com.sitecraft.backend.Services;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LowStockNotificationServiceTest {
    @Mock
    private ProductRepo productRepo;
    
    @Mock
    private UserRoleRepo userRoleRepo;
    
    @Mock
    private UserService userService;
    
    @InjectMocks
    private LowStockNotificationService lowStockNotificationService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCheckAndSendLowStockNotification_EnabledAndLowStock() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setMinCap(new BigDecimal("5"));
        product.setMaxCap(new BigDecimal("3")); // Current stock below threshold
        
        Store store = new Store();
        store.setId(1L);
        product.setStore(store);
        
        UserRole ownerRole = new UserRole();
        Users owner = new Users();
        owner.setEmail("owner@test.com");
        ownerRole.setUser(owner);
        
        when(userRoleRepo.findByRoleAndStoreId("owner", 1L)).thenReturn(Arrays.asList(ownerRole));
        doNothing().when(userService).sendLowStockNotificationEmail(anyString(), anyString(), anyString());

        // Act
        lowStockNotificationService.checkAndSendLowStockNotification(product);

        // Assert
        verify(userRoleRepo).findByRoleAndStoreId("owner", 1L);
        verify(userService).sendLowStockNotificationEmail(eq("owner@test.com"), anyString(), anyString());
    }

    @Test
    void testCheckAndSendLowStockNotification_Disabled() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        // Low stock notifications disabled by setting minCap to null
        product.setMinCap(null);
        product.setMaxCap(new BigDecimal("3"));

        // Act
        lowStockNotificationService.checkAndSendLowStockNotification(product);

        // Assert
        verify(userRoleRepo, never()).findByRoleAndStoreId(anyString(), anyLong());
        verify(userService, never()).sendLowStockNotificationEmail(anyString(), anyString(), anyString());
    }

    @Test
    void testCheckAndSendLowStockNotification_NotLowStock() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setMinCap(new BigDecimal("5"));
        product.setMaxCap(new BigDecimal("10")); // Current stock above threshold

        // Act
        lowStockNotificationService.checkAndSendLowStockNotification(product);

        // Assert
        verify(userRoleRepo, never()).findByRoleAndStoreId(anyString(), anyLong());
        verify(userService, never()).sendLowStockNotificationEmail(anyString(), anyString(), anyString());
    }

    @Test
    void testCheckAndSendLowStockNotification_NoOwnerFound() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setMinCap(new BigDecimal("5"));
        product.setMaxCap(new BigDecimal("3"));
        
        Store store = new Store();
        store.setId(1L);
        product.setStore(store);
        
        when(userRoleRepo.findByRoleAndStoreId("owner", 1L)).thenReturn(Collections.emptyList());

        // Act
        lowStockNotificationService.checkAndSendLowStockNotification(product);

        // Assert
        verify(userRoleRepo).findByRoleAndStoreId("owner", 1L);
        verify(userService, never()).sendLowStockNotificationEmail(anyString(), anyString(), anyString());
    }

    @Test
    void testCheckAndSendLowStockNotification_OwnerEmailNull() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setMinCap(new BigDecimal("5"));
        product.setMaxCap(new BigDecimal("3"));
        
        Store store = new Store();
        store.setId(1L);
        product.setStore(store);
        
        UserRole ownerRole = new UserRole();
        Users owner = new Users();
        owner.setEmail(null); // Null email
        ownerRole.setUser(owner);
        
        when(userRoleRepo.findByRoleAndStoreId("owner", 1L)).thenReturn(Arrays.asList(ownerRole));

        // Act
        lowStockNotificationService.checkAndSendLowStockNotification(product);

        // Assert
        verify(userRoleRepo).findByRoleAndStoreId("owner", 1L);
        verify(userService, never()).sendLowStockNotificationEmail(anyString(), anyString(), anyString());
    }

    @Test
    void testCheckAndSendLowStockNotification_OwnerEmailEmpty() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setMinCap(new BigDecimal("5"));
        product.setMaxCap(new BigDecimal("3"));
        
        Store store = new Store();
        store.setId(1L);
        product.setStore(store);
        
        UserRole ownerRole = new UserRole();
        Users owner = new Users();
        owner.setEmail(""); // Empty email
        ownerRole.setUser(owner);
        
        when(userRoleRepo.findByRoleAndStoreId("owner", 1L)).thenReturn(Arrays.asList(ownerRole));

        // Act
        lowStockNotificationService.checkAndSendLowStockNotification(product);

        // Assert
        verify(userRoleRepo).findByRoleAndStoreId("owner", 1L);
        verify(userService, never()).sendLowStockNotificationEmail(anyString(), anyString(), anyString());
    }

    @Test
    void testCheckAndSendLowStockNotification_ExceptionHandling() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setMinCap(new BigDecimal("5"));
        product.setMaxCap(new BigDecimal("3"));
        
        Store store = new Store();
        store.setId(1L);
        product.setStore(store);
        
        when(userRoleRepo.findByRoleAndStoreId("owner", 1L))
            .thenThrow(new RuntimeException("Database error"));

        // Act - Should not throw exception
        assertDoesNotThrow(() -> lowStockNotificationService.checkAndSendLowStockNotification(product));

        // Assert
        verify(userRoleRepo).findByRoleAndStoreId("owner", 1L);
        verify(userService, never()).sendLowStockNotificationEmail(anyString(), anyString(), anyString());
    }

    @Test
    void testSendLowStockNotification_Success() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setDescription("Test Description");
        product.setMinCap(new BigDecimal("5"));
        product.setMaxCap(new BigDecimal("3"));
        product.setPercentageMax(new BigDecimal("20"));
        
        Store store = new Store();
        store.setId(1L);
        product.setStore(store);
        
        UserRole ownerRole = new UserRole();
        Users owner = new Users();
        owner.setEmail("owner@test.com");
        ownerRole.setUser(owner);
        
        when(userRoleRepo.findByRoleAndStoreId("owner", 1L)).thenReturn(Arrays.asList(ownerRole));
        doNothing().when(userService).sendLowStockNotificationEmail(anyString(), anyString(), anyString());

        // Act
        lowStockNotificationService.sendLowStockNotification(product);

        // Assert
        verify(userRoleRepo).findByRoleAndStoreId("owner", 1L);
        verify(userService).sendLowStockNotificationEmail(
            eq("owner@test.com"),
            eq("Low Stock Alert - Test Product"),
            contains("Test Product")
        );
    }

    @Test
    void testSendLowStockNotification_CooldownPrevention() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setMinCap(new BigDecimal("5"));
        product.setMaxCap(new BigDecimal("3"));
        
        Store store = new Store();
        store.setId(1L);
        product.setStore(store);
        
        UserRole ownerRole = new UserRole();
        Users owner = new Users();
        owner.setEmail("owner@test.com");
        ownerRole.setUser(owner);
        
        when(userRoleRepo.findByRoleAndStoreId("owner", 1L)).thenReturn(Arrays.asList(ownerRole));
        doNothing().when(userService).sendLowStockNotificationEmail(anyString(), anyString(), anyString());

        // Act - Send notification twice in quick succession
        lowStockNotificationService.sendLowStockNotification(product);
        lowStockNotificationService.sendLowStockNotification(product);

        // Assert - Should only send once due to cooldown
        verify(userService, times(1)).sendLowStockNotificationEmail(anyString(), anyString(), anyString());
    }

    @Test
    void testGetLowStockStatistics_Success() {
        // Arrange
        Long storeId = 1L;
        
        Product product1 = spy(new Product());
        product1.setId(1L);
        product1.setMinCap(new BigDecimal("5"));
        product1.setMaxCap(new BigDecimal("3")); // Low stock
        doReturn(true).when(product1).isLowStockNotificationEnabled();
        doReturn(true).when(product1).isAtLowStockLevel();

        Product product2 = spy(new Product());
        product2.setId(2L);
        product2.setMinCap(new BigDecimal("5"));
        product2.setMaxCap(new BigDecimal("10")); // Not low stock
        doReturn(false).when(product2).isLowStockNotificationEnabled();
        doReturn(false).when(product2).isAtLowStockLevel();

        Product product3 = spy(new Product());
        product3.setId(3L);
        product3.setMinCap(new BigDecimal("5"));
        product3.setMaxCap(new BigDecimal("2")); // Low stock but notifications disabled
        doReturn(false).when(product3).isLowStockNotificationEnabled();
        doReturn(true).when(product3).isAtLowStockLevel();

        List<Product> storeProducts = Arrays.asList(product1, product2, product3);
        when(productRepo.findByStoreId(storeId)).thenReturn(storeProducts);

        // Act
        Map<String, Object> result = lowStockNotificationService.getLowStockStatistics(storeId);

        // Assert
        assertNotNull(result);
        assertEquals(3, result.get("totalProducts"));
        assertEquals(1, result.get("lowStockProducts")); // Only product1 should be counted
        assertEquals(1, ((List<?>) result.get("lowStockProductsList")).size());
        verify(productRepo).findByStoreId(storeId);
    }

    @Test
    void testGetLowStockStatistics_EmptyStore() {
        // Arrange
        Long storeId = 1L;
        when(productRepo.findByStoreId(storeId)).thenReturn(Collections.emptyList());

        // Act
        Map<String, Object> result = lowStockNotificationService.getLowStockStatistics(storeId);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.get("totalProducts"));
        assertEquals(0, result.get("lowStockProducts"));
        assertEquals(0, ((List<?>) result.get("lowStockProductsList")).size());
        verify(productRepo).findByStoreId(storeId);
    }

    @Test
    void testGetLowStockStatistics_AllProductsLowStock() {
        // Arrange
        Long storeId = 1L;
        
        Product product1 = new Product();
        product1.setId(1L);
        product1.setMinCap(new BigDecimal("5"));
        product1.setMaxCap(new BigDecimal("3"));
        
        Product product2 = new Product();
        product2.setId(2L);
        product2.setMinCap(new BigDecimal("10"));
        product2.setMaxCap(new BigDecimal("8"));
        
        List<Product> storeProducts = Arrays.asList(product1, product2);
        when(productRepo.findByStoreId(storeId)).thenReturn(storeProducts);

        // Act
        Map<String, Object> result = lowStockNotificationService.getLowStockStatistics(storeId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.get("totalProducts"));
        assertEquals(2, result.get("lowStockProducts"));
        assertEquals(2, ((List<?>) result.get("lowStockProductsList")).size());
        verify(productRepo).findByStoreId(storeId);
    }
} 