package com.sitecraft.backend.DTOs;

/**
 * One row of the Inventory Status report:
 * category name + total stock on hand.
 */
public class InventoryStatusRow {
    private final String categoryName;
    private final long totalStock;

    public InventoryStatusRow(String categoryName, long totalStock) {
        this.categoryName = categoryName;
        this.totalStock   = totalStock;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public long getTotalStock() {
        return totalStock;
    }
    
}
