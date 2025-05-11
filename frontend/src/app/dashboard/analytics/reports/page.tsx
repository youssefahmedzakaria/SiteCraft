// frontend/src/app/dashboard/reports/page.tsx
"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import ReportCard, { Report } from "@/components/dashboard/ReportCard";
import { reportsData } from "@/lib/reportsData";
import {
  BadgeDollarSign,
  FileUser,
  PackageOpen,
  ShoppingBag,
  Tags,
} from "lucide-react";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>();

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

  const handleDownload = (id: string) => {
    console.log(`Downloading report ${id}`);
    // TODO: wire up real download logic here
  };

  return (
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
  );
}
