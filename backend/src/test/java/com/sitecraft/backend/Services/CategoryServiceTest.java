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

    @Test
    void testUpdateCategory_Success() throws IOException {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        Category existingCategory = new Category();
        existingCategory.setId(2L);
        existingCategory.setName("Old Name");
        existingCategory.setDescription("Old Description");
        existingCategory.setStore(store);
        
        when(categoryRepo.findById(2L)).thenReturn(Optional.of(existingCategory));
        when(categoryRepo.existsByNameAndStoreId("New Name", 1L)).thenReturn(false);
        when(categoryRepo.save(any(Category.class))).thenReturn(existingCategory);
        
        CategoryCreateDTO dto = mock(CategoryCreateDTO.class);
        when(dto.getName()).thenReturn("New Name");
        when(dto.getDescription()).thenReturn("New Description");
        
        Category result = categoryService.updateCategory(2L, dto, 1L, null);
        
        assertEquals("New Name", result.getName());
        assertEquals("New Description", result.getDescription());
        verify(categoryRepo).save(existingCategory);
    }

    @Test
    void testUpdateCategory_DuplicateName_Throws() throws IOException {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        Category existingCategory = new Category();
        existingCategory.setId(2L);
        existingCategory.setName("Old Name");
        existingCategory.setStore(store);
        
        when(categoryRepo.findById(2L)).thenReturn(Optional.of(existingCategory));
        when(categoryRepo.existsByNameAndStoreId("New Name", 1L)).thenReturn(true);
        
        CategoryCreateDTO dto = mock(CategoryCreateDTO.class);
        when(dto.getName()).thenReturn("New Name");
        
        RuntimeException ex = assertThrows(RuntimeException.class, 
            () -> categoryService.updateCategory(2L, dto, 1L, null));
        assertTrue(ex.getMessage().contains("Category name already exists"));
    }

    @Test
    void testGetCategoryProducts_Success() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        Category category = new Category();
        category.setId(2L);
        category.setStore(store);
        category.setCategoryProducts(new java.util.ArrayList<>());
        
        when(categoryRepo.findById(2L)).thenReturn(Optional.of(category));
        
        List<com.sitecraft.backend.DTOs.ProductDTO> result = categoryService.getCategoryProducts(2L, 1L);
        
        assertNotNull(result);
        verify(categoryRepo).findById(2L);
    }

    @Test
    void testAssignProductsToCategory_Success() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        Category category = new Category();
        category.setId(2L);
        category.setStore(store);
        
        com.sitecraft.backend.Models.Product product = new com.sitecraft.backend.Models.Product();
        product.setId(3L);
        product.setStore(store);
        product.setCategoryProducts(new java.util.ArrayList<>());
        
        when(categoryRepo.findById(2L)).thenReturn(Optional.of(category));
        when(productRepo.findAllById(Arrays.asList(3L))).thenReturn(Arrays.asList(product));
        when(productRepo.saveAll(any())).thenReturn(Arrays.asList(product));
        
        List<Long> productIds = Arrays.asList(3L);
        categoryService.assignProductsToCategory(2L, productIds, 1L);
        
        verify(categoryRepo).findById(2L);
        verify(productRepo).findAllById(productIds);
        verify(productRepo).saveAll(any());
    }

    @Test
    void testAssignProductsToCategory_WrongStore_Throws() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        Store otherStore = mock(Store.class);
        when(otherStore.getId()).thenReturn(2L);
        
        Category category = new Category();
        category.setId(2L);
        category.setStore(store);
        
        com.sitecraft.backend.Models.Product product = new com.sitecraft.backend.Models.Product();
        product.setId(3L);
        product.setStore(otherStore);
        product.setCategoryProducts(new java.util.ArrayList<>());
        
        when(categoryRepo.findById(2L)).thenReturn(Optional.of(category));
        when(productRepo.findAllById(Arrays.asList(3L))).thenReturn(Arrays.asList(product));
        
        List<Long> productIds = Arrays.asList(3L);
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> categoryService.assignProductsToCategory(2L, productIds, 1L));
        assertTrue(ex.getMessage().contains("Product does not belong to this store"));
    }

    @Test
    void testRemoveProductFromCategory_Success() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        Category category = new Category();
        category.setId(2L);
        category.setStore(store);
        
        com.sitecraft.backend.Models.Product product = new com.sitecraft.backend.Models.Product();
        product.setId(3L);
        product.setStore(store);
        product.setCategoryProducts(new java.util.ArrayList<>());
        product.addCategory(category);
        
        when(categoryRepo.findById(2L)).thenReturn(Optional.of(category));
        when(productRepo.findById(3L)).thenReturn(Optional.of(product));
        when(productRepo.save(any(com.sitecraft.backend.Models.Product.class))).thenReturn(product);
        
        categoryService.removeProductFromCategory(2L, 3L, 1L);
        
        verify(categoryRepo).findById(2L);
        verify(productRepo).findById(3L);
        verify(productRepo).save(product);
    }

    @Test
    void testRemoveProductFromCategory_ProductNotInCategory_Throws() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        Category category = new Category();
        category.setId(2L);
        category.setStore(store);
        
        com.sitecraft.backend.Models.Product product = new com.sitecraft.backend.Models.Product();
        product.setId(3L);
        product.setStore(store);
        product.setCategoryProducts(new java.util.ArrayList<>());
        // Product not added to category
        
        when(categoryRepo.findById(2L)).thenReturn(Optional.of(category));
        when(productRepo.findById(3L)).thenReturn(Optional.of(product));
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> categoryService.removeProductFromCategory(2L, 3L, 1L));
        assertTrue(ex.getMessage().contains("Product does not belong to this category"));
    }

    @Test
    void testGetCategoryAnalytics_Success() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        when(storeRepo.findById(1L)).thenReturn(Optional.of(store));
        
        Category category1 = new Category();
        category1.setId(1L);
        category1.setName("Category 1");
        
        Category category2 = new Category();
        category2.setId(2L);
        category2.setName("Category 2");
        
        when(categoryRepo.findByStoreId(1L)).thenReturn(Arrays.asList(category1, category2));
        when(categoryRepo.countProductsByCategoryId(1L)).thenReturn(5L);
        when(categoryRepo.countProductsByCategoryId(2L)).thenReturn(0L);
        
        java.util.Map<String, Object> result = categoryService.getCategoryAnalytics(1L);
        
        assertNotNull(result);
        assertEquals(2L, result.get("totalCategories"));
        assertEquals(1L, result.get("categoriesWithProducts"));
        assertEquals(1L, result.get("categoriesWithoutProducts"));
        
        @SuppressWarnings("unchecked")
        java.util.Map<String, Object> topCategory = (java.util.Map<String, Object>) result.get("topPerformingCategory");
        assertNotNull(topCategory);
        assertEquals("Category 1", topCategory.get("name"));
        assertEquals(5L, topCategory.get("productCount"));
    }

    @Test
    void testGetCategoryAnalytics_StoreNotFound_Throws() {
        when(storeRepo.findById(1L)).thenReturn(Optional.empty());
        
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> categoryService.getCategoryAnalytics(1L));
        assertTrue(ex.getMessage().contains("Store not found"));
    }
} 