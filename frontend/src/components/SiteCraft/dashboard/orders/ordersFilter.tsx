"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/SiteCraft/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/SiteCraft/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/SiteCraft/ui/select";
import { DateRangePicker } from "@/components/SiteCraft/ui/date-range-picker";

interface FilterButtonProps {
  onApplyFilters: (filters: {
    status: string;
    dateRange: { from: Date; to: Date } | undefined;
  }) => void;
  statuses: string[];
  initialStatus?: string;
  initialDateRange?: { from: Date; to: Date };
}

export function FilterButton({
  onApplyFilters,
  statuses,
  initialStatus = "All Statuses",
  initialDateRange,
}: FilterButtonProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [dateRange, setDateRange] = useState<
    { from: Date; to: Date } | undefined
  >(initialDateRange);

  // Update internal state when props change (such as when "X" is clicked on filter tags)
  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    setDateRange(initialDateRange);
  }, [initialDateRange]);

  const handleApply = () => {
    onApplyFilters({
      status,
      dateRange,
    });
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      status: "All Statuses",
      dateRange: undefined,
    };

    // Reset local state
    setStatus(resetFilters.status);
    setDateRange(resetFilters.dateRange);

    // Apply the reset filters immediately
    onApplyFilters(resetFilters);

    // Close the dialog
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        <span>Filters</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Orders</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Order Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((statusOption) => (
                    <SelectItem key={statusOption} value={statusOption}>
                      {statusOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="button" onClick={handleApply}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
