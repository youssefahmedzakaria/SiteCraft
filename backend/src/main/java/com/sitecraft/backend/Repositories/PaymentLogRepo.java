package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.PaymentLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentLogRepo extends JpaRepository<PaymentLog, Long> {
}
