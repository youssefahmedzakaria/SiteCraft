package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.SocialMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SocialMediaRepo extends JpaRepository<SocialMedia, Long> {
    List<SocialMedia> findByStoreId(Long storeId);
}
