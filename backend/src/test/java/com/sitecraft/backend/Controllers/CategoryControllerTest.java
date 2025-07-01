package com.sitecraft.backend.Controllers;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.sitecraft.backend.Services.CategoryService;
import com.sitecraft.backend.Models.Category;
import com.sitecraft.backend.Models.Product;
import com.sitecraft.backend.DTOs.CategoryCreateDTO;
import com.sitecraft.backend.DTOs.CategoryResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import java.util.Collections;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CategoryController.class)
@AutoConfigureMockMvc(addFilters = false)
public class CategoryControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private CategoryService categoryService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllCategories_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<CategoryResponseDTO> categories = List.of(new CategoryResponseDTO());
        when(categoryService.getAllCategories(1L)).thenReturn(categories);
        mockMvc.perform(get("/categories").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetAllCategories_Unauthorized() throws Exception {
        mockMvc.perform(get("/categories"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testGetCategoryById_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        Category category = new Category();
        when(categoryService.getCategoryById(2L, 1L)).thenReturn(category);
        mockMvc.perform(get("/categories/2").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetCategoryById_Unauthorized() throws Exception {
        mockMvc.perform(get("/categories/2"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testCreateCategory_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        CategoryCreateDTO dto = new CategoryCreateDTO();
        Category saved = new Category();
        when(categoryService.createCategory(any(CategoryCreateDTO.class), eq(1L), any())).thenReturn(saved);
        mockMvc.perform(multipart("/categories")
                .file("category", objectMapper.writeValueAsBytes(dto))
                .session(session)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testCreateCategory_Unauthorized() throws Exception {
        CategoryCreateDTO dto = new CategoryCreateDTO();
        mockMvc.perform(multipart("/categories")
                .file("category", objectMapper.writeValueAsBytes(dto))
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testUpdateCategory_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        CategoryCreateDTO dto = new CategoryCreateDTO();
        Category updated = new Category();
        when(categoryService.updateCategory(eq(2L), any(CategoryCreateDTO.class), eq(1L), any())).thenReturn(updated);
        mockMvc.perform(multipart("/categories/2")
                .file("category", objectMapper.writeValueAsBytes(dto))
                .with(request -> { request.setMethod("PUT"); return request; })
                .session(session)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testUpdateCategory_Unauthorized() throws Exception {
        CategoryCreateDTO dto = new CategoryCreateDTO();
        mockMvc.perform(multipart("/categories/2")
                .file("category", objectMapper.writeValueAsBytes(dto))
                .with(request -> { request.setMethod("PUT"); return request; })
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testDeleteCategory_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        doNothing().when(categoryService).deleteCategory(2L, 1L);
        mockMvc.perform(delete("/categories/2").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testDeleteCategory_Unauthorized() throws Exception {
        mockMvc.perform(delete("/categories/2"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testGetCategoryProducts_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<Product> products = List.of(new Product());
        when(categoryService.getCategoryProducts(2L, 1L)).thenReturn(products);
        mockMvc.perform(get("/categories/2/products").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testAssignProductsToCategory_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        Map<String, List<Long>> req = Map.of("productIds", List.of(1L, 2L));
        doNothing().when(categoryService).assignProductsToCategory(2L, List.of(1L, 2L), 1L);
        mockMvc.perform(post("/categories/2/products")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testRemoveProductFromCategory_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        doNothing().when(categoryService).removeProductFromCategory(2L, 3L, 1L);
        mockMvc.perform(delete("/categories/2/products/3").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetCategoryAnalytics_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        Map<String, Object> analytics = Map.of("totalCategories", 5);
        when(categoryService.getCategoryAnalytics(1L)).thenReturn(analytics);
        mockMvc.perform(get("/categories/analytics").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetCategoryStats_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        Map<String, Object> analytics = Map.of("totalCategories", 5);
        when(categoryService.getCategoryAnalytics(1L)).thenReturn(analytics);
        mockMvc.perform(get("/categories/stats").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
} 