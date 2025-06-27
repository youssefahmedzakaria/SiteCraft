package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.WishList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface WishListRepo extends JpaRepository<WishList, Long> {
} 