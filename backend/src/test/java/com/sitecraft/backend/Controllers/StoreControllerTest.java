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
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;
import java.util.Collections;

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
} 