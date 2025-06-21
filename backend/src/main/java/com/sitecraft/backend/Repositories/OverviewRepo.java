package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

public interface OverviewRepo extends JpaRepository<Order, Long> {

    // Count orders for a given store on a single date
    @Query("""
      SELECT COUNT(o)
      FROM Order o
      WHERE o.store.id = :storeId
        AND CAST(o.issueDate AS java.time.LocalDate) = :date
    """)
    long countByStoreIdAndDate(
      @Param("storeId") Long storeId,
      @Param("date") LocalDate date
    );

    // Sum totalAmount for a given store on a single date
    @Query("""
      SELECT COALESCE(SUM(o.price), 0)
      FROM Order o
      WHERE o.store.id = :storeId
        AND CAST(o.issueDate AS java.time.LocalDate) = :date
    """)
    BigDecimal sumTotalAmountByStoreIdAndDate(
      @Param("storeId") Long storeId,
      @Param("date") LocalDate date
    );

    // Retrieve top-selling products (by quantity) for a given store on a single date
    @Query("""
      SELECT op.product, SUM(op.quantity)
      FROM OrderProduct op
      JOIN op.order o
      WHERE o.store.id = :storeId
        AND CAST(o.issueDate AS java.time.LocalDate) = :date
      GROUP BY op.product
      ORDER BY SUM(op.quantity) DESC
    """)
    List<Object[]> findTopProductsByStoreIdAndDate(
      @Param("storeId") Long storeId,
      @Param("date") LocalDate date,
      Pageable pageable
    );

    // --- Overview: all-time top-selling products ---
    @Query("""
      SELECT op.product, SUM(op.quantity)
      FROM OrderProduct op
      JOIN op.order o
      WHERE o.store.id = :storeId
      GROUP BY op.product
      ORDER BY SUM(op.quantity) DESC
    """)
    List<Object[]> findTopProductsAllTime(
      @Param("storeId") Long storeId,
      Pageable pageable
    );
}
