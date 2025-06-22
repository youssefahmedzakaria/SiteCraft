package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.ProductAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface ProductAttributeRepo extends JpaRepository<ProductAttribute, Long> {
} 