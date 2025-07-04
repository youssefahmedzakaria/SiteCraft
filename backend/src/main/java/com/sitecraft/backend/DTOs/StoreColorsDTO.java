package com.sitecraft.backend.DTOs;

public class StoreColorsDTO {
    private String primary;
    private String secondary;
    private String accent;

    public StoreColorsDTO() {
    }

    public StoreColorsDTO(String primary, String secondary, String accent) {
        this.primary = primary;
        this.secondary = secondary;
        this.accent = accent;
    }

    public String getPrimary() {
        return primary;
    }

    public void setPrimary(String primary) {
        this.primary = primary;
    }

    public String getSecondary() {
        return secondary;
    }

    public void setSecondary(String secondary) {
        this.secondary = secondary;
    }

    public String getAccent() {
        return accent;
    }

    public void setAccent(String accent) {
        this.accent = accent;
    }

    @Override
    public String toString() {
        return "StoreColorsDTO{" +
                "primary='" + primary + '\'' +
                ", secondary='" + secondary + '\'' +
                ", accent='" + accent + '\'' +
                '}';
    }
}
