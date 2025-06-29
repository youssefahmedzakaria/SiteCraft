package com.sitecraft.backend.Controllers;
import com.sitecraft.backend.Models.CustomizedTemplateSection;
import com.sitecraft.backend.Services.CustomizationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customize/")
public class CustomizationController {

    @Autowired
    private CustomizationService customizationService;

    @GetMapping("/getTemplate")
    public ResponseEntity<?> getCustomizedTemplate(HttpSession session) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

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

    @PostMapping("/addTemplate")
    public ResponseEntity<?> addCustomizedTemplate(HttpSession session, @RequestBody List<CustomizedTemplateSection> customizedTemplate) {
        try {
            Long storeId = (Long) session.getAttribute("storeId");
            if (storeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Store ID not found in session."));
            }

            customizationService.addCustomizedTemplate(storeId,customizedTemplate);

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
}
