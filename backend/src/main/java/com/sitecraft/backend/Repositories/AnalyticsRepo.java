package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface AnalyticsRepo extends JpaRepository<Order, Long> {

    // --- Analytics: daily sales breakdown ---
    @Query("""
      SELECT CAST(o.issueDate AS java.time.LocalDate) AS saleDate,
             COALESCE(SUM(o.price), 0)
      FROM Order o
      WHERE o.store.id = :storeId
        AND CAST(o.issueDate AS java.time.LocalDate) BETWEEN :startDate AND :endDate
      GROUP BY CAST(o.issueDate AS java.time.LocalDate)
      ORDER BY saleDate
    """)
    List<Object[]> findDailySalesByDateRange(
      @Param("storeId")   Long storeId,
      @Param("startDate") LocalDate startDate,
      @Param("endDate")   LocalDate endDate
    );

    // --- Analytics: daily net profit breakdown (native SQL) ---
    @Query(value = """
      SELECT
        CAST(o.issue_date AS date) AS saleDate,
        COALESCE(
          SUM(op.price * op.quantity)
          - SUM(pv.production_cost * op.quantity),
          0
        ) AS netProfit
      FROM orders o
      JOIN orderproduct op   ON o.id = op.order_id
      JOIN productvariants pv ON pv.sku = op.sku
      WHERE o.store_id = :storeId
        AND CAST(o.issue_date AS date) BETWEEN :startDate AND :endDate
      GROUP BY CAST(o.issue_date AS date)
      ORDER BY saleDate
    """, nativeQuery = true)
    List<Object[]> findDailyNetProfitByDateRange(
      @Param("storeId")   Long storeId,
      @Param("startDate") LocalDate startDate,
      @Param("endDate")   LocalDate endDate
    );

    // --- Analytics: sales by category breakdown ---
    @Query("""
      SELECT c.name, COALESCE(SUM(op.price * op.quantity), 0)
      FROM OrderProduct op
      JOIN op.product p
      JOIN p.categoryProducts cp
      JOIN cp.category c
      JOIN op.order o
      WHERE o.store.id = :storeId
        AND CAST(o.issueDate AS java.time.LocalDate) BETWEEN :startDate AND :endDate
      GROUP BY c.name
      ORDER BY SUM(op.price * op.quantity) DESC
    """)
    List<Object[]> findSalesByCategoryByDateRange(
      @Param("storeId")    Long storeId,
      @Param("startDate")  LocalDate startDate,
      @Param("endDate")    LocalDate endDate
    );

    // --- Analytics: top-selling products over a date range ---
    @Query("""
      SELECT op.product, SUM(op.quantity)
      FROM OrderProduct op
      JOIN op.order o
      WHERE o.store.id = :storeId
        AND CAST(o.issueDate AS java.time.LocalDate) BETWEEN :startDate AND :endDate
      GROUP BY op.product
      ORDER BY SUM(op.quantity) DESC
    """)
    List<Object[]> findTopProductsByDateRange(
      @Param("storeId")   Long storeId,
      @Param("startDate") LocalDate startDate,
      @Param("endDate")   LocalDate endDate,
      Pageable pageable
    );

    // --- Analytics: sales by product over time ---
    @Query("""
      SELECT 
        CAST(o.issueDate AS java.time.LocalDate) AS saleDate,
        p.name                                              AS productName,
        COALESCE(SUM(op.quantity), 0)                       AS unitsSold
      FROM OrderProduct op
      JOIN op.product p
      JOIN op.order o
      WHERE o.store.id = :storeId
        AND CAST(o.issueDate AS java.time.LocalDate) BETWEEN :startDate AND :endDate
      GROUP BY CAST(o.issueDate AS java.time.LocalDate), p.name
      ORDER BY CAST(o.issueDate AS java.time.LocalDate), p.name
    """)
    List<Object[]> findSalesByProductByDateRange(
      @Param("storeId")   Long storeId,
      @Param("startDate") LocalDate startDate,
      @Param("endDate")   LocalDate endDate
    );
}
