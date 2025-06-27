package com.sitecraft.backend.DTOs;

import java.math.BigDecimal;
import java.util.List;

public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal minCap;
    private BigDecimal percentageMax;
    private BigDecimal maxCap;
    private List<ProductImageDTO> images;
    private List<ProductVariantDTO> variants;

    public ProductDTO() {}

    public ProductDTO(Long id, String name, String description, String discountType, BigDecimal discountValue, BigDecimal minCap, BigDecimal percentageMax, BigDecimal maxCap, List<ProductImageDTO> images, List<ProductVariantDTO> variants) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minCap = minCap;
        this.percentageMax = percentageMax;
        this.maxCap = maxCap;
        this.images = images;
        this.variants = variants;
    }

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
    public List<ProductImageDTO> getImages() { return images; }
    public void setImages(List<ProductImageDTO> images) { this.images = images; }
    public List<ProductVariantDTO> getVariants() { return variants; }
    public void setVariants(List<ProductVariantDTO> variants) { this.variants = variants; }
} 