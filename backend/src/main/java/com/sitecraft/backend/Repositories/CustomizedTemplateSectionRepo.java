package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.CustomizedTemplateSection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomizedTemplateSectionRepo extends JpaRepository <CustomizedTemplateSection, Long> {
    List<CustomizedTemplateSection> findByStoreId(Long storeId);
    List<CustomizedTemplateSection> findByStoreIdAndIndexNot(Long storeId, int index);
    CustomizedTemplateSection findByStoreIdAndTitleAndIndex(Long storeId, String title, int index);

}
