package com.sitecraft.backend.Models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Orders")

public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double price;
    private String status;
    private java.time.LocalDateTime issueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private Customer customer;

    @OneToOne
    @JoinColumn(name = "payment_log_id")
    private PaymentLog paymentLog;

    @OneToOne
    @JoinColumn(name = "shipping_id")
    private Shipping shipping;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    @JsonIgnore
    private Store store;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderProduct> orderProducts;


    public Order(Long id, Double price, String status, LocalDateTime issueDate, Customer customer, PaymentLog paymentLog, Shipping shipping, Store store, List<OrderProduct> orderProducts) {
        this.id = id;
        this.price = price;
        this.status = status;
        this.issueDate = issueDate;
        this.customer = customer;
        this.paymentLog = paymentLog;
        this.shipping = shipping;
        this.store = store;
        this.orderProducts = orderProducts;
    }

    public Order() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDateTime issueDate) {
        this.issueDate = issueDate;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public PaymentLog getPaymentLog() {
        return paymentLog;
    }

    public void setPaymentLog(PaymentLog paymentLog) {
        this.paymentLog = paymentLog;
    }

    public Shipping getShipping() {
        return shipping;
    }

    public void setShipping(Shipping shipping) {
        this.shipping = shipping;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public List<OrderProduct> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(List<OrderProduct> orderProducts) {
        this.orderProducts = orderProducts;
    }

}
