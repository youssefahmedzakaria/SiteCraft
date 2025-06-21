package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.Order;
import com.sitecraft.backend.Models.Product;
import com.sitecraft.backend.Repositories.OverviewRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
public class OverviewService {    @Autowired
    private OverviewRepo overviewRepo;

    @Autowired
    private OrderService orderService;

    @Autowired
    private AnalyticsService analyticsService;    // =================================================================================
    // Overview Dashboard Methods
    // =================================================================================

    /**
     * Get order count for today for the specified store.
     */
    public long getTodayOrderCount(Long storeId) {
        LocalDate today = LocalDate.now();
        return overviewRepo.countByStoreIdAndDate(storeId, today);
    }    /**
     * Get total sales for today for the specified store.
     */
    public BigDecimal getTodaySalesTotal(Long storeId) {
        LocalDate today = LocalDate.now();
        return overviewRepo.sumTotalAmountByStoreIdAndDate(storeId, today);
    }    /**
     * Get all-time top-selling products for the specified store.
     */
    public List<ProductSales> getTopProducts(Long storeId, int limit) {
        List<Object[]> rows = overviewRepo.findTopProductsAllTime(storeId, PageRequest.of(0, limit));
        return rows.stream()
                   .map(r -> new ProductSales(
                       (Product) r[0],
                       ((Number) r[1]).intValue()
                   ))
                   .collect(Collectors.toList());
    }

    /**
     * Get all orders for today for the specified store.
     */
    public List<Order> getTodayOrders(Long storeId) {
        LocalDate today = LocalDate.now();
        return orderService.getAllOrders(storeId).stream()
            .filter(o -> o.getIssueDate().toLocalDate().equals(today))
            .collect(Collectors.toList());
    }    /**
     * Get daily sales for the last 7 days (including today) for the specified store.
     */
    public List<DailySales> getLast7DaysSales(Long storeId) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6);
        List<AnalyticsService.DailySales> analyticsSales = analyticsService.getDailySalesByDateRange(start, end, storeId);
        
        // Convert AnalyticsService.DailySales to OverviewService.DailySales
        return analyticsSales.stream()
            .map(sale -> new DailySales(sale.getDate(), sale.getTotalSales()))
            .collect(Collectors.toList());
    }

    // =================================================================================
    // Data Transfer Objects
    // =================================================================================

    /**
     * Holder class for product + quantity sold.
     */
    public static class ProductSales {
        private final Product product;
        private final int quantitySold;

        public ProductSales(Product product, int quantitySold) {
            this.product = product;
            this.quantitySold = quantitySold;
        }

        public Product getProduct() {
            return product;
        }

        public int getQuantitySold() {
            return quantitySold;
        }
    }

    /**
     * Holder class for daily sales data.
     */
    public static class DailySales {
        private final LocalDate date;
        private final BigDecimal totalSales;

        public DailySales(LocalDate date, BigDecimal totalSales) {
            this.date = date;
            this.totalSales = totalSales;
        }

        public LocalDate getDate() {
            return date;
        }

        public BigDecimal getTotalSales() {
            return totalSales;
        }
    }
}
