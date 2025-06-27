package com.sitecraft.backend.Services;

import com.sitecraft.backend.DTOs.EngagementReportRow;
import com.sitecraft.backend.DTOs.InventoryStatusRow;
import com.sitecraft.backend.DTOs.ProductAnalyticsRow;
import com.sitecraft.backend.DTOs.SalesSummaryRow;
import com.sitecraft.backend.Repositories.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    /**
     * Fetches session‐creation counts per day for the given store and date range.
     */
    public List<SessionCount> getSessionCounts(
        Long storeId,
        LocalDateTime start,
        LocalDateTime end
    ) {
        return reportRepository
            .findSessionCountsByDateRange(storeId, start, end)
            .stream()
            .map(row -> new SessionCount(
                (LocalDate) row[0],
                ((Number) row[1]).longValue()
            ))
            .collect(Collectors.toList());
    }

    /** DTO for returning a date + session count. */
    public static class SessionCount {
        private final LocalDate date;
        private final long count;

        public SessionCount(LocalDate date, long count) {
            this.date = date;
            this.count = count;
        }

        public LocalDate getDate() {
            return date;
        }

        public long getCount() {
            return count;
        }
    }

     public List<ProductAnalyticsRow> getProductAnalytics(
        Long storeId,
        LocalDateTime start,
        LocalDateTime end
    ) {
        return reportRepository.findProductAnalyticsByDateRange(storeId, start, end)
            .stream()
            .map(row -> new ProductAnalyticsRow(
                (String) row[0],
                ((Number) row[1]).longValue(),
                ((Number) row[2]).longValue()
            ))
            .collect(Collectors.toList());
    }

    public List<EngagementReportRow> getEngagementMetrics(
        Long storeId,
        LocalDateTime start,
        LocalDateTime end
    ) {
        return reportRepository
            .findEngagementMetricsByDateRange(storeId, start, end)
            .stream()
            .map(row -> new EngagementReportRow(
                (LocalDate) row[0],
                ((Number)  row[1]).longValue(),
                ((Number)  row[2]).doubleValue(),
                ((Number)  row[3]).longValue()
            ))
            .collect(Collectors.toList());
    }
    public SalesSummaryRow getSalesSummary(
        Long storeId,
        LocalDateTime start,
        LocalDateTime end
    ) {
        Object[] row = reportRepository
            .findSalesSummaryByDateRange(storeId, start, end)
            .stream()
            .findFirst()
            .orElse(new Object[]{0L, BigDecimal.ZERO, BigDecimal.ZERO, ""});

        long   totalOrders    = ((Number) row[0]).longValue();
        BigDecimal totalRevenue  = toBigDecimal(row[1]);
        BigDecimal avgOrderValue = toBigDecimal(row[2]).setScale(2, RoundingMode.HALF_UP); 
        String    topProduct     = (String) row[3];

        return new SalesSummaryRow(totalOrders, totalRevenue, avgOrderValue, topProduct);
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }
        if (value instanceof Number) {
            return BigDecimal.valueOf(((Number) value).doubleValue());
        }
        return BigDecimal.ZERO;
    }
    public List<InventoryStatusRow> getCurrentInventoryByCategory(Long storeId) {
        return reportRepository.findInventoryStatusByCategory(storeId).stream()
                   .map(r -> new InventoryStatusRow(
                       (String) r[0],
                       ((Number) r[1]).longValue()
                   ))
                   .collect(Collectors.toList());
    }
}