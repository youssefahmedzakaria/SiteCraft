"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"

export interface FullSearchBarProps {
  placeholder?: string
  iconColor?: string
  backgroundColor?: string
  textColor?: string
  className?: string
  onSearch?: (query: string) => void
  isCustomize?: boolean
  containerWidth?: number
}

export const FullSearchBar: React.FC<FullSearchBarProps> = ({
  placeholder = "Search...",
  iconColor = "text-gray-300",
  backgroundColor = "bg-white/20",
  textColor = "text-white",
  className = "",
  onSearch,
  isCustomize = false,
  containerWidth = 0,
}) => {
  const [searchQuery, setSearchQuery] = useState("")

  // Responsive to div size when isCustomize is true
  const isCompact = isCustomize && containerWidth > 0 && containerWidth < 640

  // Combine Tailwind responsive classes with div-responsive logic
  const inputPadding = isCompact
    ? "pl-6 pr-2 py-1 sm:pl-8 sm:pr-3 sm:py-1"
    : "pl-8 pr-3 py-1 sm:pl-10 sm:pr-4 sm:py-1.5"
  const iconSize = isCompact ? "h-3 w-3 sm:h-4 sm:w-4" : "h-4 w-4"
  const iconPosition = isCompact ? "left-1.5 sm:left-2" : "left-2 sm:left-3"
  const fontSize = isCompact ? "text-xs sm:text-sm" : "text-sm"

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className={`w-full ${inputPadding} ${fontSize} rounded-[15px] placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-white`}
        style={{
          backgroundColor: backgroundColor.includes("[")
            ? backgroundColor.split("-[")[1]?.slice(0, -1) || "rgba(255, 255, 255, 0.2)"
            : "rgba(255, 255, 255, 0.2)",
          color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : "#ffffff",
        }}
      />
      <button type="submit" className={`absolute ${iconPosition} top-1/2 transform -translate-y-1/2`}>
        <Search
          className={iconSize}
          style={{
            color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#d1d5db" : "#d1d5db",
          }}
        />
      </button>
    </form>
  )
}
