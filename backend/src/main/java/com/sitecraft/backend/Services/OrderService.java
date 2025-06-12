package com.sitecraft.backend.Services;
import com.sitecraft.backend.Models.Order;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Repositories.OrderRepo;
import com.sitecraft.backend.Repositories.StoreRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private StoreRepo storeRepo;

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
}
