package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.Models.CartProduct;
import com.sitecraft.backend.Models.ShoppingCart;
import com.sitecraft.backend.Services.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping("/{customerId}")
    public ResponseEntity<ShoppingCart> getCart(@PathVariable Long customerId) {
        ShoppingCart cart = cartService.getCartByCustomerId(customerId);
        if (cart == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/{customerId}/products")
    public ResponseEntity<List<CartProduct>> getCartProducts(@PathVariable Long customerId) {
        ShoppingCart cart = cartService.getCartByCustomerId(customerId);
        if (cart == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(cart.getCartProducts());
    }

    @PostMapping("/{customerId}/add")
    public ResponseEntity<CartProduct> addProductToCart(@PathVariable Long customerId, @RequestParam Long productId, @RequestParam String sku, @RequestParam int quantity) {
        CartProduct cp = cartService.addProductToCart(customerId, productId, sku, quantity);
        if (cp == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(cp);
    }

    @DeleteMapping("/{customerId}/remove/{cartProductId}")
    public ResponseEntity<Void> removeProductFromCart(@PathVariable Long customerId, @PathVariable Long cartProductId) {
        boolean removed = cartService.removeProductFromCart(customerId, cartProductId);
        if (!removed) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{customerId}/update/{cartProductId}")
    public ResponseEntity<Void> updateProductQuantity(@PathVariable Long customerId, @PathVariable Long cartProductId, @RequestParam int quantity) {
        boolean updated = cartService.updateProductQuantity(customerId, cartProductId, quantity);
        if (!updated) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{customerId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long customerId) {
        cartService.clearCart(customerId);
        return ResponseEntity.ok().build();
    }
} 