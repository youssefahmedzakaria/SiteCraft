package com.sitecraft.backend.DTOs;

import java.util.List;

public class ProductCreateDTO {
    private String name;
    private String description;
    private String discountType;
    private Double discountValue;
    private Double minCap;
    private Double percentageMax;
    private Double maxCap;
    private Long categoryId;
    
    // Low stock notification settings
    private String lowStockType; // "number" or "percentage"
    private Double lowStockThreshold; // the threshold value
    private Boolean lowStockEnabled; // whether notification is enabled
    private List<ProductAttributeDTO> attributes;
    private List<ProductVariantDTO> variants;
    private List<String> imageUrls;

    // Constructors
    public ProductCreateDTO() {}

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDiscountType() { return discountType; }
    public void setDiscountType(String discountType) { this.discountType = discountType; }

    public Double getDiscountValue() { return discountValue; }
    public void setDiscountValue(Double discountValue) { this.discountValue = discountValue; }

    public Double getMinCap() { return minCap; }
    public void setMinCap(Double minCap) { this.minCap = minCap; }

    public Double getPercentageMax() { return percentageMax; }
    public void setPercentageMax(Double percentageMax) { this.percentageMax = percentageMax; }

    public Double getMaxCap() { return maxCap; }
    public void setMaxCap(Double maxCap) { this.maxCap = maxCap; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public List<ProductAttributeDTO> getAttributes() { return attributes; }
    public void setAttributes(List<ProductAttributeDTO> attributes) { this.attributes = attributes; }

    public List<ProductVariantDTO> getVariants() { return variants; }
    public void setVariants(List<ProductVariantDTO> variants) { this.variants = variants; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    
    // Low stock notification getters and setters
    public String getLowStockType() { return lowStockType; }
    public void setLowStockType(String lowStockType) { this.lowStockType = lowStockType; }
    
    public Double getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(Double lowStockThreshold) { this.lowStockThreshold = lowStockThreshold; }
    
    public Boolean getLowStockEnabled() { return lowStockEnabled; }
    public void setLowStockEnabled(Boolean lowStockEnabled) { this.lowStockEnabled = lowStockEnabled; }
}