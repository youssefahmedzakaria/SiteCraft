package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import com.sitecraft.backend.DTOs.WishListProductDTO;
import com.sitecraft.backend.DTOs.ProductDTO;
import com.sitecraft.backend.DTOs.ProductImageDTO;
import com.sitecraft.backend.DTOs.ProductVariantDTO;
import com.sitecraft.backend.DTOs.VariantInfoDTO;
import com.sitecraft.backend.DTOs.VariantAttributeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class WishListService {
    @Autowired
    private WishListRepo wishListRepo;
    @Autowired
    private WishListProductRepo wishListProductRepo;
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private CustomerRepo customerRepo;

    public WishList getWishListByCustomerId(Long customerId) {
        Optional<Customer> customerOpt = customerRepo.findById(customerId);
        return customerOpt.map(Customer::getWishList).orElse(null);
    }

    public List<WishListProduct> getWishListProducts(Long wishListId) {
        Optional<WishList> wishListOpt = wishListRepo.findById(wishListId);
        return wishListOpt.map(WishList::getWishListProducts).orElse(null);
    }

    @Transactional
    public WishListProduct addProductToWishList(Long customerId, Long productId, String sku) {
        WishList wishList = getWishListByCustomerId(customerId);
        if (wishList == null) return null;
        Product product = productRepo.findById(productId).orElse(null);
        if (product == null) return null;
        // Check if product already in wishlist
        WishListProduct existing = wishList.getWishListProducts().stream().filter(wp -> wp.getSku().equals(sku)).findFirst().orElse(null);
        if (existing != null) return existing;
        WishListProduct wp = new WishListProduct();
        wp.setSku(sku);
        wp.setWishList(wishList);
        wp.setProduct(product);
        wishList.getWishListProducts().add(wp);
        wishListProductRepo.save(wp);
        wishList.setNumberOfProducts(wishList.getWishListProducts().size());
        wishListRepo.save(wishList);
        return wp;
    }

    @Transactional
    public boolean removeProductFromWishList(Long customerId, Long wishListProductId) {
        WishList wishList = getWishListByCustomerId(customerId);
        if (wishList == null) return false;
        WishListProduct wp = wishListProductRepo.findById(wishListProductId).orElse(null);
        if (wp == null || !wishList.getWishListProducts().contains(wp)) return false;
        wishList.getWishListProducts().remove(wp);
        wishListProductRepo.delete(wp);
        wishList.setNumberOfProducts(wishList.getWishListProducts().size());
        wishListRepo.save(wishList);
        return true;
    }

    @Transactional
    public void clearWishList(Long customerId) {
        WishList wishList = getWishListByCustomerId(customerId);
        if (wishList == null) return;
        for (WishListProduct wp : wishList.getWishListProducts()) {
            wishListProductRepo.delete(wp);
        }
        wishList.getWishListProducts().clear();
        wishList.setNumberOfProducts(0);
        wishListRepo.save(wishList);
    }

    public List<WishListProductDTO> getWishListProductDTOs(Long wishListId) {
        List<WishListProduct> products = getWishListProducts(wishListId);
        if (products == null) return null;
        return products.stream().map(this::createWishListProductDTO).collect(Collectors.toList());
    }

    public WishListProductDTO createWishListProductDTO(WishListProduct wp) {
        ProductDTO productDTO = mapProductToDTO(wp.getProduct());
        WishListProductDTO dto = new WishListProductDTO(wp.getId(), wp.getSku(), productDTO);
        
        // Extract variant information from SKU
        VariantInfoDTO variantInfo = extractVariantInfoFromSku(wp.getSku(), wp.getProduct());
        dto.setVariantInfo(variantInfo);
        
        return dto;
    }

    private VariantInfoDTO extractVariantInfoFromSku(String sku, Product product) {
        try {
            // SKU format: storeId|productId|attributename-attributevalue|...
            String[] parts = sku.split("\\|");
            if (parts.length < 3) {
                return null;
            }
            
            List<VariantAttributeDTO> attributes = new ArrayList<>();
            
            // Parse variant attributes (parts 2 onwards)
            for (int i = 2; i < parts.length; i++) {
                String[] attrParts = parts[i].split("-", 2);
                if (attrParts.length == 2) {
                    String attrName = attrParts[0];
                    String attrValue = attrParts[1];
                    attributes.add(new VariantAttributeDTO(attrName, attrValue));
                }
            }
            
            return new VariantInfoDTO(attributes);
        } catch (Exception e) {
            // If SKU parsing fails, return null
            return null;
        }
    }

    private ProductDTO mapProductToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setDiscountType(product.getDiscountType());
        dto.setDiscountValue(product.getDiscountValue());
        dto.setStoreId(product.getStore().getId());
        
        // Map images
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            dto.setImages(product.getImages().stream()
                .map(img -> {
                    ProductImageDTO imgDto = new ProductImageDTO();
                    imgDto.setId(img.getId());
                    imgDto.setImageUrl(img.getImageUrl());
                    return imgDto;
                })
                .collect(Collectors.toList()));
        }
        
        // Map variants if available
        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            dto.setVariants(product.getVariants().stream()
                .map(variant -> {
                    ProductVariantDTO variantDto = new ProductVariantDTO();
                    variantDto.setId(variant.getId());
                    variantDto.setPrice(variant.getPrice());
                    variantDto.setStock(variant.getStock());
                    return variantDto;
                })
                .collect(Collectors.toList()));
        }
        
        return dto;
    }
} 