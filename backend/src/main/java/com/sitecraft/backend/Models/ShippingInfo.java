package com.sitecraft.backend.Models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
@Entity
@Table(name = "Shippinginfo")

public class ShippingInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String governmentName;

    private Float shippingPrice;

    private String estimatedDeliveryTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    @JsonIgnore
    private Store store;

    public ShippingInfo() {
    }

    public ShippingInfo(Long id, String governmentName, Float shippingPrice, String estimatedDeliveryTime, Store store) {
        this.id = id;
        this.governmentName = governmentName;
        this.shippingPrice = shippingPrice;
        this.estimatedDeliveryTime = estimatedDeliveryTime;
        this.store = store;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGovernmentName() {
        return governmentName;
    }

    public void setGovernmentName(String governmentName) {
        this.governmentName = governmentName;
    }

    public Float getShippingPrice() {
        return shippingPrice;
    }

    public void setShippingPrice(Float shippingPrice) {
        this.shippingPrice = shippingPrice;
    }

    public String getEstimatedDeliveryTime() {
        return estimatedDeliveryTime;
    }

    public void setEstimatedDeliveryTime(String estimatedDeliveryTime) {
        this.estimatedDeliveryTime = estimatedDeliveryTime;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

}
