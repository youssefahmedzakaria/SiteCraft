package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrderRepo extends JpaRepository<Order, Long> {
    @EntityGraph(attributePaths = {
            "customer",  // Eagerly load the customer for each order
            "paymentLog",
            "shipping",
            "orderProducts",
            "orderProducts.product"
    })
    List<Order> findByStoreId(Long storeId);
    Optional<Order> findById(Long orderId);
}