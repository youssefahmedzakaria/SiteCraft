package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.Category;
import com.sitecraft.backend.Models.Product;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Repositories.CategoryRepo;
import com.sitecraft.backend.Repositories.ProductRepo;
import com.sitecraft.backend.Repositories.StoreRepo;
import com.sitecraft.backend.DTOs.CategoryCreateDTO;
import com.sitecraft.backend.DTOs.CategoryResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private StoreRepo storeRepo;

    // Basic CRUD Operations
    public List<CategoryResponseDTO> getAllCategories(Long storeId) {
        Store existingStore = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        List<Category> categories = categoryRepo.findByStoreId(existingStore.getId());
        
        // Add product count to each category
        for (Category category : categories) {
            Long productCount = categoryRepo.countProductsByCategoryId(category.getId());
            // We'll add this as a transient field or use a DTO
            // For now, we'll use a custom query approach
        }
        
        return categories.stream()
                .map(category -> new CategoryResponseDTO(category, categoryRepo.countProductsByCategoryId(category.getId())))
                .collect(Collectors.toList());
    }

    public Category getCategoryById(Long id, Long storeId) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Validate store ID match
        if (!category.getStore().getId().equals(storeId)) {
            throw new RuntimeException("Unauthorized access to this category");
        }

        return category;
    }

    public Category createCategory(CategoryCreateDTO categoryDTO, Long storeId, MultipartFile image) throws IOException {
        Store existingStore = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        if (categoryRepo.existsByNameAndStoreId(categoryDTO.getName(), storeId)) {
            throw new RuntimeException("Category name already exists in this store");
        }

        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());
        category.setStore(existingStore);

        if (image != null && !image.isEmpty()) {
            String imageUrl = saveCategoryImage(storeId, category.getName(), image);
            category.setImage(imageUrl);
        }

        return categoryRepo.save(category);
    }

    public Category updateCategory(Long id, CategoryCreateDTO categoryDTO, Long storeId, MultipartFile image) throws IOException {
        Category existingCategory = getCategoryById(id, storeId);

        if (categoryDTO.getName() != null) {
            if (!existingCategory.getName().equals(categoryDTO.getName()) &&
                categoryRepo.existsByNameAndStoreId(categoryDTO.getName(), storeId)) {
                throw new RuntimeException("Category name already exists in this store");
            }
            existingCategory.setName(categoryDTO.getName());
        }

        if (categoryDTO.getDescription() != null) {
            existingCategory.setDescription(categoryDTO.getDescription());
        }

        if (image != null && !image.isEmpty()) {
            if (existingCategory.getImage() != null && !existingCategory.getImage().isEmpty()) {
                deleteCategoryImageFile(existingCategory.getImage());
            }
            String newImageUrl = saveCategoryImage(storeId, existingCategory.getName(), image);
            existingCategory.setImage(newImageUrl);
        }

        return categoryRepo.save(existingCategory);
    }

    public void deleteCategory(Long id, Long storeId) {
        Category category = getCategoryById(id, storeId);

        // Check if category has products
        Long productCount = categoryRepo.countProductsByCategoryId(id);
        if (productCount > 0) {
            throw new RuntimeException("Cannot delete category with products. Please move or delete products first.");
        }

        deleteCategoryImageFile(category.getImage());
        categoryRepo.deleteById(id);
    }

    // Product assignment
    public List<com.sitecraft.backend.DTOs.ProductDTO> getCategoryProducts(Long categoryId, Long storeId) {
        Category category = getCategoryById(categoryId, storeId);
        List<Product> products = category.getProducts();
        return products.stream()
                .map(product -> new com.sitecraft.backend.DTOs.ProductDTO(product))
                .collect(Collectors.toList());
    }

    public void assignProductsToCategory(Long categoryId, List<Long> productIds, Long storeId) {
        Category category = getCategoryById(categoryId, storeId);

        List<Product> products = productRepo.findAllById(productIds);
        for (Product product : products) {
            if (!product.getStore().getId().equals(storeId)) {
                throw new RuntimeException("Product does not belong to this store");
            }
            // Only add if not already assigned
            if (product.getCategories() == null || product.getCategories().stream().noneMatch(cat -> cat.getId().equals(categoryId))) {
                product.addCategory(category);
            }
        }

        productRepo.saveAll(products);
    }

    public void removeProductFromCategory(Long categoryId, Long productId, Long storeId) {
        Category category = getCategoryById(categoryId, storeId); // Validate category access

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getStore().getId().equals(storeId)) {
            throw new RuntimeException("Product does not belong to this store");
        }

        // Check if product belongs to this category
        boolean belongsToCategory = product.getCategories() != null && 
                                   product.getCategories().stream()
                                   .anyMatch(cat -> cat.getId().equals(categoryId));
        
        if (!belongsToCategory) {
            throw new RuntimeException("Product does not belong to this category");
        }

        product.removeCategory(category);
        productRepo.save(product);
    }

    // Analytics
    public Map<String, Object> getCategoryAnalytics(Long storeId) {
        Store existingStore = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        List<Category> categories = categoryRepo.findByStoreId(storeId);
        Map<String, Object> analytics = new HashMap<>();

        Long totalCategories = (long) categories.size();
        Long categoriesWithProducts = 0L;
        String topCategoryName = "";
        Long maxProducts = 0L;

        for (Category category : categories) {
            Long productCount = categoryRepo.countProductsByCategoryId(category.getId());
            if (productCount > 0) {
                categoriesWithProducts++;
            }
            if (productCount > maxProducts) {
                maxProducts = productCount;
                topCategoryName = category.getName();
            }
        }

        analytics.put("totalCategories", totalCategories);
        analytics.put("categoriesWithProducts", categoriesWithProducts);
        analytics.put("categoriesWithoutProducts", totalCategories - categoriesWithProducts);

        if (!topCategoryName.isEmpty()) {
            Map<String, Object> topCategory = new HashMap<>();
            topCategory.put("name", topCategoryName);
            topCategory.put("productCount", maxProducts);
            analytics.put("topPerformingCategory", topCategory);
        }

        return analytics;
    }

    private String saveCategoryImage(Long storeId, String categoryName, MultipartFile image) throws IOException {
        String uploadDir = System.getProperty("user.dir") + "/uploads/stores/" + storeId + "/categories/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String categoryNameSlug = categoryName.toLowerCase().replaceAll("[^a-z0-9]+", "-");
        String filename = categoryNameSlug + "_" + storeId + "_" + System.currentTimeMillis() + ".png";

        File destFile = new File(dir, filename);
        image.transferTo(destFile);

        return "http://localhost:8080/uploads/stores/" + storeId + "/categories/" + filename;
    }

    private void deleteCategoryImageFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return;
        String relativePath;
        if (imageUrl.startsWith("http://localhost:8080")) {
            relativePath = imageUrl.substring("http://localhost:8080".length());
        } else {
            relativePath = imageUrl;
        }
        String path = System.getProperty("user.dir") + relativePath;
        File file = new File(path);
        if (file.exists()) {
            file.delete();
        }
    }
}