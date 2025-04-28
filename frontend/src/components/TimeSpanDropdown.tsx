// frontend/src/components/TimeSpanDropdown.tsx
'use client'

interface TimeSpanDropdownProps {
  value: string
  onChange: (newValue: string) => void
}

export function TimeSpanDropdown({ value, onChange }: TimeSpanDropdownProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="
        bg-white 
        border border-logo-border 
        rounded 
        pl-2 pr-0 py-2 
        text-sm font-medium text-logo-txt 
        focus:outline-none focus:ring-2 focus:ring-logo-txt
      "
    >
      <option value="7">Last week</option>
      <option value="30">Last month</option>
      <option value="90">Last quarter</option>
      <option value="365">Last year</option>
    </select>
  )
}