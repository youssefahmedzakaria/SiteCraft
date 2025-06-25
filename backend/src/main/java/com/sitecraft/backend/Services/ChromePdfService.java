package com.sitecraft.backend.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;

@Service
public class ChromePdfService {

    @Value("${chrome.binary.path}")
    private String chromeBinaryPath;

    private final ReportGenerationService reportGenerationService;

    public ChromePdfService(ReportGenerationService reportGenerationService) {
        this.reportGenerationService = reportGenerationService;
    }

    /**
     * Generate a PDF using Headless Chrome, with local file access enabled.
     *
     * @param templateName Thymeleaf template name (e.g. "report")
     * @param model        Model map for the template
     * @return PDF bytes
     */
    public byte[] generatePdf(String templateName, Map<String, Object> model) {
        try {
            // 1) Render HTML via Thymeleaf
            String html = reportGenerationService.renderReport(templateName, model);

            // 2) Write HTML to a temp file
            Path tempHtml = Files.createTempFile("report-", ".html");
            Path tempDir  = tempHtml.getParent();            // 3) Copy the logo file alongside the HTML
            ClassPathResource imgRes = new ClassPathResource(
                "report-template/images/font.png"
            );
            Path logoDest = tempDir.resolve("font.png");
            try (InputStream is = imgRes.getInputStream()) {
                Files.copy(is, logoDest, StandardCopyOption.REPLACE_EXISTING);
            }

            // 4) Save the HTML
            Files.writeString(tempHtml, html);

            // 5) Prepare temp PDF path
            Path tempPdf = Files.createTempFile("report-", ".pdf");

            // 6) Invoke Chrome Headless with file-access flags
            Path userDataDir = Files.createTempDirectory("chrome-data");
            ProcessBuilder pb = new ProcessBuilder(
                chromeBinaryPath,
                "--headless",
                "--disable-gpu",
                "--no-sandbox",
                "--allow-file-access-from-files",
                "--disable-web-security",
                "--user-data-dir=" + userDataDir.toAbsolutePath(),
                "--print-to-pdf=" + tempPdf.toAbsolutePath(),
                tempHtml.toUri().toString()
            );
            Process proc = pb.start();
            int exitCode = proc.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Chrome exited with code " + exitCode);
            }

            // 7) Read PDF bytes
            byte[] pdfBytes = Files.readAllBytes(tempPdf);

            // 8) Clean up temp HTML, PDF, and logo (but leave userDataDir)
            Files.deleteIfExists(tempHtml);
            Files.deleteIfExists(tempPdf);
            Files.deleteIfExists(logoDest);

            return pdfBytes;

        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to generate PDF via Chrome", e);
        }
    }
}
