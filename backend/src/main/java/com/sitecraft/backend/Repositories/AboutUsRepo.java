package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.AboutUs;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AboutUsRepo extends JpaRepository<AboutUs, Long> {
    List<AboutUs> findByStoreId(Long storeId);
    Optional<AboutUs> findByIdAndStoreId(Long id, Long storeId);
}
