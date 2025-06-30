"use client"

import type React from "react"
import { X } from "lucide-react"
import { Navigation } from "./navigation"
import { FullSearchBar } from "./full-search-bar"

export interface SideMenuProps {
  isOpen: boolean
  fullSearchBar: boolean
  onClose: () => void
  backgroundColor?: string
  textColor?: string
  iconColor?: string
  menuItems: Array<{ label: string; href: string }>
  searchIconColor?: string
  dividerColor?: string
  position?: "left" | "right"
}

export const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  fullSearchBar = false,
  backgroundColor = "bg-white",
  textColor = "text-black",
  iconColor = "text-black",
  menuItems,
  searchIconColor = "text-gray-400",
  dividerColor = "border-transparent",
  position = "left",
}) => {
  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 flex backdrop-blur ${position === "left" ? "flex-row-reverse" : ""}`}>
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="w-64 h-full shadow-lg"
        style={{
          backgroundColor: backgroundColor.includes("[")
            ? backgroundColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
            : "#ffffff",
          color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={onClose} className="p-1 hover:opacity-80">
            <X
              className="h-6 w-6"
              style={{
                color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
              }}
            />
          </button>
        </div>

        {fullSearchBar && (
          <div className="px-4 py-3">
            <FullSearchBar iconColor={searchIconColor} backgroundColor="bg-white/20" textColor={textColor} />
          </div>
        )}

        <div className="py-4 px-4">
          <Navigation menuItems={menuItems} textColor={textColor} orientation="vertical" onClick={onClose} />
        </div>
      </div>
    </div>
  )
}
