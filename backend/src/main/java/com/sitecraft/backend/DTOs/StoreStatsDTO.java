package com.sitecraft.backend.DTOs;

public class StoreStatsDTO {
    public int totalStaff;
    public int totalOrders;
    public double totalSales;
    public int lastMonthOrders;
    public double lastMonthSales;
    public int productCount;
    public String currentPlan;
    public String planRecommendation;
    public String offerRecommendation;
    public String advice;
    // Optionally, add recommendations fields here

    public StoreStatsDTO() {}

    public StoreStatsDTO(int totalStaff, int totalOrders, double totalSales, int lastMonthOrders, double lastMonthSales, int productCount, String currentPlan, String planRecommendation, String offerRecommendation, String advice) {
        this.totalStaff = totalStaff;
        this.totalOrders = totalOrders;
        this.totalSales = totalSales;
        this.lastMonthOrders = lastMonthOrders;
        this.lastMonthSales = lastMonthSales;
        this.productCount = productCount;
        this.currentPlan = currentPlan;
        this.planRecommendation = planRecommendation;
        this.offerRecommendation = offerRecommendation;
        this.advice = advice;
    }
} 