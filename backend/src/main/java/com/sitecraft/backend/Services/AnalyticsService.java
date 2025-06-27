package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.Product;
import com.sitecraft.backend.Repositories.AnalyticsRepo;
import com.sitecraft.backend.Repositories.WishlistAnalyticsDao;
import com.sitecraft.backend.Repositories.WishlistAnalyticsDao.WishlistTrend;
import com.sitecraft.backend.Repositories.VisitorLogRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {    @Autowired
    private AnalyticsRepo analyticsRepo;

    @Autowired
    private WishlistAnalyticsDao wishlistDao;

    @Autowired
    private VisitorLogRepo visitorLogRepo;

    
    /**
     * Count orders by date range for analytics.
     */
    public long countOrdersByDateRange(LocalDate startDate, LocalDate endDate, Long storeId) {
        List<Object[]> rows = analyticsRepo.findDailySalesByDateRange(storeId, startDate, endDate);
        return rows.size();
    } 
       /**
     * Sum total sales by date range for analytics.
     */
    public BigDecimal sumTotalSalesByDateRange(LocalDate startDate, LocalDate endDate, Long storeId) {
    List<Object[]> rows = analyticsRepo.findDailySalesByDateRange(storeId, startDate, endDate);
    return rows.stream()
        .map(r -> {
            Object raw = r[1];
            if (raw instanceof BigDecimal) {
                return (BigDecimal) raw;
            } else if (raw instanceof Number) {
                // covers Double, Long, Integer, etc.
                return BigDecimal.valueOf(((Number) raw).doubleValue());
            } else {
                return BigDecimal.ZERO;
            }
        })
        .reduce(BigDecimal.ZERO, BigDecimal::add);
}

    /**
     * Get top-selling products by date range for analytics.
     */
    public List<ProductSales> getTopSellingProductsByDateRange(
        LocalDate startDate, LocalDate endDate, Long storeId, int limit
    ) {
        List<Object[]> rows = analyticsRepo.findTopProductsByDateRange(
            storeId, startDate, endDate, PageRequest.of(0, limit)
        );
        return rows.stream()
                   .map(r -> new ProductSales(
                       (Product) r[0],
                       ((Number) r[1]).intValue()
                   ))
                   .collect(Collectors.toList());
    }  
    
    /**
     * Get daily sales breakdown by date range for analytics.
     */
    public List<DailySales> getDailySalesByDateRange(
    LocalDate startDate, LocalDate endDate, Long storeId
) 
{
    List<Object[]> rows = analyticsRepo.findDailySalesByDateRange(storeId, startDate, endDate);
    return rows.stream()
        .map(r -> {
            // 1) Normalize the date value
            Object dateRaw = r[0];
            LocalDate date;
            if (dateRaw instanceof java.sql.Date) {
                date = ((java.sql.Date) dateRaw).toLocalDate();
            } else if (dateRaw instanceof LocalDate) {
                date = (LocalDate) dateRaw;
            } else {
                // fallback if some other type
                date = LocalDate.parse(dateRaw.toString());
            }

            // 2) Normalize the sales total
            Object totalRaw = r[1];
            BigDecimal total;
            if (totalRaw instanceof BigDecimal) {
                total = (BigDecimal) totalRaw;
            } else if (totalRaw instanceof Number) {
                total = BigDecimal.valueOf(((Number) totalRaw).doubleValue());
            } else {
                total = BigDecimal.ZERO;
            }

            return new DailySales(date, total);
        })
        .collect(Collectors.toList());
}

/**
     * Get daily net profit breakdown by date range for analytics.
     */
    public List<DailyNetProfit> getDailyNetProfitByDateRange(
    LocalDate startDate, LocalDate endDate, Long storeId
) {
    List<Object[]> rows = analyticsRepo.findDailyNetProfitByDateRange(storeId, startDate, endDate);
    return rows.stream()
           .map(r -> new DailyNetProfit(
               ((java.sql.Date) r[0]).toLocalDate(),
               (BigDecimal)      r[1]
           ))
           .collect(Collectors.toList());
}
    /**
     * Get sales by category breakdown by date range for analytics.
     */
    public List<CategorySales> getSalesByCategory(
    LocalDate startDate, LocalDate endDate, Long storeId
) {
    List<Object[]> rows = analyticsRepo.findSalesByCategoryByDateRange(storeId, startDate, endDate);
    return rows.stream()
        .map(r -> {
            String categoryName = (String) r[0];
            Object rawTotal     = r[1];

            BigDecimal total;
            if (rawTotal instanceof BigDecimal) {
                total = (BigDecimal) rawTotal;
            } else if (rawTotal instanceof Number) {
                total = BigDecimal.valueOf(((Number) rawTotal).doubleValue());
            } else {
                total = BigDecimal.ZERO;
            }

            return new CategorySales(categoryName, total);
        })
        .collect(Collectors.toList());
}


    /**
     * Retrieves wishlist save counts per product between two dates.
     */
    public List<WishlistTrend> getWishlistTrends(
        LocalDate startDate, LocalDate endDate, Long storeId
    ) {
        return wishlistDao.findWishlistTrends(storeId, startDate, endDate);
    } 
       /**
     * Retrieves units sold per product for each day in the given range.
     */
    public List<SalesByProduct> getSalesByProductByDateRange(
        LocalDate startDate, LocalDate endDate, Long storeId
    ) {
        List<Object[]> rows = analyticsRepo.findSalesByProductByDateRange(storeId, startDate, endDate);
        return rows.stream()
                   .map(r -> new SalesByProduct(
                       (LocalDate) r[0],
                       (String)    r[1],
                       ((Number)   r[2]).intValue()
                   ))
                   .collect(Collectors.toList());
    }

    /**
     * Retrieves visit counts grouped by source for a store in the given time range.
     */
    public List<SourceCount> getVisitCountsBySource(
        LocalDateTime start,
        LocalDateTime end,
        Long storeId
    ) {
        List<Object[]> rows = visitorLogRepo.countBySourceAndDateRange(storeId, start, end);
        return rows.stream()
                   .map(r -> new SourceCount(
                       (String) r[0],
                       ((Number) r[1]).longValue()
                   ))
                   .collect(Collectors.toList());
    }

    // Data Transfer Objects
    
    public static class ProductSales {
        private final Product product;
        private final int quantitySold;
        public ProductSales(Product product, int quantitySold) {
            this.product = product;
            this.quantitySold = quantitySold;
        }
        public Product getProduct() { return product; }
        public int getQuantitySold() { return quantitySold; }
    }

    public static class DailySales {
        private final LocalDate date;
        private final BigDecimal totalSales;
        public DailySales(LocalDate date, BigDecimal totalSales) {
            this.date = date;
            this.totalSales = totalSales;
        }
        public LocalDate getDate() { return date; }
        public BigDecimal getTotalSales() { return totalSales; }
    }

    public static class DailyNetProfit {
        private final LocalDate date;
        private final BigDecimal netProfit;
        public DailyNetProfit(LocalDate date, BigDecimal netProfit) {
            this.date = date;
            this.netProfit = netProfit;
        }
        public LocalDate getDate() { return date; }
        public BigDecimal getNetProfit() { return netProfit; }
    }

    public static class CategorySales {
        private final String categoryName;
        private final BigDecimal totalSales;
        public CategorySales(String categoryName, BigDecimal totalSales) {
            this.categoryName = categoryName;
            this.totalSales = totalSales;
        }
        public String getCategoryName() { return categoryName; }
        public BigDecimal getTotalSales() { return totalSales; }
    }

    public static class SalesByProduct {
        private final LocalDate date;
        private final String productName;
        private final int unitsSold;
        public SalesByProduct(LocalDate date, String productName, int unitsSold) {
            this.date = date;
            this.productName = productName;
            this.unitsSold = unitsSold;
        }
        public LocalDate getDate() { return date; }
        public String getProductName() { return productName; }
        public int getUnitsSold() { return unitsSold; }
    }

    public static class SourceCount {
        private final String source;
        private final long count;
        public SourceCount(String source, long count) {
            this.source = source;
            this.count = count;
        }
        public String getSource() { return source; }
        public long getCount() { return count; }
    }
}