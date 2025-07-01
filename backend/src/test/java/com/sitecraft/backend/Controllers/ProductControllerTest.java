package com.sitecraft.backend.Controllers;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.sitecraft.backend.Services.ProductService;
import com.sitecraft.backend.Models.Product;
import com.sitecraft.backend.Models.ProductImage;
import com.sitecraft.backend.DTOs.ProductCreateDTO;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.mock.web.MockMultipartFile;
import java.util.List;
import java.util.Map;
import java.util.Collections;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ProductControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private ProductService productService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllProducts_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<Product> products = List.of(new Product());
        when(productService.getAllProducts(1L)).thenReturn(products);
        mockMvc.perform(get("/products").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetAllProducts_Unauthorized() throws Exception {
        mockMvc.perform(get("/products"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testGetProductById_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        Product product = new Product();
        when(productService.getProductById(2L, 1L)).thenReturn(product);
        mockMvc.perform(get("/products/2").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testCreateProduct_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        ProductCreateDTO dto = new ProductCreateDTO();
        Product product = new Product();
        when(productService.createProductWithImages(any(ProductCreateDTO.class), eq(1L), any())).thenReturn(product);
        MockMultipartFile productFile = new MockMultipartFile("product", "product", "application/json", objectMapper.writeValueAsBytes(dto));
        mockMvc.perform(multipart("/products/create")
                .file(productFile)
                .session(session)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testUpdateProduct_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        ProductCreateDTO dto = new ProductCreateDTO();
        Product product = new Product();
        when(productService.updateProductWithImages(eq(2L), any(ProductCreateDTO.class), eq(1L), any())).thenReturn(product);
        MockMultipartFile productFile = new MockMultipartFile("product", "product", "application/json", objectMapper.writeValueAsBytes(dto));
        mockMvc.perform(multipart("/products/update/2")
                .file(productFile)
                .with(request -> { request.setMethod("PUT"); return request; })
                .session(session)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testDeleteProduct_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        doNothing().when(productService).deleteProduct(2L, 1L);
        mockMvc.perform(delete("/products/delete/2").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetProductStatistics_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        Map<String, Object> stats = Map.of("count", 10);
        when(productService.getProductStatistics(1L)).thenReturn(stats);
        mockMvc.perform(get("/products/statistics").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetLowStockItems_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<Product> products = List.of(new Product());
        when(productService.getLowStockItems(1L)).thenReturn(products);
        mockMvc.perform(get("/products/low-stock").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetOutOfStockItems_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<Product> products = List.of(new Product());
        when(productService.getOutOfStockItems(1L)).thenReturn(products);
        mockMvc.perform(get("/products/out-of-stock").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testApplyDiscountToProducts_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        Map<String, Object> discountData = Map.of(
            "productIds", List.of(1L, 2L),
            "discountType", "PERCENTAGE",
            "discountValue", 10.0
        );
        Map<String, Object> result = Map.of("discounted", true);
        when(productService.applyDiscountToProducts(any(), any(), any(), any(), any(), any(), eq(1L))).thenReturn(result);
        mockMvc.perform(post("/products/apply-discount")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(discountData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetProductImages_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        Product product = new Product();
        product.setImages(List.of(new ProductImage()));
        when(productService.getProductById(2L, 1L)).thenReturn(product);
        mockMvc.perform(get("/products/2/images").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testDeleteProductImage_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        doNothing().when(productService).deleteProductImage(2L, 3L, 1L);
        mockMvc.perform(delete("/products/2/images/3").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
} 