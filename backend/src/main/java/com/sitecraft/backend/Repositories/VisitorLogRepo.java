package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.VisitorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface VisitorLogRepo extends JpaRepository<VisitorLog, Long> {

    /**
     * Count visits grouped by source within the given date/time range for a store.
     */
    @Query("""
      SELECT vl.source, COUNT(vl)
      FROM VisitorLog vl
      WHERE vl.store.id = :storeId
        AND vl.createdAt BETWEEN :start AND :end
      GROUP BY vl.source
      ORDER BY COUNT(vl) DESC
    """)
    List<Object[]> countBySourceAndDateRange(
      @Param("storeId") Long storeId,
      @Param("start")   LocalDateTime start,
      @Param("end")     LocalDateTime end
    );
}
