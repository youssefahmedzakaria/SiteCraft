package com.sitecraft.backend.Controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Services.*;
import com.sitecraft.backend.DTOs.StoreStatsDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StoreService storeService;

    @MockBean
    private OrderService orderService;

    @MockBean
    private SiteCraftSubscriptionService subscriptionService;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private MockHttpSession adminSession;
    private MockHttpSession userSession;
    private Store store;
    private SiteCraftSubscription subscription;
    private Order order;
    private Users user;
    private UserRole userRole;

    @BeforeEach
    void setUp() {
        // Setup sessions
        adminSession = new MockHttpSession();
        adminSession.setAttribute("role", "admin");
        
        userSession = new MockHttpSession();
        userSession.setAttribute("role", "user");

        // Setup store
        store = new Store();
        store.setId(1L);
        store.setStoreName("Test Store");
        store.setStatus("active");

        // Setup subscription
        subscription = new SiteCraftSubscription();
        subscription.setId(1);
        subscription.setPlan("premium");
        subscription.setStore(store);

        // Setup order
        order = new Order();
        order.setId(1L);
        order.setPrice(100.00);
        order.setStore(store);

        // Setup user
        user = new Users();
        user.setId(1L);
        user.setEmail("admin@example.com");
        user.setName("Admin User");

        // Setup user role
        userRole = new UserRole();
        userRole.setId(1L);
        userRole.setUser(user);
        userRole.setRole("admin");
    }

    @Test
    void testGetStoresOverview_Success() throws Exception {
        // Arrange
        List<Store> stores = Arrays.asList(store);
        List<Order> orders = Arrays.asList(order);
        
        when(storeService.getAllStores()).thenReturn(stores);
        when(subscriptionService.getCurrentSubscription(1L)).thenReturn(Optional.of(subscription));
        when(orderService.getOrdersByStoreAndDateRange(eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(orders);
        when(storeService.getOwnerEmail(1L)).thenReturn("owner@example.com");

        // Act & Assert
        mockMvc.perform(get("/api/admin/stores/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].storeName").value("Test Store"))
                .andExpect(jsonPath("$[0].status").value("active"))
                .andExpect(jsonPath("$[0].subscriptionType").value("premium"))
                .andExpect(jsonPath("$[0].lastMonthOrders").value(1))
                .andExpect(jsonPath("$[0].lastMonthSales").value(100.0))
                .andExpect(jsonPath("$[0].ownerEmail").value("owner@example.com"));

        verify(storeService).getAllStores();
        verify(subscriptionService).getCurrentSubscription(1L);
        verify(orderService).getOrdersByStoreAndDateRange(eq(1L), any(LocalDate.class), any(LocalDate.class));
        verify(storeService).getOwnerEmail(1L);
    }

    @Test
    void testGetStoresOverview_NoSubscription() throws Exception {
        // Arrange
        List<Store> stores = Arrays.asList(store);
        List<Order> orders = Arrays.asList(order);
        
        when(storeService.getAllStores()).thenReturn(stores);
        when(subscriptionService.getCurrentSubscription(1L)).thenReturn(Optional.empty());
        when(orderService.getOrdersByStoreAndDateRange(eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(orders);
        when(storeService.getOwnerEmail(1L)).thenReturn("owner@example.com");

        // Act & Assert
        mockMvc.perform(get("/api/admin/stores/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].subscriptionType").value("None"));

        verify(storeService).getAllStores();
        verify(subscriptionService).getCurrentSubscription(1L);
    }

    @Test
    void testSuspendStore_Success() throws Exception {
        // Arrange
        doNothing().when(storeService).updateStoreStatus(1L, "suspended");

        // Act & Assert
        mockMvc.perform(post("/api/admin/stores/1/suspend"))
                .andExpect(status().isOk())
                .andExpect(content().string("Store suspended successfully."));

        verify(storeService).updateStoreStatus(1L, "suspended");
    }

    @Test
    void testUnsuspendStore_Success() throws Exception {
        // Arrange
        doNothing().when(storeService).updateStoreStatus(1L, "active");

        // Act & Assert
        mockMvc.perform(post("/api/admin/stores/1/unsuspend"))
                .andExpect(status().isOk())
                .andExpect(content().string("Store unsuspended successfully."));

        verify(storeService).updateStoreStatus(1L, "active");
    }

    @Test
    void testSendMailToStoreOwner_Success() throws Exception {
        // Arrange
        AdminController.MailRequest mailRequest = new AdminController.MailRequest();
        mailRequest.subject = "Test Subject";
        mailRequest.message = "Test Message";

        when(storeService.getOwnerEmail(1L)).thenReturn("owner@example.com");
        doNothing().when(userService).sendCustomMail("owner@example.com", "Test Subject", "Test Message");

        // Act & Assert
        mockMvc.perform(post("/api/admin/stores/1/send-mail")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mailRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string("Mail sent successfully."));

        verify(storeService).getOwnerEmail(1L);
        verify(userService).sendCustomMail("owner@example.com", "Test Subject", "Test Message");
    }

    @Test
    void testSendMailToStoreOwner_OwnerEmailNotFound() throws Exception {
        // Arrange
        AdminController.MailRequest mailRequest = new AdminController.MailRequest();
        mailRequest.subject = "Test Subject";
        mailRequest.message = "Test Message";

        when(storeService.getOwnerEmail(1L)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(post("/api/admin/stores/1/send-mail")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mailRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Owner email not found"));

        verify(storeService).getOwnerEmail(1L);
        verify(userService, never()).sendCustomMail(any(), any(), any());
    }

    @Test
    void testGetAllAdmins_Success() throws Exception {
        // Arrange
        List<UserRole> adminRoles = Arrays.asList(userRole);
        when(userService.getAllGlobalAdmins()).thenReturn(adminRoles);

        // Act & Assert
        mockMvc.perform(get("/api/admin/stores/admins")
                .session(adminSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].email").value("admin@example.com"))
                .andExpect(jsonPath("$[0].name").value("Admin User"));

        verify(userService).getAllGlobalAdmins();
    }

    @Test
    void testGetAllAdmins_Forbidden() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/admin/stores/admins")
                .session(userSession))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Forbidden"));

        verify(userService, never()).getAllGlobalAdmins();
    }

    @Test
    void testGetAllAdmins_NoSession() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/admin/stores/admins"))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Forbidden"));

        verify(userService, never()).getAllGlobalAdmins();
    }

    @Test
    void testAddAdmin_Success() throws Exception {
        // Arrange
        Map<String, String> request = Map.of("email", "newadmin@example.com");
        doNothing().when(userService).addGlobalAdminByEmail("newadmin@example.com");

        // Act & Assert
        mockMvc.perform(post("/api/admin/stores/admins")
                .session(adminSession)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Admin added successfully."));

        verify(userService).addGlobalAdminByEmail("newadmin@example.com");
    }

    @Test
    void testAddAdmin_Forbidden() throws Exception {
        // Arrange
        Map<String, String> request = Map.of("email", "newadmin@example.com");

        // Act & Assert
        mockMvc.perform(post("/api/admin/stores/admins")
                .session(userSession)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Forbidden"));

        verify(userService, never()).addGlobalAdminByEmail(any());
    }

    @Test
    void testAddAdmin_ServiceException() throws Exception {
        // Arrange
        Map<String, String> request = Map.of("email", "newadmin@example.com");
        doThrow(new RuntimeException("User not found")).when(userService).addGlobalAdminByEmail("newadmin@example.com");

        // Act & Assert
        mockMvc.perform(post("/api/admin/stores/admins")
                .session(adminSession)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User not found"));

        verify(userService).addGlobalAdminByEmail("newadmin@example.com");
    }

    @Test
    void testRemoveAdmin_Success() throws Exception {
        // Arrange
        doNothing().when(userService).removeGlobalAdmin(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/admin/stores/admins/1")
                .session(adminSession))
                .andExpect(status().isOk())
                .andExpect(content().string("Admin removed successfully."));

        verify(userService).removeGlobalAdmin(1L);
    }

    @Test
    void testRemoveAdmin_Forbidden() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/api/admin/stores/admins/1")
                .session(userSession))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Forbidden"));

        verify(userService, never()).removeGlobalAdmin(any());
    }

    @Test
    void testRemoveAdmin_ServiceException() throws Exception {
        // Arrange
        doThrow(new RuntimeException("Admin not found")).when(userService).removeGlobalAdmin(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/admin/stores/admins/1")
                .session(adminSession))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Admin not found"));

        verify(userService).removeGlobalAdmin(1L);
    }

    @Test
    void testGetStoreStats_Success() throws Exception {
        // Arrange
        StoreStatsDTO stats = new StoreStatsDTO();
        stats.totalOrders = 100;
        stats.totalSales = 5000.0;
        stats.productCount = 25;
        when(storeService.getStoreStats(1L)).thenReturn(stats);

        // Act & Assert
        mockMvc.perform(get("/api/admin/stores/1/stats")
                .session(adminSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalOrders").value(100))
                .andExpect(jsonPath("$.totalSales").value(5000.0))
                .andExpect(jsonPath("$.productCount").value(25));

        verify(storeService).getStoreStats(1L);
    }

    @Test
    void testGetStoreStats_Forbidden() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/admin/stores/1/stats")
                .session(userSession))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Forbidden"));

        verify(storeService, never()).getStoreStats(any());
    }

    @Test
    void testGetStoreStats_ServiceException() throws Exception {
        // Arrange
        when(storeService.getStoreStats(1L)).thenThrow(new RuntimeException("Store not found"));

        // Act & Assert
        mockMvc.perform(get("/api/admin/stores/1/stats")
                .session(adminSession))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Store not found"));

        verify(storeService).getStoreStats(1L);
    }
} 