package com.sitecraft.backend.Controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sitecraft.backend.DTOs.CategoryResponseDTO;
import com.sitecraft.backend.DTOs.CustomizedTemplateDTO;
import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.StoreRepo;
import com.sitecraft.backend.Services.CategoryService;
import com.sitecraft.backend.Services.CustomizationService;
import com.sitecraft.backend.Services.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CustomizationController.class)
@AutoConfigureMockMvc(addFilters = false)
public class CustomizationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CustomizationService customizationService;

    @MockBean
    private StoreRepo storeRepo;

    @MockBean
    private ProductService productService;

    @MockBean
    private CategoryService categoryService;

    @Autowired
    private ObjectMapper objectMapper;

    private MockHttpSession session;
    private Store store;
    private CustomizedTemplateSection templateSection;
    private Product product;
    private Category category;
    private CategoryResponseDTO categoryResponseDTO;

    @BeforeEach
    void setUp() {
        session = new MockHttpSession();
        session.setAttribute("storeId", 1L);

        // Setup store
        store = new Store();
        store.setId(1L);
        store.setStoreName("Test Store");
        store.setSubdomain("teststore");

        // Setup template section
        templateSection = new CustomizedTemplateSection();
        templateSection.setId(1L);
        templateSection.setTitle("Test Section");
        try {
            templateSection.setValue(new ObjectMapper().readTree("\"Test Value\""));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        templateSection.setIndex(1);
        templateSection.setStore(store);

        // Setup product
        product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setDescription("Test Description");
        product.setStore(store);

        // Setup category
        category = new Category();
        category.setId(1L);
        category.setName("Test Category");
        category.setStore(store);

        // Setup category response DTO
        categoryResponseDTO = new CategoryResponseDTO();
        categoryResponseDTO.setId(1L);
        categoryResponseDTO.setName("Test Category");
    }

    @Test
    void testGetCustomizedTemplate_Success() throws Exception {
        // Arrange
        List<CustomizedTemplateSection> templateSections = Arrays.asList(templateSection);
        when(customizationService.getCustomizedTemplate(1L)).thenReturn(templateSections);

        // Act & Assert
        mockMvc.perform(get("/customize/getTemplate")
                .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Customized Template retrieved successfully"))
                .andExpect(jsonPath("$.['Customized Template'][0].id").value(1))
                .andExpect(jsonPath("$.['Customized Template'][0].title").value("Test Section"))
                .andExpect(jsonPath("$.['Customized Template'][0].value").value("Test Value"));

        verify(customizationService).getCustomizedTemplate(1L);
    }

    @Test
    void testGetCustomizedTemplate_Unauthorized() throws Exception {
        // Arrange
        MockHttpSession emptySession = new MockHttpSession();

        // Act & Assert
        mockMvc.perform(get("/customize/getTemplate")
                .session(emptySession))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Store ID not found in session."));

        verify(customizationService, never()).getCustomizedTemplate(any());
    }

    @Test
    void testGetCustomizedTemplate_ServiceException() throws Exception {
        // Arrange
        when(customizationService.getCustomizedTemplate(1L))
                .thenThrow(new RuntimeException("Service error"));

        // Act & Assert
        mockMvc.perform(get("/customize/getTemplate")
                .session(session))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Service error"));

        verify(customizationService).getCustomizedTemplate(1L);
    }

    @Test
    void testGetCustomizedTemplateBySubdomain_Success() throws Exception {
        // Arrange
        List<CustomizedTemplateSection> templateSections = Arrays.asList(templateSection);
        when(storeRepo.findBySubdomain("teststore")).thenReturn(store);
        when(customizationService.getCustomizedTemplate(1L)).thenReturn(templateSections);

        // Act & Assert
        mockMvc.perform(get("/customize/getTemplateBySubdomain/teststore")
                .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Customized Template retrieved successfully"))
                .andExpect(jsonPath("$.['Customized Template'][0].id").value(1));

        verify(storeRepo).findBySubdomain("teststore");
        verify(customizationService).getCustomizedTemplate(1L);
    }

    @Test
    void testGetCustomizedTemplateBySubdomain_SubdomainNotFound() throws Exception {
        // Arrange
        when(storeRepo.findBySubdomain("nonexistent")).thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/customize/getTemplateBySubdomain/nonexistent")
                .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Subdomain doesn't exists"));

        verify(storeRepo).findBySubdomain("nonexistent");
        verify(customizationService, never()).getCustomizedTemplate(any());
    }

    @Test
    void testGetCustomizedTemplateBySubdomain_ServiceException() throws Exception {
        // Arrange
        when(storeRepo.findBySubdomain("teststore")).thenReturn(store);
        when(customizationService.getCustomizedTemplate(1L))
                .thenThrow(new RuntimeException("Service error"));

        // Act & Assert
        mockMvc.perform(get("/customize/getTemplateBySubdomain/teststore")
                .session(session))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Service error"));

        verify(storeRepo).findBySubdomain("teststore");
        verify(customizationService).getCustomizedTemplate(1L);
    }

    @Test
    void testAddCustomizedTemplate_Success() throws Exception {
        // Arrange
        ObjectMapper om = new ObjectMapper();
        List<CustomizedTemplateDTO> dtoList = java.util.Collections.singletonList(
                new CustomizedTemplateDTO("Test Section", om.readTree("\"Test Value\""), 1)
        );
        when(storeRepo.findById(1L)).thenReturn(Optional.of(store));
        doNothing().when(customizationService).addCustomizedTemplate(eq(1L), anyList());

        // Act & Assert
        mockMvc.perform(post("/customize/addTemplate")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoList)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Customized Template added successfully"));

        verify(storeRepo).findById(1L);
        verify(customizationService).addCustomizedTemplate(eq(1L), anyList());
    }

    @Test
    void testAddCustomizedTemplate_Unauthorized() throws Exception {
        // Arrange
        MockHttpSession emptySession = new MockHttpSession();
        ObjectMapper om = new ObjectMapper();
        List<CustomizedTemplateDTO> dtoList = java.util.Collections.singletonList(
                new CustomizedTemplateDTO("Test Section", om.readTree("\"Test Value\""), 1)
        );

        // Act & Assert
        mockMvc.perform(post("/customize/addTemplate")
                .session(emptySession)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoList)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Store ID not found in session."));

        verify(storeRepo, never()).findById(any());
        verify(customizationService, never()).addCustomizedTemplate(any(), any());
    }

    @Test
    void testAddCustomizedTemplate_StoreNotFound() throws Exception {
        // Arrange
        ObjectMapper om = new ObjectMapper();
        List<CustomizedTemplateDTO> dtoList = java.util.Collections.singletonList(
                new CustomizedTemplateDTO("Test Section", om.readTree("\"Test Value\""), 1)
        );
        when(storeRepo.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(post("/customize/addTemplate")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoList)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Store not found"));

        verify(storeRepo).findById(1L);
        verify(customizationService, never()).addCustomizedTemplate(any(), any());
    }

    @Test
    void testEditCustomizedTemplate_Success() throws Exception {
        // Arrange
        ObjectMapper om = new ObjectMapper();
        List<CustomizedTemplateDTO> dtoList = java.util.Collections.singletonList(
                new CustomizedTemplateDTO("Updated Section", om.readTree("\"Updated Value\""), 1)
        );
        when(storeRepo.findById(1L)).thenReturn(Optional.of(store));
        doNothing().when(customizationService).editCustomizedTemplate(eq(1L), anyList());

        // Act & Assert
        mockMvc.perform(put("/customize/editTemplate")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoList)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Customized Template edited successfully"));

        verify(storeRepo).findById(1L);
        verify(customizationService).editCustomizedTemplate(eq(1L), anyList());
    }

    @Test
    void testEditCustomizedTemplate_Unauthorized() throws Exception {
        // Arrange
        MockHttpSession emptySession = new MockHttpSession();
        ObjectMapper om = new ObjectMapper();
        List<CustomizedTemplateDTO> dtoList = java.util.Collections.singletonList(
                new CustomizedTemplateDTO("Updated Section", om.readTree("\"Updated Value\""), 1)
        );

        // Act & Assert
        mockMvc.perform(put("/customize/editTemplate")
                .session(emptySession)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoList)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Store ID not found in session."));

        verify(storeRepo, never()).findById(any());
        verify(customizationService, never()).editCustomizedTemplate(any(), any());
    }

    @Test
    void testSaveImage_Success() throws Exception {
        // Arrange
        MockMultipartFile image = new MockMultipartFile(
                "image",
                "test-image.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        // Act & Assert
        mockMvc.perform(multipart("/customize/saveImage")
                .file(image)
                .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Image saved successfully."))
                .andExpect(jsonPath("$.url").value(org.hamcrest.Matchers.containsString("customize1_test-image.jpg")));
    }

    @Test
    void testSaveImage_Unauthorized() throws Exception {
        // Arrange
        MockHttpSession emptySession = new MockHttpSession();
        MockMultipartFile image = new MockMultipartFile(
                "image",
                "test-image.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        // Act & Assert
        mockMvc.perform(multipart("/customize/saveImage")
                .file(image)
                .session(emptySession))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Store ID not found in session."));
    }

    @Test
    void testGetAllProducts_Success() throws Exception {
        // Arrange
        List<Product> products = Arrays.asList(product);
        when(productService.getAllProducts(1L)).thenReturn(products);

        // Act & Assert
        mockMvc.perform(get("/customize/getProducts")
                .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Products retrieved successfully"))
                .andExpect(jsonPath("$.products[0].id").value(1))
                .andExpect(jsonPath("$.products[0].name").value("Test Product"));

        verify(productService).getAllProducts(1L);
    }

    @Test
    void testGetAllProducts_Unauthorized() throws Exception {
        // Arrange
        MockHttpSession emptySession = new MockHttpSession();

        // Act & Assert
        mockMvc.perform(get("/customize/getProducts")
                .session(emptySession))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Store ID not found in session."));

        verify(productService, never()).getAllProducts(any());
    }

    @Test
    void testGetAllProducts_ServiceException() throws Exception {
        // Arrange
        when(productService.getAllProducts(1L))
                .thenThrow(new RuntimeException("Service error"));

        // Act & Assert
        mockMvc.perform(get("/customize/getProducts")
                .session(session))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Service error"));

        verify(productService).getAllProducts(1L);
    }

    @Test
    void testGetAllCategories_Success() throws Exception {
        // Arrange
        List<CategoryResponseDTO> categories = Arrays.asList(categoryResponseDTO);
        when(categoryService.getAllCategories(1L)).thenReturn(categories);

        // Act & Assert
        mockMvc.perform(get("/customize/getCategories")
                .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Categories retrieved successfully"))
                .andExpect(jsonPath("$.categories[0].id").value(1))
                .andExpect(jsonPath("$.categories[0].name").value("Test Category"));

        verify(categoryService).getAllCategories(1L);
    }

    @Test
    void testGetAllCategories_Unauthorized() throws Exception {
        // Arrange
        MockHttpSession emptySession = new MockHttpSession();

        // Act & Assert
        mockMvc.perform(get("/customize/getCategories")
                .session(emptySession))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Store ID not found in session."));

        verify(categoryService, never()).getAllCategories(any());
    }

    @Test
    void testGetAllCategories_ServiceException() throws Exception {
        // Arrange
        when(categoryService.getAllCategories(1L))
                .thenThrow(new RuntimeException("Service error"));

        // Act & Assert
        mockMvc.perform(get("/customize/getCategories")
                .session(session))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Service error"));

        verify(categoryService).getAllCategories(1L);
    }
} 