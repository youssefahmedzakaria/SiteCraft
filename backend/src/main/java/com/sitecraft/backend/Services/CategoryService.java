package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.Category;
import com.sitecraft.backend.Models.Customer;
import com.sitecraft.backend.Models.Product;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Repositories.CategoryRepo;
import com.sitecraft.backend.Repositories.ProductRepo;
import com.sitecraft.backend.Repositories.StoreRepo;
import com.sitecraft.backend.DTOs.CategoryCreateDTO;
import com.sitecraft.backend.DTOs.CategoryResponseDTO;
import com.sitecraft.backend.DTOs.CategoryImportDTO;
import com.sitecraft.backend.DTOs.CategoryExportDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.ArrayList;
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

    // Excel Import/Export Methods
    public Map<String, Object> importCategoriesFromExcel(MultipartFile file, Long storeId) throws IOException {
        Store existingStore = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        List<CategoryImportDTO> categoriesToImport = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        int successCount = 0;
        int errorCount = 0;

        try (InputStream is = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(is)) {
            
            Sheet sheet = workbook.getSheetAt(0);
            int rowNum = 0;
            
            for (Row row : sheet) {
                rowNum++;
                if (rowNum == 1) continue; // Skip header row
                
                try {
                    String name = getCellValueAsString(row.getCell(0));
                    String description = getCellValueAsString(row.getCell(1));
                    
                    if (name == null || name.trim().isEmpty()) {
                        errors.add("Row " + rowNum + ": Category name is required");
                        errorCount++;
                        continue;
                    }
                    
                    name = name.trim();
                    description = description != null ? description.trim() : "";
                    
                    // Check for duplicate names
                    if (categoryRepo.existsByNameAndStoreId(name, storeId)) {
                        errors.add("Row " + rowNum + ": Category '" + name + "' already exists");
                        errorCount++;
                        continue;
                    }
                    
                    categoriesToImport.add(new CategoryImportDTO(name, description));
                    
                } catch (Exception e) {
                    errors.add("Row " + rowNum + ": " + e.getMessage());
                    errorCount++;
                }
            }
        }

        // Create categories in batch
        for (CategoryImportDTO categoryDTO : categoriesToImport) {
            try {
                Category category = new Category();
                category.setName(categoryDTO.getName());
                category.setDescription(categoryDTO.getDescription());
                category.setStore(existingStore);
                categoryRepo.save(category);
                successCount++;
            } catch (Exception e) {
                errors.add("Failed to create category '" + categoryDTO.getName() + "': " + e.getMessage());
                errorCount++;
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("successCount", successCount);
        result.put("errorCount", errorCount);
        result.put("errors", errors);
        result.put("totalProcessed", successCount + errorCount);
        
        return result;
    }

    public byte[] exportCategoriesToExcel(Long storeId) throws IOException {
        Store existingStore = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        List<Category> categories = categoryRepo.findByStoreId(storeId);
        List<CategoryExportDTO> exportData = new ArrayList<>();

        for (Category category : categories) {
            Long productCount = categoryRepo.countProductsByCategoryId(category.getId());
            exportData.add(new CategoryExportDTO(
                category.getName(),
                category.getDescription(),
                productCount,
                category.getCreatedAt()
            ));
        }

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Categories");
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = createHeaderStyle(workbook);
            
            String[] headers = {"Name", "Description", "Number of Products", "Created Date"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Create data rows
            CellStyle dateStyle = createDateStyle(workbook);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            
            for (int i = 0; i < exportData.size(); i++) {
                Row row = sheet.createRow(i + 1);
                CategoryExportDTO category = exportData.get(i);
                
                row.createCell(0).setCellValue(category.getName());
                row.createCell(1).setCellValue(category.getDescription());
                row.createCell(2).setCellValue(category.getProductCount());
                
                Cell dateCell = row.createCell(3);
                dateCell.setCellValue(category.getCreatedAt().format(formatter));
                dateCell.setCellStyle(dateStyle);
            }
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return out.toByteArray();
        }
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return null;
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                }
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return null;
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 12);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        return style;
    }

    private CellStyle createDateStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setDataFormat(workbook.createDataFormat().getFormat("yyyy-mm-dd hh:mm:ss"));
        return style;
    }
}