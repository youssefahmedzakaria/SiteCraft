// frontend/src/components/dashboard/account-settings/StaffManagementSection.tsx
'use client'

import React, { FC, useState } from 'react'
import { staffData, StaffMember } from '@/lib/staffData'
import { AddStaffMemberDialog } from './AddStaffMemberDialog'

export const StaffManagementSection: FC = () => {
  // keep the list in state so we can append new members
  const [staffList, setStaffList] = useState<StaffMember[]>(staffData)

  // callback passed to the dialog to add a new member
  const handleSave = (newMember: StaffMember) => {
    setStaffList(prev => [...prev, newMember])
  }

  return (
    <div>
      {/* header + add button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-2xl">    Add and Monitor Staff</h3>
        {/* the dialog component renders the “Add New Staff Member” button and popup form */}
        <AddStaffMemberDialog onSave={handleSave} />
      </div>

      {/* table */}
      <div className="border rounded-lg border-logo-border overflow-x-auto">
        <table className="min-w-full divide-y divide-logo-border table-fixed">
          <thead className="bg-white">
            <tr>
              {['Name', 'Email', 'Gender', 'Phone'].map(label => (
                <th
                  key={label}
                  className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-logo-border">
            {staffList.map(member => (
              <tr key={member.email} className="hover:bg-logo-light-button-hover">
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-sm text-gray-900 break-words">
                  {member.name}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-sm text-gray-900 break-words">
                  {member.email}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-sm text-gray-900">
                  {member.gender}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-sm text-gray-900 whitespace-nowrap">
                  {member.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
