package com.sitecraft.backend.DTOs;

/**
 * A single row of the “Product Analytics” report:
 *   • productName  — the product’s name
 *   • unitsSold    — total sold in the period
 *   • totalStock   — current on-hand stock across all its variants
 */
public class ProductAnalyticsRow {
    private final String productName;
    private final long unitsSold;
    private final long totalStock;

    public ProductAnalyticsRow(String productName, long unitsSold, long totalStock) {
        this.productName = productName;
        this.unitsSold   = unitsSold;
        this.totalStock  = totalStock;
    }

    public String getProductName() {
        return productName;
    }

    public long getUnitsSold() {
        return unitsSold;
    }

    public long getTotalStock() {
        return totalStock;
    }
}
