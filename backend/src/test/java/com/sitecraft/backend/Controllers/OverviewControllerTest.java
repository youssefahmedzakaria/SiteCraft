package com.sitecraft.backend.Controllers;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.sitecraft.backend.Services.OverviewService;
import com.sitecraft.backend.Services.OverviewService.ProductSales;
import com.sitecraft.backend.Services.OverviewService.DailySales;
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
import java.util.Collections;
import java.math.BigDecimal;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OverviewController.class)
@AutoConfigureMockMvc(addFilters = false)
public class OverviewControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private OverviewService overviewService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetOrderCount_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        when(overviewService.getTodayOrderCount(1L)).thenReturn(10L);
        mockMvc.perform(get("/api/overview/orders/count").session(session))
                .andExpect(status().isOk())
                .andExpect(content().string("10"));
    }

    @Test
    void testGetOrderCount_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/overview/orders/count"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void testGetTotalSales_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        when(overviewService.getTodaySalesTotal(1L)).thenReturn(BigDecimal.valueOf(123.45));
        mockMvc.perform(get("/api/overview/sales/total").session(session))
                .andExpect(status().isOk())
                .andExpect(content().string("123.45"));
    }

    @Test
    void testGetTopProducts_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<ProductSales> topProducts = List.of(mock(ProductSales.class));
        when(overviewService.getTopProducts(1L, 5)).thenReturn(topProducts);
        mockMvc.perform(get("/api/overview/products/top").session(session))
                .andExpect(status().isOk());
    }

    @Test
    void testGetTodayOrders_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<Order> orders = List.of(new Order());
        when(overviewService.getTodayOrders(1L)).thenReturn(orders);
        mockMvc.perform(get("/api/overview/orders").session(session))
                .andExpect(status().isOk());
    }

    @Test
    void testGetLast7DaysSales_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        List<DailySales> sales = List.of(mock(DailySales.class));
        when(overviewService.getLast7DaysSales(1L)).thenReturn(sales);
        mockMvc.perform(get("/api/overview/sales/daily").session(session))
                .andExpect(status().isOk());
    }
} 