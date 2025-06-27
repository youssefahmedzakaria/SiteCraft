package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.CartProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface CartProductRepo extends JpaRepository<CartProduct, Long> {
} 