//package com.sitecraft.backend.Controllers;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.sitecraft.backend.Models.*;
//import com.sitecraft.backend.Services.CartService;
//import com.sitecraft.backend.DTOs.CartProductDTO;
//import com.sitecraft.backend.DTOs.ProductDTO;
//import com.sitecraft.backend.DTOs.ProductVariantDTO;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.mock.web.MockHttpSession;
//import org.springframework.test.context.TestPropertySource;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.math.BigDecimal;
//import java.util.Arrays;
//import java.util.List;
//
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(CartController.class)
//@TestPropertySource(properties = {
//    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration"
//})
//public class CartControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private CartService cartService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private MockHttpSession session;
//    private ShoppingCart cart;
//    private CartProduct cartProduct;
//    private Product product;
//    private ProductVariants variant;
//    private CartProductDTO cartProductDTO;
//
//    @BeforeEach
//    void setUp() {
//        session = new MockHttpSession();
//        session.setAttribute("customerId", 1L);
//
//        // Setup cart
//        cart = new ShoppingCart();
//        cart.setId(1L);
//        cart.setTotalPrice(new BigDecimal("200.00"));
//
//        // Setup product
//        product = new Product();
//        product.setId(1L);
//        product.setName("Test Product");
//        product.setDescription("Test Description");
//
//        // Setup variant
//        variant = new ProductVariants();
//        variant.setId(1L);
//        variant.setSku("TEST-SKU-001");
//        variant.setStock(10);
//        variant.setPrice(new BigDecimal("100.00"));
//        variant.setProductionCost(new BigDecimal("50.00"));
//
//        // Setup cart product
//        cartProduct = new CartProduct();
//        cartProduct.setId(1L);
//        cartProduct.setSku("TEST-SKU-001");
//        cartProduct.setQuantity(2);
//        cartProduct.setProduct(product);
//
//        // Setup DTOs
//        ProductDTO productDTO = new ProductDTO(
//            1L, "Test Product", "Test Description",
//            null, null, null, null, null,
//            Arrays.asList(), Arrays.asList()
//        );
//
//        ProductVariantDTO variantDTO = new ProductVariantDTO(
//            1L, "TEST-SKU-001", 10,
//            new BigDecimal("100.00"), new BigDecimal("80.00"),
//            new BigDecimal("50.00")
//        );
//
//        cartProductDTO = new CartProductDTO(
//            1L, 2, "TEST-SKU-001", productDTO, variantDTO
//        );
//    }
//
//    @Test
//    void testGetCartSummary_Success() throws Exception {
//        // Arrange
//        when(cartService.getCartByCustomerId(1L)).thenReturn(cart);
//
//        // Act & Assert
//        mockMvc.perform(get("/api/cart")
//                .session(session))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1))
//                .andExpect(jsonPath("$.totalPrice").value("200.0"));
//
//        verify(cartService).getCartByCustomerId(1L);
//    }
//
//    @Test
//    void testGetCartSummary_Unauthorized() throws Exception {
//        // Arrange
//        MockHttpSession emptySession = new MockHttpSession();
//
//        // Act & Assert
//        mockMvc.perform(get("/api/cart")
//                .session(emptySession))
//                .andExpect(status().isUnauthorized());
//
//        verify(cartService, never()).getCartByCustomerId(any());
//    }
//
//    @Test
//    void testGetCartSummary_CartNotFound() throws Exception {
//        // Arrange
//        when(cartService.getCartByCustomerId(1L)).thenReturn(null);
//
//        // Act & Assert
//        mockMvc.perform(get("/api/cart")
//                .session(session))
//                .andExpect(status().isNotFound());
//
//        verify(cartService).getCartByCustomerId(1L);
//    }
//
//    @Test
//    void testGetCartProducts_Success() throws Exception {
//        // Arrange
//        List<CartProductDTO> dtos = Arrays.asList(cartProductDTO);
//        when(cartService.getCartByCustomerId(1L)).thenReturn(cart);
//        when(cartService.getCartProductDTOs(1L)).thenReturn(dtos);
//
//        // Act & Assert
//        mockMvc.perform(get("/api/cart/products")
//                .session(session))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$[0].cartProductId").value(1))
//                .andExpect(jsonPath("$[0].quantity").value(2))
//                .andExpect(jsonPath("$[0].sku").value("TEST-SKU-001"));
//
//        verify(cartService).getCartByCustomerId(1L);
//        verify(cartService).getCartProductDTOs(1L);
//    }
//
//    @Test
//    void testGetCartProducts_Unauthorized() throws Exception {
//        // Arrange
//        MockHttpSession emptySession = new MockHttpSession();
//
//        // Act & Assert
//        mockMvc.perform(get("/api/cart/products")
//                .session(emptySession))
//                .andExpect(status().isUnauthorized());
//
//        verify(cartService, never()).getCartByCustomerId(any());
//    }
//
//    @Test
//    void testGetCartProducts_CartNotFound() throws Exception {
//        // Arrange
//        when(cartService.getCartByCustomerId(1L)).thenReturn(null);
//
//        // Act & Assert
//        mockMvc.perform(get("/api/cart/products")
//                .session(session))
//                .andExpect(status().isNotFound());
//
//        verify(cartService).getCartByCustomerId(1L);
//        verify(cartService, never()).getCartProductDTOs(any());
//    }
//
//    @Test
//    void testAddProductToCart_Success() throws Exception {
//        // Arrange
//        AddCartProductRequest request = new AddCartProductRequest();
//        request.productId = 1L;
//        request.sku = "TEST-SKU-001";
//        request.quantity = 3;
//
//        when(cartService.addProductToCart(1L, 1L, "TEST-SKU-001", 3)).thenReturn(cartProduct);
//        when(cartService.createCartProductDTO(cartProduct)).thenReturn(cartProductDTO);
//
//        // Act & Assert
//        mockMvc.perform(post("/api/cart/add")
//                .session(session)
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.cartProductId").value(1))
//                .andExpect(jsonPath("$.quantity").value(2))
//                .andExpect(jsonPath("$.sku").value("TEST-SKU-001"));
//
//        verify(cartService).addProductToCart(1L, 1L, "TEST-SKU-001", 3);
//        verify(cartService).createCartProductDTO(cartProduct);
//    }
//
//    @Test
//    void testAddProductToCart_Unauthorized() throws Exception {
//        // Arrange
//        MockHttpSession emptySession = new MockHttpSession();
//        AddCartProductRequest request = new AddCartProductRequest();
//        request.productId = 1L;
//        request.sku = "TEST-SKU-001";
//        request.quantity = 3;
//
//        // Act & Assert
//        mockMvc.perform(post("/api/cart/add")
//                .session(emptySession)
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isUnauthorized());
//
//        verify(cartService, never()).addProductToCart(any(), any(), any(), anyInt());
//    }
//
//    @Test
//    void testAddProductToCart_InvalidRequest() throws Exception {
//        // Arrange
//        when(cartService.addProductToCart(1L, 1L, "TEST-SKU-001", 3)).thenReturn(null);
//
//        AddCartProductRequest request = new AddCartProductRequest();
//        request.productId = 1L;
//        request.sku = "TEST-SKU-001";
//        request.quantity = 3;
//
//        // Act & Assert
//        mockMvc.perform(post("/api/cart/add")
//                .session(session)
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isBadRequest());
//
//        verify(cartService).addProductToCart(1L, 1L, "TEST-SKU-001", 3);
//    }
//
//    @Test
//    void testRemoveProductFromCart_Success() throws Exception {
//        // Arrange
//        when(cartService.removeProductFromCart(1L, 1L)).thenReturn(true);
//
//        // Act & Assert
//        mockMvc.perform(delete("/api/cart/remove/1")
//                .session(session))
//                .andExpect(status().isOk());
//
//        verify(cartService).removeProductFromCart(1L, 1L);
//    }
//
//    @Test
//    void testRemoveProductFromCart_Unauthorized() throws Exception {
//        // Arrange
//        MockHttpSession emptySession = new MockHttpSession();
//
//        // Act & Assert
//        mockMvc.perform(delete("/api/cart/remove/1")
//                .session(emptySession))
//                .andExpect(status().isUnauthorized());
//
//        verify(cartService, never()).removeProductFromCart(any(), any());
//    }
//
//    @Test
//    void testRemoveProductFromCart_InvalidRequest() throws Exception {
//        // Arrange
//        when(cartService.removeProductFromCart(1L, 1L)).thenReturn(false);
//
//        // Act & Assert
//        mockMvc.perform(delete("/api/cart/remove/1")
//                .session(session))
//                .andExpect(status().isBadRequest());
//
//        verify(cartService).removeProductFromCart(1L, 1L);
//    }
//
//    @Test
//    void testUpdateProductQuantity_Success() throws Exception {
//        // Arrange
//        UpdateCartProductRequest request = new UpdateCartProductRequest();
//        request.cartProductId = 1L;
//        request.quantity = 5;
//
//        when(cartService.updateProductQuantity(1L, 1L, 5)).thenReturn(true);
//
//        // Act & Assert
//        mockMvc.perform(put("/api/cart/update")
//                .session(session)
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk());
//
//        verify(cartService).updateProductQuantity(1L, 1L, 5);
//    }
//
//    @Test
//    void testUpdateProductQuantity_Unauthorized() throws Exception {
//        // Arrange
//        MockHttpSession emptySession = new MockHttpSession();
//        UpdateCartProductRequest request = new UpdateCartProductRequest();
//        request.cartProductId = 1L;
//        request.quantity = 5;
//
//        // Act & Assert
//        mockMvc.perform(put("/api/cart/update")
//                .session(emptySession)
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isUnauthorized());
//
//        verify(cartService, never()).updateProductQuantity(any(), any(), anyInt());
//    }
//
//    @Test
//    void testUpdateProductQuantity_InvalidRequest() throws Exception {
//        // Arrange
//        UpdateCartProductRequest request = new UpdateCartProductRequest();
//        request.cartProductId = 1L;
//        request.quantity = 5;
//
//        when(cartService.updateProductQuantity(1L, 1L, 5)).thenReturn(false);
//
//        // Act & Assert
//        mockMvc.perform(put("/api/cart/update")
//                .session(session)
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isBadRequest());
//
//        verify(cartService).updateProductQuantity(1L, 1L, 5);
//    }
//
//    @Test
//    void testClearCart_Success() throws Exception {
//        // Arrange
//        doNothing().when(cartService).clearCart(1L);
//
//        // Act & Assert
//        mockMvc.perform(delete("/api/cart/clear")
//                .session(session))
//                .andExpect(status().isOk());
//
//        verify(cartService).clearCart(1L);
//    }
//
//    @Test
//    void testClearCart_Unauthorized() throws Exception {
//        // Arrange
//        MockHttpSession emptySession = new MockHttpSession();
//
//        // Act & Assert
//        mockMvc.perform(delete("/api/cart/clear")
//                .session(emptySession))
//                .andExpect(status().isUnauthorized());
//
//        verify(cartService, never()).clearCart(any());
//    }
//
//    // Helper classes for testing
//    static class AddCartProductRequest {
//        public Long productId;
//        public String sku;
//        public int quantity;
//    }
//
//    static class UpdateCartProductRequest {
//        public Long cartProductId;
//        public int quantity;
//    }
//}