package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.ProductVariants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductVariantsRepo extends JpaRepository<ProductVariants, Long> {
    List<ProductVariants> findByProductId(Long productId);

    @Modifying
    @Query("DELETE FROM ProductVariants pv WHERE pv.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);
}