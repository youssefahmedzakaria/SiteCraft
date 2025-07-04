package com.sitecraft.backend.Services;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import com.sitecraft.backend.Models.Order;
import com.sitecraft.backend.Models.Product;
import com.sitecraft.backend.Repositories.OverviewRepo;
import java.util.Optional;
import java.util.Collections;
import java.util.List;
import java.util.Arrays;
import java.time.LocalDate;
import java.math.BigDecimal;

public class OverviewServiceTest {
    @Mock
    private OverviewRepo overviewRepo;
    @Mock
    private OrderService orderService;
    @Mock
    private AnalyticsService analyticsService;

    @InjectMocks
    private OverviewService overviewService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetTodayOrderCount() {
        when(overviewRepo.countByStoreIdAndDate(eq(1L), any(LocalDate.class))).thenReturn(5L);
        long count = overviewService.getTodayOrderCount(1L);
        assertEquals(5L, count);
    }

    @Test
    void testGetTodaySalesTotal() {
        when(overviewRepo.sumTotalAmountByStoreIdAndDate(eq(1L), any(LocalDate.class))).thenReturn(BigDecimal.TEN);
        BigDecimal total = overviewService.getTodaySalesTotal(1L);
        assertEquals(BigDecimal.TEN, total);
    }

    @Test
    void testGetTopProducts() {
        Product product = mock(Product.class);
        List<Object[]> rows = Collections.singletonList(new Object[]{product, 7});
        when(overviewRepo.findTopProductsAllTime(eq(1L), any())).thenReturn(rows);
        List<OverviewService.ProductSales> result = overviewService.getTopProducts(1L, 1);
        assertEquals(1, result.size());
        assertEquals(product, result.get(0).getProduct());
        assertEquals(7, result.get(0).getQuantitySold());
    }

    @Test
    void testGetTodayOrders() {
        Order orderToday = mock(Order.class);
        LocalDate today = LocalDate.now();
        when(orderToday.getIssueDate()).thenReturn(today.atStartOfDay());
        Order orderOther = mock(Order.class);
        when(orderOther.getIssueDate()).thenReturn(today.minusDays(1).atStartOfDay());
        when(orderService.getAllOrders(1L)).thenReturn(Arrays.asList(orderToday, orderOther));
        List<Order> result = overviewService.getTodayOrders(1L);
        assertEquals(1, result.size());
        assertEquals(orderToday, result.get(0));
    }

    @Test
    void testGetLast7DaysSales() {
        LocalDate today = LocalDate.now();
        AnalyticsService.DailySales analyticsSale = mock(AnalyticsService.DailySales.class);
        when(analyticsSale.getDate()).thenReturn(today);
        when(analyticsSale.getTotalSales()).thenReturn(BigDecimal.ONE);
        when(analyticsService.getDailySalesByDateRange(any(), any(), eq(1L))).thenReturn(Collections.singletonList(analyticsSale));
        List<OverviewService.DailySales> result = overviewService.getLast7DaysSales(1L);
        assertEquals(1, result.size());
        assertEquals(today, result.get(0).getDate());
        assertEquals(BigDecimal.ONE, result.get(0).getTotalSales());
    }
} 