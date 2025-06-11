package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerRepo extends JpaRepository<Customer, Long> {
    List<Customer> findByStoreId(Long storeId);
}
