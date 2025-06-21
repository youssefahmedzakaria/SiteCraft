package com.sitecraft.backend.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "productvariants")
public class ProductVariants {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String sku;
    private Integer stock;
    private BigDecimal price;
    private BigDecimal productionCost;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;
    
    // Constructors
    public ProductVariants() {}
    
    public ProductVariants(String sku, Integer stock, BigDecimal price, BigDecimal productionCost, Product product) {
        this.sku = sku;
        this.stock = stock;
        this.price = price;
        this.productionCost = productionCost;
        this.product = product;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public BigDecimal getProductionCost() { return productionCost; }
    public void setProductionCost(BigDecimal productionCost) { this.productionCost = productionCost; }
    
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}