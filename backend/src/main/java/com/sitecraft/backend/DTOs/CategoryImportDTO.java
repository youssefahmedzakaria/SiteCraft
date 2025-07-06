package com.sitecraft.backend.DTOs;

public class CategoryImportDTO {
    private String name;
    private String description;

    public CategoryImportDTO() {}

    public CategoryImportDTO(String name, String description) {
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
        return "CategoryImportDTO{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
} 