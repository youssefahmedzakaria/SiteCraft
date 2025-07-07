package com.sitecraft.backend.DTOs;

import com.sitecraft.backend.Models.Product;
import com.sitecraft.backend.Models.ProductImage;
import com.sitecraft.backend.Models.ProductVariants;
import com.sitecraft.backend.Models.ProductAttribute;
import com.sitecraft.backend.Models.Review;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal minCap;
    private BigDecimal percentageMax;
    private BigDecimal maxCap;
    private List<ProductImage> images;
    private List<ProductVariants> variants;
    private List<ProductAttribute> attributes;
    private List<Review> reviews;
    private boolean lowStockNotificationEnabled;
    private int currentTotalStock;
    private boolean atLowStockLevel;
    private List<CategoryDTO> categories;

    public ProductDTO() {}

    public ProductDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.discountType = product.getDiscountType();
        this.discountValue = product.getDiscountValue();
        this.minCap = product.getMinCap();
        this.percentageMax = product.getPercentageMax();
        this.maxCap = product.getMaxCap();
        this.images = product.getImages();
        this.variants = product.getVariants();
        this.attributes = product.getAttributes();
        this.reviews = product.getReviews();
        this.lowStockNotificationEnabled = product.isLowStockNotificationEnabled();
        this.currentTotalStock = product.getCurrentTotalStock();
        this.atLowStockLevel = product.isAtLowStockLevel();
        this.categories = product.getCategories();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public BigDecimal getMinCap() {
        return minCap;
    }

    public void setMinCap(BigDecimal minCap) {
        this.minCap = minCap;
    }

    public BigDecimal getPercentageMax() {
        return percentageMax;
    }

    public void setPercentageMax(BigDecimal percentageMax) {
        this.percentageMax = percentageMax;
    }

    public BigDecimal getMaxCap() {
        return maxCap;
    }

    public void setMaxCap(BigDecimal maxCap) {
        this.maxCap = maxCap;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(List<ProductImage> images) {
        this.images = images;
    }

    public List<ProductVariants> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariants> variants) {
        this.variants = variants;
    }

    public List<ProductAttribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<ProductAttribute> attributes) {
        this.attributes = attributes;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public boolean isLowStockNotificationEnabled() {
        return lowStockNotificationEnabled;
    }

    public void setLowStockNotificationEnabled(boolean lowStockNotificationEnabled) {
        this.lowStockNotificationEnabled = lowStockNotificationEnabled;
    }

    public int getCurrentTotalStock() {
        return currentTotalStock;
    }

    public void setCurrentTotalStock(int currentTotalStock) {
        this.currentTotalStock = currentTotalStock;
    }

    public boolean isAtLowStockLevel() {
        return atLowStockLevel;
    }

    public void setAtLowStockLevel(boolean atLowStockLevel) {
        this.atLowStockLevel = atLowStockLevel;
    }

    public List<CategoryDTO> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryDTO> categories) {
        this.categories = categories;
    }
} 