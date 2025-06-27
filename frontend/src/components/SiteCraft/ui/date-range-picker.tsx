"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  date: { from: Date; to: Date } | undefined;
  onDateChange: (date: { from: Date; to: Date } | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fromDate = e.target.value ? new Date(e.target.value) : undefined;
    onDateChange({
      from: fromDate || new Date(),
      to: date?.to || new Date(),
    });
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const toDate = e.target.value ? new Date(e.target.value) : undefined;
    onDateChange({
      from: date?.from || new Date(),
      to: toDate || new Date(),
    });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">From</label>
        <input
          type="date"
          value={date?.from ? date.from.toISOString().split("T")[0] : ""}
          onChange={handleFromDateChange}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">To</label>
        <input
          type="date"
          value={date?.to ? date.to.toISOString().split("T")[0] : ""}
          onChange={handleToDateChange}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      </div>
    </div>
  );
}
