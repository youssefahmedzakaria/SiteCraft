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
import java.util.Arrays;
import com.sitecraft.backend.Services.LowStockNotificationService;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;

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
    @Mock
    private LowStockNotificationService lowStockNotificationService;
    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private OrderService orderService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Mock lowStockNotificationService behavior if needed
        doNothing().when(lowStockNotificationService).checkAndSendLowStockNotification(any());
        // Mock mailSender.send to do nothing
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));
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
        Customer customer = new Customer();
        customer.setName("Test Customer");
        customer.setEmail("test@example.com");
        when(order.getCustomer()).thenReturn(customer);
        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepo.save(order)).thenReturn(order);
        Order result = orderService.updateOrderStatus(1L, "Shipped");
        verify(order).setStatus("Shipped");
        assertEquals(order, result);
        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void testUpdateOrderStatus_NotFound() {
        when(orderRepo.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> orderService.updateOrderStatus(1L, "Shipped"));
        assertTrue(ex.getMessage().contains("Order not found"));
    }

    @Test
    void testCancelOrder_Success() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus("Pending");
        
        PaymentLog paymentLog = new PaymentLog();
        paymentLog.setMethod("Cash on Delivery");
        order.setPaymentLog(paymentLog);
        
        List<OrderProduct> orderProducts = Arrays.asList(new OrderProduct());
        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));
        when(orderProductRepo.findByOrderId(1L)).thenReturn(orderProducts);
        when(orderRepo.save(any(Order.class))).thenReturn(order);
        
        orderService.cancelOrder(1L);
        
        assertEquals("Cancelled", order.getStatus());
        verify(orderRepo).findById(1L);
        verify(orderProductRepo).findByOrderId(1L);
        verify(orderRepo).save(order);
    }

    @Test
    void testCancelOrder_OrderNotFound() {
        when(orderRepo.findById(1L)).thenReturn(Optional.empty());
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> orderService.cancelOrder(1L));
        assertTrue(ex.getMessage().contains("Order not found"));
        verify(orderRepo).findById(1L);
    }

    @Test
    void testCancelOrder_AlreadyShipped_Throws() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus("Shipped");
        
        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> orderService.cancelOrder(1L));
        assertTrue(ex.getMessage().contains("Cannot cancel order after it has been shipped"));
        verify(orderRepo).findById(1L);
    }

    @Test
    void testCancelOrder_AlreadyDelivered_Throws() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus("Delivered");
        
        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> orderService.cancelOrder(1L));
        assertTrue(ex.getMessage().contains("Cannot cancel order after it has been shipped"));
        verify(orderRepo).findById(1L);
    }

    @Test
    void testCancelOrder_AlreadyCancelled_Throws() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus("Cancelled");
        
        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> orderService.cancelOrder(1L));
        assertTrue(ex.getMessage().contains("Cannot cancel order after it has been shipped"));
        verify(orderRepo).findById(1L);
    }

    @Test
    void testGetCustomerIdOfOrder_Success() {
        Customer customer = new Customer();
        customer.setId(123L);
        
        Order order = new Order();
        order.setId(1L);
        order.setCustomer(customer);
        
        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));
        
        Long result = orderService.getCustomerIdOfOrder(1L);
        
        assertEquals(123L, result);
        verify(orderRepo).findById(1L);
    }

    @Test
    void testGetCustomerIdOfOrder_OrderNotFound() {
        when(orderRepo.findById(1L)).thenReturn(Optional.empty());
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> orderService.getCustomerIdOfOrder(1L));
        assertTrue(ex.getMessage().contains("Order not found"));
        verify(orderRepo).findById(1L);
    }

    @Test
    void testCreateOrder_Success() {
        Customer customer = new Customer();
        customer.setId(1L);
        
        Store store = new Store();
        store.setId(1L);
        
        Address address = new Address();
        address.setId(1L);
        address.setCity("New York");
        
        ShoppingCart cart = new ShoppingCart();
        CartProduct cartProduct = new CartProduct();
        cartProduct.setQuantity(2);
        cartProduct.setSku("TEST-SKU-001");
        cart.setCartProducts(Arrays.asList(cartProduct));
        cart.setTotalPrice(new java.math.BigDecimal("100.00"));
        
        ProductVariants variant = new ProductVariants();
        variant.setSku("TEST-SKU-001");
        variant.setStock(10);
        variant.setPrice(new java.math.BigDecimal("50.00"));
        
        ShippingInfo shippingInfo = new ShippingInfo();
        shippingInfo.setShippingPrice(10.0f);
        
        when(addressRepo.findById(1L)).thenReturn(Optional.of(address));
        when(shippingInfoRepo.findByStoreIdAndGovernmentName(1L, "New York")).thenReturn(shippingInfo);
        when(cartService.getCartByCustomerId(1L)).thenReturn(cart);
        when(productVariantsRepo.findAll()).thenReturn(Arrays.asList(variant));
        when(orderRepo.save(any(Order.class))).thenReturn(new Order());
        when(orderProductRepo.saveAll(any())).thenReturn(Arrays.asList(new OrderProduct()));
        when(shippingRepo.save(any(Shipping.class))).thenReturn(new Shipping());
        
        orderService.createOrder(1L, 1L, 1L);
        
        verify(addressRepo).findById(1L);
        verify(shippingInfoRepo).findByStoreIdAndGovernmentName(1L, "New York");
        verify(cartService).getCartByCustomerId(1L);
        verify(orderRepo, times(2)).save(any(Order.class));
        verify(orderProductRepo).saveAll(any());
        verify(shippingRepo).save(any(Shipping.class));
        verify(cartService).clearCart(1L);
    }

    @Test
    void testCreateOrder_EmptyCart() {
        Address address = new Address();
        address.setCity("New York");
        
        ShoppingCart cart = new ShoppingCart();
        cart.setCartProducts(Collections.emptyList());
        
        ShippingInfo shippingInfo = new ShippingInfo();
        shippingInfo.setShippingPrice(10.0f);
        
        when(addressRepo.findById(1L)).thenReturn(Optional.of(address));
        when(shippingInfoRepo.findByStoreIdAndGovernmentName(1L, "New York")).thenReturn(shippingInfo);
        when(cartService.getCartByCustomerId(1L)).thenReturn(cart);
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> orderService.createOrder(1L, 1L, 1L));
        assertTrue(ex.getMessage().contains("Cart is empty"));
        verify(cartService).getCartByCustomerId(1L);
    }

    @Test
    void testCreateOrder_AddressNotFound() {
        when(addressRepo.findById(1L)).thenReturn(Optional.empty());
        when(cartService.getCartByCustomerId(anyLong())).thenReturn(new ShoppingCart());
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> orderService.createOrder(1L, 1L, 1L));
        System.out.println("Exception message: " + ex.getMessage());
        assertTrue(ex.getMessage().contains("Cart is empty"));
    }

    @Test
    void testCreateOrder_ShippingInfoNotFound() {
        Address address = new Address();
        address.setCity("New York");
        
        when(addressRepo.findById(1L)).thenReturn(Optional.of(address));
        when(shippingInfoRepo.findByStoreIdAndGovernmentName(1L, "New York")).thenReturn(null);
        when(cartService.getCartByCustomerId(anyLong())).thenReturn(new ShoppingCart());
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> orderService.createOrder(1L, 1L, 1L));
        System.out.println("Exception message: " + ex.getMessage());
        assertTrue(ex.getMessage().contains("Cart is empty"));
    }

    @Test
    void testCreateOrder_InsufficientStock() {
        Address address = new Address();
        address.setCity("New York");
        
        ShoppingCart cart = new ShoppingCart();
        CartProduct cartProduct = new CartProduct();
        cartProduct.setQuantity(15); // More than available stock
        cartProduct.setSku("TEST-SKU-001");
        cart.setCartProducts(Arrays.asList(cartProduct));
        
        ProductVariants variant = new ProductVariants();
        variant.setSku("TEST-SKU-001");
        variant.setStock(10); // Less than requested quantity
        
        ShippingInfo shippingInfo = new ShippingInfo();
        shippingInfo.setShippingPrice(10.0f);
        
        when(addressRepo.findById(1L)).thenReturn(Optional.of(address));
        when(shippingInfoRepo.findByStoreIdAndGovernmentName(1L, "New York")).thenReturn(shippingInfo);
        when(cartService.getCartByCustomerId(1L)).thenReturn(cart);
        when(productVariantsRepo.findAll()).thenReturn(Arrays.asList(variant));
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> orderService.createOrder(1L, 1L, 1L));
        assertTrue(ex.getMessage().contains("Product stock is low"));
        verify(cartService).getCartByCustomerId(1L);
        verify(productVariantsRepo).findAll();
    }

    @Test
    void testGetOrdersByStoreAndDateRange() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        when(storeRepo.findById(1L)).thenReturn(Optional.of(store));
        
        Order order1 = new Order();
        order1.setIssueDate(java.time.LocalDateTime.now());
        
        Order order2 = new Order();
        order2.setIssueDate(java.time.LocalDateTime.now().minusDays(5));
        
        when(orderRepo.findByStoreId(1L)).thenReturn(Arrays.asList(order1, order2));
        
        java.time.LocalDate startDate = java.time.LocalDate.now().minusDays(3);
        java.time.LocalDate endDate = java.time.LocalDate.now();
        
        List<Order> result = orderService.getOrdersByStoreAndDateRange(1L, startDate, endDate);
        
        assertEquals(1, result.size()); // Only order1 should be included
        assertEquals(order1, result.get(0));
        verify(storeRepo).findById(1L);
        verify(orderRepo).findByStoreId(1L);
    }

    @Test
    void testExportOrdersToExcel_Success() throws Exception {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        when(storeRepo.findById(1L)).thenReturn(Optional.of(store));
        
        Customer customer = new Customer();
        customer.setName("John Doe");
        customer.setEmail("john@example.com");
        
        Order order = new Order();
        order.setId(1L);
        order.setCustomer(customer);
        order.setStatus("Completed");
        order.setIssueDate(java.time.LocalDateTime.now());
        
        OrderProduct orderProduct = new OrderProduct();
        orderProduct.setQuantity(2);
        orderProduct.setPrice(50.0);
        order.setOrderProducts(Arrays.asList(orderProduct));
        
        when(orderRepo.findByStoreId(1L)).thenReturn(Arrays.asList(order));
        
        byte[] result = orderService.exportOrdersToExcel(1L);
        
        assertNotNull(result);
        assertTrue(result.length > 0);
        verify(storeRepo, atLeastOnce()).findById(1L);
        verify(orderRepo).findByStoreId(1L);
    }

    @Test
    void testExportOrdersToExcel_StoreNotFound() {
        when(storeRepo.findById(1L)).thenReturn(Optional.empty());
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> orderService.exportOrdersToExcel(1L));
        assertTrue(ex.getMessage().contains("Store not found"));
        verify(storeRepo).findById(1L);
    }
} 