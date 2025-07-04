package com.sitecraft.backend.Services;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import com.sitecraft.backend.Models.Category;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Repositories.CategoryRepo;
import com.sitecraft.backend.Repositories.ProductRepo;
import com.sitecraft.backend.Repositories.StoreRepo;
import com.sitecraft.backend.DTOs.CategoryCreateDTO;
import com.sitecraft.backend.DTOs.CategoryResponseDTO;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.io.IOException;

public class CategoryServiceTest {
    @Mock
    private CategoryRepo categoryRepo;
    @Mock
    private ProductRepo productRepo;
    @Mock
    private StoreRepo storeRepo;
    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private CategoryService categoryService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllCategories() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        when(storeRepo.findById(1L)).thenReturn(Optional.of(store));
        Category category = mock(Category.class);
        when(category.getId()).thenReturn(2L);
        when(categoryRepo.findByStoreId(1L)).thenReturn(Collections.singletonList(category));
        when(categoryRepo.countProductsByCategoryId(2L)).thenReturn(5L);
        List<CategoryResponseDTO> result = categoryService.getAllCategories(1L);
        assertEquals(1, result.size());
        assertEquals(5L, result.get(0).getProductCount());
    }

    @Test
    void testGetCategoryById_Success() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        Category category = mock(Category.class);
        when(category.getStore()).thenReturn(store);
        when(categoryRepo.findById(2L)).thenReturn(Optional.of(category));
        Category result = categoryService.getCategoryById(2L, 1L);
        assertEquals(category, result);
    }

    @Test
    void testGetCategoryById_Unauthorized() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        Store otherStore = mock(Store.class);
        when(otherStore.getId()).thenReturn(2L);
        Category category = mock(Category.class);
        when(category.getStore()).thenReturn(otherStore);
        when(categoryRepo.findById(2L)).thenReturn(Optional.of(category));
        RuntimeException ex = assertThrows(RuntimeException.class, () -> categoryService.getCategoryById(2L, 1L));
        assertTrue(ex.getMessage().contains("Unauthorized"));
    }

    @Test
    void testCreateCategory_Success() throws IOException {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        when(storeRepo.findById(1L)).thenReturn(Optional.of(store));
        when(categoryRepo.existsByNameAndStoreId("cat", 1L)).thenReturn(false);
        CategoryCreateDTO dto = mock(CategoryCreateDTO.class);
        when(dto.getName()).thenReturn("cat");
        when(dto.getDescription()).thenReturn("desc");
        Category savedCategory = new Category();
        savedCategory.setName("cat");
        savedCategory.setDescription("desc");
        savedCategory.setStore(store);
        when(categoryRepo.save(any(Category.class))).thenReturn(savedCategory);
        Category result = categoryService.createCategory(dto, 1L, null);
        assertEquals("cat", result.getName());
        assertEquals("desc", result.getDescription());
        assertEquals(store, result.getStore());
    }

    @Test
    void testDeleteCategory_WithProducts_Throws() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        Category category = mock(Category.class);
        when(category.getStore()).thenReturn(store);
        when(category.getId()).thenReturn(2L);
        when(categoryRepo.findById(2L)).thenReturn(Optional.of(category));
        when(categoryRepo.countProductsByCategoryId(2L)).thenReturn(1L);
        RuntimeException ex = assertThrows(RuntimeException.class, () -> categoryService.deleteCategory(2L, 1L));
        assertTrue(ex.getMessage().contains("Cannot delete category with products"));
    }

    // TODO: Implement tests for updateCategory, getCategoryProducts, assignProductsToCategory, removeProductFromCategory, getCategoryAnalytics
} 