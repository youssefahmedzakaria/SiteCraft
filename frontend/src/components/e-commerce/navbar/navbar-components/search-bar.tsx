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
  isCustomize?: boolean
  containerWidth?: number
}

export const SearchBar: React.FC<SearchBarProps> = ({
  expanded,
  setExpanded,
  placeholder = "Search...",
  iconColor = "text-gray-300",
  backgroundColor = "bg-white/20",
  textColor = "text-white",
  isCustomize = false,
  containerWidth = 0,
}) => {
  // Responsive to div size when isCustomize is true
  const isCompact = isCustomize && containerWidth > 0 && containerWidth < 640
  const inputWidth = isCompact ? "w-32" : "w-40"
  const inputPadding = isCompact ? "pl-6 pr-3 py-1" : "pl-8 pr-4 py-1.5"
  const iconSize = isCompact ? "h-3 w-3" : "h-4 w-4"
  const buttonIconSize = isCompact ? "h-4 w-4" : "h-5 w-5"
  const fontSize = isCompact ? "text-xs" : "text-sm"

  return expanded ? (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        autoFocus
        className={`${inputPadding} ${fontSize} rounded-[15px] ${inputWidth} focus:outline-none focus:ring-1 focus:ring-white/50`}
        style={{
          backgroundColor: backgroundColor.includes("[")
            ? backgroundColor.split("-[")[1]?.slice(0, -1) || "rgba(255, 255, 255, 0.2)"
            : "rgba(255, 255, 255, 0.2)",
          color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : "#ffffff",
        }}
        onBlur={() => setExpanded(false)}
      />
      <Search
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${iconSize}`}
        style={{
          color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#d1d5db" : "#d1d5db",
        }}
      />
    </div>
  ) : (
    <button onClick={() => setExpanded(true)} className="p-1 hover:opacity-80">
      <Search
        className={buttonIconSize}
        style={{
          color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#d1d5db" : "#d1d5db",
        }}
      />
    </button>
  )
}
