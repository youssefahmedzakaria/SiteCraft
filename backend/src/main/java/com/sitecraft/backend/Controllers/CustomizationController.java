package com.sitecraft.backend.Controllers;
import com.sitecraft.backend.DTOs.CustomizedTemplateDTO;
import com.sitecraft.backend.Models.Category;
import com.sitecraft.backend.Models.CustomizedTemplateSection;
import com.sitecraft.backend.Models.Product;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Repositories.StoreRepo;
import com.sitecraft.backend.Services.CategoryService;
import com.sitecraft.backend.Services.CustomizationService;
import com.sitecraft.backend.Services.ProductService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customize")
public class CustomizationController {

    @Autowired
    private CustomizationService customizationService;
    @Autowired
    private StoreRepo storeRepo;
    @Autowired
    private ProductService productService;
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/getTemplate")
    public ResponseEntity<?> getCustomizedTemplate(HttpSession session) {
        try {
//            Long storeId = (Long) session.getAttribute("storeId");
//            if (storeId == null) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("success", false, "message", "Store ID not found in session."));
//            }

            Long storeId = 1L;

            List<CustomizedTemplateSection> customizedTemplate = customizationService.getCustomizedTemplate(storeId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Customized Template retrieved successfully");
            response.put("Customized Template", customizedTemplate);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/getTemplateBySubdomain/{subdomain}")
    public ResponseEntity<?> getCustomizedTemplateBySubdomain(@PathVariable String subdomain, HttpSession session) {
        try {
            Store store = storeRepo.findBySubdomain(subdomain);
            Map<String, Object> response = new HashMap<>();

            if (store != null) {
                List<CustomizedTemplateSection> customizedTemplate = customizationService.getCustomizedTemplate(store.getId());

                response.put("success", true);
                response.put("message", "Customized Template retrieved successfully");
                response.put("Customized Template", customizedTemplate);

                session.setAttribute("commerce-storeId", store.getId());
            } else {
                response.put("success", false);
                response.put("message", "Subdomain doesn't exists");
            }


            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/addTemplate")
    public ResponseEntity<?> addCustomizedTemplate(HttpSession session, @RequestBody List<CustomizedTemplateDTO> dtoList) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            List<CustomizedTemplateSection> customizedTemplate = new ArrayList<>();
            for (CustomizedTemplateDTO dto : dtoList) {
                Store store = storeRepo.findById(storeId)
                        .orElseThrow(() -> new RuntimeException("Store not found"));

                CustomizedTemplateSection section = new CustomizedTemplateSection();
                section.setTitle(dto.title());
                section.setValue(dto.value());
                section.setIndex(dto.index());
                section.setStore(store);

                customizedTemplate.add(section);
            }

            customizationService.addCustomizedTemplate(storeId, customizedTemplate);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Customized Template added successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/editTemplate")
    public ResponseEntity<?> editCustomizedTemplate(HttpSession session, @RequestBody List<CustomizedTemplateDTO> dtoList) {
        try {
//            Long storeId = (Long) session.getAttribute("storeId");
//            if (storeId == null) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("success", false, "message", "Store ID not found in session."));
//            }

            Long storeId = 1L;

            List<CustomizedTemplateSection> customizedTemplate = new ArrayList<>();
            for (CustomizedTemplateDTO dto : dtoList) {
                Store store = storeRepo.findById(storeId)
                        .orElseThrow(() -> new RuntimeException("Store not found"));

                CustomizedTemplateSection section = new CustomizedTemplateSection();
                section.setTitle(dto.title());
                section.setValue(dto.value());
                section.setIndex(dto.index());
                section.setStore(store);

                customizedTemplate.add(section);
            }

            customizationService.editCustomizedTemplate(storeId, customizedTemplate);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Customized Template edited successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/saveImage")
    public ResponseEntity<?> saveImage(HttpSession session, @RequestPart(value = "image") MultipartFile image) {
        try {
//            Long storeId = (Long) session.getAttribute("storeId");
//            if (storeId == null) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("success", false, "message", "Store ID not found in session."));
//            }

            Long storeId = 1L;

            String filename = "customize" + storeId + "_" + image.getOriginalFilename();
            String relativePath = "/uploads/stores/" + storeId + "/customize/";
            String uploadDir = System.getProperty("user.dir") + relativePath;

            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();
            File destFile = new File(dir, filename);
            image.transferTo(destFile);

            String imagePath = "http://localhost:8080" + relativePath + filename;
            return ResponseEntity.ok().body(Map.of("success", true, "message", "Image saved successfully.", "url", imagePath));
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/getProducts")
    public ResponseEntity<?> getAllProducts(HttpSession session) {
        try {
//            Long storeId = (Long) session.getAttribute("storeId");
//            if (storeId == null) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("success", false, "message", "Store ID not found in session."));
//            }
            Long storeId = 1L;
            List<Product> products = productService.getAllProducts(storeId).stream().limit(6).collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Products retrieved successfully");
            response.put("products", products);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/getCategories")
    public ResponseEntity<?> getAllCategories(HttpSession session) {
        try {
//            Long storeId = (Long) session.getAttribute("storeId");
//            if (storeId == null) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("success", false, "message", "Store ID not found in session."));
//            }
            Long storeId = 1L;

            List<Category> categories = categoryService.getAllCategories(storeId).stream().limit(6).collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Categories retrieved successfully");
            response.put("categories", categories);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

}
