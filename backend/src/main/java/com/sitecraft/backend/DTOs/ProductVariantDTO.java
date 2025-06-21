package com.sitecraft.backend.DTOs;

import java.math.BigDecimal;
import java.util.List;

public class ProductVariantDTO {
    private String sku;
    private Integer stock;
    private BigDecimal price;
    private BigDecimal productionCost;
    private List<VariantAttributeDTO> attributes;

    // Constructors
    public ProductVariantDTO() {}

    // Getters and setters
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getProductionCost() { return productionCost; }
    public void setProductionCost(BigDecimal productionCost) { this.productionCost = productionCost; }

    public List<VariantAttributeDTO> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<VariantAttributeDTO> attributes) {
        this.attributes = attributes;
    }
}