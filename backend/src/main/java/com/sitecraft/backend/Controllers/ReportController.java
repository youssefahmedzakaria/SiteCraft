package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.DTOs.DateRangeDTO;
import com.sitecraft.backend.DTOs.ProductAnalyticsRow;
import com.sitecraft.backend.DTOs.EngagementReportRow;
import com.sitecraft.backend.DTOs.SalesSummaryRow;
import com.sitecraft.backend.DTOs.InventoryStatusRow;
import com.sitecraft.backend.Services.ReportService;
import com.sitecraft.backend.Services.ChromePdfService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;
    private final ChromePdfService chromePdfService;

    public ReportController(ReportService reportService,
                            ChromePdfService chromePdfService) {
        this.reportService = reportService;
        this.chromePdfService = chromePdfService;
    }

    // ─── Session Creation (PDF) ──────────────────────────────────────────────
    @PostMapping(value = "/session-creation/report.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadSessionCreationPdf(
            @SessionAttribute("storeId") Long storeId,
            @RequestBody DateRangeDTO request
    ) {
        LocalDate       start  = request.getStartDate();
        LocalDate       end    = request.getEndDate();
        LocalDateTime   sdt    = start.atStartOfDay();
        LocalDateTime   edt    = end.atTime(LocalTime.MAX);

        List<ReportService.SessionCount> data =
            reportService.getSessionCounts(storeId, sdt, edt);

        Map<String,Object> model = new HashMap<>();
        model.put("reportName",        "Session Creation Report");
        model.put("reportDescription","Daily session counts from " + start + " to " + end);
        model.put("columns",           Arrays.asList("Date", "Session Count"));

        List<List<Object>> rows = new ArrayList<>();
        for (ReportService.SessionCount sc : data) {
            rows.add(Arrays.asList(sc.getDate().toString(), sc.getCount()));
        }
        model.put("rows", rows);

        byte[] pdf = chromePdfService.generatePdf("report", model);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "session-creation-report.pdf");
        return ResponseEntity.ok().headers(headers).body(pdf);
    }    // ─── Product Analytics (PDF) ─────────────────────────────────────────────
    @PostMapping(value = "/product-analytics/report.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadProductAnalyticsPdf(
            @SessionAttribute("storeId") Long storeId,
            @RequestBody DateRangeDTO request
    ) {
        LocalDate       start  = request.getStartDate();
        LocalDate       end    = request.getEndDate();
        LocalDateTime   sdt    = start.atStartOfDay();
        LocalDateTime   edt    = end.atTime(LocalTime.MAX);

        List<ProductAnalyticsRow> data =
            reportService.getProductAnalytics(storeId, sdt, edt);

        Map<String,Object> model = new HashMap<>();
        model.put("reportName",        "Product Analytics Report");
        model.put("reportDescription","Product analytics from " + start + " to " + end);
        model.put("columns",           Arrays.asList("Product", "Units Sold", "Total Stock"));

        List<List<Object>> rows = new ArrayList<>();
        for (ProductAnalyticsRow r : data) {
            rows.add(Arrays.asList(r.getProductName(), r.getUnitsSold(), r.getTotalStock()));
        }
        model.put("rows", rows);

        byte[] pdf = chromePdfService.generatePdf("report", model);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "product-analytics-report.pdf");
        return ResponseEntity.ok().headers(headers).body(pdf);
    }    // ─── Customer Engagement (PDF) ────────────────────────────────────────────
    @PostMapping(value = "/customer-engagement/report.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadEngagementPdf(
            @SessionAttribute("storeId") Long storeId,
            @RequestBody DateRangeDTO request
    ) {
        LocalDate       start  = request.getStartDate();
        LocalDate       end    = request.getEndDate();
        LocalDateTime   sdt    = start.atStartOfDay();
        LocalDateTime   edt    = end.atTime(LocalTime.MAX);

        List<EngagementReportRow> data =
            reportService.getEngagementMetrics(storeId, sdt, edt);

        Map<String,Object> model = new HashMap<>();
        model.put("reportName",        "Customer Engagement Report");
        model.put("reportDescription","Customer engagement from " + start + " to " + end);
        model.put("columns",           Arrays.asList("Date", "Total Events", "Avg Duration (sec)", "Conversions"));

        List<List<Object>> rows = new ArrayList<>();
        for (EngagementReportRow r : data) {
            rows.add(Arrays.asList(
                r.getDate().toString(),
                r.getTotalEvents(),
                r.getAvgDurationSec(),
                r.getConversions()
            ));
        }
        model.put("rows", rows);

        byte[] pdf = chromePdfService.generatePdf("report", model);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "customer-engagement-report.pdf");
        return ResponseEntity.ok().headers(headers).body(pdf);
    }    // ─── Sales Summary (PDF) ─────────────────────────────────────────────────
    @PostMapping(value = "/sales-summary/report.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadSalesSummaryPdf(
            @SessionAttribute("storeId") Long storeId,
            @RequestBody DateRangeDTO request
    ) {
        LocalDate       start  = request.getStartDate();
        LocalDate       end    = request.getEndDate();
        LocalDateTime   sdt    = start.atStartOfDay();
        LocalDateTime   edt    = end.atTime(LocalTime.MAX);

        SalesSummaryRow summary =
            reportService.getSalesSummary(storeId, sdt, edt);

        Map<String,Object> model = new HashMap<>();
        model.put("reportName",        "Sales Summary Report");
        model.put("reportDescription","Sales summary from " + start + " to " + end);
        model.put("columns",           Arrays.asList("Total Orders", "Total Revenue", "Avg Order Value", "Top Product"));

        List<List<Object>> rows = Collections.singletonList(
            Arrays.asList(
                summary.getTotalOrders(),
                summary.getTotalRevenue(),
                summary.getAvgOrderValue(),
                summary.getTopProduct()
            )
        );
        model.put("rows", rows);

        byte[] pdf = chromePdfService.generatePdf("report", model);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "sales-summary-report.pdf");
        return ResponseEntity.ok().headers(headers).body(pdf);
    }

      // ─── Inventory Status (PDF) ───────────────────────────────────────────────
    @PostMapping(value = "/inventory-status/report.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadInventoryStatusPdf(
            @SessionAttribute("storeId") Long storeId
    ) {
        List<InventoryStatusRow> data =
            reportService.getCurrentInventoryByCategory(storeId);

        Map<String,Object> model = new HashMap<>();
        model.put("reportName",         "Inventory Status Report");
        model.put("reportDescription",  "Current inventory status");
        model.put("columns",            Arrays.asList("Category", "Quantity On Hand"));

        List<List<Object>> rows = new ArrayList<>();
        for (InventoryStatusRow r : data) {
            rows.add(Arrays.asList(
                r.getCategoryName(),
                r.getTotalStock()    // fixed: use getTotalStock()
            ));
        }
        model.put("rows", rows);

        byte[] pdf = chromePdfService.generatePdf("report", model);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "inventory-status-report.pdf");
        return ResponseEntity.ok().headers(headers).body(pdf);
    }
}