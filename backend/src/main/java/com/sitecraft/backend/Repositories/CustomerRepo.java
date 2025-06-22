// src/main/java/com/sitecraft/backend/Repositories/CustomerRepo.java
package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

public interface CustomerRepo extends JpaRepository<Customer, Long> {
    List<Customer> findByStoreId(Long storeId);

    /**
     * Count new customers created between two instants (inclusive start, exclusive end).
     */
    long countByStoreIdAndCreatedAtBetween(
        Long storeId,
        LocalDateTime start,
        LocalDateTime end
    );

    /**
     * Count returning customers for a given store.
     * A customer is “returning” if they placed at least one order
     * before the window and at least one order inside the window.
     */
    @Query(value = """
      SELECT COUNT(DISTINCT o2.customer_id)
        FROM orders o2
       WHERE o2.store_id = :storeId
         AND o2.customer_id IN (
               SELECT o1.customer_id
                 FROM orders o1
                WHERE o1.store_id = :storeId
                  AND CAST(o1.issue_date AS date) < :startDate
             )
         AND CAST(o2.issue_date AS date) BETWEEN :startDate AND :endDate
    """, nativeQuery = true)
    long countReturningCustomersByDateRange(
        @Param("storeId") Long storeId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
