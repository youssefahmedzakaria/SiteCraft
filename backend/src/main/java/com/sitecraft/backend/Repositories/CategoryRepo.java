package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoryRepo extends JpaRepository<Category, Long> {
    List<Category> findByStoreId(Long storeId);
    Optional<Category> findByNameAndStoreId(String name, Long storeId);
}