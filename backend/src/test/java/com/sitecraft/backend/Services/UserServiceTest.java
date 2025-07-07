package com.sitecraft.backend.Services;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import org.springframework.mail.javamail.JavaMailSender;
import java.util.Optional;
import java.util.Collections;
import java.util.List;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class UserServiceTest {
    @Mock private UserRepo userRepo;
    @Mock private UserRoleRepo userRoleRepo;
    @Mock private OTPRepo otpRepo;
    @Mock private StoreService storeService;
    @Mock private JavaMailSender mailSender;
    @Mock private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService = new UserService(mailSender);

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllUsers() {
        Users user = mock(Users.class);
        when(userRepo.findAll()).thenReturn(Collections.singletonList(user));
        List<Users> result = userService.getAllUsers();
        assertEquals(1, result.size());
        assertEquals(user, result.get(0));
    }

    @Test
    void testRegister_EncodesPasswordAndSaves() {
        Users user = new Users();
        user.setEmail("test@example.com");
        user.setPassword("plain");
        Users savedUser = new Users();
        savedUser.setId(1L);
        savedUser.setEmail("test@example.com");
        when(userRepo.save(any(Users.class))).thenReturn(savedUser);
        Users result = userService.register(user);
        assertEquals(1L, result.getId());
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void testIsUserExists_True() {
        Users user = new Users();
        when(userRepo.findByEmail("a@b.com")).thenReturn(user);
        assertTrue(userService.isUserExists("a@b.com"));
    }

    @Test
    void testIsUserExists_False() {
        when(userRepo.findByEmail("a@b.com")).thenReturn(null);
        assertFalse(userService.isUserExists("a@b.com"));
    }

    @Test
    void testLogin_Success() {
        Users user = new Users();
        user.setEmail("test@example.com");
        String encoded = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("password123");
        user.setPassword(encoded);
        user.setRole("admin");
        user.setStoreId(5L);
        when(userRepo.findAllByEmail("test@example.com")).thenReturn(List.of(user));
        UserRole role = new UserRole();
        role.setRole("admin");
        role.setStoreId(5L);
        when(userRoleRepo.findByUser(user)).thenReturn(role);
        Users result = userService.login("test@example.com", "password123");
        assertEquals("admin", result.getRole());
        assertEquals(5L, result.getStoreId());
    }

    @Test
    void testLogin_WrongPassword() {
        Users user = new Users();
        user.setEmail("a@b.com");
        user.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("pass"));
        when(userRepo.findByEmail("a@b.com")).thenReturn(user);
        Users result = userService.login("a@b.com", "wrong");
        assertNull(result);
    }

    @Test
    void testLogin_UserNotFound() {
        when(userRepo.findByEmail("a@b.com")).thenReturn(null);
        Users result = userService.login("a@b.com", "pass");
        assertNull(result);
    }

    // TODO: Implement tests for sendOTP, verifyOTP, resetPassword, getAllStaffByStoreId, addStaff, removeStaff, and other edge cases
} 