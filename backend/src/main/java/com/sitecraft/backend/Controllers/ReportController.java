package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.DTOs.DateRangeDTO;
import com.sitecraft.backend.DTOs.ProductAnalyticsRow;
import com.sitecraft.backend.DTOs.EngagementReportRow;
import com.sitecraft.backend.DTOs.SalesSummaryRow;
import com.sitecraft.backend.DTOs.InventoryStatusRow;
import com.sitecraft.backend.Services.ReportService;
import com.sitecraft.backend.Services.ChromePdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
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
        LocalDate     start = request.getStartDate();
        LocalDate     end   = request.getEndDate();
        LocalDateTime sdt   = start.atStartOfDay();
        LocalDateTime edt   = end.atTime(LocalTime.MAX);

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

        // build and add insights list
        String rawInsights =
            "What it shows: A daily count of new sessions started in your store.\n" +
            "Why it matters: Helps you spot your busiest and slowest days at a glance.\n" +
            "How to use it: Plan marketing pushes (email, social ads) just before peak days to capture more visitors, and run targeted re-engagement offers on slower days to boost overall traffic.";
        List<String> insightsList = Arrays.asList(rawInsights.split("\\n"));
        model.put("reportInsightsList", insightsList);

        byte[] pdfBytes = chromePdfService.generatePdf("report", model);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "session-creation-report.pdf");
        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }

    // ─── Product Analytics (PDF) ─────────────────────────────────────────────
    @PostMapping(value = "/product-analytics/report.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadProductAnalyticsPdf(
            @SessionAttribute("storeId") Long storeId,
            @RequestBody DateRangeDTO request
    ) {
        LocalDate     start = request.getStartDate();
        LocalDate     end   = request.getEndDate();
        LocalDateTime sdt   = start.atStartOfDay();
        LocalDateTime edt   = end.atTime(LocalTime.MAX);

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

        String rawInsights =
            "What it shows: Units sold and total revenue for each product.\n" +
            "Why it matters: Pinpoints which items drive your revenue and which lag behind.\n" +
            "How to use it: Feature your top sellers in promotions or bundle them with underperformers to lift their sales, and adjust restocking levels based on real demand.";
        List<String> insightsList = Arrays.asList(rawInsights.split("\\n"));
        model.put("reportInsightsList", insightsList);

        byte[] pdfBytes = chromePdfService.generatePdf("report", model);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "product-analytics-report.pdf");
        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }

    // ─── Customer Engagement (PDF) ────────────────────────────────────────────
    @PostMapping(value = "/customer-engagement/report.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadEngagementPdf(
            @SessionAttribute("storeId") Long storeId,
            @RequestBody DateRangeDTO request
    ) {
        LocalDate     start = request.getStartDate();
        LocalDate     end   = request.getEndDate();
        LocalDateTime sdt   = start.atStartOfDay();
        LocalDateTime edt   = end.atTime(LocalTime.MAX);

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

        String rawInsights =
            "What it shows: Counts of user actions (clicks, add-to-cart, conversions) and average session duration.\n" +
            "Why it matters: Reveals how deeply customers interact with your site.\n" +
            "How to use it: On days with high engagement but few conversions, tweak your checkout flow or calls-to-action; on low-engagement days, send targeted reminders or flash-sale alerts to re-engage users.";
        List<String> insightsList = Arrays.asList(rawInsights.split("\\n"));
        model.put("reportInsightsList", insightsList);

        byte[] pdfBytes = chromePdfService.generatePdf("report", model);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "customer-engagement-report.pdf");
        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }

    // ─── Sales Summary (PDF) ─────────────────────────────────────────────────
    @PostMapping(value = "/sales-summary/report.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadSalesSummaryPdf(
            @SessionAttribute("storeId") Long storeId,
            @RequestBody DateRangeDTO request
    ) {
        LocalDate       start = request.getStartDate();
        LocalDate       end   = request.getEndDate();
        LocalDateTime   sdt   = start.atStartOfDay();
        LocalDateTime   edt   = end.atTime(LocalTime.MAX);

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

        String rawInsights =
            "What it shows: Total orders, gross revenue, average order size, and your top product.\n" +
            "Why it matters: Gives you a quick health check of sales performance over any period.\n" +
            "How to use it: If average order value dips below your target, add upsell recommendations or free-shipping thresholds; use revenue trends to adjust marketing spend and inventory budgets.";
        List<String> insightsList = Arrays.asList(rawInsights.split("\\n"));
        model.put("reportInsightsList", insightsList);

        byte[] pdfBytes = chromePdfService.generatePdf("report", model);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "sales-summary-report.pdf");
        return ResponseEntity.ok().headers(headers).body(pdfBytes);
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
            rows.add(Arrays.asList(r.getCategoryName(), r.getTotalStock()));
        }
        model.put("rows", rows);

        String rawInsights =
            "What it shows: Current stock levels in each product category.\n" +
            "Why it matters: Ensures you have enough inventory to meet demand without overspending.\n" +
            "How to use it: Reorder categories running low before they sell out, and run bundle or clearance deals on overstocked categories to free up warehouse space.";
        List<String> insightsList = Arrays.asList(rawInsights.split("\\n"));
        model.put("reportInsightsList", insightsList);

        byte[] pdfBytes = chromePdfService.generatePdf("report", model);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "inventory-status-report.pdf");
        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }
}
