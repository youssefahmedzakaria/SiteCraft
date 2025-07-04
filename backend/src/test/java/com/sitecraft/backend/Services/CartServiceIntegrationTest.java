package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import com.sitecraft.backend.DTOs.CartProductDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class CartServiceIntegrationTest {

    @Autowired
    private CartService cartService;

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private ShoppingCartRepo shoppingCartRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private ProductVariantsRepo productVariantsRepo;

    @Autowired
    private CartProductRepo cartProductRepo;

    private Customer customer;
    private ShoppingCart cart;
    private Product product;
    private ProductVariants variant;

    @BeforeEach
    void setUp() {
        // Create customer
        customer = new Customer();
        customer.setEmail("integration@test.com");
        customer = customerRepo.save(customer);

        // Create cart
        cart = new ShoppingCart();
        cart.setCustomer(customer);
        cart.setTotalPrice(BigDecimal.ZERO);
        cart = shoppingCartRepo.save(cart);

        // Link customer to cart
        customer.setShoppingCart(cart);
        customerRepo.save(customer);

        // Create product
        product = new Product();
        product.setName("Integration Test Product");
        product.setDescription("Product for integration testing");
        product = productRepo.save(product);

        // Create variant
        variant = new ProductVariants();
        variant.setSku("INTEGRATION-SKU-001");
        variant.setStock(20);
        variant.setPrice(new BigDecimal("150.00"));
        variant.setProductionCost(new BigDecimal("75.00"));
        variant.setProduct(product);
        variant = productVariantsRepo.save(variant);
    }

    @Test
    void testCompleteCartWorkflow() {
        // Test 1: Add product to cart
        CartProduct addedProduct = cartService.addProductToCart(
            customer.getId(), product.getId(), variant.getSku(), 3
        );
        assertNotNull(addedProduct);
        assertEquals(3, addedProduct.getQuantity());
        assertEquals(variant.getSku(), addedProduct.getSku());

        // Test 2: Verify cart total is calculated
        ShoppingCart updatedCart = cartService.getCartByCustomerId(customer.getId());
        assertNotNull(updatedCart);
        assertEquals(new BigDecimal("450.00"), updatedCart.getTotalPrice().setScale(2)); // 3 * $150

        // Test 3: Add more of the same product
        CartProduct updatedProduct = cartService.addProductToCart(
            customer.getId(), product.getId(), variant.getSku(), 2
        );
        assertNotNull(updatedProduct);
        assertEquals(5, updatedProduct.getQuantity()); // 3 + 2

        // Test 4: Verify updated cart total
        updatedCart = cartService.getCartByCustomerId(customer.getId());
        assertEquals(new BigDecimal("750.00"), updatedCart.getTotalPrice().setScale(2)); // 5 * $150

        // Test 5: Update quantity
        boolean updateResult = cartService.updateProductQuantity(
            customer.getId(), addedProduct.getId(), 4
        );
        assertTrue(updateResult);

        // Test 6: Verify final cart total
        updatedCart = cartService.getCartByCustomerId(customer.getId());
        assertEquals(new BigDecimal("600.00"), updatedCart.getTotalPrice().setScale(2)); // 4 * $150

        // Test 7: Remove product
        boolean removeResult = cartService.removeProductFromCart(
            customer.getId(), addedProduct.getId()
        );
        assertTrue(removeResult);

        // Test 8: Verify empty cart
        updatedCart = cartService.getCartByCustomerId(customer.getId());
        assertEquals(BigDecimal.ZERO, updatedCart.getTotalPrice());
        assertTrue(updatedCart.getCartProducts().isEmpty());
    }

    @Test
    void testStockValidationWithMultipleProducts() {
        // Create second variant with limited stock
        ProductVariants variant2 = new ProductVariants();
        variant2.setSku("INTEGRATION-SKU-002");
        variant2.setStock(5);
        variant2.setPrice(new BigDecimal("100.00"));
        variant2.setProductionCost(new BigDecimal("50.00"));
        variant2.setProduct(product);
        ProductVariants savedVariant2 = productVariantsRepo.save(variant2);

        // Add first product (plenty of stock)
        CartProduct product1 = cartService.addProductToCart(
            customer.getId(), product.getId(), variant.getSku(), 10
        );
        assertNotNull(product1);

        // Add second product (limited stock)
        CartProduct product2 = cartService.addProductToCart(
            customer.getId(), product.getId(), savedVariant2.getSku(), 3
        );
        assertNotNull(product2);

        // Try to add more than available stock for second product
        CartProduct failedProduct = cartService.addProductToCart(
            customer.getId(), product.getId(), savedVariant2.getSku(), 5
        );
        assertNull(failedProduct); // Should fail due to stock limit

        // Verify cart still has original quantities
        ShoppingCart cart = cartService.getCartByCustomerId(customer.getId());
        assertEquals(2, cart.getCartProducts().size());
        
        CartProduct existingProduct2 = cart.getCartProducts().stream()
            .filter(cp -> cp.getSku().equals(savedVariant2.getSku()))
            .findFirst()
            .orElse(null);
        assertNotNull(existingProduct2);
        assertEquals(3, existingProduct2.getQuantity()); // Should still be 3, not 8
    }

    @Test
    void testDiscountCalculationIntegration() {
        // Set up product with discount
        product.setDiscountType("Percentage");
        product.setDiscountValue(new BigDecimal("20.00")); // 20% off
        product = productRepo.save(product);

        // Add product to cart
        CartProduct addedProduct = cartService.addProductToCart(
            customer.getId(), product.getId(), variant.getSku(), 2
        );
        assertNotNull(addedProduct);

        // Verify discounted total
        // Original price: $150, Discount: 20% = $30, Final price: $120
        // Quantity: 2, Total: $120 * 2 = $240
        ShoppingCart cart = cartService.getCartByCustomerId(customer.getId());
        assertEquals(new BigDecimal("240.00"), cart.getTotalPrice().setScale(2));

        // Test DTO mapping with discounts
        List<CartProductDTO> dtos = cartService.getCartProductDTOs(cart.getId());
        assertNotNull(dtos);
        assertEquals(1, dtos.size());
        
        CartProductDTO dto = dtos.get(0);
        assertNotNull(dto.getVariant());
        assertEquals(new BigDecimal("150.00"), dto.getVariant().getPrice()); // Original price
        assertEquals(new BigDecimal("120.00"), dto.getVariant().getDiscountedPrice().setScale(2)); // Discounted price
    }

    @Test
    void testCartClearing() {
        // Add multiple products
        cartService.addProductToCart(customer.getId(), product.getId(), variant.getSku(), 3);
        
        // Create and add second variant
        ProductVariants variant2 = new ProductVariants();
        variant2.setSku("INTEGRATION-SKU-002");
        variant2.setStock(10);
        variant2.setPrice(new BigDecimal("100.00"));
        variant2.setProductionCost(new BigDecimal("50.00"));
        variant2.setProduct(product);
        variant2 = productVariantsRepo.save(variant2);
        
        cartService.addProductToCart(customer.getId(), product.getId(), variant2.getSku(), 2);

        // Verify cart has products
        ShoppingCart cart = cartService.getCartByCustomerId(customer.getId());
        assertEquals(2, cart.getCartProducts().size());
        assertTrue(cart.getTotalPrice().compareTo(BigDecimal.ZERO) > 0);

        // Clear cart
        cartService.clearCart(customer.getId());

        // Verify cart is empty
        cart = cartService.getCartByCustomerId(customer.getId());
        assertEquals(0, cart.getCartProducts().size());
        assertEquals(BigDecimal.ZERO, cart.getTotalPrice());

        // Verify cart products are deleted from database
        List<CartProduct> remainingProducts = cartProductRepo.findAll();
        assertTrue(remainingProducts.isEmpty());
    }

    @Test
    void testEdgeCases() {
        // Test 1: Zero quantity
        CartProduct zeroProduct = cartService.addProductToCart(
            customer.getId(), product.getId(), variant.getSku(), 0
        );
        assertNull(zeroProduct);

        // Test 2: Negative quantity
        CartProduct negativeProduct = cartService.addProductToCart(
            customer.getId(), product.getId(), variant.getSku(), -1
        );
        assertNull(negativeProduct);

        // Test 3: Update to zero quantity (should remove product)
        CartProduct addedProduct = cartService.addProductToCart(
            customer.getId(), product.getId(), variant.getSku(), 3
        );
        assertNotNull(addedProduct);

        boolean updateResult = cartService.updateProductQuantity(
            customer.getId(), addedProduct.getId(), 0
        );
        assertTrue(updateResult);

        cart = cartService.getCartByCustomerId(customer.getId());
        assertTrue(cart.getCartProducts().isEmpty());

        // Test 4: Update to negative quantity (should remove product)
        addedProduct = cartService.addProductToCart(
            customer.getId(), product.getId(), variant.getSku(), 3
        );
        assertNotNull(addedProduct);

        updateResult = cartService.updateProductQuantity(
            customer.getId(), addedProduct.getId(), -1
        );
        assertTrue(updateResult);

        cart = cartService.getCartByCustomerId(customer.getId());
        assertTrue(cart.getCartProducts().isEmpty());
    }

    @Test
    void testConcurrentStockValidation() {
        // Add product to cart
        CartProduct addedProduct = cartService.addProductToCart(
            customer.getId(), product.getId(), variant.getSku(), 5
        );
        assertNotNull(addedProduct);

        // Try to update to quantity that exceeds stock
        boolean updateResult = cartService.updateProductQuantity(
            customer.getId(), addedProduct.getId(), 25 // Stock is 20
        );
        assertFalse(updateResult);

        // Verify quantity remains unchanged
        cart = cartService.getCartByCustomerId(customer.getId());
        CartProduct cartProduct = cart.getCartProducts().get(0);
        assertEquals(5, cartProduct.getQuantity()); // Should still be 5, not 25
    }
} 