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
        if (customerOpt.isPresent()) {
            return customerOpt.get().getShoppingCart();
        }
        return null;
    }

    public List<CartProduct> getCartProducts(Long cartId) {
        Optional<ShoppingCart> cartOpt = shoppingCartRepo.findById(cartId);
        return cartOpt.map(ShoppingCart::getCartProducts).orElse(null);
    }

    @Transactional
    public CartProduct addProductToCart(Long customerId, Long productId, String sku, int quantity) {
        ShoppingCart cart = getCartByCustomerId(customerId);
        if (cart == null) return null;
        Product product = productRepo.findById(productId).orElse(null);
        if (product == null) return null;
        ProductVariants variant = productVariantsRepo.findAll().stream().filter(v -> v.getSku().equals(sku)).findFirst().orElse(null);
        if (variant == null || variant.getStock() < quantity) return null;
        // Check if product already in cart
        CartProduct existing = cart.getCartProducts().stream().filter(cp -> cp.getSku().equals(sku)).findFirst().orElse(null);
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
                total = total.add(variant.getPrice().multiply(BigDecimal.valueOf(cp.getQuantity())));
            }
        }
        cart.setTotalPrice(total);
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
            ProductVariantDTO variantDTO = (variant != null) ? mapVariantToDTO(variant) : null;
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

    private ProductDTO mapProductToDTO(Product product) {
        if (product == null) return null;
        List<ProductImageDTO> imageDTOs = new java.util.ArrayList<>();
        if (product.getImages() != null) {
            for (ProductImage img : product.getImages()) {
                imageDTOs.add(new ProductImageDTO(img.getAlt(), img.getImageUrl()));
            }
        }
        List<ProductVariantDTO> variantDTOs = new java.util.ArrayList<>();
        if (product.getVariants() != null) {
            for (ProductVariants v : product.getVariants()) {
                variantDTOs.add(mapVariantToDTO(v));
            }
        }
        return new ProductDTO(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getDiscountType(),
            product.getDiscountValue(),
            product.getMinCap(),
            product.getPercentageMax(),
            product.getMaxCap(),
            imageDTOs,
            variantDTOs
        );
    }

    private ProductVariantDTO mapVariantToDTO(ProductVariants variant) {
        if (variant == null) return null;
        return new ProductVariantDTO(
            variant.getId(),
            variant.getSku(),
            variant.getStock(),
            variant.getPrice(),
            variant.getProductionCost()
        );
    }
} 