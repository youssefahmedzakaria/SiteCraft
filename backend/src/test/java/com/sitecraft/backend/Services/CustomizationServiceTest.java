package com.sitecraft.backend.Services;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import com.sitecraft.backend.Models.CustomizedTemplateSection;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Repositories.CustomizedTemplateSectionRepo;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class CustomizationServiceTest {
    @Mock
    private CustomizedTemplateSectionRepo customizedTemplateSectionRepo;

    @InjectMocks
    private CustomizationService customizationService;

    private ObjectMapper objectMapper = new ObjectMapper();

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetCustomizedTemplate_Success() {
        // Arrange
        CustomizedTemplateSection section1 = new CustomizedTemplateSection();
        section1.setId(1L);
        section1.setTitle("Header");
        section1.setIndex(0);
        section1.setValue(objectMapper.createObjectNode().put("text", "Custom Header"));

        CustomizedTemplateSection section2 = new CustomizedTemplateSection();
        section2.setId(2L);
        section2.setTitle("Footer");
        section2.setIndex(1);
        section2.setValue(objectMapper.createObjectNode().put("text", "Custom Footer"));

        List<CustomizedTemplateSection> expectedSections = Arrays.asList(section1, section2);
        when(customizedTemplateSectionRepo.findByStoreIdAndIndexNot(1L, -1)).thenReturn(expectedSections);

        // Act
        List<CustomizedTemplateSection> result = customizationService.getCustomizedTemplate(1L);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Header", result.get(0).getTitle());
        assertEquals("Footer", result.get(1).getTitle());
        verify(customizedTemplateSectionRepo).findByStoreIdAndIndexNot(1L, -1);
    }

    @Test
    void testGetCustomizedTemplate_EmptyResult() {
        // Arrange
        when(customizedTemplateSectionRepo.findByStoreIdAndIndexNot(1L, -1)).thenReturn(Collections.emptyList());

        // Act
        List<CustomizedTemplateSection> result = customizationService.getCustomizedTemplate(1L);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(customizedTemplateSectionRepo).findByStoreIdAndIndexNot(1L, -1);
    }

    @Test
    void testGetCustomizedTemplate_Exception() {
        // Arrange
        when(customizedTemplateSectionRepo.findByStoreIdAndIndexNot(1L, -1))
            .thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
            () -> customizationService.getCustomizedTemplate(1L));
        assertTrue(exception.getMessage().contains("Failed to get customized template sections"));
        verify(customizedTemplateSectionRepo).findByStoreIdAndIndexNot(1L, -1);
    }

    @Test
    void testAddCustomizedTemplate_Success() {
        // Arrange
        CustomizedTemplateSection section = new CustomizedTemplateSection();
        section.setTitle("Test Section");
        section.setIndex(0);
        section.setValue(objectMapper.createObjectNode().put("text", "Test Value"));

        List<CustomizedTemplateSection> sections = Arrays.asList(section);
        when(customizedTemplateSectionRepo.saveAll(sections)).thenReturn(sections);

        // Act
        assertDoesNotThrow(() -> customizationService.addCustomizedTemplate(1L, sections));

        // Assert
        verify(customizedTemplateSectionRepo).saveAll(sections);
    }

    @Test
    void testAddCustomizedTemplate_Exception() {
        // Arrange
        CustomizedTemplateSection section = new CustomizedTemplateSection();
        List<CustomizedTemplateSection> sections = Arrays.asList(section);
        when(customizedTemplateSectionRepo.saveAll(sections))
            .thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
            () -> customizationService.addCustomizedTemplate(1L, sections));
        assertTrue(exception.getMessage().contains("Failed to add customized template"));
        verify(customizedTemplateSectionRepo).saveAll(sections);
    }

    @Test
    void testEditCustomizedTemplate_NewSections() {
        // Arrange
        Long storeId = 1L;
        
        // No existing sections
        when(customizedTemplateSectionRepo.findByStoreId(storeId)).thenReturn(Collections.emptyList());
        when(customizedTemplateSectionRepo.findByStoreIdAndTitleAndIndex(storeId, "New Section", -1))
            .thenReturn(null);

        CustomizedTemplateSection newSection = new CustomizedTemplateSection();
        newSection.setTitle("New Section");
        newSection.setIndex(0);
        newSection.setValue(objectMapper.createObjectNode().put("text", "New Value"));
        newSection.setStore(new Store(storeId));

        List<CustomizedTemplateSection> newSections = Arrays.asList(newSection);
        when(customizedTemplateSectionRepo.save(newSection)).thenReturn(newSection);

        // Act
        assertDoesNotThrow(() -> customizationService.editCustomizedTemplate(storeId, newSections));

        // Assert
        verify(customizedTemplateSectionRepo).findByStoreId(storeId);
        verify(customizedTemplateSectionRepo).findByStoreIdAndTitleAndIndex(storeId, "New Section", -1);
        verify(customizedTemplateSectionRepo).save(newSection);
    }

    @Test
    void testEditCustomizedTemplate_UpdateExistingSections() {
        // Arrange
        Long storeId = 1L;
        
        // Existing section
        CustomizedTemplateSection existingSection = new CustomizedTemplateSection();
        existingSection.setId(1L);
        existingSection.setTitle("Existing Section");
        existingSection.setIndex(0);
        existingSection.setValue(objectMapper.createObjectNode().put("text", "Old Value"));
        existingSection.setStore(new Store(storeId));

        when(customizedTemplateSectionRepo.findByStoreId(storeId))
            .thenReturn(Arrays.asList(existingSection));

        // Updated section with same title but different value
        CustomizedTemplateSection updatedSection = new CustomizedTemplateSection();
        updatedSection.setTitle("Existing Section");
        updatedSection.setIndex(0);
        updatedSection.setValue(objectMapper.createObjectNode().put("text", "New Value"));

        List<CustomizedTemplateSection> newSections = Arrays.asList(updatedSection);
        when(customizedTemplateSectionRepo.save(existingSection)).thenReturn(existingSection);

        // Act
        assertDoesNotThrow(() -> customizationService.editCustomizedTemplate(storeId, newSections));

        // Assert
        verify(customizedTemplateSectionRepo).findByStoreId(storeId);
        verify(customizedTemplateSectionRepo).save(existingSection);
        assertEquals("{\"text\":\"New Value\"}", updatedSection.getValue().toString());
    }

    @Test
    void testEditCustomizedTemplate_ReactivateDeletedSection() {
        // Arrange
        Long storeId = 1L;
        
        // No active sections
        when(customizedTemplateSectionRepo.findByStoreId(storeId)).thenReturn(Collections.emptyList());
        
        // Deleted section (index = -1)
        CustomizedTemplateSection deletedSection = new CustomizedTemplateSection();
        deletedSection.setId(1L);
        deletedSection.setTitle("Deleted Section");
        deletedSection.setIndex(-1);
        deletedSection.setValue(objectMapper.createObjectNode().put("text", "Old Value"));
        deletedSection.setStore(new Store(storeId));

        when(customizedTemplateSectionRepo.findByStoreIdAndTitleAndIndex(storeId, "Deleted Section", -1))
            .thenReturn(deletedSection);

        // Reactivate section
        CustomizedTemplateSection reactivatedSection = new CustomizedTemplateSection();
        reactivatedSection.setTitle("Deleted Section");
        reactivatedSection.setIndex(0);
        reactivatedSection.setValue(objectMapper.createObjectNode().put("text", "New Value"));

        List<CustomizedTemplateSection> newSections = Arrays.asList(reactivatedSection);
        when(customizedTemplateSectionRepo.save(deletedSection)).thenReturn(deletedSection);

        // Act
        assertDoesNotThrow(() -> customizationService.editCustomizedTemplate(storeId, newSections));

        // Assert
        verify(customizedTemplateSectionRepo).findByStoreId(storeId);
        verify(customizedTemplateSectionRepo).findByStoreIdAndTitleAndIndex(storeId, "Deleted Section", -1);
        verify(customizedTemplateSectionRepo).save(deletedSection);
        assertEquals(0, deletedSection.getIndex());
        assertEquals("{\"text\":\"New Value\"}", reactivatedSection.getValue().toString());
    }

    @Test
    void testEditCustomizedTemplate_RemoveSections() {
        // Arrange
        Long storeId = 1L;
        
        // Existing sections
        CustomizedTemplateSection existingSection1 = new CustomizedTemplateSection();
        existingSection1.setId(1L);
        existingSection1.setTitle("Section 1");
        existingSection1.setIndex(0);
        existingSection1.setStore(new Store(storeId));

        CustomizedTemplateSection existingSection2 = new CustomizedTemplateSection();
        existingSection2.setId(2L);
        existingSection2.setTitle("Section 2");
        existingSection2.setIndex(1);
        existingSection2.setStore(new Store(storeId));

        when(customizedTemplateSectionRepo.findByStoreId(storeId))
            .thenReturn(Arrays.asList(existingSection1, existingSection2));

        // Only keep Section 1, remove Section 2
        CustomizedTemplateSection keepSection = new CustomizedTemplateSection();
        keepSection.setTitle("Section 1");
        keepSection.setIndex(0);
        keepSection.setValue(objectMapper.createObjectNode().put("text", "Value 1"));

        List<CustomizedTemplateSection> newSections = Arrays.asList(keepSection);
        when(customizedTemplateSectionRepo.save(existingSection1)).thenReturn(existingSection1);
        when(customizedTemplateSectionRepo.save(existingSection2)).thenReturn(existingSection2);

        // Act
        assertDoesNotThrow(() -> customizationService.editCustomizedTemplate(storeId, newSections));

        // Assert
        verify(customizedTemplateSectionRepo).findByStoreId(storeId);
        verify(customizedTemplateSectionRepo).save(existingSection1);
        verify(customizedTemplateSectionRepo).save(existingSection2);
        assertEquals(-1, existingSection2.getIndex()); // Marked as deleted
    }

    @Test
    void testEditCustomizedTemplate_Exception() {
        // Arrange
        Long storeId = 1L;
        when(customizedTemplateSectionRepo.findByStoreId(storeId))
            .thenThrow(new RuntimeException("Database error"));

        CustomizedTemplateSection section = new CustomizedTemplateSection();
        List<CustomizedTemplateSection> sections = Arrays.asList(section);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
            () -> customizationService.editCustomizedTemplate(storeId, sections));
        assertTrue(exception.getMessage().contains("Failed to edit customized template"));
        verify(customizedTemplateSectionRepo).findByStoreId(storeId);
    }
} 