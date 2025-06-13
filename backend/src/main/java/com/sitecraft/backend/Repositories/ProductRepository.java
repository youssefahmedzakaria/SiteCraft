package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByStoreId(Long storeId);
    
    Optional<Product> findByIdAndStoreId(Long id, Long storeId);
    
    List<Product> findAllByIdInAndStoreId(List<Long> ids, Long storeId);
    
    List<Product> findByCategoryNameAndStoreId(String categoryName, Long storeId);
    
    @Query("SELECT DISTINCT p FROM Product p JOIN p.variants v WHERE p.store.id = :storeId AND (:inStock = true AND v.stock > 0 OR :inStock = false AND v.stock <= 0)")
    List<Product> findByStoreIdAndInStock(Long storeId, boolean inStock);
    
    @Query("SELECT DISTINCT p FROM Product p JOIN p.category c JOIN p.variants v WHERE c.name = :categoryName AND p.store.id = :storeId AND (:inStock = true AND v.stock > 0 OR :inStock = false AND v.stock <= 0)")
    List<Product> findByCategoryNameAndStoreIdAndInStock(String categoryName, Long storeId, boolean inStock);
}