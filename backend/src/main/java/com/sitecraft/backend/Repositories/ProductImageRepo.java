package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductImageRepo extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductId(Long productId);

    @Modifying
    @Query("DELETE FROM ProductImage pi WHERE pi.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);

    @Modifying
    @Query("DELETE FROM ProductVariants pv WHERE pv.product.id = :productId")
    void deleteProductVariantsByProductId(@Param("productId") Long productId);
}