package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface StoreRepo extends JpaRepository<Store, Long> {
    Store findBySubdomain(String subdomain);
    
    boolean existsBySubdomain(String subdomain);
    
    @Modifying
    @Transactional
    @Query(value = "UPDATE store SET colors = CAST(:colors AS jsonb) WHERE id = :storeId", nativeQuery = true)
    void updateStoreColors(@Param("storeId") Long storeId, @Param("colors") String colors);
    
    @Query(value = "SELECT colors FROM store WHERE id = :storeId", nativeQuery = true)
    String getStoreColors(@Param("storeId") Long storeId);
}
