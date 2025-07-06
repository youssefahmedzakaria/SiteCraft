package com.sitecraft.backend.Controllers;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.sitecraft.backend.Services.OrderService;
import com.sitecraft.backend.Models.Order;
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
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
public class OrderControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private OrderService orderService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllOrdersForStore_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<Order> orders = List.of(new Order());
        when(orderService.getAllOrders(1L)).thenReturn(orders);
        mockMvc.perform(get("/order/getAllOrders").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetAllOrdersForStore_Unauthorized() throws Exception {
        mockMvc.perform(get("/order/getAllOrders"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testGetOrder_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        Order order = new Order();
        when(orderService.getOrder(2L, 1L)).thenReturn(order);
        mockMvc.perform(get("/order/getOrder/2").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetOrder_Unauthorized() throws Exception {
        mockMvc.perform(get("/order/getOrder/2"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testUpdateOrderStatus_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        Map<String, String> body = Map.of("status", "SHIPPED");
        Order order = new Order();
        when(orderService.updateOrderStatus(2L, "SHIPPED")).thenReturn(order);
        mockMvc.perform(put("/order/updateOrderStatus/2")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testUpdateOrderStatus_Unauthorized() throws Exception {
        Map<String, String> body = Map.of("status", "SHIPPED");
        mockMvc.perform(put("/order/updateOrderStatus/2")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testCancelOrder_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        when(orderService.getCustomerIdOfOrder(2L)).thenReturn(1L);
        doNothing().when(orderService).cancelOrder(2L);
        mockMvc.perform(put("/order/cancelOrder/2").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testCancelOrder_Unauthorized_NoCustomerId() throws Exception {
        mockMvc.perform(put("/order/cancelOrder/2"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testCancelOrder_Unauthorized_WrongCustomer() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        when(orderService.getCustomerIdOfOrder(2L)).thenReturn(2L);
        mockMvc.perform(put("/order/cancelOrder/2").session(session))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testCreateOrder_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("customerId", 1L);
        session.setAttribute("storeId", 2L);
        doNothing().when(orderService).createOrder(1L, 3L, 2L);
        mockMvc.perform(post("/order/create/3").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testCreateOrder_Unauthorized_NoCustomerId() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 2L);
        mockMvc.perform(post("/order/create/3").session(session))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testCreateOrder_Unauthorized() throws Exception {
        mockMvc.perform(post("/order/create/1"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Customer ID not found in session."));
    }

    @Test
    void testExportOrders_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        byte[] excelData = "test excel data".getBytes();
        when(orderService.exportOrdersToExcel(1L)).thenReturn(excelData);
        mockMvc.perform(get("/order/export").session(session))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "form-data; name=\"attachment\"; filename=\"orders_export.xlsx\""))
                .andExpect(header().string("Content-Type", "application/octet-stream"));
    }

    @Test
    void testExportOrders_Unauthorized() throws Exception {
        mockMvc.perform(get("/order/export"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Store ID not found in session."));
    }

    @Test
    void testExportOrders_ServiceException() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        when(orderService.exportOrdersToExcel(1L)).thenThrow(new RuntimeException("Export failed"));
        mockMvc.perform(get("/order/export").session(session))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Failed to export orders: Export failed"));
    }
} 