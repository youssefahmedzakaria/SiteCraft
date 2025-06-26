package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.time.LocalDate;

public interface CustomerRepo extends JpaRepository<Customer, Long> {
    List<Customer> findByStoreId(Long storeId);
    Customer findByEmailAndStoreId(String email, Long storeId);
    
    /**
     * Count new customers registered within the given date range for the specified store.
     */
     // Count customers created between two dates (inclusive)
  /** New customers between start/end (inclusive) */
  @Query(value = """
    SELECT COUNT(*) 
      FROM customer
     WHERE store_id   = :storeId
       AND created_at::date BETWEEN :start AND :end
    """, nativeQuery = true)
  long countNewCustomersByDateRange(
      @Param("storeId") Long storeId,
      @Param("start")   LocalDate start,
      @Param("end")     LocalDate end
  );
  /**
   * Count returning customers for a given store.
   * A customer is “returning” if they placed at least one order
   * BEFORE the start date, AND at least one order BETWEEN start and end.
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
      @Param("storeId")   Long storeId,
      @Param("startDate") LocalDate startDate,
      @Param("endDate")   LocalDate endDate
  );


}
