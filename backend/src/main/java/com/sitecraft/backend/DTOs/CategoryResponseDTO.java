package com.sitecraft.backend.DTOs;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sitecraft.backend.Models.Category;

public class CategoryResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String image;
    
    @JsonProperty("productCount")
    private Long productCount;
    
    @JsonProperty("createdAt")
    private String createdAt;

    public CategoryResponseDTO() {}

    public CategoryResponseDTO(Long id, String name, String description, String image, Long productCount, String createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.productCount = productCount;
        this.createdAt = createdAt;
    }

    public CategoryResponseDTO(Category category, Long productCount) {
        this.id = category.getId();
        this.name = category.getName();
        this.description = category.getDescription();
        this.image = category.getImage();
        this.productCount = productCount;
        this.createdAt = "2024-01-01"; // Default value since Category doesn't have createdAt
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Long getProductCount() {
        return productCount;
    }

    public void setProductCount(Long productCount) {
        this.productCount = productCount;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
} 