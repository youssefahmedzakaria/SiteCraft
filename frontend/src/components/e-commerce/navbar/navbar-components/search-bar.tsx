"use client"

import type React from "react"
import { Search } from "lucide-react"

export interface SearchBarProps {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  placeholder?: string
  iconColor?: string
  backgroundColor?: string
  textColor?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  expanded,
  setExpanded,
  placeholder = "Search...",
  iconColor = "text-gray-300",
  backgroundColor = "bg-white/20",
  textColor = "text-white",
}) => {
  return expanded ? (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        autoFocus
        className="pl-8 pr-4 py-1.5 text-sm rounded-[15px] w-40 focus:outline-none focus:ring-1 focus:ring-white/50"
        style={{
          backgroundColor: backgroundColor.includes("[")
            ? backgroundColor.split("-[")[1]?.slice(0, -1) || "rgba(255, 255, 255, 0.2)"
            : "rgba(255, 255, 255, 0.2)",
          color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : "#ffffff",
        }}
        onBlur={() => setExpanded(false)}
      />
      <Search
        className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4"
        style={{
          color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#d1d5db" : "#d1d5db",
        }}
      />
    </div>
  ) : (
    <button onClick={() => setExpanded(true)} className="p-1 hover:opacity-80">
      <Search
        className="h-5 w-5"
        style={{
          color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#d1d5db" : "#d1d5db",
        }}
      />
    </button>
  )
}
