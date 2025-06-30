package com.sitecraft.backend.Services;
import com.sitecraft.backend.Models.CustomizedTemplateSection;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Repositories.CustomizedTemplateSectionRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

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
        try {
            customizedTemplateSectionRepo.saveAll(customizedTemplate);
        } catch (Exception e) {
            throw new RuntimeException("Failed to add customized template: " + e.getMessage());
        }
    }

    @Transactional
    public void editCustomizedTemplate(Long storeId, List<CustomizedTemplateSection> customizedTemplate) {
        try {
            List<CustomizedTemplateSection> oldSections = customizedTemplateSectionRepo.findByStoreId(storeId);

            Map<String, CustomizedTemplateSection> oldByTitle = oldSections.stream()
                    .collect(Collectors.toMap(CustomizedTemplateSection::getTitle, s -> s));

            Set<String> newTitles = customizedTemplate.stream()
                    .map(CustomizedTemplateSection::getTitle)
                    .collect(Collectors.toSet());

            // Track handled titles
            Set<String> handledTitles = new HashSet<>();

            for (CustomizedTemplateSection newSection : customizedTemplate) {
                String title = newSection.getTitle();
                CustomizedTemplateSection old = oldByTitle.get(title);

                if (old == null) {
                    // New section — check if it was previously deleted
                    CustomizedTemplateSection deleted = customizedTemplateSectionRepo
                            .findByStoreIdAndTitleAndIndex(storeId, title, -1);

                    if (deleted != null) {
                        // Reactivate deleted section
                        deleted.setIndex(newSection.getIndex());
                        deleted.setValue(newSection.getValue());
                        customizedTemplateSectionRepo.save(deleted);
                    } else {
                        // Completely new section
                        newSection.setStore(new Store(storeId)); // just set reference
                        customizedTemplateSectionRepo.save(newSection);
                    }
                } else {
                    // Existing section — update value/index if changed
                    if (!Objects.equals(old.getIndex(), newSection.getIndex()) ||
                            !Objects.equals(old.getValue(), newSection.getValue())) {
                        old.setIndex(newSection.getIndex());
                        old.setValue(newSection.getValue());
                        customizedTemplateSectionRepo.save(old);
                    }
                }
                handledTitles.add(title);
            }

            // Mark removed sections
            for (CustomizedTemplateSection old : oldSections) {
                if (!handledTitles.contains(old.getTitle()) && old.getIndex() != -1) {
                    old.setIndex(-1); // mark as deleted
                    customizedTemplateSectionRepo.save(old);
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to edit customized template: " + e.getMessage(), e);
        }
    }

}
