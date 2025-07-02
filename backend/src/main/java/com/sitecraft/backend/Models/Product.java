package com.sitecraft.backend.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    @Column(name = "discount_type")
    private String discountType;
    @Column(name = "discount_value")
    private BigDecimal discountValue;
    @Column(name = "min_cap")
    private BigDecimal minCap;
    @Column(name = "percentage_max")
    private BigDecimal percentageMax;
    @Column(name = "max_cap")
    private BigDecimal maxCap;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    @JsonIgnore
    private Store store;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariants> variants;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductAttribute> attributes;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<CategoryProduct> categoryProducts;

    public Product() {}

    public Product(String name, String description, String discountType, BigDecimal discountValue,
                  BigDecimal minCap, BigDecimal percentageMax, BigDecimal maxCap, Store store) {
        this.name = name;
        this.description = description;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minCap = minCap;
        this.percentageMax = percentageMax;
        this.maxCap = maxCap;
        this.store = store;
    }

    // All existing getters and setters, plus new ones for relationships
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDiscountType() { return discountType; }
    public void setDiscountType(String discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getMinCap() { return minCap; }
    public void setMinCap(BigDecimal minCap) { this.minCap = minCap; }

    public BigDecimal getPercentageMax() { return percentageMax; }
    public void setPercentageMax(BigDecimal percentageMax) { this.percentageMax = percentageMax; }

    public BigDecimal getMaxCap() { return maxCap; }
    public void setMaxCap(BigDecimal maxCap) { this.maxCap = maxCap; }

    public Store getStore() { return store; }
    public void setStore(Store store) { this.store = store; }

    public List<ProductVariants> getVariants() { return variants; }
    public void setVariants(List<ProductVariants> variants) { this.variants = variants; }

    public List<ProductImage> getImages() { return images; }
    public void setImages(List<ProductImage> images) { this.images = images; }

    public List<ProductAttribute> getAttributes() { return attributes; }
    public void setAttributes(List<ProductAttribute> attributes) { this.attributes = attributes; }

    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }

    public List<CategoryProduct> getCategoryProducts() { return categoryProducts; }
    public void setCategoryProducts(List<CategoryProduct> categoryProducts) { this.categoryProducts = categoryProducts; }

    // Helper methods for category management
    public void addCategory(Category category) {
        CategoryProduct categoryProduct = new CategoryProduct();
        categoryProduct.setProduct(this);
        categoryProduct.setCategory(category);
        this.categoryProducts.add(categoryProduct);
    }

    public void removeCategory(Category category) {
        this.categoryProducts.removeIf(cp -> cp.getCategory().equals(category));
    }

    // Get categories as a list
    @JsonProperty("categories")
    public List<com.sitecraft.backend.DTOs.CategoryDTO> getCategories() {
        if (categoryProducts == null) return null;
        return categoryProducts.stream()
                .map(cp -> new com.sitecraft.backend.DTOs.CategoryDTO(cp.getCategory()))
                .collect(Collectors.toList());
    }

    // Get category IDs for JSON serialization
    @JsonProperty("categoryIds")
    public List<Long> getCategoryIds() {
        if (categoryProducts == null) return null;
        return categoryProducts.stream()
                .map(cp -> cp.getCategory().getId())
                .collect(Collectors.toList());
    }

    // Get category names for JSON serialization
    @JsonProperty("categoryNames")
    public List<String> getCategoryNames() {
        if (categoryProducts == null) return null;
        return categoryProducts.stream()
                .map(cp -> cp.getCategory().getName())
                .collect(Collectors.toList());
    }
    
    // Low stock notification helper methods
    /**
     * Check if low stock notification is enabled for this product
     */
    public boolean isLowStockNotificationEnabled() {
        return minCap != null && maxCap != null;
    }
    
    /**
     * Get the current total stock from all variants
     */
    public int getCurrentTotalStock() {
        if (variants == null) return 0;
        return variants.stream()
                .mapToInt(variant -> variant.getStock())
                .sum();
    }
    
    /**
     * Check if the product is currently at low stock level
     */
    public boolean isAtLowStockLevel() {
        if (!isLowStockNotificationEnabled()) return false;
        int currentStock = getCurrentTotalStock();
        return currentStock <= minCap.intValue();
    }
    
    /**
     * Calculate the total stock capacity from variants (for maxCap)
     */
    public BigDecimal calculateTotalStockCapacity() {
        if (variants == null) return BigDecimal.ZERO;
        int totalStock = variants.stream()
                .mapToInt(variant -> variant.getStock())
                .sum();
        return BigDecimal.valueOf(totalStock);
    }
}