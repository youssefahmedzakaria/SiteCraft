package com.sitecraft.backend.Controllers;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.sitecraft.backend.Services.UserService;
import com.sitecraft.backend.Services.StoreService;
import com.sitecraft.backend.Models.Users;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.UserRole;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private UserService userService;
    @MockBean
    private StoreService storeService;
    @MockBean
    private com.sitecraft.backend.Repositories.UserRoleRepo userRoleRepo;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testRegister_Success() throws Exception {
        Users user = new Users();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setId(1L);
        when(userService.canRegisterAsOwner("test@example.com")).thenReturn(true);
        when(userService.register(any(Users.class))).thenReturn(user);
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.userId").value(1));
    }

    @Test
    void testRegister_UserExists() throws Exception {
        Users user = new Users();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        when(userService.canRegisterAsOwner("test@example.com")).thenReturn(false);
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("User with this email is already an owner of another store."));
    }

    @Test
    void testRegister_ShortPassword() throws Exception {
        Users user = new Users();
        user.setEmail("test@example.com");
        user.setPassword("short");
        when(userService.canRegisterAsOwner("test@example.com")).thenReturn(true);
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testRegister_InternalError() throws Exception {
        Users user = new Users();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        when(userService.canRegisterAsOwner("test@example.com")).thenReturn(true);
        when(userService.register(any(Users.class))).thenThrow(new RuntimeException("DB error"));
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testLogin_Success() throws Exception {
        AuthController.LoginRequest req = new AuthController.LoginRequest();
        req.setEmail("test@example.com");
        req.setPassword("password123");
        Users user = new Users();
        user.setId(1L);
        user.setStoreId(2L);
        user.setRole("admin");
        when(userService.isAnyUserExists("test@example.com")).thenReturn(true);
        when(userService.login("test@example.com", "password123")).thenReturn(user);
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isAccepted())
                .andExpect(content().string("User logged in successfully."));
    }

    @Test
    void testLogin_UserNotFound() throws Exception {
        AuthController.LoginRequest req = new AuthController.LoginRequest();
        req.setEmail("notfound@example.com");
        req.setPassword("password123");
        when(userService.isAnyUserExists("notfound@example.com")).thenReturn(false);
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User with this email does not exist."));
    }

    @Test
    void testLogin_WrongPassword() throws Exception {
        AuthController.LoginRequest req = new AuthController.LoginRequest();
        req.setEmail("test@example.com");
        req.setPassword("wrongpass");
        when(userService.isAnyUserExists("test@example.com")).thenReturn(true);
        when(userService.login("test@example.com", "wrongpass")).thenReturn(null);
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Incorrect password. Please try again."));
    }

    @Test
    void testLogout_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("userId", 1L);
        session.setAttribute("storeId", 2L);
        session.setAttribute("role", "admin");
        mockMvc.perform(post("/auth/logout").session(session))
                .andExpect(status().isAccepted())
                .andExpect(content().string("User logged out successfully."));
    }

    @Test
    void testForgotPassword_SendOTPSuccess() throws Exception {
        Map<String, String> body = Map.of("email", "test@example.com");
        when(userService.isAnyUserExists("test@example.com")).thenReturn(true);
        doNothing().when(userService).sendOTP("test@example.com");
        mockMvc.perform(post("/auth/forgotPassword/sendOTP")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testForgotPassword_SendOTPUserNotFound() throws Exception {
        Map<String, String> body = Map.of("email", "notfound@example.com");
        when(userService.isAnyUserExists("notfound@example.com")).thenReturn(false);
        mockMvc.perform(post("/auth/forgotPassword/sendOTP")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testForgotPassword_SendOTPInternalError() throws Exception {
        Map<String, String> body = Map.of("email", "test@example.com");
        when(userService.isAnyUserExists("test@example.com")).thenReturn(true);
        doThrow(new RuntimeException("Mail error")).when(userService).sendOTP("test@example.com");
        mockMvc.perform(post("/auth/forgotPassword/sendOTP")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testForgotPassword_VerifyOTPSuccess() throws Exception {
        Map<String, String> body = Map.of("email", "test@example.com", "otp", "123456");
        when(userService.isAnyUserExists("test@example.com")).thenReturn(true);
        doNothing().when(userService).verifyOTP("test@example.com", "123456");
        mockMvc.perform(post("/auth/forgotPassword/verifyOTP")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testForgotPassword_VerifyOTPUserNotFound() throws Exception {
        Map<String, String> body = Map.of("email", "notfound@example.com", "otp", "123456");
        when(userService.isAnyUserExists("notfound@example.com")).thenReturn(false);
        mockMvc.perform(post("/auth/forgotPassword/verifyOTP")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testForgotPassword_VerifyOTPInternalError() throws Exception {
        Map<String, String> body = Map.of("email", "test@example.com", "otp", "123456");
        when(userService.isAnyUserExists("test@example.com")).thenReturn(true);
        doThrow(new RuntimeException("OTP error")).when(userService).verifyOTP("test@example.com", "123456");
        mockMvc.perform(post("/auth/forgotPassword/verifyOTP")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testForgotPassword_ResetPasswordSuccess() throws Exception {
        Map<String, String> body = Map.of("email", "test@example.com", "newPassword", "password123");
        doNothing().when(userService).resetPassword("test@example.com", "password123");
        mockMvc.perform(post("/auth/forgotPassword/resetPassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testForgotPassword_ResetPasswordShortPassword() throws Exception {
        Map<String, String> body = Map.of("email", "test@example.com", "newPassword", "short");
        mockMvc.perform(post("/auth/forgotPassword/resetPassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testForgotPassword_ResetPasswordInternalError() throws Exception {
        Map<String, String> body = Map.of("email", "test@example.com", "newPassword", "password123");
        doThrow(new RuntimeException("Reset error")).when(userService).resetPassword("test@example.com", "password123");
        mockMvc.perform(post("/auth/forgotPassword/resetPassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testGetSession_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("userId", 1L);
        session.setAttribute("storeId", 2L);
        session.setAttribute("role", "admin");
        UserRole userRole = new UserRole("admin", new Users(), 2L);
        when(userService.getUserRole(1L)).thenReturn(userRole);
        mockMvc.perform(get("/auth/getSession").session(session))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.storeId").value(2))
                .andExpect(jsonPath("$.role").value("admin"));
    }

    @Test
    void testGetSession_NoUserId() throws Exception {
        MockHttpSession session = new MockHttpSession();
        mockMvc.perform(get("/auth/getSession").session(session))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.userId").doesNotExist());
    }

    @Test
    void testSetSession_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        Map<String, Object> sessionData = Map.of(
            "userId", 1L,
            "storeId", 2L,
            "role", "admin"
        );
        mockMvc.perform(post("/auth/setSession")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionData))
                .session(session))
                .andExpect(status().isOk());
        
        assertEquals(1L, session.getAttribute("userId"));
        assertEquals(2L, session.getAttribute("storeId"));
        assertEquals("admin", session.getAttribute("role"));
    }

    @Test
    void testCommitRegistration_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        // Create test data
        Users user = new Users();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setName("Test User");
        Store store = new Store();
        store.setId(1L);
        store.setStoreName("Test Store");
        store.setStoreType("retail");
        when(userService.register(any(Users.class))).thenReturn(user);
        when(storeService.createStore(any(Store.class), eq(1L))).thenReturn(store);
        when(storeService.updateStorePartial(anyLong(), any(Store.class))).thenReturn(store);
        String registrationDataJson = """
            {
                \"user\": {
                    \"email\": \"test@example.com\",
                    \"password\": \"password123\",
                    \"name\": \"Test User\",
                    \"phone\": \"1234567890\",
                    \"gender\": \"Male\"
                },
                \"store\": {
                    \"storeName\": \"Test Store\",
                    \"storeType\": \"retail\",
                    \"description\": \"Test store description\",
                    \"phoneNumber\": \"1234567890\",
                    \"emailAddress\": \"store@example.com\",
                    \"address\": \"Test Address\",
                    \"addressLink\": \"https://maps.google.com\",
                    \"openingHours\": \"9AM-6PM\"
                }
            }
            """;
        mockMvc.perform(multipart("/auth/commitRegistration")
                .param("registrationData", registrationDataJson)
                .session(session))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Registration completed successfully"))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.storeId").value(1))
                .andExpect(jsonPath("$.role").value("owner"));
        assertEquals(1L, session.getAttribute("userId"));
        assertEquals(1L, session.getAttribute("storeId"));
        assertEquals("owner", session.getAttribute("role"));
    }

    @Test
    void testCommitRegistration_WithLogo() throws Exception {
        MockHttpSession session = new MockHttpSession();
        Users user = new Users();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setName("Test User");
        Store store = new Store();
        store.setId(1L);
        store.setStoreName("Test Store");
        store.setStoreType("retail");
        when(userService.register(any(Users.class))).thenReturn(user);
        when(storeService.createStore(any(Store.class), eq(1L))).thenReturn(store);
        when(storeService.updateStorePartial(anyLong(), any(Store.class))).thenReturn(store);
        String registrationDataJson = """
            {
                \"user\": {
                    \"email\": \"test@example.com\",
                    \"password\": \"password123\",
                    \"name\": \"Test User\",
                    \"phone\": \"1234567890\",
                    \"gender\": \"Male\"
                },
                \"store\": {
                    \"storeName\": \"Test Store\",
                    \"storeType\": \"retail\",
                    \"description\": \"Test store description\",
                    \"phoneNumber\": \"1234567890\",
                    \"emailAddress\": \"store@example.com\",
                    \"address\": \"Test Address\",
                    \"addressLink\": \"https://maps.google.com\",
                    \"openingHours\": \"9AM-6PM\"
                }
            }
            """;
        MockMultipartFile logoFile = new MockMultipartFile("logo", "logo.jpg", "image/jpeg", "test logo content".getBytes());
        mockMvc.perform(((org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder)
                multipart("/auth/commitRegistration")
                .param("registrationData", registrationDataJson))
                .file(logoFile)
                .session(session))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Registration completed successfully"));
    }

    @Test
    void testCommitRegistration_ServiceException() throws Exception {
        MockHttpSession session = new MockHttpSession();
        when(userService.register(any(Users.class))).thenThrow(new RuntimeException("Registration failed"));
        String registrationDataJson = """
            {
                \"user\": {
                    \"email\": \"test@example.com\",
                    \"password\": \"password123\",
                    \"name\": \"Test User\",
                    \"phone\": \"1234567890\",
                    \"gender\": \"Male\"
                },
                \"store\": {
                    \"storeName\": \"Test Store\",
                    \"storeType\": \"retail\",
                    \"description\": \"Test store description\",
                    \"phoneNumber\": \"1234567890\",
                    \"emailAddress\": \"store@example.com\",
                    \"address\": \"Test Address\",
                    \"addressLink\": \"https://maps.google.com\",
                    \"openingHours\": \"9AM-6PM\"
                }
            }
            """;
        mockMvc.perform(multipart("/auth/commitRegistration")
                .param("registrationData", registrationDataJson)
                .session(session))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Registration failed"));
    }
} 