package com.sitecraft.backend.DTOs;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class CategoryExportDTO {
    private String name;
    private String description;
    private Long productCount;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    public CategoryExportDTO() {}

    public CategoryExportDTO(String name, String description, Long productCount, LocalDateTime createdAt) {
        this.name = name;
        this.description = description;
        this.productCount = productCount;
        this.createdAt = createdAt;
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

    public Long getProductCount() {
        return productCount;
    }

    public void setProductCount(Long productCount) {
        this.productCount = productCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "CategoryExportDTO{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", productCount=" + productCount +
                ", createdAt=" + createdAt +
                '}';
    }
} 