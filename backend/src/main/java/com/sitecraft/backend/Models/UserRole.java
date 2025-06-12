package com.sitecraft.backend.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "userrole")
public class UserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role")
    private String role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    @JsonIgnore
    private Store store;

    // Constructors
    public UserRole() {
    }

    public UserRole(String role, Users userId, Store storeId) {
        this.role = role;
        this.user = userId;
        this.store = storeId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Users getUserId() {
        return user;
    }

    public void setUserId(Users userId) {
        this.user = userId;
    }

    public Store getStoreId() {
        return store;
    }

    public void setStoreId(Store storeId) {
        this.store = storeId;
    }
}