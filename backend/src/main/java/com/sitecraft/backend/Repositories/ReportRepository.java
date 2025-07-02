package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReportRepository extends JpaRepository<Session, Long> {

    /**
     * Returns a list of [sessionDate, sessionCount] for each day in the range.
     */
    @Query("""
      SELECT
        CAST(s.createdAt AS java.time.LocalDate) AS sessionDate,
        COUNT(s)                                AS sessionCount
      FROM Session s
      WHERE s.store.id       = :storeId
        AND s.createdAt     BETWEEN :start AND :end
      GROUP BY CAST(s.createdAt AS java.time.LocalDate)
      ORDER BY sessionDate
    """)
    List<Object[]> findSessionCountsByDateRange(
        @Param("storeId") Long storeId,
        @Param("start")   LocalDateTime start,
        @Param("end")     LocalDateTime end
    );

     /**
     * Returns rows of [productName, unitsSold, totalStock]
     * for each product in the given date range.
     */
    @Query("""
      SELECT 
        p.name                                            AS productName,
        COALESCE(SUM(op.quantity), 0)                     AS unitsSold,
        COALESCE(SUM(pv.stock), 0)                        AS totalStock
      FROM OrderProduct op
      JOIN op.product p
      JOIN ProductVariants pv 
        WITH pv.sku = op.sku
      JOIN op.order o
      WHERE o.store.id  = :storeId
        AND o.issueDate BETWEEN :start AND :end
      GROUP BY p.name
      ORDER BY unitsSold DESC
    """)
    List<Object[]> findProductAnalyticsByDateRange(
      @Param("storeId") Long storeId,
      @Param("start")   LocalDateTime start,
      @Param("end")     LocalDateTime end
    );

    /**
   * Returns per‐day engagement metrics for the given store + timeframe:
   *  1) totalEvents:   # of session_event rows
   *  2) avgDuration:   average session duration, in seconds
   *  3) conversions:   # of sessions that produced at least one order
   */  @Query("""
    SELECT
      CAST(s.createdAt AS java.time.LocalDate)           AS reportDate,
      COUNT(e)                                           AS totalEvents,
      AVG(
        CASE 
          WHEN s.endedAt IS NOT NULL 
          THEN EXTRACT(EPOCH FROM s.endedAt) - EXTRACT(EPOCH FROM s.createdAt)
          ELSE 0 
        END
      )                                                  AS avgDurationSec,
      SUM(
        CASE WHEN EXISTS (
          SELECT 1
          FROM Order o
          WHERE o.customer.id = s.user.id
            AND o.store.id    = s.store.id
            AND o.issueDate BETWEEN :start AND :end
        ) THEN 1 ELSE 0 END
      )                                                  AS conversions
    FROM Session s
    LEFT JOIN SessionEvent e   ON e.session.id = s.id
    WHERE s.store.id = :storeId
      AND s.createdAt BETWEEN :start AND :end
    GROUP BY CAST(s.createdAt AS java.time.LocalDate)
    ORDER BY reportDate
  """)
  List<Object[]> findEngagementMetricsByDateRange(
    @Param("storeId") Long storeId,
    @Param("start")   LocalDateTime start,
    @Param("end")     LocalDateTime end
  );
   /**
     * One‐row summary: total orders, revenue, avg order value, top selling product.
     */
    @Query("""
      SELECT
        COUNT(o)                                                     AS totalOrders,
        COALESCE(SUM(o.price), 0)                                    AS totalRevenue,
        COALESCE(AVG(o.price), 0)                                    AS avgOrderValue,
        COALESCE(
          (
            SELECT p2.name
              FROM OrderProduct op2
              JOIN op2.product p2
              JOIN op2.order o2
             WHERE o2.store.id = :storeId
               AND o2.issueDate BETWEEN :start AND :end
             GROUP BY p2.name
             ORDER BY SUM(op2.quantity) DESC
            LIMIT 1
          ),
          ''
        )                                                           AS topProduct
      FROM Order o
      WHERE o.store.id = :storeId
        AND o.issueDate BETWEEN :start AND :end
    """)
    List<Object[]> findSalesSummaryByDateRange(
      @Param("storeId") Long storeId,
      @Param("start")   LocalDateTime start,
      @Param("end")     LocalDateTime end
    );

        // ── rep-005: Inventory Status ───────────────────────────────────────────────
    /**
     * Returns rows of [categoryName, totalStock] across all variants in the store.
     */
    @Query("""
      SELECT c.name,
             COALESCE(SUM(pv.stock), 0)
      FROM ProductVariants pv
      JOIN pv.product p
      JOIN p.categoryProducts cp
      JOIN cp.category c
      WHERE p.store.id = :storeId
      GROUP BY c.name
      ORDER BY c.name
    """)
    List<Object[]> findInventoryStatusByCategory(
      @Param("storeId") Long storeId
    );
}