"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"

export interface SearchBarProps {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  placeholder?: string
  iconColor?: string
  backgroundColor?: string
  textColor?: string
  onSearch?: (query: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({
  expanded,
  setExpanded,
  placeholder = "Search...",
  iconColor = "text-gray-300",
  backgroundColor = "bg-white/20",
  textColor = "text-white",
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim())
      setSearchQuery("")
      setExpanded(false)
    } else if (searchQuery.trim()) {
      // Default behavior - navigate to products page with search
      const pathSegments = window.location.pathname.split("/")
      const subdomain = pathSegments[2]
      if (subdomain) {
        window.location.href = `/e-commerce/${subdomain}/products?search=${encodeURIComponent(searchQuery.trim())}`
      }
      setSearchQuery("")
      setExpanded(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e)
    }
  }
  return expanded ? (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
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
      <button type="submit" className="absolute left-2 top-1/2 transform -translate-y-1/2">
        <Search
          className="h-4 w-4"
          style={{
            color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#d1d5db" : "#d1d5db",
          }}
        />
      </button>
    </form>
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
