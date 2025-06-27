// frontend/src/components/dashboard/account-settings/StaffManagementSection.tsx
'use client'

import React, { FC, useState } from 'react'
import { StaffMember } from '@/lib/store-info'
import { AddStaffMemberDialog } from './AddStaffMemberDialog'
import { useStaffManagement } from '@/hooks/useStaffManagement'
import { Button } from '@/components/SiteCraft/ui/button'
import { Loader2, Trash2, CheckCircle, AlertCircle } from 'lucide-react'

export const StaffManagementSection: FC = () => {
  const { staff, loading, error, adding, removing, addStaffMember, removeStaffMember } = useStaffManagement()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Clear messages after 5 seconds
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  React.useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  // callback passed to the dialog to add a new member
  const handleSave = async (newMember: Omit<StaffMember, 'id'>) => {
    try {
      await addStaffMember(newMember)
      setSuccessMessage('Staff member added successfully! They will receive login credentials via email.')
      setErrorMessage(null)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to add staff member'
      setErrorMessage(errorMsg)
      setSuccessMessage(null)
    }
  }

  const handleRemoveStaff = async (staffId: number, staffName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${staffName} from the staff?\n\nThis action cannot be undone and they will lose access to the store.`
    )
    
    if (confirmed) {
      try {
        await removeStaffMember(staffId)
        setSuccessMessage('Staff member removed successfully!')
        setErrorMessage(null)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to remove staff member'
        setErrorMessage(errorMsg)
        setSuccessMessage(null)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-logo-txt" />
        <span className="ml-2 text-gray-600">Loading staff...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">{errorMessage}</span>
        </div>
      )}

      {/* header + add button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-2xl">Add and Monitor Staff</h3>
          <p className="text-gray-600 text-sm mt-1">
            Manage your store staff members and their access permissions
          </p>
        </div>
        {/* the dialog component renders the "Add New Staff Member" button and popup form */}
        <AddStaffMemberDialog onSave={handleSave} disabled={adding} />
      </div>

      {/* table */}
      <div className="border rounded-lg border-logo-border overflow-x-auto">
        <table className="min-w-full divide-y divide-logo-border table-fixed">
          <thead className="bg-white">
            <tr>
              {['Name', 'Email', 'Gender', 'Phone', 'Role', 'Actions'].map(label => (
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
            {staff.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-2 sm:px-4 py-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center">
                    <p className="mb-2">No staff members found.</p>
                    <p className="text-xs text-gray-400">Add your first staff member to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              staff.map(member => (
                <tr key={member.id} className="hover:bg-logo-light-button-hover">
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
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {member.role || 'Staff'}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveStaff(member.id!, member.name)}
                      disabled={removing}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      title="Remove staff member"
                    >
                      {removing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info section */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="font-medium text-blue-900 mb-2">Staff Management Information</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• New staff members will receive login credentials via email</li>
          <li>• Staff members have access to manage products, orders, and customer data</li>
          <li>• Removing a staff member will immediately revoke their access</li>
          <li>• You can add multiple staff members to help manage your store</li>
        </ul>
      </div>
    </div>
  )
}
