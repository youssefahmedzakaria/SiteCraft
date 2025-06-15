package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.ShippingInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShippingInfoRepo extends JpaRepository<ShippingInfo, Long> {
    List<ShippingInfo> findByStoreId(Long storeId);
}
