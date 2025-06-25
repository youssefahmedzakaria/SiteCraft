package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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

    //--------------------------------------------------------------------------------------------------

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

}
