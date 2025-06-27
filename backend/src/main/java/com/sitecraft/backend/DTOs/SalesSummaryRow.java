package com.sitecraft.backend.DTOs;

import java.math.BigDecimal;

public class SalesSummaryRow {
    private final long totalOrders;
    private final BigDecimal totalRevenue;
    private final BigDecimal avgOrderValue;
    private final String topProduct;

    public SalesSummaryRow(
        long totalOrders,
        BigDecimal totalRevenue,
        BigDecimal avgOrderValue,
        String topProduct
    ) {
        this.totalOrders    = totalOrders;
        this.totalRevenue   = totalRevenue;
        this.avgOrderValue  = avgOrderValue;
        this.topProduct     = topProduct;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public BigDecimal getAvgOrderValue() {
        return avgOrderValue;
    }

    public String getTopProduct() {
        return topProduct;
    }
}
