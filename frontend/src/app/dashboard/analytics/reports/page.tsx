// frontend/src/app/dashboard/analytics/reports/page.tsx
'use client'

import { useState } from 'react'
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

      <main className="flex-1 bg-gray-100 pt-20 md:pt-20 lg:pt-6 lg:ml-80">
        <div className="container mx-auto px-4 md:px-6">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Reports</h1>

          {/* Subtitle + dropdown aligned on same line */}
          <div className="flex items-center justify-between mb-6">
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
                <DropdownMenuItem onClick={() => setSelectedSpan('7')}>
                  Last week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSpan('30')}>
                  Last month
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSpan('90')}>
                  Last quarter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSpan('365')}>
                  Last year
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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