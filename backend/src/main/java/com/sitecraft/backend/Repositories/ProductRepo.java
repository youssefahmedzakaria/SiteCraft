package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepo extends JpaRepository<Product, Long> {
    List<Product> findByStoreId(Long storeId);
    Optional<Product> findByIdAndStoreId(Long id, Long storeId);
    List<Product> findByCategoryIdAndStoreId(Long categoryId, Long storeId);
    
    @Query("SELECT p FROM Product p WHERE p.store.id = :storeId AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Product> findProductsWithFilters(@Param("storeId") Long storeId,
                                        @Param("categoryId") Long categoryId,
                                        @Param("search") String search);
    
    // Deletion methods for handling foreign key constraints
    @Modifying
    @Query(value = "DELETE FROM variantattributevalue WHERE variant_id = :variantId", nativeQuery = true)
    void deleteVariantAttributeValuesByVariantId(@Param("variantId") Long variantId);
    
    @Modifying
    @Query(value = "DELETE FROM variantattributevalue WHERE variant_id IN (SELECT id FROM productvariants WHERE product_id = :productId)", nativeQuery = true)
    void deleteAllVariantAttributeValuesByProductId(@Param("productId") Long productId);
    
    @Modifying
    @Query(value = "DELETE FROM wishlistproduct WHERE product_id = :productId", nativeQuery = true)
    void deleteWishListProductsByProductId(@Param("productId") Long productId);
    
    @Modifying
    @Query(value = "DELETE FROM cartproduct WHERE product_id = :productId", nativeQuery = true)
    void deleteCartProductsByProductId(@Param("productId") Long productId);
    
    @Modifying
    @Query(value = "DELETE FROM categoryproduct WHERE product_id = :productId", nativeQuery = true)
    void deleteCategoryProductsByProductId(@Param("productId") Long productId);
    
    @Modifying
    @Query(value = "DELETE FROM orderproduct WHERE product_id = :productId", nativeQuery = true)
    void deleteOrderProductsByProductId(@Param("productId") Long productId);
    
    @Modifying
    @Query(value = "DELETE FROM review WHERE product_id = :productId", nativeQuery = true)
    void deleteReviewsByProductId(@Param("productId") Long productId);
    
    @Modifying
    @Query(value = "DELETE FROM productattribute WHERE product_id = :productId", nativeQuery = true)
    void deleteProductAttributesByProductId(@Param("productId") Long productId);
}