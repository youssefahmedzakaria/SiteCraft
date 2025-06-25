package com.sitecraft.backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

@Configuration
public class ThymeleafConfig {

    /**
     * Resolver for our report templates (in src/main/resources/report-template/).
     * By setting checkExistence=true, Thymeleaf will only hand off to this
     * resolver if it actually finds the file there.
     */
    @Bean
    public ClassLoaderTemplateResolver reportTemplateResolver() {
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        resolver.setPrefix("report-template/");    // folder under resources
        resolver.setSuffix(".html");              // your files are *.html
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCharacterEncoding("UTF-8");
        resolver.setOrder(1);                     // higher priority than default
        resolver.setCheckExistence(true);
        return resolver;
    }
}
