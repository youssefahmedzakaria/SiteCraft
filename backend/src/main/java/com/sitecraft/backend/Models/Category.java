package com.sitecraft.backend.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private String image;

    @ManyToOne
    @JoinColumn(name = "store_id")
    @JsonIgnore
    private Store store;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<CategoryProduct> categoryProducts;

    // Constructors
    public Category() {}

    public Category(String name, String description, String image, Store store) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.store = store;
    }

    // Getters and setters
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

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public List<CategoryProduct> getCategoryProducts() {
        return categoryProducts;
    }

    public void setCategoryProducts(List<CategoryProduct> categoryProducts) {
        this.categoryProducts = categoryProducts;
    }

    // Get products as a list
    @JsonIgnore
    public List<Product> getProducts() {
        if (categoryProducts == null) return null;
        return categoryProducts.stream()
                .map(CategoryProduct::getProduct)
                .collect(Collectors.toList());
    }

    // Helper methods for product management
    public void addProduct(Product product) {
        CategoryProduct categoryProduct = new CategoryProduct();
        categoryProduct.setCategory(this);
        categoryProduct.setProduct(product);
        this.categoryProducts.add(categoryProduct);
    }

    public void removeProduct(Product product) {
        this.categoryProducts.removeIf(cp -> cp.getProduct().equals(product));
    }
}
