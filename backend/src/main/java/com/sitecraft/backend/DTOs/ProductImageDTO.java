package com.sitecraft.backend.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProductImageDTO {
    private String alt;
    private String imageUrl;

    public ProductImageDTO() {}
    public ProductImageDTO(String alt, String imageUrl) {
        this.alt = alt;
        this.imageUrl = imageUrl;
    }
    public String getAlt() { return alt; }
    public void setAlt(String alt) { this.alt = alt; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
} 