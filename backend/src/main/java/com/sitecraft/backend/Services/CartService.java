package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import com.sitecraft.backend.DTOs.CartProductDTO;
import com.sitecraft.backend.DTOs.ProductDTO;
import com.sitecraft.backend.DTOs.ProductImageDTO;
import com.sitecraft.backend.DTOs.ProductVariantDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    private ShoppingCartRepo shoppingCartRepo;
    @Autowired
    private CartProductRepo cartProductRepo;
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private ProductVariantsRepo productVariantsRepo;
    @Autowired
    private CustomerRepo customerRepo;

    public ShoppingCart getCartByCustomerId(Long customerId) {
        Optional<Customer> customerOpt = customerRepo.findById(customerId);
        return customerOpt.map(Customer::getShoppingCart).orElse(null);
    }

    public List<CartProduct> getCartProducts(Long cartId) {
        Optional<ShoppingCart> cartOpt = shoppingCartRepo.findById(cartId);
        return cartOpt.map(ShoppingCart::getCartProducts).orElse(null);
    }

    @Transactional
    public CartProduct addProductToCart(Long customerId, Long productId, String sku, int quantity) {
        // Validate quantity
        if (quantity <= 0) return null;
        
        ShoppingCart cart = getCartByCustomerId(customerId);
        if (cart == null) return null;
        Product product = productRepo.findById(productId).orElse(null);
        if (product == null) return null;
        ProductVariants variant = productVariantsRepo.findAll().stream().filter(v -> v.getSku().equals(sku)).findFirst().orElse(null);
        if (variant == null) return null;
        
        // Check if product already in cart
        CartProduct existing = cart.getCartProducts().stream().filter(cp -> cp.getSku().equals(sku)).findFirst().orElse(null);
        
        // Calculate total quantity (existing + new)
        int totalQuantity = quantity;
        if (existing != null) {
            totalQuantity += existing.getQuantity();
        }
        
        // Check if total quantity doesn't exceed available stock
        if (variant.getStock() < totalQuantity) return null;
        
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
            cartProductRepo.save(existing);
        } else {
            CartProduct cp = new CartProduct();
            cp.setSku(sku);
            cp.setQuantity(quantity);
            cp.setShoppingCart(cart);
            cp.setProduct(product);
            cart.getCartProducts().add(cp);
            cartProductRepo.save(cp);
        }
        recalculateCartTotal(cart);
        shoppingCartRepo.save(cart);
        return cart.getCartProducts().stream().filter(cp -> cp.getSku().equals(sku)).findFirst().orElse(null);
    }

    @Transactional
    public boolean removeProductFromCart(Long customerId, Long cartProductId) {
        ShoppingCart cart = getCartByCustomerId(customerId);
        if (cart == null) return false;
        CartProduct cp = cartProductRepo.findById(cartProductId).orElse(null);
        if (cp == null || !cart.getCartProducts().contains(cp)) return false;
        cart.getCartProducts().remove(cp);
        cartProductRepo.delete(cp);
        recalculateCartTotal(cart);
        shoppingCartRepo.save(cart);
        return true;
    }

    @Transactional
    public boolean updateProductQuantity(Long customerId, Long cartProductId, int newQuantity) {
        ShoppingCart cart = getCartByCustomerId(customerId);
        if (cart == null) return false;
        CartProduct cp = cartProductRepo.findById(cartProductId).orElse(null);
        if (cp == null || !cart.getCartProducts().contains(cp)) return false;
        
        if (newQuantity <= 0) {
            cart.getCartProducts().remove(cp);
            cartProductRepo.delete(cp);
        } else {
            // Check if new quantity doesn't exceed available stock
            ProductVariants variant = productVariantsRepo.findAll().stream()
                .filter(v -> v.getSku().equals(cp.getSku()))
                .findFirst().orElse(null);
            if (variant == null || variant.getStock() < newQuantity) return false;
            
            cp.setQuantity(newQuantity);
            cartProductRepo.save(cp);
        }
        recalculateCartTotal(cart);
        shoppingCartRepo.save(cart);
        return true;
    }

    @Transactional
    public void clearCart(Long customerId) {
        ShoppingCart cart = getCartByCustomerId(customerId);
        if (cart == null) return;
        for (CartProduct cp : cart.getCartProducts()) {
            cartProductRepo.delete(cp);
        }
        cart.getCartProducts().clear();
        recalculateCartTotal(cart);
        shoppingCartRepo.save(cart);
    }

    private void recalculateCartTotal(ShoppingCart cart) {
        BigDecimal total = BigDecimal.ZERO;
        for (CartProduct cp : cart.getCartProducts()) {
            ProductVariants variant = productVariantsRepo.findAll().stream().filter(v -> v.getSku().equals(cp.getSku())).findFirst().orElse(null);
            if (variant != null) {
                // Calculate discounted price for this product
                BigDecimal discountedPrice = calculateDiscountedPrice(cp.getProduct(), variant.getPrice());
                total = total.add(discountedPrice.multiply(BigDecimal.valueOf(cp.getQuantity())));
            }
        }
        cart.setTotalPrice(total);
    }

    /**
     * Calculate the discounted price for a product based on its discount settings
     */
    public BigDecimal calculateDiscountedPrice(Product product, BigDecimal originalPrice) {
        if (originalPrice == null) {
            System.err.println("Warning: originalPrice is null in calculateDiscountedPrice for product: " + (product != null ? product.getId() : "null"));
            return BigDecimal.ZERO;
        }
        if (product == null || product.getDiscountType() == null || product.getDiscountValue() == null) {
            return originalPrice; // No discount applied
        }

        String discountType = product.getDiscountType().toLowerCase();
        BigDecimal discountValue = product.getDiscountValue();

        BigDecimal discountedPrice = originalPrice;

        switch (discountType) {
            case "percentage":
                // Calculate percentage discount
                BigDecimal percentageDiscount = originalPrice.multiply(discountValue).divide(BigDecimal.valueOf(100));
                discountedPrice = originalPrice.subtract(percentageDiscount);
                break;

            case "amount":
            case "fixed":
                // Calculate fixed amount discount
                discountedPrice = originalPrice.subtract(discountValue);
                break;

            default:
                // Unknown discount type, return original price
                return originalPrice;
        }

        // Ensure price doesn't go below zero
        if (discountedPrice.compareTo(BigDecimal.ZERO) < 0) {
            discountedPrice = BigDecimal.ZERO;
        }

        return discountedPrice;
    }

    public List<CartProductDTO> getCartProductDTOs(Long cartId) {
        List<CartProduct> cartProducts = getCartProducts(cartId);
        if (cartProducts == null) return null;
        List<CartProductDTO> dtos = new java.util.ArrayList<>();
        for (CartProduct cp : cartProducts) {
            Product product = cp.getProduct();
            ProductDTO productDTO = mapProductToDTO(product);
            ProductVariants variant = productVariantsRepo.findAll().stream()
                .filter(v -> v.getSku().equals(cp.getSku()))
                .findFirst().orElse(null);
            ProductVariantDTO variantDTO = (variant != null) ? mapVariantToDTO(variant, product) : null;
            dtos.add(new CartProductDTO(
                cp.getId(),
                cp.getQuantity(),
                cp.getSku(),
                productDTO,
                variantDTO
            ));
        }
        return dtos;
    }

    public CartProductDTO createCartProductDTO(CartProduct cp) {
        if (cp == null) return null;
        
        try {
            // Get the product with proper error handling
            Product product = cp.getProduct();
            if (product == null) {
                System.err.println("CartProduct has null product");
                return null;
            }
            
            // Create a simplified ProductDTO to avoid lazy loading issues
            ProductDTO productDTO = createSimplifiedProductDTO(product);
            
            // Find the variant
            ProductVariants variant = productVariantsRepo.findAll().stream()
                .filter(v -> v.getSku().equals(cp.getSku()))
                .findFirst().orElse(null);
                
            ProductVariantDTO variantDTO = null;
            if (variant != null) {
                variantDTO = createSimplifiedVariantDTO(variant, product);
            }
            
            return new CartProductDTO(
                cp.getId(),
                cp.getQuantity(),
                cp.getSku(),
                productDTO,
                variantDTO
            );
        } catch (Exception e) {
            System.err.println("Error creating CartProductDTO: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private ProductDTO createSimplifiedProductDTO(Product product) {
        try {
            // Use the new ProductDTO constructor that takes a Product object
            return new ProductDTO(product);
        } catch (Exception e) {
            System.err.println("Error creating simplified ProductDTO: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private ProductVariantDTO createSimplifiedVariantDTO(ProductVariants variant, Product product) {
        try {
            // Calculate discounted price
            BigDecimal discountedPrice = calculateDiscountedPrice(product, variant.getPrice());
            
            return new ProductVariantDTO(
                variant.getId(),
                variant.getSku(),
                variant.getStock(),
                variant.getPrice(),
                discountedPrice,
                variant.getProductionCost()
            );
        } catch (Exception e) {
            System.err.println("Error creating simplified ProductVariantDTO: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private ProductDTO mapProductToDTO(Product product) {
        if (product == null) return null;
        // Use the new ProductDTO constructor that takes a Product object
        return new ProductDTO(product);
    }

    private ProductVariantDTO mapVariantToDTO(ProductVariants variant, Product product) {
        if (variant == null) return null;
        
        // Calculate discounted price
        BigDecimal discountedPrice = calculateDiscountedPrice(product, variant.getPrice());
        
        return new ProductVariantDTO(
            variant.getId(),
            variant.getSku(),
            variant.getStock(),
            variant.getPrice(),
            discountedPrice,
            variant.getProductionCost()
        );
    }
} 