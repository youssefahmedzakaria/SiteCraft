package com.sitecraft.backend.DTOs;

public class ProductImportDTO {
    private String name;
    private String description;

    public ProductImportDTO() {}

    public ProductImportDTO(String name, String description) {
        this.name = name;
        this.description = description;
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

    @Override
    public String toString() {
        return "ProductImportDTO{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
} 