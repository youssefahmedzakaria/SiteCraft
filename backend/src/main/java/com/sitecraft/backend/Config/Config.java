package com.sitecraft.backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
public class Config {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Allow all requests for now
                )
                .csrf(AbstractHttpConfigurer::disable); // Disable CSRF for testing or API clients

        return http.build();
    }

    @Bean
    @Primary
    public DataSource defaultDataSource() {
        return DataSourceBuilder.create()
                .driverClassName("org.postgresql.Driver")
                .url("jdbc:postgresql://localhost:5432/SiteCraft")
                .username("postgres")
                .password("123456")
                .build();
    }
}
