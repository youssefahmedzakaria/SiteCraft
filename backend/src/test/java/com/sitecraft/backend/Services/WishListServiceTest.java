package com.sitecraft.backend.Services;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import java.util.Optional;
import java.util.Collections;
import java.util.List;

public class WishListServiceTest {
    @Mock private WishListRepo wishListRepo;
    @Mock private WishListProductRepo wishListProductRepo;
    @Mock private ProductRepo productRepo;
    @Mock private CustomerRepo customerRepo;

    @InjectMocks
    private WishListService wishListService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetWishListByCustomerId_CustomerExists() {
        Customer customer = new Customer();
        WishList wishList = new WishList();
        customer.setWishList(wishList);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        WishList result = wishListService.getWishListByCustomerId(1L);
        assertEquals(wishList, result);
    }

    @Test
    void testGetWishListByCustomerId_CustomerNotFound() {
        when(customerRepo.findById(1L)).thenReturn(Optional.empty());
        WishList result = wishListService.getWishListByCustomerId(1L);
        assertNull(result);
    }

    @Test
    void testAddProductToWishList_Success() {
        WishList wishList = new WishList();
        wishList.setWishListProducts(new java.util.ArrayList<>());
        Customer customer = new Customer();
        customer.setWishList(wishList);
        Product product = new Product();
        product.setId(2L);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepo.findById(2L)).thenReturn(Optional.of(product));
        when(wishListProductRepo.save(any(WishListProduct.class))).thenAnswer(i -> i.getArgument(0));
        when(wishListRepo.save(any(WishList.class))).thenReturn(wishList);
        WishListProduct result = wishListService.addProductToWishList(1L, 2L, "sku1");
        assertNotNull(result);
        assertEquals("sku1", result.getSku());
        assertEquals(product, result.getProduct());
        assertEquals(wishList, result.getWishList());
    }

    @Test
    void testAddProductToWishList_WishListNotFound() {
        when(customerRepo.findById(1L)).thenReturn(Optional.empty());
        WishListProduct result = wishListService.addProductToWishList(1L, 2L, "sku1");
        assertNull(result);
    }

    @Test
    void testAddProductToWishList_ProductNotFound() {
        WishList wishList = new WishList();
        wishList.setWishListProducts(new java.util.ArrayList<>());
        Customer customer = new Customer();
        customer.setWishList(wishList);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepo.findById(2L)).thenReturn(Optional.empty());
        WishListProduct result = wishListService.addProductToWishList(1L, 2L, "sku1");
        assertNull(result);
    }

    @Test
    void testAddProductToWishList_AlreadyInWishList() {
        WishList wishList = new WishList();
        WishListProduct existing = new WishListProduct();
        existing.setSku("sku1");
        wishList.setWishListProducts(new java.util.ArrayList<>(Collections.singletonList(existing)));
        Customer customer = new Customer();
        customer.setWishList(wishList);
        Product product = new Product();
        product.setId(2L);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepo.findById(2L)).thenReturn(Optional.of(product));
        WishListProduct result = wishListService.addProductToWishList(1L, 2L, "sku1");
        assertEquals(existing, result);
    }

    // TODO: Implement tests for getWishListProducts, removeProductFromWishList, clearWishList, getWishListProductDTOs, createWishListProductDTO, and other edge cases
} 