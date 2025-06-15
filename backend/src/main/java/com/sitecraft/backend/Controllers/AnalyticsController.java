package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.Services.AnalyticsService;
import com.sitecraft.backend.Services.AnalyticsService.ProductSales;
import com.sitecraft.backend.Services.AnalyticsService.DailySales;
import com.sitecraft.backend.Services.AnalyticsService.CategorySales;
import com.sitecraft.backend.Services.AnalyticsService.DailyNetProfit;
import com.sitecraft.backend.Services.AnalyticsService.SalesByProduct;
import com.sitecraft.backend.Repositories.WishlistAnalyticsDao.WishlistTrend;
import com.sitecraft.backend.Services.CustomerService;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import com.sitecraft.backend.Services.AnalyticsService.SourceCount;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    private final CustomerService customerService;

    public AnalyticsController(
        AnalyticsService analyticsService,
        CustomerService customerService
    ) {
        this.analyticsService = analyticsService;
        this.customerService = customerService;
    }    @GetMapping("/orders/count")
    public ResponseEntity<Long> getOrderCount(
        @RequestParam Long storeId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        long count = analyticsService.countOrdersByDateRange(startDate, endDate, storeId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/sales/total")
    public ResponseEntity<BigDecimal> getTotalSales(
        @RequestParam Long storeId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        BigDecimal total = analyticsService.sumTotalSalesByDateRange(startDate, endDate, storeId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/sales/daily")
    public ResponseEntity<List<DailySales>> getDailySales(
        @RequestParam Long storeId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<DailySales> sales = analyticsService.getDailySalesByDateRange(startDate, endDate, storeId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/profit/daily")
    public ResponseEntity<List<DailyNetProfit>> getDailyNetProfit(
        @RequestParam Long storeId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<DailyNetProfit> profits = analyticsService.getDailyNetProfitByDateRange(startDate, endDate, storeId);
        return ResponseEntity.ok(profits);
    }

    @GetMapping("/sales/category")
    public ResponseEntity<List<CategorySales>> getSalesByCategory(
        @RequestParam Long storeId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<CategorySales> stats = analyticsService.getSalesByCategory(startDate, endDate, storeId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/products/top")
    public ResponseEntity<List<ProductSales>> getTopProductsByDateRange(
        @RequestParam Long storeId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @RequestParam(defaultValue = "5") int limit
    ) {
        List<ProductSales> list = analyticsService.getTopSellingProductsByDateRange(startDate, endDate, storeId, limit);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/wishlist/trends")
    public ResponseEntity<List<WishlistTrend>> getWishlistTrends(
        @RequestParam Long storeId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<WishlistTrend> trends = analyticsService.getWishlistTrends(startDate, endDate, storeId);
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/sales/product")
    public ResponseEntity<List<SalesByProduct>> getSalesByProduct(
        @RequestParam Long storeId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<SalesByProduct> data = analyticsService.getSalesByProductByDateRange(startDate, endDate, storeId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/customers/new")
    public ResponseEntity<Long> getNewCustomers(
        @RequestParam Long storeId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        long count = customerService.countNewCustomersByDateRange(startDate, endDate, storeId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/customers/returning")
public ResponseEntity<Long> getReturningCustomers(
    @RequestParam Long storeId,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
) {
    long count = customerService.countReturningCustomersByDateRange(startDate, endDate, storeId);
    return ResponseEntity.ok(count);
}

@GetMapping("/customers/acquisition")
public ResponseEntity<List<SourceCount>> getCustomerAcquisition(
    @RequestParam Long storeId,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
) {
    // start at 00:00:00 on startDate
    LocalDateTime start = startDate.atStartOfDay();
    // end at 23:59:59.999999999 on endDate
    LocalDateTime end   = endDate.atTime(LocalTime.MAX);

    List<SourceCount> acquisition = analyticsService.getVisitCountsBySource(start, end, storeId);
    return ResponseEntity.ok(acquisition);
}

}
