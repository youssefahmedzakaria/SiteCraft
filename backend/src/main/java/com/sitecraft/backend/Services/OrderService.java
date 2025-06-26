package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    @Autowired
    private CustomerRepo customerRepo;
    @Autowired
    private AddressRepo addressRepo;
    @Autowired
    private PaymentLogRepo paymentLogRepo;
    @Autowired
    private ShippingInfoRepo shippingInfoRepo;


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

    public ShoppingCart getCartByCustomerId(Long customerId) {
        Optional<Customer> customerOpt = customerRepo.findById(customerId);
        return customerOpt.map(Customer::getShoppingCart).orElse(null);
    }

    public void createOrder(Long customerId, Long addressId, Long storeId) {
        try {
            // Get Customer Data
            Customer customer = new Customer();
            customer.setId(customerId);

            // Get Store Data
            Store store = new Store();
            store.setId(storeId);

            Order order = new Order();
            order.setStatus("Pending");
            order.setStore(store);
            order.setCustomer(customer);

            orderRepo.save(order);

            ShoppingCart cart = getCartByCustomerId(customerId);

            // Handle Order Products
            List<OrderProduct> orderProducts = new ArrayList<>();
            for(CartProduct cartProduct : cart.getCartProducts()) {
                OrderProduct orderProduct = new OrderProduct();
//                TODO
                orderProduct.setOrder(order);
                orderProduct.setProduct(cartProduct.getProduct());
                orderProduct.setSku(cartProduct.getSku());

                // Quantity Validations
                ProductVariants variant = productVariantsRepo.findAll().stream().filter(v -> v.getSku().equals(cartProduct.getSku())).findFirst().orElseThrow(() -> new RuntimeException("Product variant not found."));;
                if (variant.getStock() < cartProduct.getQuantity()) {
                    throw new RuntimeException("Product stock is low.");
                }

                orderProduct.setQuantity(cartProduct.getQuantity());
                orderProduct.setPrice(variant.getPrice().doubleValue());
                orderProducts.add(orderProduct);
            }

            // Handle Shipping Data
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

//            TODO
            // process order payment here
            PaymentLog paymentLog = new PaymentLog();
//            paymentLog.setTransactionId(paymentId);

            order.setPrice(cart.getTotalPrice().doubleValue());
            order.setIssueDate(LocalDateTime.now());
            order.setPaymentLog(paymentLog);
            order.setShipping(shipping);
            order.setOrderProducts(orderProducts);

            orderProductRepo.saveAll(orderProducts);
            shippingRepo.save(shipping);
            paymentLogRepo.save(paymentLog);
            orderRepo.save(order);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }
}
