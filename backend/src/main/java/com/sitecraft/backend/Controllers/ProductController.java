package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.DTOs.ProductCreateDTO;
import com.sitecraft.backend.Models.Product;
import com.sitecraft.backend.Models.ProductImage;
import com.sitecraft.backend.Services.ProductService;
import com.sitecraft.backend.Services.LowStockNotificationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private LowStockNotificationService lowStockNotificationService;

    @GetMapping
    public ResponseEntity<?> getAllProducts(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            List<Product> products = productService.getAllProducts(storeId);
            List<com.sitecraft.backend.DTOs.ProductDTO> productDTOs = products.stream()
                    .map(product -> new com.sitecraft.backend.DTOs.ProductDTO(product))
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Products retrieved successfully");
            response.put("data", productDTOs);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            Product product = productService.getProductById(id, storeId);
            com.sitecraft.backend.DTOs.ProductDTO productDTO = new com.sitecraft.backend.DTOs.ProductDTO(product);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product retrieved successfully");
            response.put("data", productDTO);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("create")
    public ResponseEntity<?> createProduct(
        @RequestPart("product") String productJson,
        @RequestPart(value = "images", required = false) List<MultipartFile> images,
        HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }
            ObjectMapper mapper = new ObjectMapper();
            ProductCreateDTO productDTO = mapper.readValue(productJson, ProductCreateDTO.class);
            Product product = productService.createProductWithImages(productDTO, storeId, images);
            
            // Check low stock level for the newly created product
            lowStockNotificationService.checkAndSendLowStockNotification(product);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product created successfully");
            response.put("data", product);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("update/{id}")
    public ResponseEntity<?> updateProduct(
        @PathVariable Long id,
        @RequestPart("product") String productJson,
        @RequestPart(value = "images", required = false) List<MultipartFile> images,
        HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }
            ObjectMapper mapper = new ObjectMapper();
            ProductCreateDTO productDTO = mapper.readValue(productJson, ProductCreateDTO.class);
            Product product = productService.updateProductWithImages(id, productDTO, storeId, images);
            
            // Check low stock level for the updated product
            lowStockNotificationService.checkAndSendLowStockNotification(product);
            
            com.sitecraft.backend.DTOs.ProductDTO productResponseDTO = new com.sitecraft.backend.DTOs.ProductDTO(product);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product updated successfully");
            response.put("data", productResponseDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            productService.deleteProduct(id, storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product deleted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /*
    @GetMapping("/filter")
    public ResponseEntity<List<Product>> getFilteredProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String stockStatus,
            @RequestParam(required = false) String search,
            @RequestParam Long storeId) {
        
        List<Product> products = productService.filterProducts(category, stockStatus, search, storeId);
        return ResponseEntity.ok(products);
    }
    */

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getProductStatistics(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            Map<String, Object> stats = productService.getProductStatistics(storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Statistics retrieved successfully");
            response.put("data", stats);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/low-stock")
    public ResponseEntity<?> getLowStockItems(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            List<Product> products = productService.getLowStockItems(storeId);
            List<com.sitecraft.backend.DTOs.ProductDTO> productDTOs = products.stream()
                    .map(product -> new com.sitecraft.backend.DTOs.ProductDTO(product))
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Low stock items retrieved successfully");
            response.put("data", productDTOs);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/out-of-stock")
    public ResponseEntity<?> getOutOfStockItems(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            List<Product> products = productService.getOutOfStockItems(storeId);
            List<com.sitecraft.backend.DTOs.ProductDTO> productDTOs = products.stream()
                    .map(product -> new com.sitecraft.backend.DTOs.ProductDTO(product))
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Out of stock items retrieved successfully");
            response.put("data", productDTOs);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/apply-discount")
    public ResponseEntity<?> applyDiscountToProducts(@RequestBody Map<String, Object> discountData, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            @SuppressWarnings("unchecked")
            List<Long> productIds = (List<Long>) discountData.get("productIds");
            String discountType = (String) discountData.get("discountType");
            Number discountValueNum = (Number) discountData.get("discountValue");
            Double discountValue = discountValueNum == null ? null : discountValueNum.doubleValue();

            Map<String, Object> result = productService.applyDiscountToProducts(
                    productIds, discountType, discountValue, storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Discount applied successfully");
            response.put("data", result);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /*
    @PostMapping("/{id}/upload-images")
    public ResponseEntity<?> uploadProductImages(@PathVariable Long id, 
                                               @RequestParam("images") MultipartFile[] images, 
                                               HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            // Validate images
            if (images == null || images.length == 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "No images provided"));
            }

            List<MultipartFile> imageList = Arrays.asList(images);
            List<String> imageUrls = productService.uploadProductImages(id, imageList, storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Images uploaded successfully");
            response.put("data", imageUrls);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    */

    @GetMapping("/{id}/images")
    public ResponseEntity<?> getProductImages(@PathVariable Long id, HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            Product product = productService.getProductById(id, storeId);
            List<ProductImage> images = product.getImages();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Images retrieved successfully");
            response.put("data", images);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{productId}/images/{imageId}")
    public ResponseEntity<?> deleteProductImage(
        @PathVariable Long productId,
        @PathVariable Long imageId,
        HttpSession session
    ) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }
            productService.deleteProductImage(productId, imageId, storeId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Image deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ==================== LOW STOCK NOTIFICATION ENDPOINTS ====================

    @GetMapping("/low-stock-notifications")
    public ResponseEntity<?> getLowStockNotifications(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            Map<String, Object> stats = lowStockNotificationService.getLowStockStatistics(storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Low stock notifications retrieved successfully");
            response.put("data", stats);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/import")
    public ResponseEntity<?> importProducts(@RequestParam("file") MultipartFile file, HttpSession session) {
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

            Map<String, Object> importResult = productService.importProductsFromExcel(file, storeId);

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
    public ResponseEntity<?> exportProducts(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            byte[] excelData = productService.exportProductsToExcel(storeId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "products_export.xlsx");

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