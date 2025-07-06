package com.sitecraft.backend.Controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sitecraft.backend.Models.Customer;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Services.EcommerceAuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EcommerceAuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class EcommerceAuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EcommerceAuthService ecommerceAuthService;

    @Autowired
    private ObjectMapper objectMapper;

    private Customer customer;
    private Store store;
    private MockHttpSession session;

    @BeforeEach
    void setUp() {
        // Setup Store
        store = new Store();
        store.setStoreName("Test Store");

        // Setup Customer
        customer = new Customer();
        customer.setId(1L);
        customer.setName("John Doe");
        customer.setEmail("john@example.com");
        customer.setPassword("password123");
        customer.setPhone("1234567890");
        customer.setGender("Male");
        customer.setStatus("active");
        customer.setStore(store);

        // Setup Session
        session = new MockHttpSession();
    }

    @Test
    void testRegister_Success() throws Exception {
        // Arrange
        Customer newCustomer = new Customer();
        newCustomer.setName("Jane Doe");
        newCustomer.setEmail("jane@example.com");
        newCustomer.setPassword("password123");
        newCustomer.setPhone("0987654321");
        newCustomer.setGender("Female");

        when(ecommerceAuthService.isCustomerExists("jane@example.com", 1L)).thenReturn(false);
        when(ecommerceAuthService.register(any(Customer.class), eq(1L))).thenReturn(newCustomer);

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/register")
                        .param("storeId", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCustomer)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Customer registered successfully"));

        verify(ecommerceAuthService).isCustomerExists("jane@example.com", 1L);
        verify(ecommerceAuthService).register(any(Customer.class), eq(1L));
    }

    @Test
    void testRegister_CustomerAlreadyExists() throws Exception {
        // Arrange
        Customer newCustomer = new Customer();
        newCustomer.setEmail("john@example.com");
        newCustomer.setPassword("password123");

        when(ecommerceAuthService.isCustomerExists("john@example.com", 1L)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/register")
                        .param("storeId", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCustomer)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Customer with this email already exists in this store."));

        verify(ecommerceAuthService).isCustomerExists("john@example.com", 1L);
        verify(ecommerceAuthService, never()).register(any(), any());
    }

    @Test
    void testRegister_ServiceException() throws Exception {
        // Arrange
        Customer newCustomer = new Customer();
        newCustomer.setEmail("jane@example.com");
        newCustomer.setPassword("password123");

        when(ecommerceAuthService.isCustomerExists("jane@example.com", 1L)).thenReturn(false);
        when(ecommerceAuthService.register(any(Customer.class), eq(1L)))
                .thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/register")
                        .param("storeId", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCustomer)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Database error"));

        verify(ecommerceAuthService).isCustomerExists("jane@example.com", 1L);
        verify(ecommerceAuthService).register(any(Customer.class), eq(1L));
    }

    @Test
    void testLogin_Success() throws Exception {
        // Arrange
        EcommerceAuthController.LoginRequest loginRequest = new EcommerceAuthController.LoginRequest();
        loginRequest.setEmail("john@example.com");
        loginRequest.setPassword("password123");
        loginRequest.setStoreId(1L);

        when(ecommerceAuthService.isCustomerExists("john@example.com", 1L)).thenReturn(true);
        when(ecommerceAuthService.login("john@example.com", "password123", 1L)).thenReturn(customer);

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .session(session))
                .andExpect(status().isAccepted())
                .andExpect(content().string("Customer logged in successfully."));

        verify(ecommerceAuthService).isCustomerExists("john@example.com", 1L);
        verify(ecommerceAuthService).login("john@example.com", "password123", 1L);

        // Verify session attributes
        assertEquals(customer.getId(), session.getAttribute("customerId"));
        assertEquals(1L, session.getAttribute("storeId"));
        assertEquals("john@example.com", session.getAttribute("customerEmail"));
        assertEquals("John Doe", session.getAttribute("customerName"));
    }

    @Test
    void testLogin_CustomerNotFound() throws Exception {
        // Arrange
        EcommerceAuthController.LoginRequest loginRequest = new EcommerceAuthController.LoginRequest();
        loginRequest.setEmail("nonexistent@example.com");
        loginRequest.setPassword("password123");
        loginRequest.setStoreId(1L);

        when(ecommerceAuthService.isCustomerExists("nonexistent@example.com", 1L)).thenReturn(false);

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .session(session))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Customer with this email does not exist in this store."));

        verify(ecommerceAuthService).isCustomerExists("nonexistent@example.com", 1L);
        verify(ecommerceAuthService, never()).login(any(), any(), any());
    }

    @Test
    void testLogin_WrongPassword() throws Exception {
        // Arrange
        EcommerceAuthController.LoginRequest loginRequest = new EcommerceAuthController.LoginRequest();
        loginRequest.setEmail("john@example.com");
        loginRequest.setPassword("wrongpassword");
        loginRequest.setStoreId(1L);

        when(ecommerceAuthService.isCustomerExists("john@example.com", 1L)).thenReturn(true);
        when(ecommerceAuthService.login("john@example.com", "wrongpassword", 1L)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .session(session))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Incorrect password. Please try again."));

        verify(ecommerceAuthService).isCustomerExists("john@example.com", 1L);
        verify(ecommerceAuthService).login("john@example.com", "wrongpassword", 1L);
    }

    @Test
    void testLogin_InactiveCustomer() throws Exception {
        // Arrange
        customer.setStatus("inactive");
        EcommerceAuthController.LoginRequest loginRequest = new EcommerceAuthController.LoginRequest();
        loginRequest.setEmail("john@example.com");
        loginRequest.setPassword("password123");
        loginRequest.setStoreId(1L);

        when(ecommerceAuthService.isCustomerExists("john@example.com", 1L)).thenReturn(true);
        when(ecommerceAuthService.login("john@example.com", "password123", 1L)).thenReturn(customer);

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
                        .session(session))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Your account has been suspended. Please contact support."));

        verify(ecommerceAuthService).isCustomerExists("john@example.com", 1L);
        verify(ecommerceAuthService).login("john@example.com", "password123", 1L);
    }

    @Test
    void testLogout_Success() throws Exception {
        // Arrange
        session.setAttribute("customerId", 1L);
        session.setAttribute("storeId", 1L);

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/logout")
                        .session(session))
                .andExpect(status().isAccepted())
                .andExpect(content().string("Customer logged out successfully."));

        // Verify session is invalidated
        assertTrue(session.isInvalid());
    }

    @Test
    void testGetSession_Authenticated() throws Exception {
        // Arrange
        session.setAttribute("customerId", 1L);
        session.setAttribute("storeId", 1L);
        session.setAttribute("customerEmail", "john@example.com");
        session.setAttribute("customerName", "John Doe");

        // Act & Assert
        mockMvc.perform(get("/ecommerce/auth/getSession")
                        .session(session))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.customerId").value(1))
                .andExpect(jsonPath("$.storeId").value(1))
                .andExpect(jsonPath("$.customerEmail").value("john@example.com"))
                .andExpect(jsonPath("$.customerName").value("John Doe"));
    }

    @Test
    void testGetSession_NotAuthenticated() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/ecommerce/auth/getSession")
                        .session(session))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.customerId").value(org.hamcrest.Matchers.nullValue()))
                .andExpect(jsonPath("$.storeId").value(org.hamcrest.Matchers.nullValue()));
    }

    @Test
    void testGetProfile_Success() throws Exception {
        // Arrange
        session.setAttribute("customerId", 1L);
        session.setAttribute("storeId", 1L);
        when(ecommerceAuthService.getCustomerById(1L, 1L)).thenReturn(customer);

        // Act & Assert
        mockMvc.perform(get("/ecommerce/auth/profile")
                        .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath(".id").value(1))
                .andExpect(jsonPath(".name").value("John Doe"))
                .andExpect(jsonPath(".email").value("john@example.com"));
    }

    @Test
    void testGetProfile_Unauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/ecommerce/auth/profile")
                        .session(session))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Not authenticated."));
    }

    @Test
    void testUpdateProfile_Success() throws Exception {
        // Arrange
        session.setAttribute("customerId", 1L);
        session.setAttribute("storeId", 1L);
        Customer updatedCustomer = new Customer();
        updatedCustomer.setName("Updated Name");
        updatedCustomer.setPhone("9876543210");

        when(ecommerceAuthService.updateCustomerProfile(eq(1L), eq(1L), any(Customer.class))).thenReturn(customer);

        // Act & Assert
        mockMvc.perform(put("/ecommerce/auth/update/profile")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedCustomer)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"));

        verify(ecommerceAuthService).updateCustomerProfile(eq(1L), eq(1L), any(Customer.class));
    }

    @Test
    void testUpdateProfile_Unauthorized() throws Exception {
        // Arrange
        Customer updatedCustomer = new Customer();
        updatedCustomer.setName("Updated Name");

        // Act & Assert
        mockMvc.perform(put("/ecommerce/auth/update/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedCustomer)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Not authenticated."));
    }

    @Test
    void testSendOTP_Success() throws Exception {
        // Arrange
        Map<String, String> request = Map.of("email", "john@example.com");
        when(ecommerceAuthService.isCustomerExists("john@example.com")).thenReturn(true);
        doNothing().when(ecommerceAuthService).sendCustomerOTP("john@example.com");

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/forgotPassword/sendOTP")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("OTP sent successfully"));

        verify(ecommerceAuthService).sendCustomerOTP("john@example.com");
    }

    @Test
    void testSendOTP_ServiceException() throws Exception {
        // Arrange
        Map<String, String> request = Map.of("email", "john@example.com");
        when(ecommerceAuthService.isCustomerExists("john@example.com")).thenReturn(true);
        doThrow(new RuntimeException("Email service error")).when(ecommerceAuthService).sendCustomerOTP("john@example.com");

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/forgotPassword/sendOTP")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email service error"));
    }

    @Test
    void testVerifyOTP_Success() throws Exception {
        // Arrange
        Map<String, String> request = Map.of("email", "john@example.com", "otp", "123456");
        when(ecommerceAuthService.isCustomerExists("john@example.com")).thenReturn(true);
        doNothing().when(ecommerceAuthService).verifyCustomerOTP("john@example.com", "123456");

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/forgotPassword/verifyOTP")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("OTP verified successfully"));

        verify(ecommerceAuthService).verifyCustomerOTP("john@example.com", "123456");
    }

    @Test
    void testVerifyOTP_InvalidOTP() throws Exception {
        // Arrange
        Map<String, String> request = Map.of("email", "john@example.com", "otp", "000000");
        when(ecommerceAuthService.isCustomerExists("john@example.com")).thenReturn(true);
        doThrow(new RuntimeException("Invalid OTP")).when(ecommerceAuthService).verifyCustomerOTP("john@example.com", "000000");

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/forgotPassword/verifyOTP")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid OTP"));
    }

    @Test
    void testResetPassword_Success() throws Exception {
        // Arrange
        Map<String, String> request = Map.of("email", "john@example.com", "newPassword", "newpassword123");
        when(ecommerceAuthService.isCustomerExists("john@example.com")).thenReturn(true);
        doNothing().when(ecommerceAuthService).resetCustomerPassword("john@example.com", "newpassword123");

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/forgotPassword/resetPassword")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Password reset successfully"));

        verify(ecommerceAuthService).resetCustomerPassword("john@example.com", "newpassword123");
    }

    @Test
    void testResetPassword_ShortPassword() throws Exception {
        // Arrange
        Map<String, String> request = Map.of("email", "john@example.com", "newPassword", "short");

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/forgotPassword/resetPassword")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Password must be at least 8 characters long."));
    }

    @Test
    void testResetPassword_ServiceException() throws Exception {
        // Arrange
        Map<String, String> request = Map.of("email", "john@example.com", "newPassword", "newpassword123");
        when(ecommerceAuthService.isCustomerExists("john@example.com")).thenReturn(true);
        doThrow(new RuntimeException("Reset failed")).when(ecommerceAuthService).resetCustomerPassword("john@example.com", "newpassword123");

        // Act & Assert
        mockMvc.perform(post("/ecommerce/auth/forgotPassword/resetPassword")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Reset failed"));
    }
}
