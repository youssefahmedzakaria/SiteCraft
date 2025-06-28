package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ProductRepo extends JpaRepository<Product, Long> {
    List<Product> findByStoreId(Long storeId);
    
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.categoryProducts cp LEFT JOIN FETCH cp.category WHERE p.store.id = :storeId")
    List<Product> findByStoreIdWithCategory(@Param("storeId") Long storeId);
    
    Optional<Product> findByIdAndStoreId(Long id, Long storeId);
}