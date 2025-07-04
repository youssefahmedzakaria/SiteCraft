package com.sitecraft.backend.Controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sitecraft.backend.DTOs.DateRangeDTO;
import com.sitecraft.backend.Repositories.WishlistAnalyticsDao.WishlistTrend;
import com.sitecraft.backend.Services.AnalyticsService;
import com.sitecraft.backend.Services.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AnalyticsController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AnalyticsControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnalyticsService analyticsService;

    @MockBean
    private CustomerService customerService;

    @Autowired
    private ObjectMapper objectMapper;

    private DateRangeDTO dateRange;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        dateRange = new DateRangeDTO();
        dateRange.setStartDate(LocalDate.of(2024, 1, 1));
        dateRange.setEndDate(LocalDate.of(2024, 1, 31));
    }

    @Test
    void testGetOrderCount_Success() throws Exception {
        when(analyticsService.countOrdersByDateRange(any(), any(), eq(1L))).thenReturn(5L);
        mockMvc.perform(post("/api/analytics/orders/count")
                        .sessionAttr("storeId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dateRange)))
                .andExpect(status().isOk())
                .andExpect(content().string("5"));
    }

    @Test
    void testGetOrderCount_MissingSession() throws Exception {
        mockMvc.perform(post("/api/analytics/orders/count")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dateRange)))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void testGetTotalSales_Success() throws Exception {
        when(analyticsService.sumTotalSalesByDateRange(any(), any(), eq(1L))).thenReturn(new BigDecimal("123.45"));
        mockMvc.perform(post("/api/analytics/sales/total")
                        .sessionAttr("storeId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dateRange)))
                .andExpect(status().isOk())
                .andExpect(content().string("123.45"));
    }

    @Test
    void testGetDailySales_Success() throws Exception {
        AnalyticsService.DailySales daily = new AnalyticsService.DailySales(LocalDate.of(2024, 1, 1), new BigDecimal("100.00"));
        when(analyticsService.getDailySalesByDateRange(any(), any(), eq(1L))).thenReturn(Collections.singletonList(daily));
        mockMvc.perform(post("/api/analytics/sales/daily")
                        .sessionAttr("storeId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dateRange)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].date").value("2024-01-01"))
                .andExpect(jsonPath("$[0].totalSales").value(100.00));
    }

    @Test
    void testGetDailyNetProfit_Success() throws Exception {
        AnalyticsService.DailyNetProfit profit = new AnalyticsService.DailyNetProfit(LocalDate.of(2024, 1, 1), new BigDecimal("50.00"));
        when(analyticsService.getDailyNetProfitByDateRange(any(), any(), eq(1L))).thenReturn(Collections.singletonList(profit));
        mockMvc.perform(post("/api/analytics/profit/daily")
                        .sessionAttr("storeId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dateRange)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].date").value("2024-01-01"))
                .andExpect(jsonPath("$[0].netProfit").value(50.00));
    }

    @Test
    void testGetSalesByCategory_Success() throws Exception {
        AnalyticsService.CategorySales cat = new AnalyticsService.CategorySales("Electronics", new BigDecimal("200.00"));
        when(analyticsService.getSalesByCategory(any(), any(), eq(1L))).thenReturn(Collections.singletonList(cat));
        mockMvc.perform(post("/api/analytics/sales/category")
                        .sessionAttr("storeId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dateRange)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].categoryName").value("Electronics"))
                .andExpect(jsonPath("$[0].totalSales").value(200.00));
    }

    @Test
    void testGetTopProductsByDateRange_Success() throws Exception {
        AnalyticsService.ProductSales prod = new AnalyticsService.ProductSales(null, 10);
        when(analyticsService.getTopSellingProductsByDateRange(any(), any(), eq(1L), anyInt())).thenReturn(Collections.singletonList(prod));
        dateRange.setLimit(1);
        mockMvc.perform(post("/api/analytics/products/top")
                        .sessionAttr("storeId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dateRange)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].quantitySold").value(10));
    }

    @Test
    void testGetWishlistTrends_Success() throws Exception {
        WishlistTrend trend = mock(WishlistTrend.class);
        when(analyticsService.getWishlistTrends(any(), any(), eq(1L))).thenReturn(Collections.singletonList(trend));
        mockMvc.perform(post("/api/analytics/wishlist/trends")
                        .sessionAttr("storeId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dateRange)))
                .andExpect(status().isOk());
    }

    @Test
    void testGetSalesByProduct_Success() throws Exception {
        AnalyticsService.SalesByProduct sales = new AnalyticsService.SalesByProduct(LocalDate.of(2024, 1, 1), "ProductA", 5);
        when(analyticsService.getSalesByProductByDateRange(any(), any(), eq(1L))).thenReturn(Collections.singletonList(sales));
        mockMvc.perform(post("/api/analytics/sales/product")
                        .sessionAttr("storeId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dateRange)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].productName").value("ProductA"))
                .andExpect(jsonPath("$[0].unitsSold").value(5));
    }

    @Test
    void testGetNewCustomers_Success() throws Exception {
        when(customerService.countNewCustomersByDateRange(any(), any(), eq(1L))).thenReturn(3L);
        mockMvc.perform(post("/api/analytics/customers/new")
                        .sessionAttr("storeId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dateRange)))
                .andExpect(status().isOk())
                .andExpect(content().string("3"));
    }

    @Test
    void testGetReturningCustomers_Success() throws Exception {
        when(customerService.countReturningCustomersByDateRange(any(), any(), eq(1L))).thenReturn(2L);
        mockMvc.perform(post("/api/analytics/customers/returning")
                        .sessionAttr("storeId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dateRange)))
                .andExpect(status().isOk())
                .andExpect(content().string("2"));
    }

    @Test
    void testGetCustomerAcquisition_Success() throws Exception {
        AnalyticsService.SourceCount source = new AnalyticsService.SourceCount("Google", 7L);
        when(analyticsService.getVisitCountsBySource(any(), any(), eq(1L))).thenReturn(Collections.singletonList(source));
        mockMvc.perform(post("/api/analytics/customers/acquisition")
                        .sessionAttr("storeId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dateRange)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].source").value("Google"))
                .andExpect(jsonPath("$[0].count").value(7));
    }
}