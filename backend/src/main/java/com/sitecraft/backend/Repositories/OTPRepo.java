package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.OTP;
import com.sitecraft.backend.Models.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface OTPRepo extends JpaRepository<OTP, Long> {
    OTP findTopByUserIdAndCodeAndActiveTrueAndExpiresAtAfterOrderByCreatedAtDesc(Long userId, String code, LocalDateTime now);
    List<OTP> findByUserIdAndActiveTrue(Long id);
}
