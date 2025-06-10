package com.sitecraft.backend.Services;
import com.sitecraft.backend.Config.DynamicDataSourceManager;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

@Service
public class TenantDatabaseService {
    @Autowired
    private DynamicDataSourceManager dataSourceManager;

    public void createUserDatabaseAndSchema(String dbName, String dbUsername, String dbPassword) throws Exception {
        // 1. Create database
        try (Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/postgres", dbUsername, dbPassword);
             Statement stmt = conn.createStatement()) {
            // Quote the database name to preserve case
            String quotedDbName = "\"" + dbName + "\"";
            stmt.executeUpdate("CREATE DATABASE " + quotedDbName);
        }
        // 2. Apply schema to new DB
        try (Connection newDbConn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/" + dbName, dbUsername, dbPassword)) {
            Resource script = new ClassPathResource("schema.sql");
            ScriptUtils.executeSqlScript(newDbConn, script);
        }
        // 3. Register new DataSource
        DataSource newDs = createDataSource(dbName, dbUsername, dbPassword);
        dataSourceManager.registerDataSource(dbName, newDs);
    }

    private DataSource createDataSource(String dbName, String dbUsername, String dbPassword) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:postgresql://localhost:5432/" + dbName);
        config.setUsername(dbUsername);
        config.setPassword(dbPassword);
        return new HikariDataSource(config);
    }
} 