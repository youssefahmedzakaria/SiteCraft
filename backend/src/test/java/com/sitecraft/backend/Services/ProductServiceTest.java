package com.sitecraft.backend.Services;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import com.sitecraft.backend.DTOs.ProductCreateDTO;
import java.util.Optional;
import java.util.Collections;
import java.util.List;
import java.math.BigDecimal;

public class ProductServiceTest {
    @Mock private ProductRepo productRepo;
    @Mock private ProductVariantsRepo productVariantsRepo;
    @Mock private ProductImageRepo productImageRepo;
    @Mock private CategoryRepo categoryRepo;
    @Mock private StoreRepo storeRepo;
    @Mock private OrderRepo orderRepo;
    @Mock private OrderProductRepo orderProductRepo;
    @Mock private WishListProductRepo wishListProductRepo;
    @Mock private CartProductRepo cartProductRepo;
    @Mock private CategoryProductRepo categoryProductRepo;
    @Mock private ReviewRepo reviewRepo;
    @Mock private AttributeValueRepo attributeValueRepo;
    @Mock private ProductAttributeRepo productAttributeRepo;
    @Mock private VariantAttributeValueRepo variantAttributeValueRepo;

    @InjectMocks
    private ProductService productService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllProducts() {
        Product product = mock(Product.class);
        when(productRepo.findByStoreIdWithCategory(1L)).thenReturn(Collections.singletonList(product));
        List<Product> result = productService.getAllProducts(1L);
        assertEquals(1, result.size());
        assertEquals(product, result.get(0));
    }

    @Test
    void testGetProductById_Success() {
        Product product = mock(Product.class);
        when(productRepo.findByIdAndStoreId(2L, 1L)).thenReturn(Optional.of(product));
        Product result = productService.getProductById(2L, 1L);
        assertEquals(product, result);
    }

    @Test
    void testGetProductById_NotFound() {
        when(productRepo.findByIdAndStoreId(2L, 1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> productService.getProductById(2L, 1L));
        assertTrue(ex.getMessage().contains("Product not found"));
    }

    @Test
    void testCreateProduct_Success() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        when(storeRepo.findById(1L)).thenReturn(Optional.of(store));
        Category category = mock(Category.class);
        when(categoryRepo.findById(2L)).thenReturn(Optional.of(category));
        ProductCreateDTO dto = mock(ProductCreateDTO.class);
        when(dto.getName()).thenReturn("Test Product");
        when(dto.getDescription()).thenReturn("desc");
        when(dto.getDiscountType()).thenReturn(null);
        when(dto.getDiscountValue()).thenReturn(null);
        when(dto.getMinCap()).thenReturn(null);
        when(dto.getPercentageMax()).thenReturn(null);
        when(dto.getMaxCap()).thenReturn(null);
        when(dto.getCategoryId()).thenReturn(2L);
        Product savedProduct = new Product();
        savedProduct.setName("Test Product");
        savedProduct.setDescription("desc");
        savedProduct.setStore(store);
        savedProduct.setCategory(category);
        when(productRepo.save(any(Product.class))).thenReturn(savedProduct);
        when(categoryProductRepo.save(any(CategoryProduct.class))).thenReturn(new CategoryProduct());
        Product result = productService.createProduct(dto, 1L);
        assertEquals("Test Product", result.getName());
        assertEquals("desc", result.getDescription());
        assertEquals(store, result.getStore());
        assertEquals(category, result.getCategory());
    }

    @Test
    void testCreateProduct_StoreNotFound() {
        when(storeRepo.findById(1L)).thenReturn(Optional.empty());
        ProductCreateDTO dto = mock(ProductCreateDTO.class);
        when(dto.getCategoryId()).thenReturn(2L);
        RuntimeException ex = assertThrows(RuntimeException.class, () -> productService.createProduct(dto, 1L));
        assertTrue(ex.getMessage().contains("Store not found"));
    }

    @Test
    void testCreateProduct_CategoryNotFound() {
        Store store = mock(Store.class);
        when(store.getId()).thenReturn(1L);
        when(storeRepo.findById(1L)).thenReturn(Optional.of(store));
        when(categoryRepo.findById(2L)).thenReturn(Optional.empty());
        ProductCreateDTO dto = mock(ProductCreateDTO.class);
        when(dto.getCategoryId()).thenReturn(2L);
        RuntimeException ex = assertThrows(RuntimeException.class, () -> productService.createProduct(dto, 1L));
        assertTrue(ex.getMessage().contains("Category not found"));
    }

    // TODO: Implement tests for updateProduct, deleteProduct, getProductStatistics, getLowStockItems, getOutOfStockItems, and other edge cases
} 