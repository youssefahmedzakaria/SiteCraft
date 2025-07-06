package com.sitecraft.backend.Controllers;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.sitecraft.backend.Services.ReportService;
import com.sitecraft.backend.Services.ChromePdfService;
import com.sitecraft.backend.DTOs.DateRangeDTO;
import com.sitecraft.backend.DTOs.ProductAnalyticsRow;
import com.sitecraft.backend.DTOs.EngagementReportRow;
import com.sitecraft.backend.DTOs.SalesSummaryRow;
import com.sitecraft.backend.DTOs.InventoryStatusRow;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.List;
import java.util.Collections;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReportController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ReportControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private ReportService reportService;
    @MockBean
    private ChromePdfService chromePdfService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testDownloadSessionCreationPdf_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        DateRangeDTO dto = new DateRangeDTO();
        dto.setStartDate(LocalDate.now().minusDays(7));
        dto.setEndDate(LocalDate.now());
        when(reportService.getSessionCounts(anyLong(), any(), any())).thenReturn(Collections.emptyList());
        when(chromePdfService.generatePdf(anyString(), any())).thenReturn(new byte[]{1,2,3});
        mockMvc.perform(post("/reports/session-creation/report.pdf")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));
    }

    @Test
    void testDownloadProductAnalyticsPdf_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        DateRangeDTO dto = new DateRangeDTO();
        dto.setStartDate(LocalDate.now().minusDays(7));
        dto.setEndDate(LocalDate.now());
        when(reportService.getProductAnalytics(anyLong(), any(), any())).thenReturn(Collections.emptyList());
        when(chromePdfService.generatePdf(anyString(), any())).thenReturn(new byte[]{1,2,3});
        mockMvc.perform(post("/reports/product-analytics/report.pdf")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));
    }

    @Test
    void testDownloadEngagementPdf_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        DateRangeDTO dto = new DateRangeDTO();
        dto.setStartDate(LocalDate.now().minusDays(7));
        dto.setEndDate(LocalDate.now());
        when(reportService.getEngagementMetrics(anyLong(), any(), any())).thenReturn(Collections.emptyList());
        when(chromePdfService.generatePdf(anyString(), any())).thenReturn(new byte[]{1,2,3});
        mockMvc.perform(post("/reports/customer-engagement/report.pdf")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));
    }

    @Test
    void testDownloadSalesSummaryPdf_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        DateRangeDTO dto = new DateRangeDTO();
        dto.setStartDate(LocalDate.now().minusDays(7));
        dto.setEndDate(LocalDate.now());
        when(reportService.getSalesSummary(anyLong(), any(), any())).thenReturn(mock(SalesSummaryRow.class));
        when(chromePdfService.generatePdf(anyString(), any())).thenReturn(new byte[]{1,2,3});
        mockMvc.perform(post("/reports/sales-summary/report.pdf")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));
    }

    @Test
    void testDownloadInventoryStatusPdf_Success() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("storeId", 1L);
        when(reportService.getCurrentInventoryByCategory(anyLong())).thenReturn(Collections.emptyList());
        when(chromePdfService.generatePdf(anyString(), any())).thenReturn(new byte[]{1,2,3});
        mockMvc.perform(post("/reports/inventory-status/report.pdf")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));
    }
} 