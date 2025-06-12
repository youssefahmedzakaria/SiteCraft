package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PolicyRepo extends JpaRepository<Policy, Long> {
    List<Policy> findByStoreId(Long storeId);
}
