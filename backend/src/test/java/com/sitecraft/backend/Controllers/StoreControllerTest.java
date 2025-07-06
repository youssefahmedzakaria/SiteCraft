package com.sitecraft.backend.Controllers;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.Policy;
import com.sitecraft.backend.Models.AboutUs;
import com.sitecraft.backend.Models.Users;
import com.sitecraft.backend.Models.ShippingInfo;
import com.sitecraft.backend.DTOs.StoreInfoDTO;
import com.sitecraft.backend.Services.StoreService;
import com.sitecraft.backend.Services.UserService;
import com.sitecraft.backend.Repositories.StoreRepo;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.mock.web.MockPart;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;
import java.util.Collections;
import java.io.File;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StoreController.class)
@AutoConfigureMockMvc(addFilters = false)
public class StoreControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private StoreService storeService;
    @MockBean
    private UserService userService;
    @MockBean
    private StoreRepo storeRepo;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetStoreSettings_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        Store store = new Store();
        when(storeService.getStore(1L)).thenReturn(store);
        mockMvc.perform(get("/api/store/getStoreSettings").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetStoreSettings_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/store/getStoreSettings"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testGetAllShippingInfo_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<ShippingInfo> shippingInfos = List.of(new ShippingInfo());
        when(storeService.getShippingInfosByStoreId(1L)).thenReturn(shippingInfos);
        mockMvc.perform(get("/api/store/getAllShippingInfo").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testAddShippingInfo_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        ShippingInfo shippingInfo = new ShippingInfo();
        when(storeService.addShippingInfo(any(ShippingInfo.class))).thenReturn(shippingInfo);
        mockMvc.perform(post("/api/store/addShippingInfo")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(shippingInfo)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetStoreInfo_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<Policy> policies = List.of(new Policy());
        List<AboutUs> aboutUsList = List.of(new AboutUs());
        StoreInfoDTO storeInfoDTO = new StoreInfoDTO(policies, aboutUsList);
        when(storeService.getStoreInfoByStoreId(1L)).thenReturn(storeInfoDTO);
        mockMvc.perform(get("/api/store/getStoreInfo").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetStorePolicies_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<Policy> policies = List.of(new Policy());
        when(storeService.getStorePolicies(1L)).thenReturn(policies);
        mockMvc.perform(get("/api/store/getStorePolicies").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetStorePolicyById_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        Policy policy = new Policy();
        when(storeService.getStorePolicyById(2L, 1L)).thenReturn(policy);
        mockMvc.perform(get("/api/store/getStorePolicyById/2").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testAddPolicy_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        Policy policy = new Policy();
        when(storeService.addPolicy(any(Policy.class))).thenReturn(policy);
        mockMvc.perform(post("/api/store/addPolicy")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(policy)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetStoreAboutUsList_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<AboutUs> aboutUsList = List.of(new AboutUs());
        when(storeService.getAboutUsListByStoreId(1L)).thenReturn(aboutUsList);
        mockMvc.perform(get("/api/store/getStoreAboutUsList").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetAllStaff_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<Users> staff = List.of(new Users());
        when(userService.getAllStaffByStoreId(1L)).thenReturn(staff);
        mockMvc.perform(get("/api/store/getStoreStaff").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    // New tests for missing methods

    @Test
    void testCreateStore_Success() throws Exception {
        Store store = new Store();
        store.setStoreName("Test Store");
        store.setSubdomain("teststore");
        
        when(storeService.createStore(any(Store.class), eq(1L))).thenReturn(store);
        when(storeService.updateStorePartial(anyLong(), any(Store.class))).thenReturn(store);
        
        // Create store JSON without accentColor field
        String storeJson = "{\"storeName\":\"Test Store\",\"subdomain\":\"teststore\"}";
        MockMultipartFile storeFile = new MockMultipartFile("store", "store", "application/json", 
                storeJson.getBytes());
        
        mockMvc.perform(multipart("/api/store/1")
                .file(storeFile)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Store created successfully"));
    }

   
    @Test
    void testGetStoreIdBySubDomain_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        Store store = new Store();
        store.setId(1L);
        store.setSubdomain("teststore");
        
        when(storeRepo.findBySubdomain("teststore")).thenReturn(store);
        
        mockMvc.perform(get("/api/store/getStoreId/teststore").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.storeId").value(1));
    }

    @Test
    void testGetStoreIdBySubDomain_NotFound() throws Exception {
        MockHttpSession session = new MockHttpSession();
        when(storeRepo.findBySubdomain("nonexistent")).thenReturn(null);
        
        mockMvc.perform(get("/api/store/getStoreId/nonexistent").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Subdomain doesn't exists"));
    }

    @Test
    void testUpdateStore_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        
        Store store = new Store();
        store.setStoreName("Updated Store");
        store.setSubdomain("updatedstore");
        
        when(storeService.getStore(1L)).thenReturn(store);
        when(storeService.updateStorePartial(anyLong(), any(Store.class))).thenReturn(store);
        
        // Create store JSON without accentColor field
        String storeJson = "{\"storeName\":\"Updated Store\",\"subdomain\":\"updatedstore\"}";
        MockMultipartFile storeFile = new MockMultipartFile("store", "store", "application/json", 
                storeJson.getBytes());
        
        mockMvc.perform(multipart("/api/store/updateStoreInfo")
                .file(storeFile)
                .with(request -> { request.setMethod("PUT"); return request; })
                .session(session)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Store updated successfully"));
    }

    @Test
    void testUpdateStore_Unauthorized() throws Exception {
        Store store = new Store();
        store.setStoreName("Updated Store");
        
        // Create store JSON without accentColor field
        String storeJson = "{\"storeName\":\"Updated Store\"}";
        MockMultipartFile storeFile = new MockMultipartFile("store", "store", "application/json", 
                storeJson.getBytes());
        
        mockMvc.perform(multipart("/api/store/updateStoreInfo")
                .file(storeFile)
                .with(request -> { request.setMethod("PUT"); return request; })
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testUpdateShippingInfo_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        
        ShippingInfo shippingInfo = new ShippingInfo();
        shippingInfo.setGovernmentName("Express");
        shippingInfo.setShippingPrice(10.0f);
        
        doNothing().when(storeService).updateShippingInfo(1L, shippingInfo, 1L);
        
        mockMvc.perform(put("/api/store/updateShippingInfo/1")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(shippingInfo)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Shipping info updated successfully"));
    }

    @Test
    void testUpdateShippingInfo_Unauthorized() throws Exception {
        ShippingInfo shippingInfo = new ShippingInfo();
        
        mockMvc.perform(put("/api/store/updateShippingInfo/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(shippingInfo)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testDeleteShippingInfo_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        
        doNothing().when(storeService).deleteShippingInfo(1L, 1L);
        
        mockMvc.perform(delete("/api/store/deleteShippingInfo/1").session(session))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Shipping info deleted successfully"));
    }

    @Test
    void testDeleteShippingInfo_Unauthorized() throws Exception {
        mockMvc.perform(delete("/api/store/deleteShippingInfo/1"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testGetStoreAboutUsById_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        
        AboutUs aboutUs = new AboutUs();
        aboutUs.setId(1L);
        aboutUs.setTitle("About Us");
        aboutUs.setContent("This is about us content");
        
        when(storeService.getAboutUsById(1L, 1L)).thenReturn(aboutUs);
        
        mockMvc.perform(get("/api/store/getStoreAboutUsById/1").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.aboutUs.id").value(1));
    }

    @Test
    void testGetStoreAboutUsById_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/store/getStoreAboutUsById/1"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testAddAboutUs_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        
        AboutUs aboutUs = new AboutUs();
        aboutUs.setTitle("New About Us");
        aboutUs.setContent("New content");
        
        when(storeService.addAboutUs(any(AboutUs.class))).thenReturn(aboutUs);
        
        mockMvc.perform(post("/api/store/addAboutUs")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(aboutUs)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("About Us entry added successfully"));
    }

    @Test
    void testAddAboutUs_Unauthorized() throws Exception {
        AboutUs aboutUs = new AboutUs();
        
        mockMvc.perform(post("/api/store/addAboutUs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(aboutUs)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testUpdateAboutUs_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        
        AboutUs aboutUs = new AboutUs();
        aboutUs.setTitle("Updated About Us");
        aboutUs.setContent("Updated content");
        
        doNothing().when(storeService).updateAboutUs(1L, aboutUs, 1L);
        
        mockMvc.perform(put("/api/store/updateAboutUs/1")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(aboutUs)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("About Us entry updated successfully"));
    }

    @Test
    void testUpdateAboutUs_Unauthorized() throws Exception {
        AboutUs aboutUs = new AboutUs();
        
        mockMvc.perform(put("/api/store/updateAboutUs/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(aboutUs)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testDeleteAboutUs_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        
        doNothing().when(storeService).deleteAboutUs(1L, 1L);
        
        mockMvc.perform(delete("/api/store/deleteAboutUs/1").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("About Us entry deleted successfully"));
    }

    @Test
    void testDeleteAboutUs_Unauthorized() throws Exception {
        mockMvc.perform(delete("/api/store/deleteAboutUs/1"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testAddStaff_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        
        Users user = new Users();
        user.setEmail("staff@example.com");
        user.setName("Staff Member");
        user.setRole("staff");
        
        when(userService.addStaff(any(Users.class))).thenReturn(user);
        
        mockMvc.perform(post("/api/store/addStaff")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Staff added successfully"));
    }

    @Test
    void testAddStaff_Unauthorized() throws Exception {
        Users user = new Users();
        
        mockMvc.perform(post("/api/store/addStaff")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testRemoveStaff_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        
        doNothing().when(userService).removeStaff(1L, 2L);
        
        mockMvc.perform(delete("/api/store/removeStaff/2").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Staff removed successfully"));
    }

    @Test
    void testRemoveStaff_Unauthorized() throws Exception {
        mockMvc.perform(delete("/api/store/removeStaff/2"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testAddColors_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        
        Map<String, String> colors = Map.of(
            "primary", "#FF0000",
            "secondary", "#00FF00",
            "accent", "#0000FF"
        );
        
        Store store = new Store();
        when(storeService.updateStoreColors(1L, "#FF0000", "#00FF00", "#0000FF")).thenReturn(store);
        
        mockMvc.perform(post("/api/store/colors")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(colors)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Store colors saved successfully"))
                .andExpect(jsonPath("$.colors.primary").value("#FF0000"))
                .andExpect(jsonPath("$.colors.secondary").value("#00FF00"))
                .andExpect(jsonPath("$.colors.accent").value("#0000FF"));
    }

    @Test
    void testAddColors_InvalidHexColor() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        
        Map<String, String> colors = Map.of(
            "primary", "invalid",
            "secondary", "#00FF00",
            "accent", "#0000FF"
        );
        
        mockMvc.perform(post("/api/store/colors")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(colors)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid hex color format"));
    }

    @Test
    void testAddColors_Unauthorized() throws Exception {
        Map<String, String> colors = Map.of(
            "primary", "#FF0000",
            "secondary", "#00FF00",
            "accent", "#0000FF"
        );
        
        mockMvc.perform(post("/api/store/colors")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(colors)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testUpdateColors_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        
        Map<String, String> colors = Map.of(
            "primary", "#FF0000",
            "secondary", "#00FF00",
            "accent", "#0000FF"
        );
        
        Store store2 = new Store();
        when(storeService.updateStoreColors(1L, "#FF0000", "#00FF00", "#0000FF")).thenReturn(store2);
        
        mockMvc.perform(put("/api/store/colors")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(colors)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Store colors updated successfully"));
    }

    @Test
    void testUpdateColors_Unauthorized() throws Exception {
        Map<String, String> colors = Map.of(
            "primary", "#FF0000",
            "secondary", "#00FF00",
            "accent", "#0000FF"
        );
        
        mockMvc.perform(put("/api/store/colors")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(colors)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testGetColors_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        
        String colorsJson = "{\"primary\":\"#FF0000\",\"secondary\":\"#00FF00\",\"accent\":\"#0000FF\"}";
        when(storeService.getStoreColors(1L)).thenReturn(colorsJson);
        
        mockMvc.perform(get("/api/store/colors").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Store colors retrieved successfully"))
                .andExpect(jsonPath("$.colors").value(colorsJson));
    }

    @Test
    void testGetColors_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/store/colors"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }
} 