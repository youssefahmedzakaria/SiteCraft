package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import com.sitecraft.backend.DTOs.CartProductDTO;
import com.sitecraft.backend.DTOs.ProductVariantDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CartServiceTest {

    @Mock
    private ShoppingCartRepo shoppingCartRepo;

    @Mock
    private CartProductRepo cartProductRepo;

    @Mock
    private ProductRepo productRepo;

    @Mock
    private ProductVariantsRepo productVariantsRepo;

    @Mock
    private CustomerRepo customerRepo;

    @InjectMocks
    private CartService cartService;

    private Customer customer;
    private ShoppingCart cart;
    private Product product;
    private ProductVariants variant;
    private CartProduct cartProduct;

    @BeforeEach
    void setUp() {
        // Setup customer
        customer = new Customer();
        customer.setId(1L);
        customer.setEmail("test@example.com");

        // Setup cart
        cart = new ShoppingCart();
        cart.setId(1L);
        cart.setCustomer(customer);
        cart.setCartProducts(new ArrayList<>());
        cart.setTotalPrice(BigDecimal.ZERO);

        // Setup product
        product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setDescription("Test Description");

        // Setup variant
        variant = new ProductVariants();
        variant.setId(1L);
        variant.setSku("TEST-SKU-001");
        variant.setStock(10);
        variant.setPrice(new BigDecimal("100.00"));
        variant.setProductionCost(new BigDecimal("50.00"));
        variant.setProduct(product);

        // Setup cart product
        cartProduct = new CartProduct();
        cartProduct.setId(1L);
        cartProduct.setSku("TEST-SKU-001");
        cartProduct.setQuantity(2);
        cartProduct.setShoppingCart(cart);
        cartProduct.setProduct(product);

        // Link customer to cart
        customer.setShoppingCart(cart);
    }

    @Test
    void testGetCartByCustomerId_Success() {
        // Arrange
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));

        // Act
        ShoppingCart result = cartService.getCartByCustomerId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(customerRepo).findById(1L);
    }

    @Test
    void testGetCartByCustomerId_CustomerNotFound() {
        // Arrange
        when(customerRepo.findById(999L)).thenReturn(Optional.empty());

        // Act
        ShoppingCart result = cartService.getCartByCustomerId(999L);

        // Assert
        assertNull(result);
        verify(customerRepo).findById(999L);
    }

    @Test
    void testAddProductToCart_NewProduct_Success() {
        // Arrange
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepo.findById(1L)).thenReturn(Optional.of(product));
        when(productVariantsRepo.findAll()).thenReturn(Arrays.asList(variant));
        when(cartProductRepo.save(any(CartProduct.class))).thenReturn(cartProduct);
        when(shoppingCartRepo.save(any(ShoppingCart.class))).thenReturn(cart);

        // Act
        CartProduct result = cartService.addProductToCart(1L, 1L, "TEST-SKU-001", 3);

        // Assert
        assertNotNull(result);
        assertEquals("TEST-SKU-001", result.getSku());
        assertEquals(3, result.getQuantity());
        verify(cartProductRepo).save(any(CartProduct.class));
        verify(shoppingCartRepo).save(any(ShoppingCart.class));
    }

    @Test
    void testAddProductToCart_ExistingProduct_Success() {
        // Arrange
        cart.getCartProducts().add(cartProduct);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepo.findById(1L)).thenReturn(Optional.of(product));
        when(productVariantsRepo.findAll()).thenReturn(Arrays.asList(variant));
        when(cartProductRepo.save(any(CartProduct.class))).thenReturn(cartProduct);
        when(shoppingCartRepo.save(any(ShoppingCart.class))).thenReturn(cart);

        // Act
        CartProduct result = cartService.addProductToCart(1L, 1L, "TEST-SKU-001", 3);

        // Assert
        assertNotNull(result);
        assertEquals("TEST-SKU-001", result.getSku());
        assertEquals(5, result.getQuantity()); // 2 existing + 3 new
        verify(cartProductRepo).save(any(CartProduct.class));
        verify(shoppingCartRepo).save(any(ShoppingCart.class));
    }

    @Test
    void testAddProductToCart_ExceedsStock_ReturnsNull() {
        // Arrange
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepo.findById(1L)).thenReturn(Optional.of(product));
        when(productVariantsRepo.findAll()).thenReturn(Arrays.asList(variant));

        // Act
        CartProduct result = cartService.addProductToCart(1L, 1L, "TEST-SKU-001", 15); // Stock is 10

        // Assert
        assertNull(result);
        verify(cartProductRepo, never()).save(any(CartProduct.class));
        verify(shoppingCartRepo, never()).save(any(ShoppingCart.class));
    }

    @Test
    void testAddProductToCart_ExistingProductExceedsStock_ReturnsNull() {
        // Arrange
        cart.getCartProducts().add(cartProduct); // Already has 2
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepo.findById(1L)).thenReturn(Optional.of(product));
        when(productVariantsRepo.findAll()).thenReturn(Arrays.asList(variant));

        // Act
        CartProduct result = cartService.addProductToCart(1L, 1L, "TEST-SKU-001", 9); // 2 + 9 = 11 > 10

        // Assert
        assertNull(result);
        verify(cartProductRepo, never()).save(any(CartProduct.class));
        verify(shoppingCartRepo, never()).save(any(ShoppingCart.class));
    }

    @Test
    void testAddProductToCart_CustomerNotFound_ReturnsNull() {
        // Arrange
        when(customerRepo.findById(999L)).thenReturn(Optional.empty());

        // Act
        CartProduct result = cartService.addProductToCart(999L, 1L, "TEST-SKU-001", 3);

        // Assert
        assertNull(result);
        verify(productRepo, never()).findById(any());
        verify(cartProductRepo, never()).save(any(CartProduct.class));
    }

    @Test
    void testAddProductToCart_ProductNotFound_ReturnsNull() {
        // Arrange
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepo.findById(999L)).thenReturn(Optional.empty());

        // Act
        CartProduct result = cartService.addProductToCart(1L, 999L, "TEST-SKU-001", 3);

        // Assert
        assertNull(result);
        verify(productVariantsRepo, never()).findAll();
        verify(cartProductRepo, never()).save(any(CartProduct.class));
    }

    @Test
    void testAddProductToCart_VariantNotFound_ReturnsNull() {
        // Arrange
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepo.findById(1L)).thenReturn(Optional.of(product));
        when(productVariantsRepo.findAll()).thenReturn(new ArrayList<>());

        // Act
        CartProduct result = cartService.addProductToCart(1L, 1L, "NONEXISTENT-SKU", 3);

        // Assert
        assertNull(result);
        verify(cartProductRepo, never()).save(any(CartProduct.class));
        verify(shoppingCartRepo, never()).save(any(ShoppingCart.class));
    }

    @Test
    void testAddProductToCart_ZeroQuantity_ReturnsNull() {
        // Arrange - No mocks needed since method returns early due to quantity validation

        // Act
        CartProduct result = cartService.addProductToCart(1L, 1L, "TEST-SKU-001", 0);

        // Assert
        assertNull(result);
        verify(productRepo, never()).findById(any());
        verify(cartProductRepo, never()).save(any(CartProduct.class));
    }

    @Test
    void testAddProductToCart_NegativeQuantity_ReturnsNull() {
        // Arrange - No mocks needed since method returns early due to quantity validation

        // Act
        CartProduct result = cartService.addProductToCart(1L, 1L, "TEST-SKU-001", -1);

        // Assert
        assertNull(result);
        verify(productRepo, never()).findById(any());
        verify(cartProductRepo, never()).save(any(CartProduct.class));
    }

    @Test
    void testRemoveProductFromCart_Success() {
        // Arrange
        cart.getCartProducts().add(cartProduct);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(cartProductRepo.findById(1L)).thenReturn(Optional.of(cartProduct));
        when(shoppingCartRepo.save(any(ShoppingCart.class))).thenReturn(cart);

        // Act
        boolean result = cartService.removeProductFromCart(1L, 1L);

        // Assert
        assertTrue(result);
        verify(cartProductRepo).delete(cartProduct);
        verify(shoppingCartRepo).save(any(ShoppingCart.class));
    }

    @Test
    void testRemoveProductFromCart_CartNotFound_ReturnsFalse() {
        // Arrange
        when(customerRepo.findById(999L)).thenReturn(Optional.empty());

        // Act
        boolean result = cartService.removeProductFromCart(999L, 1L);

        // Assert
        assertFalse(result);
        verify(cartProductRepo, never()).findById(any());
        verify(cartProductRepo, never()).delete(any(CartProduct.class));
    }

    @Test
    void testRemoveProductFromCart_CartProductNotFound_ReturnsFalse() {
        // Arrange
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(cartProductRepo.findById(999L)).thenReturn(Optional.empty());

        // Act
        boolean result = cartService.removeProductFromCart(1L, 999L);

        // Assert
        assertFalse(result);
        verify(cartProductRepo, never()).delete(any(CartProduct.class));
        verify(shoppingCartRepo, never()).save(any(ShoppingCart.class));
    }

    @Test
    void testUpdateProductQuantity_Success() {
        // Arrange
        cart.getCartProducts().add(cartProduct);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(cartProductRepo.findById(1L)).thenReturn(Optional.of(cartProduct));
        when(productVariantsRepo.findAll()).thenReturn(Arrays.asList(variant));
        when(cartProductRepo.save(any(CartProduct.class))).thenReturn(cartProduct);
        when(shoppingCartRepo.save(any(ShoppingCart.class))).thenReturn(cart);

        // Act
        boolean result = cartService.updateProductQuantity(1L, 1L, 5);

        // Assert
        assertTrue(result);
        assertEquals(5, cartProduct.getQuantity());
        verify(cartProductRepo).save(cartProduct);
        verify(shoppingCartRepo).save(any(ShoppingCart.class));
    }

    @Test
    void testUpdateProductQuantity_ExceedsStock_ReturnsFalse() {
        // Arrange
        cart.getCartProducts().add(cartProduct);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(cartProductRepo.findById(1L)).thenReturn(Optional.of(cartProduct));
        when(productVariantsRepo.findAll()).thenReturn(Arrays.asList(variant));

        // Act
        boolean result = cartService.updateProductQuantity(1L, 1L, 15); // Stock is 10

        // Assert
        assertFalse(result);
        assertEquals(2, cartProduct.getQuantity()); // Quantity unchanged
        verify(cartProductRepo, never()).save(any(CartProduct.class));
        verify(shoppingCartRepo, never()).save(any(ShoppingCart.class));
    }

    @Test
    void testUpdateProductQuantity_ZeroQuantity_RemovesProduct() {
        // Arrange
        cart.getCartProducts().add(cartProduct);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(cartProductRepo.findById(1L)).thenReturn(Optional.of(cartProduct));
        when(shoppingCartRepo.save(any(ShoppingCart.class))).thenReturn(cart);

        // Act
        boolean result = cartService.updateProductQuantity(1L, 1L, 0);

        // Assert
        assertTrue(result);
        assertTrue(cart.getCartProducts().isEmpty());
        verify(cartProductRepo).delete(cartProduct);
        verify(shoppingCartRepo).save(any(ShoppingCart.class));
    }

    @Test
    void testUpdateProductQuantity_NegativeQuantity_RemovesProduct() {
        // Arrange
        cart.getCartProducts().add(cartProduct);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(cartProductRepo.findById(1L)).thenReturn(Optional.of(cartProduct));
        when(shoppingCartRepo.save(any(ShoppingCart.class))).thenReturn(cart);

        // Act
        boolean result = cartService.updateProductQuantity(1L, 1L, -1);

        // Assert
        assertTrue(result);
        assertTrue(cart.getCartProducts().isEmpty());
        verify(cartProductRepo).delete(cartProduct);
        verify(shoppingCartRepo).save(any(ShoppingCart.class));
    }

    @Test
    void testClearCart_Success() {
        // Arrange
        cart.getCartProducts().add(cartProduct);
        when(customerRepo.findById(1L)).thenReturn(Optional.of(customer));
        when(shoppingCartRepo.save(any(ShoppingCart.class))).thenReturn(cart);

        // Act
        cartService.clearCart(1L);

        // Assert
        assertTrue(cart.getCartProducts().isEmpty());
        verify(cartProductRepo).delete(cartProduct);
        verify(shoppingCartRepo).save(any(ShoppingCart.class));
    }

    @Test
    void testClearCart_CartNotFound_DoesNothing() {
        // Arrange
        when(customerRepo.findById(999L)).thenReturn(Optional.empty());

        // Act
        cartService.clearCart(999L);

        // Assert
        verify(cartProductRepo, never()).delete(any(CartProduct.class));
        verify(shoppingCartRepo, never()).save(any(ShoppingCart.class));
    }

    @Test
    void testGetCartProductDTOs_Success() {
        // Arrange
        cart.getCartProducts().add(cartProduct);
        when(shoppingCartRepo.findById(1L)).thenReturn(Optional.of(cart));
        when(productVariantsRepo.findAll()).thenReturn(Arrays.asList(variant));

        // Act
        List<CartProductDTO> result = cartService.getCartProductDTOs(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        CartProductDTO dto = result.get(0);
        assertEquals(1L, dto.getCartProductId());
        assertEquals(2, dto.getQuantity());
        assertEquals("TEST-SKU-001", dto.getSku());
        assertNotNull(dto.getProduct());
        assertNotNull(dto.getVariant());
    }

    @Test
    void testGetCartProductDTOs_CartNotFound_ReturnsNull() {
        // Arrange
        when(shoppingCartRepo.findById(999L)).thenReturn(Optional.empty());

        // Act
        List<CartProductDTO> result = cartService.getCartProductDTOs(999L);

        // Assert
        assertNull(result);
    }

    @Test
    void testCalculateDiscountedPrice_NoDiscount_ReturnsOriginalPrice() {
        // Arrange
        product.setDiscountType(null);
        product.setDiscountValue(null);

        // Act
        BigDecimal result = cartService.calculateDiscountedPrice(product, new BigDecimal("100.00"));

        // Assert
        assertEquals(new BigDecimal("100.00"), result);
    }

    @Test
    void testCalculateDiscountedPrice_PercentageDiscount_Success() {
        // Arrange
        product.setDiscountType("Percentage");
        product.setDiscountValue(new BigDecimal("20.00")); // 20% off

        // Act
        BigDecimal result = cartService.calculateDiscountedPrice(product, new BigDecimal("100.00"));

        // Assert
        assertEquals(new BigDecimal("80.00"), result.setScale(2));
    }

    @Test
    void testCalculateDiscountedPrice_PercentageDiscountWithMaxCap_Success() {
        // Arrange
        product.setDiscountType("Percentage");
        product.setDiscountValue(new BigDecimal("50.00")); // 50% off
        product.setPercentageMax(new BigDecimal("30.00")); // Max $30 discount

        // Act
        BigDecimal result = cartService.calculateDiscountedPrice(product, new BigDecimal("100.00"));

        // Assert
        assertEquals(new BigDecimal("70.00"), result.setScale(2)); // $100 - $30 = $70
    }

    @Test
    void testCalculateDiscountedPrice_AmountDiscount_Success() {
        // Arrange
        product.setDiscountType("Amount");
        product.setDiscountValue(new BigDecimal("25.00")); // $25 off

        // Act
        BigDecimal result = cartService.calculateDiscountedPrice(product, new BigDecimal("100.00"));

        // Assert
        assertEquals(new BigDecimal("75.00"), result.setScale(2));
    }

    @Test
    void testCalculateDiscountedPrice_AmountDiscountWithMinCap_Success() {
        // Arrange
        product.setDiscountType("Amount");
        product.setDiscountValue(new BigDecimal("25.00")); // $25 off
        product.setMinCap(new BigDecimal("50.00")); // Min $50 purchase to qualify

        // Act
        BigDecimal result = cartService.calculateDiscountedPrice(product, new BigDecimal("100.00"));

        // Assert
        assertEquals(new BigDecimal("75.00"), result.setScale(2)); // $100 - $25 = $75 (since $100 >= $50)
    }

    @Test
    void testCalculateDiscountedPrice_AmountDiscountWithMaxCap_Success() {
        // Arrange
        product.setDiscountType("Amount");
        product.setDiscountValue(new BigDecimal("50.00")); // $50 off
        product.setMaxCap(new BigDecimal("30.00")); // Max $30 discount

        // Act
        BigDecimal result = cartService.calculateDiscountedPrice(product, new BigDecimal("100.00"));

        // Assert
        assertEquals(new BigDecimal("70.00"), result.setScale(2)); // $100 - $30 = $70
    }

    @Test
    void testCalculateDiscountedPrice_DiscountExceedsPrice_ReturnsZero() {
        // Arrange
        product.setDiscountType("Amount");
        product.setDiscountValue(new BigDecimal("150.00")); // $150 off

        // Act
        BigDecimal result = cartService.calculateDiscountedPrice(product, new BigDecimal("100.00"));

        // Assert
        assertEquals(BigDecimal.ZERO, result);
    }

    @Test
    void testCalculateDiscountedPrice_UnknownDiscountType_ReturnsOriginalPrice() {
        // Arrange
        product.setDiscountType("Unknown");
        product.setDiscountValue(new BigDecimal("20.00"));

        // Act
        BigDecimal result = cartService.calculateDiscountedPrice(product, new BigDecimal("100.00"));

        // Assert
        assertEquals(new BigDecimal("100.00"), result);
    }

    @Test
    void testCalculateDiscountedPrice_FixedDiscount() {
        // Arrange
        Product product = new Product();
        product.setDiscountType("fixed");
        product.setDiscountValue(new BigDecimal("100.00"));
        product.setMinCap(new BigDecimal("1000.00")); // Minimum purchase threshold
        
        BigDecimal originalPrice = new BigDecimal("1499.99");
        
        // Act
        BigDecimal discountedPrice = cartService.calculateDiscountedPrice(product, originalPrice);
        
        // Assert
        // Expected: 1499.99 - 100.00 = 1399.99 (since 1499.99 >= 1000.00)
        assertEquals(new BigDecimal("1399.99"), discountedPrice);
    }

    @Test
    void testCalculateDiscountedPrice_FixedDiscountWithMinCap() {
        // Arrange
        Product product = new Product();
        product.setDiscountType("fixed");
        product.setDiscountValue(new BigDecimal("100.00"));
        product.setMinCap(new BigDecimal("2000.00")); // Minimum purchase threshold not met
        
        BigDecimal originalPrice = new BigDecimal("1499.99");
        
        // Act
        BigDecimal discountedPrice = cartService.calculateDiscountedPrice(product, originalPrice);
        
        // Assert
        // Expected: 1499.99 (no discount since 1499.99 < 2000.00)
        assertEquals(new BigDecimal("1499.99"), discountedPrice);
    }

    @Test
    void testCreateCartProductDTO_Success() {
        // Arrange
        when(productVariantsRepo.findAll()).thenReturn(Arrays.asList(variant));

        // Act
        CartProductDTO result = cartService.createCartProductDTO(cartProduct);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getCartProductId());
        assertEquals(2, result.getQuantity());
        assertEquals("TEST-SKU-001", result.getSku());
        assertNotNull(result.getProduct());
        assertNotNull(result.getVariant());
        assertEquals("Test Product", result.getProduct().getName());
        assertEquals("TEST-SKU-001", result.getVariant().getSku());
    }

    @Test
    void testCreateCartProductDTO_NullInput_ReturnsNull() {
        // Act
        CartProductDTO result = cartService.createCartProductDTO(null);

        // Assert
        assertNull(result);
    }
} 