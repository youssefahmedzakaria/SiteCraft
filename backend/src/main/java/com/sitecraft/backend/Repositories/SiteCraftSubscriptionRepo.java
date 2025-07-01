package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.SiteCraftSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteCraftSubscriptionRepo extends JpaRepository<SiteCraftSubscription, Integer> {
    // Add custom queries if needed
} 