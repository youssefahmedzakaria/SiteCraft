package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.OrderProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderProductRepo extends JpaRepository<OrderProduct, Integer> {

    List<OrderProduct> findByOrderId(Long orderId);
}
