package com.sitecraft.backend.Services;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import java.util.Optional;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.sql.Timestamp;

public class SiteCraftSubscriptionServiceTest {
    @Mock
    private SiteCraftSubscriptionRepo subscriptionRepo;
    
    @Mock
    private StoreRepo storeRepo;
    
    @Mock
    private PaymentLogRepo paymentLogRepo;
    
    @InjectMocks
    private SiteCraftSubscriptionService subscriptionService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateSubscription_Success() {
        // Arrange
        Long storeId = 1L;
        String plan = "premium";
        String period = "monthly";
        Double price = 29.99;
        String method = "credit_card";
        
        Store store = new Store();
        store.setId(storeId);
        store.setStoreName("Test Store");
        
        PaymentLog paymentLog = new PaymentLog();
        paymentLog.setTransactionId(1L);
        paymentLog.setMethod(method);
        paymentLog.setAmount(price);
        
        SiteCraftSubscription subscription = new SiteCraftSubscription();
        subscription.setId(1);
        subscription.setStore(store);
        subscription.setPlan(plan);
        subscription.setStatus("active");
        subscription.setStartDate(Timestamp.valueOf(LocalDateTime.now()));
        subscription.setEndDate(Timestamp.valueOf(LocalDateTime.now().plusMonths(1)));
        subscription.setPaymentLog(paymentLog);
        
        when(storeRepo.findById(storeId)).thenReturn(Optional.of(store));
        when(paymentLogRepo.save(any(PaymentLog.class))).thenReturn(paymentLog);
        when(subscriptionRepo.save(any(SiteCraftSubscription.class))).thenReturn(subscription);

        // Act
        SiteCraftSubscription result = subscriptionService.createSubscription(storeId, plan, period, price, method);

        // Assert
        assertNotNull(result);
        result.setId(1);
        assertEquals(1, result.getId());
        assertEquals(plan, result.getPlan());
        assertEquals("active", result.getStatus());
        assertNotNull(result.getStartDate());
        assertNotNull(result.getEndDate());
        assertNotNull(result.getPaymentLog());
        
        verify(storeRepo).findById(storeId);
        verify(paymentLogRepo).save(any(PaymentLog.class));
        verify(subscriptionRepo).save(any(SiteCraftSubscription.class));
    }

    @Test
    void testCreateSubscription_StoreNotFound() {
        // Arrange
        Long storeId = 999L;
        when(storeRepo.findById(storeId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
            () -> subscriptionService.createSubscription(storeId, "premium", "monthly", 29.99, "credit_card"));
        assertTrue(exception.getMessage().contains("Store not found"));
        
        verify(storeRepo).findById(storeId);
        verify(paymentLogRepo, never()).save(any(PaymentLog.class));
        verify(subscriptionRepo, never()).save(any(SiteCraftSubscription.class));
    }

    @Test
    void testCreateSubscription_YearlyPeriod() {
        // Arrange
        Long storeId = 1L;
        String plan = "premium";
        String period = "annual";
        Double price = 299.99;
        String method = "credit_card";
        
        Store store = new Store();
        store.setId(storeId);
        
        SiteCraftSubscription subscription = new SiteCraftSubscription();
        subscription.setId(1);
        subscription.setStore(store);
        subscription.setPlan(plan);
        subscription.setStatus("active");
        subscription.setStartDate(Timestamp.valueOf(LocalDateTime.now()));
        subscription.setEndDate(Timestamp.valueOf(LocalDateTime.now().plusYears(1)));
        
        when(storeRepo.findById(storeId)).thenReturn(Optional.of(store));
        when(paymentLogRepo.save(any(PaymentLog.class))).thenReturn(new PaymentLog());
        when(subscriptionRepo.save(any(SiteCraftSubscription.class))).thenReturn(subscription);

        // Act
        SiteCraftSubscription result = subscriptionService.createSubscription(storeId, plan, period, price, method);

        // Assert
        assertNotNull(result);
        assertEquals(period, "annual");
        assertTrue(result.getEndDate().toLocalDateTime().isAfter(result.getStartDate().toLocalDateTime().plusMonths(11)));
        
        verify(storeRepo).findById(storeId);
        verify(paymentLogRepo).save(any(PaymentLog.class));
        verify(subscriptionRepo).save(any(SiteCraftSubscription.class));
    }

    @Test
    void testGetCurrentSubscription_Success() {
        // Arrange
        Long storeId = 1L;
        Store store = new Store();
        store.setId(storeId);
        SiteCraftSubscription subscription = new SiteCraftSubscription();
        subscription.setId(1);
        subscription.setStore(store);
        subscription.setStatus("active");
        subscription.setEndDate(Timestamp.valueOf(LocalDateTime.now().plusDays(30)));
        
        when(subscriptionRepo.findAll()).thenReturn(Arrays.asList(subscription));

        // Act
        Optional<SiteCraftSubscription> result = subscriptionService.getCurrentSubscription(storeId);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(1, result.get().getId());
        assertEquals("active", result.get().getStatus());
        verify(subscriptionRepo).findAll();
    }

    @Test
    void testGetCurrentSubscription_NoActiveSubscription() {
        // Arrange
        Long storeId = 1L;
        when(subscriptionRepo.findAll()).thenReturn(Collections.emptyList());

        // Act
        Optional<SiteCraftSubscription> result = subscriptionService.getCurrentSubscription(storeId);

        // Assert
        assertFalse(result.isPresent());
        verify(subscriptionRepo).findAll();
    }

    @Test
    void testGetCurrentSubscription_MultipleSubscriptions_ReturnsLatest() {
        // Arrange
        Long storeId = 1L;
        Store store = new Store();
        Store store2 = new Store();
        store.setId(storeId);
        store2.setId(storeId);
        SiteCraftSubscription oldSubscription = new SiteCraftSubscription();
        oldSubscription.setId(1);
        oldSubscription.setStore(store2);
        oldSubscription.setStatus("active");
        oldSubscription.setEndDate(Timestamp.valueOf(LocalDateTime.now().plusDays(10)));
        
        SiteCraftSubscription newSubscription = new SiteCraftSubscription();
        newSubscription.setId(2);
        newSubscription.setStore(store2);
        newSubscription.setStatus("active");
        newSubscription.setEndDate(Timestamp.valueOf(LocalDateTime.now().plusDays(30)));
        
        when(subscriptionRepo.findAll()).thenReturn(Arrays.asList(newSubscription, oldSubscription));

        // Act
        Optional<SiteCraftSubscription> result = subscriptionService.getCurrentSubscription(storeId);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(2, result.get().getId()); // Should return the latest one
        verify(subscriptionRepo).findAll();
    }

    @Test
    void testCancelSubscription_Success() {
        // Arrange
        Long storeId = 1L;
        Store store = new Store();
        Store store3 = new Store();
        store.setId(storeId);
        store3.setId(storeId);
        SiteCraftSubscription subscription = new SiteCraftSubscription();
        subscription.setId(1);
        subscription.setStore(store3);
        subscription.setStatus("active");
        subscription.setEndDate(Timestamp.valueOf(LocalDateTime.now().plusDays(30)));
        
        when(subscriptionRepo.findAll()).thenReturn(Arrays.asList(subscription));
        when(subscriptionRepo.save(any(SiteCraftSubscription.class))).thenReturn(subscription);

        // Act
        subscriptionService.cancelSubscription(storeId);

        // Assert
        assertEquals("cancelled", subscription.getStatus());
        verify(subscriptionRepo).findAll();
        verify(subscriptionRepo).save(subscription);
    }

    @Test
    void testCancelSubscription_NoActiveSubscription() {
        // Arrange
        Long storeId = 1L;
        when(subscriptionRepo.findAll()).thenReturn(Collections.emptyList());

        // Act
        subscriptionService.cancelSubscription(storeId);

        // Assert
        verify(subscriptionRepo).findAll();
        verify(subscriptionRepo, never()).save(any(SiteCraftSubscription.class));
    }

    @Test
    void testCheckAndUpdateExpiredSubscriptions_WithExpiredSubscriptions() {
        // Arrange
        Store store = new Store();
        store.setId(1L);
        SiteCraftSubscription expiredSubscription = new SiteCraftSubscription();
        expiredSubscription.setId(1);
        expiredSubscription.setStore(store);
        expiredSubscription.setStatus("active");
        expiredSubscription.setEndDate(Timestamp.valueOf(LocalDateTime.now().minusDays(1))); // Expired
        
        SiteCraftSubscription activeSubscription = new SiteCraftSubscription();
        activeSubscription.setId(2);
        activeSubscription.setStore(store);
        activeSubscription.setStatus("active");
        activeSubscription.setEndDate(Timestamp.valueOf(LocalDateTime.now().plusDays(30))); // Still active
        
        when(subscriptionRepo.findAll()).thenReturn(Arrays.asList(expiredSubscription, activeSubscription));
        when(subscriptionRepo.save(any(SiteCraftSubscription.class))).thenReturn(expiredSubscription);

        // Act
        subscriptionService.checkAndUpdateExpiredSubscriptions();

        // Assert
        assertEquals("expired", expiredSubscription.getStatus());
        assertEquals("active", activeSubscription.getStatus()); // Should remain active
        
        verify(subscriptionRepo).findAll();
        verify(subscriptionRepo).save(expiredSubscription);
        verify(subscriptionRepo, times(1)).save(any(SiteCraftSubscription.class)); // Only save the expired one
    }

    @Test
    void testCheckAndUpdateExpiredSubscriptions_NoExpiredSubscriptions() {
        // Arrange
        Store store = new Store();
        store.setId(1L);
        SiteCraftSubscription activeSubscription1 = new SiteCraftSubscription();
        activeSubscription1.setId(1);
        activeSubscription1.setStore(store);
        activeSubscription1.setStatus("active");
        activeSubscription1.setEndDate(Timestamp.valueOf(LocalDateTime.now().plusDays(30)));
        
        SiteCraftSubscription activeSubscription2 = new SiteCraftSubscription();
        activeSubscription2.setId(2);
        activeSubscription2.setStatus("active");
        activeSubscription2.setEndDate(Timestamp.valueOf(LocalDateTime.now().plusDays(60)));
        
        when(subscriptionRepo.findAll()).thenReturn(Arrays.asList(activeSubscription1, activeSubscription2));

        // Act
        subscriptionService.checkAndUpdateExpiredSubscriptions();

        // Assert
        assertEquals("active", activeSubscription1.getStatus());
        assertEquals("active", activeSubscription2.getStatus());
        
        verify(subscriptionRepo).findAll();
        verify(subscriptionRepo, never()).save(any(SiteCraftSubscription.class));
    }

    @Test
    void testCheckAndUpdateExpiredSubscriptions_EmptyList() {
        // Arrange
        when(subscriptionRepo.findAll()).thenReturn(Collections.emptyList());

        // Act
        subscriptionService.checkAndUpdateExpiredSubscriptions();

        // Assert
        verify(subscriptionRepo).findAll();
        verify(subscriptionRepo, never()).save(any(SiteCraftSubscription.class));
    }

    @Test
    void testCheckAndUpdateExpiredSubscriptions_ExceptionHandling() {
        // Arrange
        when(subscriptionRepo.findAll()).thenThrow(new RuntimeException("Database error"));

        // Act & Assert - Should not throw exception
        assertThrows(RuntimeException.class, () -> subscriptionService.checkAndUpdateExpiredSubscriptions());
        
        verify(subscriptionRepo).findAll();
        verify(subscriptionRepo, never()).save(any(SiteCraftSubscription.class));
    }

    @Test
    void testScheduledCheckExpiredSubscriptions() {
        // Arrange
        Store store = new Store();
        store.setId(1L);
        SiteCraftSubscription expiredSubscription = new SiteCraftSubscription();
        expiredSubscription.setId(1);
        expiredSubscription.setStore(store);
        expiredSubscription.setStatus("active");
        expiredSubscription.setEndDate(Timestamp.valueOf(LocalDateTime.now().minusDays(1)));
        
        when(subscriptionRepo.findAll()).thenReturn(Arrays.asList(expiredSubscription));
        when(subscriptionRepo.save(any(SiteCraftSubscription.class))).thenReturn(expiredSubscription);

        // Act
        subscriptionService.scheduledCheckExpiredSubscriptions();

        // Assert
        assertEquals("expired", expiredSubscription.getStatus());
        verify(subscriptionRepo).findAll();
        verify(subscriptionRepo).save(expiredSubscription);
    }
} 