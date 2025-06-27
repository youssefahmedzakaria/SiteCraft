package com.sitecraft.backend.DTOs;

import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

public class DateRangeDTO {
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;
   
    private Integer limit = 5;

    public DateRangeDTO() {}

    public LocalDate getStartDate() {
        return startDate;
    }
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    public LocalDate getEndDate() {
        return endDate;
    }
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    public int getLimit() {
        return limit == null ? 5 : limit;
    }
    public void setLimit(Integer limit) {
        this.limit = limit;
    }
}