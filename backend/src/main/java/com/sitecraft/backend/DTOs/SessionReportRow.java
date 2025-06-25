package com.sitecraft.backend.DTOs;

import java.time.LocalDate;

/**
 * One row of the Session Creation Report:
 *   date       – the date of the sessions
 *   sessionCount – how many sessions began on that date
 */
public class SessionReportRow {
    private final LocalDate date;
    private final long sessionCount;

    public SessionReportRow(LocalDate date, long sessionCount) {
        this.date = date;
        this.sessionCount = sessionCount;
    }

    public LocalDate getDate() {
        return date;
    }

    public long getSessionCount() {
        return sessionCount;
    }
}