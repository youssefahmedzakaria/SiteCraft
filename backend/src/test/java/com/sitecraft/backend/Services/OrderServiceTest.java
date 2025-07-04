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

public class OrderServiceTest {
    @Mock
    private OrderRepo orderRepo;
    @Mock
    private StoreRepo storeRepo;
    @Mock
    private ShippingRepo shippingRepo;
    @Mock
    private ProductVariantsRepo productVariantsRepo;
    @Mock
    private OrderProductRepo orderProductRepo;
    @Mock
    private AddressRepo addressRepo;
    @Mock
    private PaymentLogRepo paymentLogRepo;
    @Mock
    private ShippingInfoRepo shippingInfoRepo;
    @Mock
    private CartService cartService;

    @InjectMocks
    private OrderService orderService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllOrders_StoreExists() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        when(storeRepo.findById(1L)).thenReturn(Optional.of(store));
        Order order = mock(Order.class);
        when(orderRepo.findByStoreId(1L)).thenReturn(Collections.singletonList(order));
        List<Order> result = orderService.getAllOrders(1L);
        assertEquals(1, result.size());
        assertEquals(order, result.get(0));
    }

    @Test
    void testGetAllOrders_StoreNotFound() {
        when(storeRepo.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> orderService.getAllOrders(1L));
        assertTrue(ex.getMessage().contains("Store not found"));
    }

    @Test
    void testGetOrder_Success() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(2L);
        Order order = mock(Order.class);
        when(order.getStore()).thenReturn(store);
        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));
        Order result = orderService.getOrder(1L, 2L);
        assertEquals(order, result);
    }

    @Test
    void testGetOrder_NotFound() {
        when(orderRepo.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> orderService.getOrder(1L, 2L));
        assertTrue(ex.getMessage().contains("Order not found"));
    }

    @Test
    void testGetOrder_Unauthorized() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(3L);
        Order order = mock(Order.class);
        when(order.getStore()).thenReturn(store);
        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));
        RuntimeException ex = assertThrows(RuntimeException.class, () -> orderService.getOrder(1L, 2L));
        assertTrue(ex.getMessage().contains("Unauthorized"));
    }

    @Test
    void testUpdateOrderStatus_Success() {
        Order order = mock(Order.class);
        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepo.save(order)).thenReturn(order);
        Order result = orderService.updateOrderStatus(1L, "Shipped");
        verify(order).setStatus("Shipped");
        assertEquals(order, result);
    }

    @Test
    void testUpdateOrderStatus_NotFound() {
        when(orderRepo.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> orderService.updateOrderStatus(1L, "Shipped"));
        assertTrue(ex.getMessage().contains("Order not found"));
    }

    // TODO: Implement tests for cancelOrder, getCustomerIdOfOrder, createOrder, and other edge cases
} 