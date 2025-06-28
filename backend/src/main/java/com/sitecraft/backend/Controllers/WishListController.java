package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.DTOs.WishListProductDTO;
import com.sitecraft.backend.Models.WishList;
import com.sitecraft.backend.Models.WishListProduct;
import com.sitecraft.backend.Services.WishListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishListController {
    @Autowired
    private WishListService wishListService;

    @GetMapping
    public ResponseEntity<?> getWishListSummary(HttpSession session) {
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(401).build();
        }
        WishList wishList = wishListService.getWishListByCustomerId(customerId);
        if (wishList == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(java.util.Map.of(
            "id", wishList.getId(),
            "numberOfProducts", wishList.getNumberOfProducts()
        ));
    }

    @GetMapping("/products")
    public ResponseEntity<List<WishListProductDTO>> getWishListProducts(HttpSession session) {
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(401).build();
        }
        WishList wishList = wishListService.getWishListByCustomerId(customerId);
        if (wishList == null) return ResponseEntity.notFound().build();
        List<WishListProductDTO> dtos = wishListService.getWishListProductDTOs(wishList.getId());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/add")
    public ResponseEntity<WishListProductDTO> addProductToWishList(HttpSession session, @RequestBody AddWishListProductRequest req) {
        try {
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(401).build();
            }
            WishListProduct wp = wishListService.addProductToWishList(customerId, req.productId, req.sku);
            if (wp == null) {
                return ResponseEntity.badRequest().build();
            }
            WishListProductDTO dto = wishListService.createWishListProductDTO(wp);
            if (dto == null) {
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/remove/{wishListProductId}")
    public ResponseEntity<Void> removeProductFromWishList(HttpSession session, @PathVariable Long wishListProductId) {
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(401).build();
        }
        boolean removed = wishListService.removeProductFromWishList(customerId, wishListProductId);
        if (!removed) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearWishList(HttpSession session) {
        Long customerId = (Long) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(401).build();
        }
        wishListService.clearWishList(customerId);
        return ResponseEntity.ok().build();
    }
}

class AddWishListProductRequest {
    public Long productId;
    public String sku;
} 