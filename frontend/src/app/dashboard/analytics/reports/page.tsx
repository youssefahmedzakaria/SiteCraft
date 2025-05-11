// frontend/src/app/dashboard/reports/page.tsx
"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import Image from "next/image";
import { reportsData } from "@/lib/reportsData";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
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

        {/* Reports Table */}
        <div className="border rounded-lg border-logo-border overflow-x-auto">
          <table className="min-w-full divide-y divide-logo-border table-fixed">
            <thead className="min-w-full divide-y">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-logo-txt uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-logo-border">
              {reportsData.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-logo-light-button-hover"
                >
                  <td className="px-4 py-4 text-sm text-gray-900 break-words">
                    {report.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 break-words">
                    {report.category}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div className="line-clamp-2 sm:line-clamp-none overflow-y-auto max-h-24">
                      {report.description}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">
                    <button className="p-2 text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-md">
                      <Image
                        src="/icons/download.svg"
                        alt="Download"
                        width={20}
                        height={20}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
