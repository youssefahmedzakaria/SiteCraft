package com.sitecraft.backend.Services;

import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

@Service
public class ReportGenerationService {

    private final SpringTemplateEngine templateEngine;

    public ReportGenerationService(SpringTemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    /**
     * Render the given template (without suffix) with the provided model.
     *
     * @param templateName the name of the template file (e.g. "report" for report.html)
     * @param model map of variables to expose to Thymeleaf (e.g. reportName, columns, rows, etc)
     * @return the rendered HTML as a String
     */
    public String renderReport(String templateName, Map<String, Object> model) {
        Context context = new Context();
        context.setVariables(model);
        return templateEngine.process(templateName, context);
    }
}
