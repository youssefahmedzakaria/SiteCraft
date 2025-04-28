'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar/sidebar'
import Image from "next/image";
import { reportsData } from '@/lib/reportsData';
import { TimeSpanDropdown } from '@/components/TimeSpanDropdown'
import { Timespan } from '@/lib/chartData'

export default function ReportsPage() {
  const [selectedSpan, setSelectedSpan] = useState<Timespan>('30')

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 bg-gray-100 pt-20 md:pt-20 lg:pt-6 lg:ml-80">
        <div className="container mx-auto px-4 md:px-6">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Reports</h1>

          {/* Subtitle + dropdown aligned on same line */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500">
              View and download your store's reports
            </p>
            <TimeSpanDropdown value={selectedSpan} onChange={setSelectedSpan} />
          </div>

          {/* Table - styled like CategoryTable */}
          <div className="border rounded-lg border-logo-border overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-logo-border">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-logo-txt uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-logo-border">
                {reportsData.map((report) => (
                  <tr key={report.id} className="hover:bg-logo-light-button-hover">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {report.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
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
        </div>
      </main>
    </div>
  )
}