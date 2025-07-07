package com.sitecraft.backend.Services;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.Map;
import java.util.HashMap;
import java.io.IOException;

public class ChromePdfServiceTest {
    @Mock
    private ReportGenerationService reportGenerationService;

    @InjectMocks
    private ChromePdfService chromePdfService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGeneratePdf_CallsRenderReport() {
        // Arrange
        String templateName = "report";
        Map<String, Object> model = new HashMap<>();
        when(reportGenerationService.renderReport(eq(templateName), eq(model))).thenReturn("<html></html>");
        // We can't easily mock the process and file system without refactoring ChromePdfService,
        // so here we just verify that renderReport is called and expect a RuntimeException due to process failure.
        assertThrows(RuntimeException.class, () -> chromePdfService.generatePdf(templateName, model));
        verify(reportGenerationService, times(1)).renderReport(eq(templateName), eq(model));
    }

    // To fully test ChromePdfService, consider refactoring to allow injection/mocking of process creation and file I/O.
    // For now, we focus on verifying the service interaction and exception handling.

    // Additional tests for exception handling could be added if ChromePdfService is refactored for better testability.
}