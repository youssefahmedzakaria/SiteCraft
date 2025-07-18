package com.sitecraft.backend.Controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sitecraft.backend.Models.Category;
import com.sitecraft.backend.Models.Product;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Services.CategoryService;
import com.sitecraft.backend.DTOs.CategoryCreateDTO;
import com.sitecraft.backend.DTOs.CategoryResponseDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<?> getAllCategories(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            List<CategoryResponseDTO> categories = categoryService.getAllCategories(storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Categories retrieved successfully");
            response.put("data", categories);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            Category category = categoryService.getCategoryById(id, storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Category retrieved successfully");
            response.put("data", category);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createCategory(
            @RequestPart("category") String categoryJson,
            @RequestPart(value = "image", required = false) MultipartFile image,
            HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            ObjectMapper mapper = new ObjectMapper();
            CategoryCreateDTO categoryDTO = mapper.readValue(categoryJson, CategoryCreateDTO.class);

            Category savedCategory = categoryService.createCategory(categoryDTO, storeId, image);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Category created successfully");
            response.put("data", savedCategory);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @RequestPart("category") String categoryJson,
            @RequestPart(value = "image", required = false) MultipartFile image,
            HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            ObjectMapper mapper = new ObjectMapper();
            CategoryCreateDTO categoryDTO = mapper.readValue(categoryJson, CategoryCreateDTO.class);

            Category category = categoryService.updateCategory(id, categoryDTO, storeId, image);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Category updated successfully");
            response.put("data", category);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            categoryService.deleteCategory(id, storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Category deleted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /*
    @GetMapping("/search")
    public ResponseEntity<?> searchCategories(@RequestParam(required = false) String q, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            List<Category> categories = categoryService.searchCategories(q, storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Categories searched successfully");
            response.put("data", categories);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    */

    @GetMapping("/{id}/products")
    public ResponseEntity<?> getCategoryProducts(@PathVariable Long id, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            List<com.sitecraft.backend.DTOs.ProductDTO> products = categoryService.getCategoryProducts(id, storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Category products retrieved successfully");
            response.put("data", products);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/{id}/products")
    public ResponseEntity<?> assignProductsToCategory(@PathVariable Long id, @RequestBody Map<String, List<Long>> request, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            List<Long> productIds = request.get("productIds");
            categoryService.assignProductsToCategory(id, productIds, storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Products assigned to category successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}/products/{productId}")
    public ResponseEntity<?> removeProductFromCategory(@PathVariable Long id, @PathVariable Long productId, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            categoryService.removeProductFromCategory(id, productId, storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product removed from category successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getCategoryAnalytics(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            Map<String, Object> analytics = categoryService.getCategoryAnalytics(storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Analytics retrieved successfully");
            response.put("data", analytics);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getCategoryStats(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            Map<String, Object> analytics = categoryService.getCategoryAnalytics(storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Statistics retrieved successfully");
            response.put("data", analytics);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/import")
    public ResponseEntity<?> importCategories(@RequestParam("file") MultipartFile file, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Please select a file to upload."));
            }

            String fileName = file.getOriginalFilename();
            if (fileName == null || (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls") && !fileName.endsWith(".csv"))) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Please upload an Excel file (.xlsx, .xls) or CSV file."));
            }

            // Check file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "File size must be less than 5MB."));
            }

            Map<String, Object> importResult = categoryService.importCategoriesFromExcel(file, storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Import completed");
            response.put("data", importResult);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/export")
    public ResponseEntity<?> exportCategories(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            byte[] excelData = categoryService.exportCategoriesToExcel(storeId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "categories_export.xlsx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelData);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}