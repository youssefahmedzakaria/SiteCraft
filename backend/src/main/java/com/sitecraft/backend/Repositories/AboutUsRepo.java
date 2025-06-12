package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.AboutUs;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AboutUsRepo extends JpaRepository<AboutUs, Long> {
    List<AboutUs> findByStoreId(Long storeId);
}
