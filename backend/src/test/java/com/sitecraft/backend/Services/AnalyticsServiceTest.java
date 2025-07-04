package com.sitecraft.backend.Services;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.sitecraft.backend.Models.Product;
import com.sitecraft.backend.Repositories.AnalyticsRepo;
import com.sitecraft.backend.Repositories.WishlistAnalyticsDao;
import com.sitecraft.backend.Repositories.VisitorLogRepo;
import com.sitecraft.backend.Services.AnalyticsService.ProductSales;
import com.sitecraft.backend.Services.AnalyticsService.DailySales;
import com.sitecraft.backend.Services.AnalyticsService.DailyNetProfit;
import com.sitecraft.backend.Services.AnalyticsService.CategorySales;
import com.sitecraft.backend.Services.AnalyticsService.SalesByProduct;
import com.sitecraft.backend.Services.AnalyticsService.SourceCount;
import org.junit.jupiter.api.BeforeEach;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Collections;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Arrays;

public class AnalyticsServiceTest {
    @Mock
    private AnalyticsRepo analyticsRepo;
    @Mock
    private WishlistAnalyticsDao wishlistDao;
    @Mock
    private VisitorLogRepo visitorLogRepo;
    @InjectMocks
    private AnalyticsService analyticsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCountOrdersByDateRange() {
        List<Object[]> rows = Arrays.asList(new Object[2], new Object[2]);
        when(analyticsRepo.findDailySalesByDateRange(1L, LocalDate.now(), LocalDate.now())).thenReturn(rows);
        long count = analyticsService.countOrdersByDateRange(LocalDate.now(), LocalDate.now(), 1L);
        assertEquals(2, count);
    }

    @Test
    void testSumTotalSalesByDateRange() {
        List<Object[]> rows = Arrays.asList(new Object[]{null, BigDecimal.valueOf(10)}, new Object[]{null, 5.0});
        when(analyticsRepo.findDailySalesByDateRange(1L, LocalDate.now(), LocalDate.now())).thenReturn(rows);
        BigDecimal sum = analyticsService.sumTotalSalesByDateRange(LocalDate.now(), LocalDate.now(), 1L);
        assertEquals(BigDecimal.valueOf(15.0), sum);
    }

    @Test
    void testGetTopSellingProductsByDateRange() {
        Product p = new Product();
        List<Object[]> rows = Collections.singletonList(new Object[]{p, 5});
        when(analyticsRepo.findTopProductsByDateRange(eq(1L), any(), any(), any())).thenReturn(rows);
        List<ProductSales> result = analyticsService.getTopSellingProductsByDateRange(LocalDate.now(), LocalDate.now(), 1L, 1);
        assertEquals(1, result.size());
        assertEquals(p, result.get(0).getProduct());
        assertEquals(5, result.get(0).getQuantitySold());
    }

    @Test
    void testGetDailySalesByDateRange() {
        List<Object[]> rows = Collections.singletonList(new Object[]{LocalDate.now(), BigDecimal.valueOf(20)});
        when(analyticsRepo.findDailySalesByDateRange(1L, LocalDate.now(), LocalDate.now())).thenReturn(rows);
        List<DailySales> result = analyticsService.getDailySalesByDateRange(LocalDate.now(), LocalDate.now(), 1L);
        assertEquals(1, result.size());
        assertEquals(BigDecimal.valueOf(20), result.get(0).getTotalSales());
    }

    @Test
    void testGetDailyNetProfitByDateRange() {
        List<Object[]> rows = Collections.singletonList(new Object[]{java.sql.Date.valueOf(LocalDate.now()), BigDecimal.valueOf(30)});
        when(analyticsRepo.findDailyNetProfitByDateRange(1L, LocalDate.now(), LocalDate.now())).thenReturn(rows);
        List<DailyNetProfit> result = analyticsService.getDailyNetProfitByDateRange(LocalDate.now(), LocalDate.now(), 1L);
        assertEquals(1, result.size());
        assertEquals(BigDecimal.valueOf(30), result.get(0).getNetProfit());
    }

    @Test
    void testGetSalesByCategory() {
        List<Object[]> rows = Collections.singletonList(new Object[]{"cat", BigDecimal.valueOf(40)});
        when(analyticsRepo.findSalesByCategoryByDateRange(1L, LocalDate.now(), LocalDate.now())).thenReturn(rows);
        List<CategorySales> result = analyticsService.getSalesByCategory(LocalDate.now(), LocalDate.now(), 1L);
        assertEquals(1, result.size());
        assertEquals("cat", result.get(0).getCategoryName());
        assertEquals(BigDecimal.valueOf(40), result.get(0).getTotalSales());
    }

    @Test
    void testGetWishlistTrends() {
        WishlistAnalyticsDao.WishlistTrend trend = mock(WishlistAnalyticsDao.WishlistTrend.class);
        when(wishlistDao.findWishlistTrends(1L, LocalDate.now(), LocalDate.now())).thenReturn(List.of(trend));
        List<WishlistAnalyticsDao.WishlistTrend> result = analyticsService.getWishlistTrends(LocalDate.now(), LocalDate.now(), 1L);
        assertEquals(1, result.size());
        assertEquals(trend, result.get(0));
    }

    @Test
    void testGetSalesByProductByDateRange() {
        List<Object[]> rows = Collections.singletonList(new Object[]{LocalDate.now(), "prod", 7});
        when(analyticsRepo.findSalesByProductByDateRange(1L, LocalDate.now(), LocalDate.now())).thenReturn(rows);
        List<SalesByProduct> result = analyticsService.getSalesByProductByDateRange(LocalDate.now(), LocalDate.now(), 1L);
        assertEquals(1, result.size());
        assertEquals("prod", result.get(0).getProductName());
        assertEquals(7, result.get(0).getUnitsSold());
    }

    @Test
    void testGetVisitCountsBySource() {
        List<Object[]> rows = Collections.singletonList(new Object[]{"google", 10L});
        when(visitorLogRepo.countBySourceAndDateRange(1L, LocalDateTime.MIN, LocalDateTime.MAX)).thenReturn(rows);
        List<SourceCount> result = analyticsService.getVisitCountsBySource(LocalDateTime.MIN, LocalDateTime.MAX, 1L);
        assertEquals(1, result.size());
        assertEquals("google", result.get(0).getSource());
        assertEquals(10L, result.get(0).getCount());
    }
} 