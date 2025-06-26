package com.sitecraft.backend.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "wishlist")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class WishList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "number_of_products")
    private Integer numberOfProducts;

    @OneToOne(mappedBy = "wishList")
    @JsonIgnore
    private Customer customer;

    @OneToMany(mappedBy = "wishList", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<WishListProduct> wishListProducts;

    public WishList() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumberOfProducts() {
        return numberOfProducts;
    }

    public void setNumberOfProducts(Integer numberOfProducts) {
        this.numberOfProducts = numberOfProducts;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public List<WishListProduct> getWishListProducts() {
        return wishListProducts;
    }

    public void setWishListProducts(List<WishListProduct> wishListProducts) {
        this.wishListProducts = wishListProducts;
    }
} 