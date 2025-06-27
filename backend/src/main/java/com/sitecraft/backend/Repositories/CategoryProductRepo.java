package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.CategoryProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface CategoryProductRepo extends JpaRepository<CategoryProduct, Long> {
} 