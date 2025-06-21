package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoryRepo extends JpaRepository<Category, Long> {
    List<Category> findByStoreId(Long storeId);

    Optional<Category> findByNameAndStoreId(String name, Long storeId);

    @Query("SELECT c FROM Category c WHERE c.store.id = :storeId AND c.name LIKE %:search%")
    List<Category> findByStoreIdAndNameContaining(@Param("storeId") Long storeId, @Param("search") String search);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId")
    Long countProductsByCategoryId(@Param("categoryId") Long categoryId);

    boolean existsByNameAndStoreId(String name, Long storeId);
}