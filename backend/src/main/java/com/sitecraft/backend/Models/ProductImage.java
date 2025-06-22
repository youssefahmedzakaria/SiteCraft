package com.sitecraft.backend.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "productimage")
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String alt;
    private String imageUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;
    
    // Constructors
    public ProductImage() {}
    
    public ProductImage(String alt, String imageUrl, Product product) {
        this.alt = alt;
        this.imageUrl = imageUrl;
        this.product = product;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getAlt() { return alt; }
    public void setAlt(String alt) { this.alt = alt; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}