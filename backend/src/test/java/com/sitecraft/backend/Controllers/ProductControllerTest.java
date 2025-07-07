package com.sitecraft.backend.Controllers;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.sitecraft.backend.Services.ProductService;
import com.sitecraft.backend.Services.LowStockNotificationService;
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
    @MockBean
    private LowStockNotificationService lowStockNotificationService;
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
        when(productService.applyDiscountToProducts(any(), any(), any(), eq(1L))).thenReturn(result);
        mockMvc.perform(post("/products/apply-discount")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(discountData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Discount applied successfully"));
    }

    @Test
    void testApplyDiscountToProducts_Unauthorized() throws Exception {
        Map<String, Object> discountData = Map.of(
            "productIds", List.of(1L, 2L),
            "discountType", "PERCENTAGE",
            "discountValue", 10.0
        );
        mockMvc.perform(post("/products/apply-discount")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(discountData)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
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

    @Test
    void testGetLowStockNotifications_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        Map<String, Object> stats = Map.of("lowStockCount", 5, "criticalCount", 2);
        when(lowStockNotificationService.getLowStockStatistics(1L)).thenReturn(stats);
        mockMvc.perform(get("/products/low-stock-notifications").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Low stock notifications retrieved successfully"));
    }

    @Test
    void testGetLowStockNotifications_Unauthorized() throws Exception {
        mockMvc.perform(get("/products/low-stock-notifications"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testImportProducts_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        MockMultipartFile file = new MockMultipartFile("file", "products.xlsx", 
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                "test content".getBytes());
        Map<String, Object> importResult = Map.of("imported", 10, "failed", 0);
        when(productService.importProductsFromExcel(any(), eq(1L))).thenReturn(importResult);
        mockMvc.perform(multipart("/products/import")
                .file(file)
                .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Import completed"));
    }

    @Test
    void testImportProducts_EmptyFile() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        MockMultipartFile file = new MockMultipartFile("file", "empty.xlsx", 
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                new byte[0]);
        mockMvc.perform(multipart("/products/import")
                .file(file)
                .session(session))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Please select a file to upload."));
    }

    @Test
    void testImportProducts_InvalidFileType() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        MockMultipartFile file = new MockMultipartFile("file", "products.txt", 
                "text/plain", "test content".getBytes());
        mockMvc.perform(multipart("/products/import")
                .file(file)
                .session(session))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Please upload an Excel file (.xlsx, .xls) or CSV file."));
    }

    @Test
    void testImportProducts_FileTooLarge() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        // Create a file larger than 5MB
        byte[] largeContent = new byte[6 * 1024 * 1024];
        MockMultipartFile file = new MockMultipartFile("file", "large.xlsx", 
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                largeContent);
        mockMvc.perform(multipart("/products/import")
                .file(file)
                .session(session))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("File size must be less than 5MB."));
    }

    @Test
    void testImportProducts_Unauthorized() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "products.xlsx", 
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                "test content".getBytes());
        mockMvc.perform(multipart("/products/import")
                .file(file))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testExportProducts_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        byte[] excelData = "test excel data".getBytes();
        when(productService.exportProductsToExcel(1L)).thenReturn(excelData);
        mockMvc.perform(get("/products/export").session(session))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "form-data; name=\"attachment\"; filename=\"products_export.xlsx\""))
                .andExpect(header().string("Content-Type", "application/octet-stream"));
    }

    @Test
    void testExportProducts_Unauthorized() throws Exception {
        mockMvc.perform(get("/products/export"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }
} 