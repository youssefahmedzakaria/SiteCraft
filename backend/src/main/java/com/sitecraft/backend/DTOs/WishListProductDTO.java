package com.sitecraft.backend.DTOs;

import java.io.Serializable;

public class WishListProductDTO implements Serializable {
    private Long wishListProductId;
    private String sku;
    private ProductDTO product;

    public WishListProductDTO() {}

    public WishListProductDTO(Long wishListProductId, String sku, ProductDTO product) {
        this.wishListProductId = wishListProductId;
        this.sku = sku;
        this.product = product;
    }

    public Long getWishListProductId() { return wishListProductId; }
    public void setWishListProductId(Long wishListProductId) { this.wishListProductId = wishListProductId; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public ProductDTO getProduct() { return product; }
    public void setProduct(ProductDTO product) { this.product = product; }
} 