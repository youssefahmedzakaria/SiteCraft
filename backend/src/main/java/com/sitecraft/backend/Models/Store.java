package com.sitecraft.backend.Models;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "store")
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String storeType;
    private LocalDateTime creationDate;
    private String databaseName;
    private String databaseUrl;

    public Store(Long id, String storeType, LocalDateTime creationDate, String databaseName, String databaseUrl) {
        this.id = id;
        this.storeType = storeType;
        this.creationDate = creationDate;
        this.databaseName = databaseName;
        this.databaseUrl = databaseUrl;
    }

    public Store() {
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStoreType() { return storeType; }
    public void setStoreType(String storeType) { this.storeType = storeType; }

    public LocalDateTime getCreationDate() { return creationDate; }
    public void setCreationDate(LocalDateTime creationDate) { this.creationDate = creationDate; }

    public String getDatabaseName() { return databaseName; }
    public void setDatabaseName(String databaseName) { this.databaseName = databaseName; }

    public String getDatabaseUrl() { return databaseUrl; }
    public void setDatabaseUrl(String databaseURL) { this.databaseUrl = databaseURL; }
}
