'use client'

export function TimeSpanDropdown() {
  return (
    <select
      defaultValue="30"
      className="bg-white border border-logo-border rounded px-3 py-2 text-sm font-medium text-logo-txt focus:outline-none focus:ring-2 focus:ring-logo-txt"
    >
      <option value="7">Last 7 Days</option>
      <option value="30">Last 30 Days</option>
      <option value="90">Last 90 Days</option>
      <option value="365">Last 1 Year</option>
    </select>
  )
}