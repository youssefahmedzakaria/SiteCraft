package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.WishListProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface WishListProductRepo extends JpaRepository<WishListProduct, Long> {
} 