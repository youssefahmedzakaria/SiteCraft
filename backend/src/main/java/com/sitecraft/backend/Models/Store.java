package com.sitecraft.backend.Models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "store")
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "store_name")
    private String storeName;

    @Column(name = "store_type")
    private String storeType;

    @Column(name = "creation_date")
    private LocalDateTime creationDate;

    @Column(name = "database_name")
    private String databaseName;

    @Column(name = "database_url")
    private String databaseUrl;

    // Constructors
    public Store() {
    }

    public Store(Long id, String storeName, String storeType, LocalDateTime creationDate, String databaseName, String databaseUrl) {
        this.id = id;
        this.storeName = storeName;
        this.storeType = storeType;
        this.creationDate = creationDate;
        this.databaseName = databaseName;
        this.databaseUrl = databaseUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getStoreType() { return storeType; }
    public void setStoreType(String storeType) { this.storeType = storeType; }

    public LocalDateTime getCreationDate() { return creationDate; }
    public void setCreationDate(LocalDateTime creationDate) { this.creationDate = creationDate; }

    public String getDatabaseName() { return databaseName; }
    public void setDatabaseName(String databaseName) { this.databaseName = databaseName; }

    public String getDatabaseUrl() { return databaseUrl; }
    public void setDatabaseUrl(String databaseUrl) { this.databaseUrl = databaseUrl; }
}