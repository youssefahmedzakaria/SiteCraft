package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.Services.OverviewService;
import com.sitecraft.backend.Services.OverviewService.ProductSales;
import com.sitecraft.backend.Services.OverviewService.DailySales;
import com.sitecraft.backend.Models.Order;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;


import java.util.List;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/overview")
public class OverviewController {

    private final OverviewService overviewService;

    public OverviewController(OverviewService overviewService) {
        this.overviewService = overviewService;
    }

    @GetMapping("/orders/count")
    public ResponseEntity<Long> getOrderCount(
        @SessionAttribute("storeId") Long storeId
    ) {
        long count = overviewService.getTodayOrderCount(storeId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/sales/total")
    public ResponseEntity<BigDecimal> getTotalSales(
        @SessionAttribute("storeId") Long storeId
    ) {
        BigDecimal total = overviewService.getTodaySalesTotal(storeId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/products/top")
    public ResponseEntity<List<ProductSales>> getTopProducts(
        @SessionAttribute("storeId") Long storeId,
        @RequestParam(defaultValue = "5") int limit
    ) {
        List<ProductSales> list = overviewService.getTopProducts(storeId, limit);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getTodayOrders(
        @SessionAttribute("storeId") Long storeId
    ) {
        List<Order> orders = overviewService.getTodayOrders(storeId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/sales/daily")
    public ResponseEntity<List<DailySales>> getLast7DaysSales(
        @SessionAttribute("storeId") Long storeId
    ) {
        List<DailySales> sales = overviewService.getLast7DaysSales(storeId);
        return ResponseEntity.ok(sales);
    }
}