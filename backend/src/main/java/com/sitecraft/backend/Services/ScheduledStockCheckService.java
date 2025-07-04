package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.Product;
import com.sitecraft.backend.Models.ProductVariants;
import com.sitecraft.backend.Repositories.ProductRepository;
import com.sitecraft.backend.Repositories.ProductVariantsRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ScheduledStockCheckService {
    
    private static final Logger logger = LoggerFactory.getLogger(ScheduledStockCheckService.class);
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ProductVariantsRepo productVariantsRepo;
    
    @Autowired
    private LowStockNotificationService lowStockNotificationService;
    
    /**
     * Scheduled task that runs every 5 minutes to check stock levels
     * and trigger low stock notifications if needed
     */
    @Scheduled(fixedRate = 300000) // Run every 5 minutes (300000 ms = 5 minutes)
    public void checkStockLevels() {
        logger.info("🔄 Starting scheduled stock level check...");
        
        try {
            // Get all products with low stock notifications enabled
            List<Product> allProducts = productRepository.findAll();
            List<Product> productsWithNotifications = allProducts.stream()
                    .filter(p -> p.getMinCap() != null && p.getMaxCap() != null)
                    .toList();
            
            logger.info("📊 Found {} products with low stock notifications enabled", productsWithNotifications.size());
            
            for (Product product : productsWithNotifications) {
                checkProductStockLevel(product);
            }
            
            logger.info("✅ Scheduled stock level check completed successfully");
            
        } catch (Exception e) {
            logger.error("❌ Error during scheduled stock level check: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Check stock level for a specific product and trigger notification if needed
     */
    private void checkProductStockLevel(Product product) {
        try {
            // Get all variants for this product
            List<ProductVariants> variants = productVariantsRepo.findByProductId(product.getId());
            
            if (variants.isEmpty()) {
                logger.debug("⚠️ Product {} has no variants, skipping stock check", product.getId());
                return;
            }
            
            // Calculate total current stock
            int totalCurrentStock = variants.stream()
                    .mapToInt(variant -> variant.getStock() != null ? variant.getStock() : 0)
                    .sum();
            
            // Calculate total max capacity (maxCap)
            int totalMaxCapacity = product.getMaxCap() != null ? product.getMaxCap().intValue() : 0;
            
            if (totalMaxCapacity <= 0) {
                logger.warn("⚠️ Product {} has invalid max capacity: {}", product.getId(), totalMaxCapacity);
                return;
            }
            
            // Check if stock is below minimum threshold
            boolean isLowStock = false;
            String notificationType = "";
            int threshold = 0;
            
            if (product.getPercentageMax() != null) {
                // Percentage-based notification
                double currentPercentage = (double) totalCurrentStock / totalMaxCapacity * 100;
                threshold = product.getPercentageMax().intValue();
                isLowStock = currentPercentage <= threshold;
                notificationType = "percentage";
                
                logger.debug("📊 Product {}: Current stock: {}, Max capacity: {}, Current percentage: {:.1f}%, Threshold: {}%", 
                    product.getId(), totalCurrentStock, totalMaxCapacity, currentPercentage, threshold);
                
            } else if (product.getMinCap() != null) {
                // Number-based notification
                threshold = product.getMinCap().intValue();
                isLowStock = totalCurrentStock <= threshold;
                notificationType = "number";
                
                logger.debug("📊 Product {}: Current stock: {}, Threshold: {}", 
                    product.getId(), totalCurrentStock, threshold);
            }
            
            if (isLowStock) {
                logger.info("🚨 Low stock detected for product {}: Current stock: {}, Threshold: {} ({})", 
                    product.getId(), totalCurrentStock, threshold, notificationType);
                
                // Trigger low stock notification with proper checking
                lowStockNotificationService.checkAndSendLowStockNotification(product);
            }
            
        } catch (Exception e) {
            logger.error("❌ Error checking stock level for product {}: {}", product.getId(), e.getMessage(), e);
        }
    }
    
    /**
     * Manual trigger for stock level check (can be called via API)
     */
    public void manualStockCheck() {
        logger.info("🔧 Manual stock level check triggered");
        checkStockLevels();
    }
    
    /**
     * Check stock level for a specific product (can be called via API)
     */
    public void checkSpecificProductStock(Long productId) {
        logger.info("🔧 Manual stock level check triggered for product: {}", productId);
        
        try {
            Product product = productRepository.findById(productId).orElse(null);
            if (product != null && product.getMinCap() != null && product.getMaxCap() != null) {
                checkProductStockLevel(product);
            } else {
                logger.warn("⚠️ Product {} not found or doesn't have low stock notifications enabled", productId);
            }
        } catch (Exception e) {
            logger.error("❌ Error checking stock level for product {}: {}", productId, e.getMessage(), e);
        }
    }
} 