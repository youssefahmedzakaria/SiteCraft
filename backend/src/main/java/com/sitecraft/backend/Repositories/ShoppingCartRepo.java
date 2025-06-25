package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface ShoppingCartRepo extends JpaRepository<ShoppingCart, Long> {
} 