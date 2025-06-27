package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.Models.CartProduct;
import com.sitecraft.backend.Models.ShoppingCart;
import com.sitecraft.backend.Services.CartService;
import com.sitecraft.backend.DTOs.CartProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<?> getCartSummary(HttpSession session) {
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(401).build();
        }
        ShoppingCart cart = cartService.getCartByCustomerId(customerId);
        if (cart == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(java.util.Map.of(
            "id", cart.getId(),
            "totalPrice", cart.getTotalPrice()
        ));
    }

    @GetMapping("/products")
    public ResponseEntity<List<CartProductDTO>> getCartProducts(HttpSession session) {
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(401).build();
        }
        ShoppingCart cart = cartService.getCartByCustomerId(customerId);
        if (cart == null) return ResponseEntity.notFound().build();
        List<CartProductDTO> dtos = cartService.getCartProductDTOs(cart.getId());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/add")
    public ResponseEntity<CartProductDTO> addProductToCart(HttpSession session, @RequestBody AddCartProductRequest req) {
        try {
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                System.err.println("Customer ID not found in session");
                return ResponseEntity.status(401).build();
            }
            
            CartProduct cp = cartService.addProductToCart(customerId, req.productId, req.sku, req.quantity);
            if (cp == null) {
                System.err.println("Failed to add product to cart - service returned null");
                return ResponseEntity.badRequest().build();
            }
            
            System.err.println("Product added successfully, creating DTO for cart product ID: " + cp.getId());
            
            // Create DTO directly from the cart product to avoid serialization issues
            CartProductDTO dto = cartService.createCartProductDTO(cp);
            if (dto == null) {
                System.err.println("Failed to create CartProductDTO - DTO creation returned null");
                return ResponseEntity.badRequest().build();
            }
            
            System.err.println("DTO created successfully, returning response");
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error in addProductToCart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/remove/{cartProductId}")
    public ResponseEntity<Void> removeProductFromCart(HttpSession session, @PathVariable Long cartProductId) {
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(401).build();
        }
        boolean removed = cartService.removeProductFromCart(customerId, cartProductId);
        if (!removed) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update")
    public ResponseEntity<Void> updateProductQuantity(HttpSession session, @RequestBody UpdateCartProductRequest req) {
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(401).build();
        }
        boolean updated = cartService.updateProductQuantity(customerId, req.cartProductId, req.quantity);
        if (!updated) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(HttpSession session) {
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(401).build();
        }
        cartService.clearCart(customerId);
        return ResponseEntity.ok().build();
    }

   
}

class UpdateCartProductRequest {
    public Long cartProductId;
    public int quantity;
}

class AddCartProductRequest {
    public Long productId;
    public String sku;
    public int quantity;
} 