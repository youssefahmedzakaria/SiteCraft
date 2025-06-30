// frontend/src/app/dashboard/reports/page.tsx
"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { DateRangeFilter } from "@/components/SiteCraft/dashboard/analytics/DateRangeFilter";
import ReportCard, {
  Report,
} from "@/components/SiteCraft/dashboard/analytics/ReportCard";
import { reportsData } from "@/lib/reportsData";
import {
  BadgeDollarSign,
  FileUser,
  PackageOpen,
  ShoppingBag,
  Tags,
  X,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { format } from "date-fns";

export default function ReportsPage() {
  // Default to last 30 days
  const defaultDateRange = (() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    return { from: startDate, to: endDate };
  })();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(defaultDateRange);

  // map report IDs to your static icon paths
  const iconMap: Record<string, React.ReactNode> = {
    "rep-001": <FileUser size={48} className="pb-2" />,
    "rep-002": <Tags size={48} className="pb-2" />,
    "rep-003": <ShoppingBag size={48} className="pb-2" />,
    "rep-004": <BadgeDollarSign size={48} className="pb-2" />,
    "rep-005": <PackageOpen size={48} className="pb-2" />,
  };

  // build full Report[] with iconSrc
  const reportsWithIcons: Report[] = reportsData.map((r) => ({
    ...r,
    iconSrc: iconMap[r.id] || "/icons/default.svg",
  }));

  // Map report IDs to backend endpoints and whether they need a date range
  const reportEndpoints: Record<string, { url: string; needsDateRange: boolean; filename: string }> = {
    "rep-001": { url: "http://localhost:8080/reports/session-creation/report.pdf", needsDateRange: true, filename: "session-creation-report.pdf" },
    "rep-002": { url: "http://localhost:8080/reports/product-analytics/report.pdf", needsDateRange: true, filename: "product-analytics-report.pdf" },
    "rep-003": { url: "http://localhost:8080/reports/customer-engagement/report.pdf", needsDateRange: true, filename: "customer-engagement-report.pdf" },
    "rep-004": { url: "http://localhost:8080/reports/sales-summary/report.pdf", needsDateRange: true, filename: "sales-summary-report.pdf" },
    "rep-005": { url: "http://localhost:8080/reports/inventory-status/report.pdf", needsDateRange: false, filename: "inventory-status-report.pdf" },
  };

  // Helper to convert date range to backend format
  function toDateRangeDTO(range: { from: Date; to: Date }) {
    return {
      startDate: range.from.toISOString().split('T')[0],
      endDate: range.to.toISOString().split('T')[0],
    };
  }

  const handleDownload = async (id: string) => {
    const endpoint = reportEndpoints[id];
    if (!endpoint) return;

    let fetchOptions: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: {},
    };

    if (endpoint.needsDateRange) {
      if (!dateRange) {
        alert('Please select a date range first.');
        return;
      }
      fetchOptions.headers = { 'Content-Type': 'application/json' };
      fetchOptions.body = JSON.stringify(toDateRangeDTO(dateRange));
    }

    try {
      const res = await fetch(endpoint.url, fetchOptions);
      if (!res.ok) throw new Error('Failed to download report');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = endpoint.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error downloading report.');
      console.error(err);
    }
  };

  return (
    <ProtectedRoute requiredRole="owner">
      <div className="flex min-h-screen h-full bg-gray-100">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100 h-full overflow-y-auto">
          {/* Header section */}
          <div className="mb-6 space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">Reports</h1>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-600">
                View and download your store's reports
              </h2>
              <DateRangeFilter
                initialDateRange={dateRange}
                onApply={setDateRange}
              />
            </div>

            {/* Date Range Display (like analytics) */}
            {dateRange && (
              <div className="flex flex-wrap gap-2 items-center mt-2">
                <span className="text-sm text-gray-600">Showing data for:</span>
                <div className="flex bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm gap-1 items-center">
                  <span>
                    {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                  </span>
                  <button
                    onClick={() => setDateRange(undefined)}
                    className="ml-1 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {reportsWithIcons.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
