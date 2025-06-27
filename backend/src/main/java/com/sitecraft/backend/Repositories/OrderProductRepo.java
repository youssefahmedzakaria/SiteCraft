package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.OrderProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderProductRepo extends JpaRepository<OrderProduct, Long> {
    List<OrderProduct> findByProductId(Long productId);
    List<OrderProduct> findByOrderId(Long orderId);
}