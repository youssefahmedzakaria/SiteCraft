package com.sitecraft.backend.DTOs;

public class CartProductDTO implements java.io.Serializable {
    private Long cartProductId;
    private int quantity;
    private String sku;
    private ProductDTO product;
    private ProductVariantDTO variant;

    public CartProductDTO() {}

    public CartProductDTO(Long cartProductId, int quantity, String sku, ProductDTO product, ProductVariantDTO variant) {
        this.cartProductId = cartProductId;
        this.quantity = quantity;
        this.sku = sku;
        this.product = product;
        this.variant = variant;
    }

    public Long getCartProductId() { return cartProductId; }
    public void setCartProductId(Long cartProductId) { this.cartProductId = cartProductId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public ProductDTO getProduct() { return product; }
    public void setProduct(ProductDTO product) { this.product = product; }

    public ProductVariantDTO getVariant() { return variant; }
    public void setVariant(ProductVariantDTO variant) { this.variant = variant; }
} 