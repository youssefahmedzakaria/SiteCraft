package com.sitecraft.backend.Controllers;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.sitecraft.backend.Services.CustomerService;
import com.sitecraft.backend.Models.Customer;
import com.sitecraft.backend.Models.Address;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import java.util.Collections;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@WebMvcTest(CustomerController.class)
@AutoConfigureMockMvc(addFilters = false)
public class CustomerControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private CustomerService customerService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllCustomers_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<Customer> customers = List.of(new Customer());
        when(customerService.getAllCustomers(1L)).thenReturn(customers);
        mockMvc.perform(get("/customer").session(session))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAllCustomers_InternalError() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        when(customerService.getAllCustomers(1L)).thenThrow(new RuntimeException("DB error"));
        mockMvc.perform(get("/customer").session(session))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testSuspendCustomer_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        doNothing().when(customerService).suspendCustomer(2L, 1L);
        mockMvc.perform(put("/customer/suspend/2").session(session))
                .andExpect(status().isAccepted())
                .andExpect(content().string("Customer Suspended Successfully."));
    }

    @Test
    void testSuspendCustomer_InternalError() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        doThrow(new RuntimeException("DB error")).when(customerService).suspendCustomer(2L, 1L);
        mockMvc.perform(put("/customer/suspend/2").session(session))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testGetCustomerInfo_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        Customer customer = new Customer();
        when(customerService.getCustomerInfo(1L)).thenReturn(customer);
        mockMvc.perform(get("/customer/getInfo").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetCustomerInfo_Unauthorized() throws Exception {
        mockMvc.perform(get("/customer/getInfo"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testGetCustomerAddresses_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        List<Address> addresses = List.of(new Address());
        when(customerService.getCustomerAddresses(1L)).thenReturn(addresses);
        mockMvc.perform(get("/customer/getAddresses").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testUpdateCustomerInfo_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        Customer updated = new Customer();
        doNothing().when(customerService).updateCustomerInfo(1L, updated);
        mockMvc.perform(put("/customer/updateCustomerInfo")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testChangePassword_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        Map<String, String> passwords = Map.of("oldPassword", "old", "newPassword", "new");
        doNothing().when(customerService).changePassword(1L, passwords);
        mockMvc.perform(put("/customer/changePassword")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(passwords)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testAddAddress_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        Address address = new Address();
        doNothing().when(customerService).addAddress(1L, address);
        mockMvc.perform(post("/customer/addAddress")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(address)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testUpdateAddress_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        Address address = new Address();
        doNothing().when(customerService).updateAddress(1L, 2L, address);
        mockMvc.perform(put("/customer/updateAddress/2")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(address)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testDeleteAddress_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        doNothing().when(customerService).deleteAddress(1L, 2L);
        mockMvc.perform(delete("/customer/deleteAddress/2").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetSession_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        mockMvc.perform(get("/customer/getSession").session(session))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.customerId").value(1));
    }

    @Test
    void testGetSession_Unauthorized() throws Exception {
        mockMvc.perform(get("/customer/getSession"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.customerId").value(org.hamcrest.Matchers.nullValue()));
    }

    @Test
    void testSetSession_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        Customer customer = new Customer();
        customer.setId(1L);
        customer.setName("Test Customer");
        customer.setEmail("test@example.com");
        
        mockMvc.perform(post("/customer/setSession")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customer)))
                .andExpect(status().isAccepted())
                .andExpect(content().string("Session Updated Successfully."));
        
        // Verify session attribute is set
        assertEquals(1L, session.getAttribute("customerId"));
    }

    @Test
    void testSetSession_WithNullCustomer() throws Exception {
        MockHttpSession session = new MockHttpSession();
        Customer customer = new Customer();
        customer.setId(null);
        
        mockMvc.perform(post("/customer/setSession")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customer)))
                .andExpect(status().isAccepted())
                .andExpect(content().string("Session Updated Successfully."));
        
        // Verify session attribute is set to null
        assertEquals(null, session.getAttribute("customerId"));
    }
} 