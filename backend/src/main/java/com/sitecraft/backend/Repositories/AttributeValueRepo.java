package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.AttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface AttributeValueRepo extends JpaRepository<AttributeValue, Long> {
} 