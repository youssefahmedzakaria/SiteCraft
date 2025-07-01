package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class LowStockNotificationService {
    
    @Autowired
    private ProductRepo productRepo;
    
    @Autowired
    private ProductVariantsRepo productVariantsRepo;
    
    @Autowired
    private UserRoleRepo userRoleRepo;
    
    @Autowired
    private UserService userService;
    
    // Track last notification time for each product to prevent spam
    private final Map<Long, LocalDateTime> lastNotificationTime = new HashMap<>();
    
    // Minimum time between notifications for the same product (24 hours)
    private static final int NOTIFICATION_COOLDOWN_HOURS = 24;
    
    /**
     * Check if a product is at low stock level and send notification if needed
     */
    public void checkAndSendLowStockNotification(Product product) {
        // Only send notification if low stock notifications are enabled and product is at low stock level
        if (product.isLowStockNotificationEnabled() && product.isAtLowStockLevel()) {
            sendLowStockNotification(product);
        }
    }
    

    
    /**
     * Send low stock notification email to store owner
     */
    public void sendLowStockNotification(Product product) {
        try {
            // Check if we should send notification (prevent spam)
            if (!shouldSendNotification(product.getId())) {
                return;
            }
            
            // Find store owner
            List<UserRole> userRoles = userRoleRepo.findByRoleAndStoreId("owner", product.getStore().getId());
            if (userRoles.isEmpty()) {
                System.err.println("No store owner found for store: " + product.getStore().getId());
                return;
            }
            
            UserRole ownerRole = userRoles.get(0);
            String ownerEmail = ownerRole.getUser().getEmail();
            
            if (ownerEmail == null || ownerEmail.trim().isEmpty()) {
                System.err.println("Store owner email not found for store: " + product.getStore().getId());
                return;
            }
            
            // Prepare email content
            String subject = "Low Stock Alert - " + product.getName();
            String content = buildLowStockEmailContent(product);
            
            // Send email using existing UserService
            userService.sendLowStockNotificationEmail(ownerEmail, subject, content);
            
            // Update last notification time for this product
            lastNotificationTime.put(product.getId(), LocalDateTime.now());
            
        } catch (Exception e) {
            System.err.println("Error sending low stock notification for product " + product.getId() + ": " + e.getMessage());
        }
    }
    
    /**
     * Check if we should send a notification for this product
     * Prevents spam by enforcing a cooldown period
     */
    private boolean shouldSendNotification(Long productId) {
        LocalDateTime lastNotification = lastNotificationTime.get(productId);
        if (lastNotification == null) {
            // First time notification for this product
            return true;
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime cooldownEnd = lastNotification.plusHours(NOTIFICATION_COOLDOWN_HOURS);
        
        // Only send if cooldown period has passed
        return now.isAfter(cooldownEnd);
    }
    

    
    /**
     * Build email content for low stock notification
     */
    private String buildLowStockEmailContent(Product product) {
        int currentStock = product.getCurrentTotalStock();
        BigDecimal threshold = product.getMinCap();
        
        StringBuilder content = new StringBuilder();
        content.append("Dear Store Owner,\n\n");
        content.append("This is an automated notification that one of your products has reached its low stock threshold.\n\n");
        content.append("Product Details:\n");
        content.append("- Name: ").append(product.getName()).append("\n");
        content.append("- Description: ").append(product.getDescription()).append("\n");
        content.append("- Current Stock: ").append(currentStock).append(" units\n");
        content.append("- Low Stock Threshold: ").append(threshold).append(" units\n");
        
        if (product.getPercentageMax() != null) {
            content.append("- Threshold Type: Percentage-based (").append(product.getPercentageMax()).append("%)\n");
        } else {
            content.append("- Threshold Type: Number-based\n");
        }
        
        content.append("\nPlease consider restocking this product to maintain your inventory levels.\n\n");
        content.append("Note: You will not receive another notification for this product for the next ").append(NOTIFICATION_COOLDOWN_HOURS).append(" hours.\n\n");
        content.append("Best regards,\n");
        content.append("SiteCraft System");
        
        return content.toString();
    }
    
    /**
     * Get low stock statistics for a store
     */
    public Map<String, Object> getLowStockStatistics(Long storeId) {
        Map<String, Object> stats = new HashMap<>();
        
        List<Product> storeProducts = productRepo.findByStoreId(storeId);
        List<Product> lowStockProducts = storeProducts.stream()
                .filter(product -> product.isLowStockNotificationEnabled() && product.isAtLowStockLevel())
                .collect(Collectors.toList());
        
        stats.put("totalProducts", storeProducts.size());
        stats.put("lowStockProducts", lowStockProducts.size());
        stats.put("lowStockProductsList", lowStockProducts);
        
        return stats;
    }
} 