package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.VariantAttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VariantAttributeValueRepo extends JpaRepository<VariantAttributeValue, Long> {
    List<VariantAttributeValue> findByVariantId(Long variantId);
} 