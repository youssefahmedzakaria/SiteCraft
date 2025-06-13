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
    
    // Delete VariantAttributeValue based on ProductVariants that belong to this Product
    @Modifying
    @Query(value = "DELETE FROM VariantAttributeValue WHERE variant_id IN (SELECT id FROM ProductVariants WHERE product_id = ?1)", nativeQuery = true)
    void deleteVariantAttributeValuesByProductId(Long productId);
    
    // Delete OrderProduct
    @Modifying
    @Query(value = "DELETE FROM OrderProduct WHERE product_id = ?1", nativeQuery = true)
    void deleteOrderProductsByProductId(Long productId);
    
    // Delete WishListProduct
    @Modifying
    @Query(value = "DELETE FROM WishListProduct WHERE product_id = ?1", nativeQuery = true)
    void deleteWishListProductsByProductId(Long productId);
    
    // Delete CartProduct
    @Modifying
    @Query(value = "DELETE FROM CartProduct WHERE product_id = ?1", nativeQuery = true)
    void deleteCartProductsByProductId(Long productId);
    
    // Delete CategoryProduct
    @Modifying
    @Query(value = "DELETE FROM CategoryProduct WHERE product_id = ?1", nativeQuery = true)
    void deleteCategoryProductsByProductId(Long productId);
    
    // Delete Review
    @Modifying
    @Query(value = "DELETE FROM Review WHERE product_id = ?1", nativeQuery = true)
    void deleteReviewsByProductId(Long productId);
    
    // Delete AttributeValue based on ProductAttribute that belongs to this Product
    @Modifying
    @Query(value = "DELETE FROM AttributeValue WHERE product_attribute_id IN (SELECT id FROM ProductAttribute WHERE product_id = ?1)", nativeQuery = true)
    void deleteAttributeValuesByProductId(Long productId);
    
    // Delete ProductAttribute
    @Modifying
    @Query(value = "DELETE FROM ProductAttribute WHERE product_id = ?1", nativeQuery = true)
    void deleteProductAttributesByProductId(Long productId);
}