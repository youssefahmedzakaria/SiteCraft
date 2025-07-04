package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.CategoryProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryProductRepo extends JpaRepository<CategoryProduct, Long> {
    
    List<CategoryProduct> findByCategoryId(Long categoryId);
    
    List<CategoryProduct> findByProductId(Long productId);
    
    List<CategoryProduct> findByCategoryIdAndProductId(Long categoryId, Long productId);
    
    List<CategoryProduct> findByCategoryStoreId(Long storeId);
    
    List<CategoryProduct> findByProductStoreId(Long storeId);
    
    @Query("SELECT cp FROM CategoryProduct cp JOIN cp.category c WHERE c.name = :categoryName AND c.store.id = :storeId")
    List<CategoryProduct> findByCategoryNameAndStoreId(@Param("categoryName") String categoryName, @Param("storeId") Long storeId);
    
    void deleteByCategoryIdAndProductId(Long categoryId, Long productId);
    
    void deleteByProductId(Long productId);
    
    void deleteByCategoryId(Long categoryId);
} 