package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.ProductVariants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductVariantsRepo extends JpaRepository<ProductVariants, Long> {
    List<ProductVariants> findByProductId(Long productId);

    @Modifying
    @Query(value = "DELETE FROM ProductVariants WHERE product_id = ?1", nativeQuery = true)
    void deleteByProductId(Long productId);

    ProductVariants findBySku(String sku);
}