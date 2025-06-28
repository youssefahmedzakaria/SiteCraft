package com.sitecraft.backend.DTOs;

import java.time.LocalDate;

public class EngagementReportRow {
    private final LocalDate date;
    private final long totalEvents;
    private final double avgDurationSec;
    private final long conversions;

    public EngagementReportRow(
        LocalDate date,
        long totalEvents,
        double avgDurationSec,
        long conversions
    ) {
        this.date          = date;
        this.totalEvents   = totalEvents;
        this.avgDurationSec= avgDurationSec;
        this.conversions   = conversions;
    }

    public LocalDate getDate()          { return date; }
    public long      getTotalEvents()  { return totalEvents; }
    public double    getAvgDurationSec(){ return avgDurationSec; }
    public long      getConversions()  { return conversions; }
}
