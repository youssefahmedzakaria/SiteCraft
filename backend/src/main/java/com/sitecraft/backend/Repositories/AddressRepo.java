package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepo extends JpaRepository<Address, Long> {
    List<Address> findByCustomerId(Long customerId);
}
