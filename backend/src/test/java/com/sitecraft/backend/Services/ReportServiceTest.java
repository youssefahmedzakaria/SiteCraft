package com.sitecraft.backend.Services;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import com.sitecraft.backend.Repositories.ReportRepository;
import com.sitecraft.backend.DTOs.ProductAnalyticsRow;
import com.sitecraft.backend.DTOs.EngagementReportRow;
import com.sitecraft.backend.DTOs.SalesSummaryRow;
import com.sitecraft.backend.DTOs.InventoryStatusRow;
import java.util.List;
import java.util.Arrays;
import java.util.Collections;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;

public class ReportServiceTest {
    @Mock
    private ReportRepository reportRepository;

    @InjectMocks
    private ReportService reportService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetSessionCounts() {
        LocalDate date = LocalDate.now();
        List<Object[]> repoResult = Collections.singletonList(new Object[]{date, 5L});
        when(reportRepository.findSessionCountsByDateRange(1L, null, null)).thenReturn(repoResult);
        List<ReportService.SessionCount> result = reportService.getSessionCounts(1L, null, null);
        assertEquals(1, result.size());
        assertEquals(date, result.get(0).getDate());
        assertEquals(5L, result.get(0).getCount());
    }

    @Test
    void testGetProductAnalytics() {
        List<Object[]> repoResult = Collections.singletonList(new Object[]{"prod", 2L, 3L});
        when(reportRepository.findProductAnalyticsByDateRange(1L, null, null)).thenReturn(repoResult);
        List<ProductAnalyticsRow> result = reportService.getProductAnalytics(1L, null, null);
        assertEquals(1, result.size());
        assertEquals("prod", result.get(0).getProductName());
        assertEquals(2L, result.get(0).getUnitsSold());
        assertEquals(3L, result.get(0).getTotalStock());
    }

    @Test
    void testGetEngagementMetrics() {
        LocalDate date = LocalDate.now();
        List<Object[]> repoResult = Collections.singletonList(new Object[]{date, 10L, 2.5, 3L});
        when(reportRepository.findEngagementMetricsByDateRange(1L, null, null)).thenReturn(repoResult);
        List<EngagementReportRow> result = reportService.getEngagementMetrics(1L, null, null);
        assertEquals(1, result.size());
        assertEquals(date, result.get(0).getDate());
        assertEquals(10L, result.get(0).getTotalEvents());
        assertEquals(2.5, result.get(0).getAvgDurationSec());
        assertEquals(3L, result.get(0).getConversions());
    }

    @Test
    void testGetSalesSummary_WithData() {
        Object[] row = new Object[]{5L, BigDecimal.TEN, 2.5, "top"};
        when(reportRepository.findSalesSummaryByDateRange(1L, null, null)).thenReturn(Collections.singletonList(row));
        SalesSummaryRow result = reportService.getSalesSummary(1L, null, null);
        assertEquals(5L, result.getTotalOrders());
        assertEquals(BigDecimal.TEN, result.getTotalRevenue());
        assertEquals(new BigDecimal("2.50"), result.getAvgOrderValue());
        assertEquals("top", result.getTopProduct());
    }

    @Test
    void testGetSalesSummary_Empty() {
        when(reportRepository.findSalesSummaryByDateRange(1L, null, null)).thenReturn(Collections.emptyList());
        SalesSummaryRow result = reportService.getSalesSummary(1L, null, null);
        assertEquals(0L, result.getTotalOrders());
        assertEquals(BigDecimal.ZERO, result.getTotalRevenue());
        assertEquals(new BigDecimal("0.00"), result.getAvgOrderValue());
        assertEquals("", result.getTopProduct());
    }

    @Test
    void testGetCurrentInventoryByCategory() {
        List<Object[]> repoResult = Collections.singletonList(new Object[]{"cat", 7L});
        when(reportRepository.findInventoryStatusByCategory(1L)).thenReturn(repoResult);
        List<InventoryStatusRow> result = reportService.getCurrentInventoryByCategory(1L);
        assertEquals(1, result.size());
        assertEquals("cat", result.get(0).getCategoryName());
        assertEquals(7L, result.get(0).getTotalStock());
    }
} 