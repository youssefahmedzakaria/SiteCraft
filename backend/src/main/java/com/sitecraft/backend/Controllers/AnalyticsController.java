package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.Services.AnalyticsService;
import com.sitecraft.backend.Services.AnalyticsService.ProductSales;
import com.sitecraft.backend.Services.AnalyticsService.DailySales;
import com.sitecraft.backend.Services.AnalyticsService.CategorySales;
import com.sitecraft.backend.Services.AnalyticsService.DailyNetProfit;
import com.sitecraft.backend.Services.AnalyticsService.SalesByProduct;
import com.sitecraft.backend.Services.AnalyticsService.SourceCount;
import com.sitecraft.backend.Repositories.WishlistAnalyticsDao.WishlistTrend;
import com.sitecraft.backend.Services.CustomerService;
import com.sitecraft.backend.DTOs.DateRangeDTO;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    private final CustomerService    customerService;

    public AnalyticsController(
        AnalyticsService analyticsService,
        CustomerService  customerService
    ) {
        this.analyticsService = analyticsService;
        this.customerService  = customerService;
    }

    @PostMapping("/orders/count")
    public ResponseEntity<Long> getOrderCount(
        @SessionAttribute("storeId") Long storeId,
        @RequestBody DateRangeDTO req
    ) {
        long count = analyticsService.countOrdersByDateRange(
            req.getStartDate(), req.getEndDate(), storeId
        );
        return ResponseEntity.ok(count);
    }

    @PostMapping("/sales/total")
    public ResponseEntity<BigDecimal> getTotalSales(
        @SessionAttribute("storeId") Long storeId,
        @RequestBody DateRangeDTO req
    ) {
        BigDecimal total = analyticsService.sumTotalSalesByDateRange(
            req.getStartDate(), req.getEndDate(), storeId
        );
        return ResponseEntity.ok(total);
    }

    @PostMapping("/sales/daily")
    public ResponseEntity<List<DailySales>> getDailySales(
        @SessionAttribute("storeId") Long storeId,
        @RequestBody DateRangeDTO req
    ) {
        List<DailySales> sales = analyticsService.getDailySalesByDateRange(
            req.getStartDate(), req.getEndDate(), storeId
        );
        return ResponseEntity.ok(sales);
    }

    @PostMapping("/profit/daily")
    public ResponseEntity<List<DailyNetProfit>> getDailyNetProfit(
        @SessionAttribute("storeId") Long storeId,
        @RequestBody DateRangeDTO req
    ) {
        List<DailyNetProfit> profits = analyticsService.getDailyNetProfitByDateRange(
            req.getStartDate(), req.getEndDate(), storeId
        );
        return ResponseEntity.ok(profits);
    }

    @PostMapping("/sales/category")
    public ResponseEntity<List<CategorySales>> getSalesByCategory(
        @SessionAttribute("storeId") Long storeId,
        @RequestBody DateRangeDTO req
    ) {
        List<CategorySales> stats = analyticsService.getSalesByCategory(
            req.getStartDate(), req.getEndDate(), storeId
        );
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/products/top")
    public ResponseEntity<List<ProductSales>> getTopProductsByDateRange(
        @SessionAttribute("storeId") Long storeId,
        @RequestBody DateRangeDTO req
    ) {
        List<ProductSales> list = analyticsService.getTopSellingProductsByDateRange(
            req.getStartDate(), req.getEndDate(), storeId, req.getLimit()
        );
        return ResponseEntity.ok(list);
    }

    @PostMapping("/wishlist/trends")
    public ResponseEntity<List<WishlistTrend>> getWishlistTrends(
        @SessionAttribute("storeId") Long storeId,
        @RequestBody DateRangeDTO req
    ) {
        List<WishlistTrend> trends = analyticsService.getWishlistTrends(
            req.getStartDate(), req.getEndDate(), storeId
        );
        return ResponseEntity.ok(trends);
    }

    @PostMapping("/sales/product")
    public ResponseEntity<List<SalesByProduct>> getSalesByProduct(
        @SessionAttribute("storeId") Long storeId,
        @RequestBody DateRangeDTO req
    ) {
        List<SalesByProduct> data = analyticsService.getSalesByProductByDateRange(
            req.getStartDate(), req.getEndDate(), storeId
        );
        return ResponseEntity.ok(data);
    }

    @PostMapping("/customers/new")
    public ResponseEntity<Long> getNewCustomers(
        @SessionAttribute("storeId") Long storeId,
        @RequestBody DateRangeDTO req
    ) {
        long count = customerService.countNewCustomersByDateRange(
            req.getStartDate(), req.getEndDate(), storeId
        );
        return ResponseEntity.ok(count);
    }

    @PostMapping("/customers/returning")
    public ResponseEntity<Long> getReturningCustomers(
        @SessionAttribute("storeId") Long storeId,
        @RequestBody DateRangeDTO req
    ) {
        long count = customerService.countReturningCustomersByDateRange(
            req.getStartDate(), req.getEndDate(), storeId
        );
        return ResponseEntity.ok(count);
    }

    @PostMapping("/customers/acquisition")
    public ResponseEntity<List<SourceCount>> getCustomerAcquisition(
        @SessionAttribute("storeId") Long storeId,
        @RequestBody DateRangeDTO req
    ) {
        LocalDateTime start = req.getStartDate().atStartOfDay();
        LocalDateTime end   = req.getEndDate().atTime(LocalTime.MAX);

        List<SourceCount> acquisition = analyticsService.getVisitCountsBySource(
            start, end, storeId
        );
        return ResponseEntity.ok(acquisition);
    }
}