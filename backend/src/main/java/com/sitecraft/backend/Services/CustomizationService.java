package com.sitecraft.backend.Services;
import com.sitecraft.backend.Models.CustomizedTemplateSection;
import com.sitecraft.backend.Repositories.CustomizedTemplateSectionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomizationService {
    @Autowired
    private CustomizedTemplateSectionRepo customizedTemplateSectionRepo;
    public List<CustomizedTemplateSection> getCustomizedTemplate(Long storeId) {
        try {
            return customizedTemplateSectionRepo.findByStoreId(storeId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get customized template sections: " + e.getMessage());
        }
    }

    public void addCustomizedTemplate(Long storeId, List<CustomizedTemplateSection> customizedTemplate) {
        
    }
}
