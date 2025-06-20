package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface ReviewRepo extends JpaRepository<Review, Long> {
} 