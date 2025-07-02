package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private StoreRepo storeRepo;
    @Autowired
    private ShippingRepo shippingRepo;
    @Autowired
    private ProductVariantsRepo productVariantsRepo;
    @Autowired
    private OrderProductRepo orderProductRepo;
    @Autowired
    private AddressRepo addressRepo;
    @Autowired
    private PaymentLogRepo paymentLogRepo;
    @Autowired
    private ShippingInfoRepo shippingInfoRepo;
    @Autowired
    private CartService cartService;
    @Autowired
    private LowStockNotificationService lowStockNotificationService;


    public List<Order> getAllOrders(Long storeId) {
        Store existingStore = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        return orderRepo.findByStoreId(existingStore.getId());
    }

    public Order getOrder(Long orderId, Long storeId) {
        Optional<Order> optionalOrder = orderRepo.findById(orderId);

        if (optionalOrder.isEmpty()) {
            throw new RuntimeException("Order not found.");
        }

        Order order = optionalOrder.get();

        // Validate store ID match
        if (!order.getStore().getId().equals(storeId)) {
            throw new RuntimeException("Unauthorized access to this order.");
        }

        return order;
    }

    public Order updateOrderStatus(Long orderId, String newStatus) {
        Optional<Order> orderOptional = orderRepo.findById(orderId);
        if (orderOptional.isEmpty()) {
            throw new RuntimeException("Order not found.");
        }

        Order order = orderOptional.get();
        order.setStatus(newStatus);
        return orderRepo.save(order);
    }

    //----------------------------------------Cancel Order------------------------------------

    @Transactional
    public void cancelOrder(Long orderId) {
        try{
            Order order = orderRepo.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            if (Objects.equals(order.getStatus(), "Shipped") || Objects.equals(order.getStatus(), "Delivered") || Objects.equals(order.getStatus(), "Cancelled")) {
                throw new RuntimeException("Cannot cancel order after it has been shipped or delivered or already cancelled.");
            }

            PaymentLog paymentLog = order.getPaymentLog();
            if (paymentLog != null && !Objects.equals(paymentLog.getMethod(), "Cash on Delivery")) {
//                processRefund(paymentLog);
            }

            // 2. Restore stock
            List<OrderProduct> orderProducts = orderProductRepo.findByOrderId(orderId);
            for (OrderProduct orderProduct : orderProducts) {
                ProductVariants variant = productVariantsRepo.findBySku(orderProduct.getSku());
                if (variant != null) {
                    variant.setStock(variant.getStock() + orderProduct.getQuantity());
                    productVariantsRepo.save(variant);
                }
            }

            // 3. Cancel related shipping
            Shipping shipping = order.getShipping();
            if (shipping != null) {
                shipping.setStatus("Cancelled");
                shippingRepo.save(shipping);
            }

            // 4. Cancel order
            order.setStatus("Cancelled");
            orderRepo.save(order);

        }catch (Exception e) {
            throw new RuntimeException("Failed to cancel order: " + e.getMessage(), e);
        }

    }

    public Long getCustomerIdOfOrder(Long orderId) {
        Optional<Order> optionalOrder = orderRepo.findById(orderId);
        if (optionalOrder.isEmpty()) {
            throw new RuntimeException("Order not found.");
        }
        Order order = optionalOrder.get();
        return order.getCustomer().getId();
    }

    // -------------------------------------Create Order-------------------------------------------

    public void createOrder(Long customerId, Long addressId, Long storeId) {
        try {
            // 1. Get Customer Data
            Customer customer = new Customer();
            customer.setId(customerId);

            // 2. Get Store Data
            Store store = new Store();
            store.setId(storeId);

            // 3. Create Empty Order
            Order order = new Order();
            order.setStatus("Pending");
            order.setIssueDate(LocalDateTime.now());
            order.setStore(store);
            order.setCustomer(customer);

            orderRepo.save(order);

            // 4. Get Cart
            ShoppingCart cart = cartService.getCartByCustomerId(customerId);

            // 5. Create Order Products and store variants for later reuse
            List<OrderProduct> orderProducts = new ArrayList<>();
            Map<String, ProductVariants> variantMap = new HashMap<>();
            for(CartProduct cartProduct : cart.getCartProducts()) {
                OrderProduct orderProduct = new OrderProduct();
                orderProduct.setOrder(order);
                orderProduct.setProduct(cartProduct.getProduct());
                orderProduct.setSku(cartProduct.getSku());

                // Quantity Validations
                ProductVariants variant = productVariantsRepo.findAll().stream().filter(v -> v.getSku().equals(cartProduct.getSku())).findFirst().orElseThrow(() -> new RuntimeException("Product variant not found."));;
                if (variant.getStock() < cartProduct.getQuantity()) {
                    throw new RuntimeException("Product stock is low.");
                }

                // Store variant for later reuse in stock deduction
                variantMap.put(cartProduct.getSku(), variant);

                orderProduct.setQuantity(cartProduct.getQuantity());
                orderProduct.setPrice(variant.getPrice().doubleValue());
                orderProducts.add(orderProduct);
            }
            orderProductRepo.saveAll(orderProducts);

            // 6. Create Shipping Data
            Address address = addressRepo.findById(addressId)
                    .orElseThrow(() -> new RuntimeException("Address not found"));
            ShippingInfo shippingInfo = shippingInfoRepo.findByStoreIdAndGovernmentName(storeId, address.getCity());
            if (shippingInfo == null) {
                throw new RuntimeException("Shipping info to this city not found.");
            }
            Shipping shipping = new Shipping();
            shipping.setAddress(address);
            shipping.setCost(shippingInfo.getShippingPrice().doubleValue());
            shipping.setStatus("Pending");
            shipping.setShippingDate(null);
            shippingRepo.save(shipping);

            // 7. Process Payment
//            TODO
//            PaymentLog paymentLog = new PaymentLog();
//            paymentLog.setTransactionId(paymentId);
//            paymentLogRepo.save(paymentLog);

            // 8. Add Order Data
            order.setPrice(cart.getTotalPrice().doubleValue());
//            order.setPaymentLog(paymentLog);
            order.setShipping(shipping);
            order.setOrderProducts(orderProducts);

            // 9. Save Order and Clear Shopping cart
            orderRepo.save(order);
            
            // 10. Deduct stock from variants after successful order creation (reuse variants from step 5)
            for(CartProduct cartProduct : cart.getCartProducts()) {
                ProductVariants variant = variantMap.get(cartProduct.getSku());
                if (variant != null) {
                    variant.setStock(variant.getStock() - cartProduct.getQuantity());
                    productVariantsRepo.save(variant);
                }
            }
            
            // 11. Check for low stock notifications after stock update
            for(CartProduct cartProduct : cart.getCartProducts()) {
                lowStockNotificationService.checkAndSendLowStockNotification(cartProduct.getProduct());
            }
            
            cartService.clearCart(customerId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }
}