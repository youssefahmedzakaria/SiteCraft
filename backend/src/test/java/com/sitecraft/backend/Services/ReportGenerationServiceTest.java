package com.sitecraft.backend.Services;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.context.Context;
import java.util.HashMap;
import java.util.Map;

public class ReportGenerationServiceTest {
    @Mock
    private SpringTemplateEngine templateEngine;

    @InjectMocks
    private ReportGenerationService reportGenerationService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRenderReport() {
        String templateName = "report";
        Map<String, Object> model = new HashMap<>();
        String expectedHtml = "<html>Report</html>";
        when(templateEngine.process(eq(templateName), any(Context.class))).thenReturn(expectedHtml);
        String result = reportGenerationService.renderReport(templateName, model);
        assertEquals(expectedHtml, result);
        verify(templateEngine, times(1)).process(eq(templateName), any(Context.class));
    }
} 