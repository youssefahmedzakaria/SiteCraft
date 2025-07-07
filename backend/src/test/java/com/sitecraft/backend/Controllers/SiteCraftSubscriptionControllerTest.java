package com.sitecraft.backend.Controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sitecraft.backend.Models.SiteCraftSubscription;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Services.SiteCraftSubscriptionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Timestamp;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SiteCraftSubscriptionController.class)
@AutoConfigureMockMvc(addFilters = false)
public class SiteCraftSubscriptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SiteCraftSubscriptionService subscriptionService;

    @Autowired
    private ObjectMapper objectMapper;

    private MockHttpSession session;
    private SiteCraftSubscription subscription;
    private Store store;

    @BeforeEach
    void setUp() {
        session = new MockHttpSession();
        session.setAttribute("storeId", 1L);

        // Setup store
        store = new Store();
        store.setId(1L);
        store.setStoreName("Test Store");

        // Setup subscription
        subscription = new SiteCraftSubscription();
        subscription.setId(1);
        subscription.setPlan("premium");
        subscription.setStatus("active");
        subscription.setStartDate(new Timestamp(System.currentTimeMillis()));
        subscription.setEndDate(new Timestamp(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000)); // 30 days later
        subscription.setStore(store);
    }

    @Test
    void testCreateSubscription_Success() throws Exception {
        // Arrange
        Map<String, Object> request = Map.of(
                "plan", "premium",
                "period", "monthly",
                "price", 29.99,
                "method", "credit_card"
        );

        when(subscriptionService.createSubscription(eq(1L), eq("premium"), eq("monthly"), eq(29.99), eq("credit_card")))
                .thenReturn(subscription);

        // Act & Assert
        mockMvc.perform(post("/api/subscription")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.plan").value("premium"));

        verify(subscriptionService).createSubscription(eq(1L), eq("premium"), eq("monthly"), eq(29.99), eq("credit_card"));
    }

    @Test
    void testCreateSubscription_Unauthorized() throws Exception {
        // Arrange
        MockHttpSession emptySession = new MockHttpSession();
        Map<String, Object> request = Map.of(
                "plan", "premium",
                "period", "monthly",
                "price", 29.99,
                "method", "credit_card"
        );

        // Act & Assert
        mockMvc.perform(post("/api/subscription")
                .session(emptySession)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Not logged in"));

        verify(subscriptionService, never()).createSubscription(any(), any(), any(), any(), any());
    }

    @Test
    void testCreateSubscription_ServiceException() throws Exception {
        // Arrange
        Map<String, Object> request = Map.of(
                "plan", "premium",
                "period", "monthly",
                "price", 29.99,
                "method", "credit_card"
        );

        when(subscriptionService.createSubscription(eq(1L), eq("premium"), eq("monthly"), eq(29.99), eq("credit_card")))
                .thenThrow(new RuntimeException("Invalid plan"));

        // Act & Assert
        mockMvc.perform(post("/api/subscription")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid plan"));

        verify(subscriptionService).createSubscription(eq(1L), eq("premium"), eq("monthly"), eq(29.99), eq("credit_card"));
    }

    @Test
    void testCreateSubscription_InvalidPrice() throws Exception {
        // Arrange
        Map<String, Object> request = Map.of(
                "plan", "premium",
                "period", "monthly",
                "price", "invalid_price",
                "method", "credit_card"
        );

        // Act & Assert
        mockMvc.perform(post("/api/subscription")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verify(subscriptionService, never()).createSubscription(any(), any(), any(), any(), any());
    }

    @Test
    void testGetCurrentSubscription_Success() throws Exception {
        // Arrange
        when(subscriptionService.getCurrentSubscription(1L)).thenReturn(Optional.of(subscription));

        // Act & Assert
        mockMvc.perform(get("/api/subscription/current")
                .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.plan").value("premium"));

        verify(subscriptionService).getCurrentSubscription(1L);
    }

    @Test
    void testGetCurrentSubscription_Unauthorized() throws Exception {
        // Arrange
        MockHttpSession emptySession = new MockHttpSession();

        // Act & Assert
        mockMvc.perform(get("/api/subscription/current")
                .session(emptySession))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Not logged in"));

        verify(subscriptionService, never()).getCurrentSubscription(any());
    }

    @Test
    void testGetCurrentSubscription_NotFound() throws Exception {
        // Arrange
        when(subscriptionService.getCurrentSubscription(1L)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get("/api/subscription/current")
                .session(session))
                .andExpect(status().isNotFound());

        verify(subscriptionService).getCurrentSubscription(1L);
    }

    @Test
    void testCancelSubscription_Success() throws Exception {
        // Arrange
        doNothing().when(subscriptionService).cancelSubscription(1L);

        // Act & Assert
        mockMvc.perform(post("/api/subscription/cancel")
                .session(session))
                .andExpect(status().isOk())
                .andExpect(content().string("Subscription cancelled successfully"));

        verify(subscriptionService).cancelSubscription(1L);
    }

    @Test
    void testCancelSubscription_Unauthorized() throws Exception {
        // Arrange
        MockHttpSession emptySession = new MockHttpSession();

        // Act & Assert
        mockMvc.perform(post("/api/subscription/cancel")
                .session(emptySession))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Not logged in"));

        verify(subscriptionService, never()).cancelSubscription(any());
    }

    @Test
    void testCancelSubscription_ServiceException() throws Exception {
        // Arrange
        doThrow(new RuntimeException("Subscription not found")).when(subscriptionService).cancelSubscription(1L);

        // Act & Assert
        mockMvc.perform(post("/api/subscription/cancel")
                .session(session))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Subscription not found"));

        verify(subscriptionService).cancelSubscription(1L);
    }

    @Test
    void testCheckExpiredSubscriptions_Success() throws Exception {
        // Arrange
        doNothing().when(subscriptionService).checkAndUpdateExpiredSubscriptions();

        // Act & Assert
        mockMvc.perform(post("/api/subscription/check-expired"))
                .andExpect(status().isOk())
                .andExpect(content().string("Expired subscriptions checked and updated"));

        verify(subscriptionService).checkAndUpdateExpiredSubscriptions();
    }

    @Test
    void testCheckExpiredSubscriptions_ServiceException() throws Exception {
        // Arrange
        doThrow(new RuntimeException("Database error")).when(subscriptionService).checkAndUpdateExpiredSubscriptions();

        // Act & Assert
        mockMvc.perform(post("/api/subscription/check-expired"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Database error"));

        verify(subscriptionService).checkAndUpdateExpiredSubscriptions();
    }

    @Test
    void testCreateSubscription_WithIntegerPrice() throws Exception {
        // Arrange
        Map<String, Object> request = Map.of(
                "plan", "basic",
                "period", "yearly",
                "price", 299,
                "method", "paypal"
        );

        SiteCraftSubscription basicSubscription = new SiteCraftSubscription();
        basicSubscription.setId(2);
        basicSubscription.setPlan("basic");
        basicSubscription.setStatus("active");

        when(subscriptionService.createSubscription(eq(1L), eq("basic"), eq("yearly"), eq(299.0), eq("paypal")))
                .thenReturn(basicSubscription);

        // Act & Assert
        mockMvc.perform(post("/api/subscription")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.plan").value("basic"));

        verify(subscriptionService).createSubscription(eq(1L), eq("basic"), eq("yearly"), eq(299.0), eq("paypal"));
    }

    @Test
    void testCreateSubscription_MissingRequiredFields() throws Exception {
        // Arrange
        Map<String, Object> request = Map.of(
                "plan", "premium"
                // Missing period, price, method
        );

        // Act & Assert
        mockMvc.perform(post("/api/subscription")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verify(subscriptionService, never()).createSubscription(any(), any(), any(), any(), any());
    }
} 