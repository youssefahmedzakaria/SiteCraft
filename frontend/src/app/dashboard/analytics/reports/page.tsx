// frontend/src/app/dashboard/reports/page.tsx
'use client'

import React, { useState, FC } from 'react'
import { Sidebar } from '@/components/sidebar/sidebar'
import Image from 'next/image'
import { reportsData } from '@/lib/reportsData'
import { Timespan } from '@/lib/chartData'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export default function ReportsPage() {
  const [selectedSpan, setSelectedSpan] = useState<Timespan>('30')
  const labels: Record<Timespan, string> = {
    '7':   'Last week',
    '30':  'Last month',
    '90':  'Last quarter',
    '365': 'Last year',
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-6 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6 space-y-6 pb-4 md:pb-8">

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold">Reports</h1>

          {/* Subtitle + dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <p className="text-gray-500">
              View and download your store's reports
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white border-logo-border text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover px-3 py-2 text-sm font-medium flex items-center"
                >
                  {labels[selectedSpan]}
                  <ChevronDown className="ml-2 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedSpan('7')}>Last week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSpan('30')}>Last month</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSpan('90')}>Last quarter</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSpan('365')}>Last year</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reports Table */}
          <div className="border rounded-lg border-logo-border overflow-x-auto">
            <table className="w-full divide-y divide-logo-border table-fixed">
              <thead className="w-full divide-y">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider w-24 sm:w-1/6 md:w-1/5 whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider w-24 sm:w-1/6 md:w-1/5 whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider w-[50%] sm:w-[40%] whitespace-nowrap">
                    Description
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-logo-txt uppercase tracking-wider w-16 sm:w-1/6 md:w-1/5 whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-logo-border">
                {reportsData.map((report) => (
                  <tr key={report.id} className="hover:bg-logo-light-button-hover">
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                      <div className="truncate">{report.name}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">
                      <div className="truncate">{report.category}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">
                      <div className="line-clamp-2 sm:line-clamp-none overflow-y-auto max-h-24 sm:max-h-full">
                        {report.description}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-right whitespace-nowrap">
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
