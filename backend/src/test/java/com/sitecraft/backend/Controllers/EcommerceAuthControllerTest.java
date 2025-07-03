//package com.sitecraft.backend.Controllers;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.sitecraft.backend.Models.Customer;
//import com.sitecraft.backend.Models.Store;
//import com.sitecraft.backend.Services.EcommerceAuthService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.mock.web.MockHttpSession;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.util.HashMap;
//import java.util.Map;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(EcommerceAuthController.class)
//@AutoConfigureMockMvc(addFilters = false)
//public class EcommerceAuthControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private EcommerceAuthService ecommerceAuthService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private Customer customer;
//    private Store store;
//    private MockHttpSession session;
//
//    @BeforeEach
//    void setUp() {
//        // Setup Store
//        store = new Store();
//        store.setId(1L);
//        store.setStoreName("Test Store");
//
//        // Setup Customer
//        customer = new Customer();
//        customer.setId(1L);
//        customer.setName("John Doe");
//        customer.setEmail("john@example.com");
//        customer.setPassword("password123");
//        customer.setPhone("1234567890");
//        customer.setGender("Male");
//        customer.setStatus("active");
//        customer.setStore(store);
//
//        // Setup Session
//        session = new MockHttpSession();
//    }
//
//    @Test
//    void testRegister_Success() throws Exception {
//        // Arrange
//        Customer newCustomer = new Customer();
//        newCustomer.setName("Jane Doe");
//        newCustomer.setEmail("jane@example.com");
//        newCustomer.setPassword("password123");
//        newCustomer.setPhone("0987654321");
//        newCustomer.setGender("Female");
//
//        when(ecommerceAuthService.isCustomerExists("jane@example.com", 1L)).thenReturn(false);
//        when(ecommerceAuthService.register(any(Customer.class), eq(1L))).thenReturn(newCustomer);
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/register")
//                        .param("storeId", "1")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(newCustomer)))
//                .andExpect(status().isAccepted())
//                .andExpect(content().string("Customer registered successfully."));
//
//        verify(ecommerceAuthService).isCustomerExists("jane@example.com", 1L);
//        verify(ecommerceAuthService).register(any(Customer.class), eq(1L));
//    }
//
//    @Test
//    void testRegister_CustomerAlreadyExists() throws Exception {
//        // Arrange
//        Customer newCustomer = new Customer();
//        newCustomer.setEmail("john@example.com");
//        newCustomer.setPassword("password123");
//
//        when(ecommerceAuthService.isCustomerExists("john@example.com", 1L)).thenReturn(true);
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/register")
//                        .param("storeId", "1")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(newCustomer)))
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string("Customer with this email already exists in this store."));
//
//        verify(ecommerceAuthService).isCustomerExists("john@example.com", 1L);
//        verify(ecommerceAuthService, never()).register(any(), any());
//    }
//
//    @Test
//    void testRegister_ServiceException() throws Exception {
//        // Arrange
//        Customer newCustomer = new Customer();
//        newCustomer.setEmail("jane@example.com");
//        newCustomer.setPassword("password123");
//
//        when(ecommerceAuthService.isCustomerExists("jane@example.com", 1L)).thenReturn(false);
//        when(ecommerceAuthService.register(any(Customer.class), eq(1L)))
//                .thenThrow(new RuntimeException("Database error"));
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/register")
//                        .param("storeId", "1")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(newCustomer)))
//                .andExpect(status().isInternalServerError())
//                .andExpect(jsonPath("$.success").value(false))
//                .andExpect(jsonPath("$.message").value("Database error"));
//
//        verify(ecommerceAuthService).isCustomerExists("jane@example.com", 1L);
//        verify(ecommerceAuthService).register(any(Customer.class), eq(1L));
//    }
//
//    @Test
//    void testLogin_Success() throws Exception {
//        // Arrange
//        EcommerceAuthController.LoginRequest loginRequest = new EcommerceAuthController.LoginRequest();
//        loginRequest.setEmail("john@example.com");
//        loginRequest.setPassword("password123");
//
//        when(ecommerceAuthService.isCustomerExists("john@example.com", 1L)).thenReturn(true);
//        when(ecommerceAuthService.login("john@example.com", "password123", 1L)).thenReturn(customer);
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/login")
//                        .param("storeId", "1")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(loginRequest))
//                        .session(session))
//                .andExpect(status().isAccepted())
//                .andExpect(content().string("Customer logged in successfully."));
//
//        verify(ecommerceAuthService).isCustomerExists("john@example.com", 1L);
//        verify(ecommerceAuthService).login("john@example.com", "password123", 1L);
//
//        // Verify session attributes
//        assertEquals(customer.getId(), session.getAttribute("customerId"));
//        assertEquals(1L, session.getAttribute("storeId"));
//        assertEquals("john@example.com", session.getAttribute("customerEmail"));
//        assertEquals("John Doe", session.getAttribute("customerName"));
//    }
//
//    @Test
//    void testLogin_CustomerNotFound() throws Exception {
//        // Arrange
//        EcommerceAuthController.LoginRequest loginRequest = new EcommerceAuthController.LoginRequest();
//        loginRequest.setEmail("nonexistent@example.com");
//        loginRequest.setPassword("password123");
//
//        when(ecommerceAuthService.isCustomerExists("nonexistent@example.com", 1L)).thenReturn(false);
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/login")
//                        .param("storeId", "1")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(loginRequest))
//                        .session(session))
//                .andExpect(status().isNotFound())
//                .andExpect(content().string("Customer with this email does not exist in this store."));
//
//        verify(ecommerceAuthService).isCustomerExists("nonexistent@example.com", 1L);
//        verify(ecommerceAuthService, never()).login(any(), any(), any());
//    }
//
//    @Test
//    void testLogin_WrongPassword() throws Exception {
//        // Arrange
//        EcommerceAuthController.LoginRequest loginRequest = new EcommerceAuthController.LoginRequest();
//        loginRequest.setEmail("john@example.com");
//        loginRequest.setPassword("wrongpassword");
//
//        when(ecommerceAuthService.isCustomerExists("john@example.com", 1L)).thenReturn(true);
//        when(ecommerceAuthService.login("john@example.com", "wrongpassword", 1L)).thenReturn(null);
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/login")
//                        .param("storeId", "1")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(loginRequest))
//                        .session(session))
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string("Incorrect password. Please try again."));
//
//        verify(ecommerceAuthService).isCustomerExists("john@example.com", 1L);
//        verify(ecommerceAuthService).login("john@example.com", "wrongpassword", 1L);
//    }
//
//    @Test
//    void testLogin_InactiveCustomer() throws Exception {
//        // Arrange
//        customer.setStatus("inactive");
//        EcommerceAuthController.LoginRequest loginRequest = new EcommerceAuthController.LoginRequest();
//        loginRequest.setEmail("john@example.com");
//        loginRequest.setPassword("password123");
//
//        when(ecommerceAuthService.isCustomerExists("john@example.com", 1L)).thenReturn(true);
//        when(ecommerceAuthService.login("john@example.com", "password123", 1L)).thenReturn(customer);
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/login")
//                        .param("storeId", "1")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(loginRequest))
//                        .session(session))
//                .andExpect(status().isForbidden())
//                .andExpect(content().string("Your account has been suspended. Please contact support."));
//
//        verify(ecommerceAuthService).isCustomerExists("john@example.com", 1L);
//        verify(ecommerceAuthService).login("john@example.com", "password123", 1L);
//    }
//
//    @Test
//    void testLogout_Success() throws Exception {
//        // Arrange
//        session.setAttribute("customerId", 1L);
//        session.setAttribute("storeId", 1L);
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/logout")
//                        .session(session))
//                .andExpect(status().isAccepted())
//                .andExpect(content().string("Customer logged out successfully."));
//
//        // Verify session is invalidated
//        assertTrue(session.isInvalid());
//    }
//
//    @Test
//    void testGetSession_Authenticated() throws Exception {
//        // Arrange
//        session.setAttribute("customerId", 1L);
//        session.setAttribute("storeId", 1L);
//        session.setAttribute("customerEmail", "john@example.com");
//        session.setAttribute("customerName", "John Doe");
//
//        // Act & Assert
//        mockMvc.perform(get("/ecommerce/auth/getSession")
//                        .session(session))
//                .andExpect(status().isAccepted())
//                .andExpect(jsonPath("$.customerId").value(1))
//                .andExpect(jsonPath("$.storeId").value(1))
//                .andExpect(jsonPath("$.customerEmail").value("john@example.com"))
//                .andExpect(jsonPath("$.customerName").value("John Doe"))
//                .andExpect(jsonPath("$.isAuthenticated").value(true));
//    }
//
//    @Test
//    void testGetSession_NotAuthenticated() throws Exception {
//        // Act & Assert
//        mockMvc.perform(get("/ecommerce/auth/getSession")
//                        .session(session))
//                .andExpect(status().isAccepted())
//                .andExpect(jsonPath("$.customerId").isEmpty())
//                .andExpect(jsonPath("$.storeId").isEmpty())
//                .andExpect(jsonPath("$.customerEmail").isEmpty())
//                .andExpect(jsonPath("$.customerName").isEmpty())
//                .andExpect(jsonPath("$.isAuthenticated").value(false));
//    }
//
//    @Test
//    void testGetProfile_Success() throws Exception {
//        // Arrange
//        session.setAttribute("customerId", 1L);
//        session.setAttribute("storeId", 1L);
//
//        when(ecommerceAuthService.getCustomerById(1L, 1L)).thenReturn(customer);
//
//        // Act & Assert
//        mockMvc.perform(get("/ecommerce/auth/profile")
//                        .session(session))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1))
//                .andExpect(jsonPath("$.name").value("John Doe"))
//                .andExpect(jsonPath("$.email").value("john@example.com"))
//                .andExpect(jsonPath("$.password").isEmpty()); // Password should not be returned
//
//        verify(ecommerceAuthService).getCustomerById(1L, 1L);
//    }
//
//    @Test
//    void testGetProfile_NotAuthenticated() throws Exception {
//        // Act & Assert
//        mockMvc.perform(get("/ecommerce/auth/profile")
//                        .session(session))
//                .andExpect(status().isUnauthorized())
//                .andExpect(content().string("Not authenticated."));
//
//        verify(ecommerceAuthService, never()).getCustomerById(any(), any());
//    }
//
//    @Test
//    void testGetProfile_CustomerNotFound() throws Exception {
//        // Arrange
//        session.setAttribute("customerId", 1L);
//        session.setAttribute("storeId", 1L);
//
//        when(ecommerceAuthService.getCustomerById(1L, 1L)).thenReturn(null);
//
//        // Act & Assert
//        mockMvc.perform(get("/ecommerce/auth/profile")
//                        .session(session))
//                .andExpect(status().isNotFound())
//                .andExpect(content().string("Customer not found."));
//
//        verify(ecommerceAuthService).getCustomerById(1L, 1L);
//    }
//
//    @Test
//    void testUpdateProfile_Success() throws Exception {
//        // Arrange
//        session.setAttribute("customerId", 1L);
//        session.setAttribute("storeId", 1L);
//
//        Customer updateData = new Customer();
//        updateData.setName("Updated Name");
//        updateData.setPhone("9876543210");
//        updateData.setGender("Female");
//
//        Customer updatedCustomer = new Customer();
//        updatedCustomer.setId(1L);
//        updatedCustomer.setName("Updated Name");
//        updatedCustomer.setPhone("9876543210");
//        updatedCustomer.setGender("Female");
//        updatedCustomer.setEmail("john@example.com");
//
//        when(ecommerceAuthService.updateCustomerProfile(eq(1L), eq(1L), any(Customer.class))).thenReturn(updatedCustomer);
//
//        // Act & Assert
//        mockMvc.perform(put("/ecommerce/auth/update/profile")
//                        .session(session)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(updateData)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1))
//                .andExpect(jsonPath("$.name").value("Updated Name"))
//                .andExpect(jsonPath("$.phone").value("9876543210"))
//                .andExpect(jsonPath("$.gender").value("Female"))
//                .andExpect(jsonPath("$.password").isEmpty()); // Password should not be returned
//
//        verify(ecommerceAuthService).updateCustomerProfile(eq(1L), eq(1L), any(Customer.class));
//    }
//
//    @Test
//    void testUpdateProfile_NotAuthenticated() throws Exception {
//        // Arrange
//        Customer updateData = new Customer();
//        updateData.setName("Updated Name");
//
//        // Act & Assert
//        mockMvc.perform(put("/ecommerce/auth/update/profile")
//                        .session(session)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(updateData)))
//                .andExpect(status().isUnauthorized())
//                .andExpect(content().string("Not authenticated."));
//
//        verify(ecommerceAuthService, never()).updateCustomerProfile(any(), any(), any());
//    }
//
//    @Test
//    void testUpdateProfile_ServiceException() throws Exception {
//        // Arrange
//        session.setAttribute("customerId", 1L);
//        session.setAttribute("storeId", 1L);
//
//        Customer updateData = new Customer();
//        updateData.setName("Updated Name");
//
//        when(ecommerceAuthService.updateCustomerProfile(eq(1L), eq(1L), any(Customer.class)))
//                .thenThrow(new RuntimeException("Update failed"));
//
//        // Act & Assert
//        mockMvc.perform(put("/ecommerce/auth/update/profile")
//                        .session(session)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(updateData)))
//                .andExpect(status().isInternalServerError())
//                .andExpect(jsonPath("$.success").value(false))
//                .andExpect(jsonPath("$.message").value("Update failed"));
//
//        verify(ecommerceAuthService).updateCustomerProfile(eq(1L), eq(1L), any(Customer.class));
//    }
//
//    @Test
//    void testSendCustomerOTP_Success() throws Exception {
//        // Arrange
//        Map<String, String> requestBody = new HashMap<>();
//        requestBody.put("email", "john@example.com");
//
//        when(ecommerceAuthService.isCustomerExists("john@example.com")).thenReturn(true);
//        doNothing().when(ecommerceAuthService).sendCustomerOTP("john@example.com");
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/forgotPassword/sendOTP")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestBody)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.message").value("OTP sent successfully"));
//
//        verify(ecommerceAuthService).isCustomerExists("john@example.com");
//        verify(ecommerceAuthService).sendCustomerOTP("john@example.com");
//    }
//
//    @Test
//    void testSendCustomerOTP_CustomerNotFound() throws Exception {
//        // Arrange
//        Map<String, String> requestBody = new HashMap<>();
//        requestBody.put("email", "nonexistent@example.com");
//
//        when(ecommerceAuthService.isCustomerExists("nonexistent@example.com")).thenReturn(false);
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/forgotPassword/sendOTP")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestBody)))
//                .andExpect(status().isUnauthorized())
//                .andExpect(jsonPath("$.success").value(false))
//                .andExpect(jsonPath("$.message").value("No customer with this email exists."));
//
//        verify(ecommerceAuthService).isCustomerExists("nonexistent@example.com");
//        verify(ecommerceAuthService, never()).sendCustomerOTP(any());
//    }
//
//    @Test
//    void testVerifyCustomerOTP_Success() throws Exception {
//        // Arrange
//        Map<String, String> requestBody = new HashMap<>();
//        requestBody.put("email", "john@example.com");
//        requestBody.put("otp", "123456");
//
//        when(ecommerceAuthService.isCustomerExists("john@example.com")).thenReturn(true);
//        doNothing().when(ecommerceAuthService).verifyCustomerOTP("john@example.com", "123456");
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/forgotPassword/verifyOTP")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestBody)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.message").value("OTP verified successfully"));
//
//        verify(ecommerceAuthService).isCustomerExists("john@example.com");
//        verify(ecommerceAuthService).verifyCustomerOTP("john@example.com", "123456");
//    }
//
//    @Test
//    void testVerifyCustomerOTP_CustomerNotFound() throws Exception {
//        // Arrange
//        Map<String, String> requestBody = new HashMap<>();
//        requestBody.put("email", "nonexistent@example.com");
//        requestBody.put("otp", "123456");
//
//        when(ecommerceAuthService.isCustomerExists("nonexistent@example.com")).thenReturn(false);
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/forgotPassword/verifyOTP")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestBody)))
//                .andExpect(status().isUnauthorized())
//                .andExpect(jsonPath("$.success").value(false))
//                .andExpect(jsonPath("$.message").value("No customer with this email exists."));
//
//        verify(ecommerceAuthService).isCustomerExists("nonexistent@example.com");
//        verify(ecommerceAuthService, never()).verifyCustomerOTP(any(), any());
//    }
//
//    @Test
//    void testResetCustomerPassword_Success() throws Exception {
//        // Arrange
//        Map<String, String> requestBody = new HashMap<>();
//        requestBody.put("email", "john@example.com");
//        requestBody.put("newPassword", "newpassword123");
//
//        when(ecommerceAuthService.isCustomerExists("john@example.com")).thenReturn(true);
//        doNothing().when(ecommerceAuthService).resetCustomerPassword("john@example.com", "newpassword123");
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/forgotPassword/resetPassword")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestBody)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.message").value("Password reset successfully"));
//
//        verify(ecommerceAuthService).isCustomerExists("john@example.com");
//        verify(ecommerceAuthService).resetCustomerPassword("john@example.com", "newpassword123");
//    }
//
//    @Test
//    void testResetCustomerPassword_ShortPassword() throws Exception {
//        // Arrange
//        Map<String, String> requestBody = new HashMap<>();
//        requestBody.put("email", "john@example.com");
//        requestBody.put("newPassword", "123"); // Too short
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/forgotPassword/resetPassword")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestBody)))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.success").value(false))
//                .andExpect(jsonPath("$.message").value("Password must be at least 8 characters long."));
//
//        verify(ecommerceAuthService, never()).isCustomerExists(any());
//        verify(ecommerceAuthService, never()).resetCustomerPassword(any(), any());
//    }
//
//    @Test
//    void testResetCustomerPassword_CustomerNotFound() throws Exception {
//        // Arrange
//        Map<String, String> requestBody = new HashMap<>();
//        requestBody.put("email", "nonexistent@example.com");
//        requestBody.put("newPassword", "newpassword123");
//
//        when(ecommerceAuthService.isCustomerExists("nonexistent@example.com")).thenReturn(false);
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/forgotPassword/resetPassword")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestBody)))
//                .andExpect(status().isUnauthorized())
//                .andExpect(jsonPath("$.success").value(false))
//                .andExpect(jsonPath("$.message").value("No customer with this email exists."));
//
//        verify(ecommerceAuthService).isCustomerExists("nonexistent@example.com");
//        verify(ecommerceAuthService, never()).resetCustomerPassword(any(), any());
//    }
//
//    @Test
//    void testResetCustomerPassword_MissingPassword() throws Exception {
//        // Arrange
//        Map<String, String> requestBody = new HashMap<>();
//        requestBody.put("email", "john@example.com");
//        // Missing newPassword
//
//        // Act & Assert
//        mockMvc.perform(post("/ecommerce/auth/forgotPassword/resetPassword")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestBody)))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.success").value(false))
//                .andExpect(jsonPath("$.message").value("Password must be at least 8 characters long."));
//
//        verify(ecommerceAuthService, never()).isCustomerExists(any());
//        verify(ecommerceAuthService, never()).resetCustomerPassword(any(), any());
//    }
//}