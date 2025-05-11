// frontend/src/components/dashboard/DateRangeFilter.tsx
'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { DateRangePicker } from "@/components/ui/date-range-picker"

interface DateRangeFilterProps {
  /**
   * Called when user clicks “Apply”
   * Passes { from: Date; to: Date } or undefined (if reset)
   */
  onApply: (dateRange: { from: Date; to: Date } | undefined) => void
  /** initial range you want selected when the dialog opens */
  initialDateRange?: { from: Date; to: Date }
}

export function DateRangeFilter({
  onApply,
  initialDateRange
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(initialDateRange)

  // keep in sync if parent resets
  useEffect(() => {
    setDateRange(initialDateRange)
  }, [initialDateRange])

  const handleApply = () => {
    onApply(dateRange)
    setOpen(false)
  }

  const handleReset = () => {
    setDateRange(undefined)
    onApply(undefined)
    // no longer closing the dialog here so users can immediately pick a new range
  }

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border flex items-center"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        <span>Filter</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Date Range</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
            />
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApply}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}