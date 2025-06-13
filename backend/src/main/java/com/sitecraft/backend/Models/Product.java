package com.sitecraft.backend.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String discountType;
    private Double discountValue;
    private Double minCap;
    private Double percentageMax;
    private Double maxCap;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnore
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    @JsonIgnore
    private Store store;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariants> variants;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductImage> images;

    // Constructors
    public Product() {}

    public Product(String name, String description, String discountType, Double discountValue,
                  Double minCap, Double percentageMax, Double maxCap, Category category, Store store) {
        this.name = name;
        this.description = description;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minCap = minCap;
        this.percentageMax = percentageMax;
        this.maxCap = maxCap;
        this.category = category;
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

    public Double getDiscountValue() { return discountValue; }
    public void setDiscountValue(Double discountValue) { this.discountValue = discountValue; }

    public Double getMinCap() { return minCap; }
    public void setMinCap(Double minCap) { this.minCap = minCap; }

    public Double getPercentageMax() { return percentageMax; }
    public void setPercentageMax(Double percentageMax) { this.percentageMax = percentageMax; }

    public Double getMaxCap() { return maxCap; }
    public void setMaxCap(Double maxCap) { this.maxCap = maxCap; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Store getStore() { return store; }
    public void setStore(Store store) { this.store = store; }

    public List<ProductVariants> getVariants() { return variants; }
    public void setVariants(List<ProductVariants> variants) { this.variants = variants; }

    public List<ProductImage> getImages() { return images; }
    public void setImages(List<ProductImage> images) { this.images = images; }
}