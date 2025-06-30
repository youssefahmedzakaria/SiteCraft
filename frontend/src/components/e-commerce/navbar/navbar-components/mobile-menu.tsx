/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import type React from "react"
import { X, Search } from "lucide-react"
import { FullSearchBar } from "./full-search-bar"
import Link from "next/link"
import { Navigation } from "./navigation"
import { useState } from "react"
import { usePathname } from "next/navigation"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  MobileMenuItems: Array<{
    label: string
    href: string
  }>
  NavMenuItems: Array<{
    label: string
    href: string
  }>
  backgroundColor?: string
  textColor?: string
  iconColor?: string
  searchIconColor?: string
  dividerColor?: string
  onSearch?: (query: string) => void
  products?: any[]
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  MobileMenuItems,
  NavMenuItems,
  backgroundColor = "bg-black",
  textColor = "text-white",
  iconColor = "text-white",
  searchIconColor = "text-white",
  dividerColor = "border-transparent",
  onSearch,
  products = [],
}) => {
  const path = usePathname()
  const pathSegments = path.split("/")
  const subdomain = pathSegments[2]

  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible)
  }

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query)
    }
    console.log("Searching for:", query)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex backdrop-blur">
      <div
        className="w-64 h-full shadow-lg"
        style={{
          backgroundColor: backgroundColor.includes("[")
            ? backgroundColor.split("-[")[1]?.slice(0, -1) || "#000000"
            : "#000000",
          color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : "#ffffff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">Menu</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSearchToggle}
              className="p-1 hover:opacity-80 transition-opacity"
              aria-label="Toggle search"
            >
              <Search
                className="h-5 w-5"
                style={{
                  color: searchIconColor.includes("[")
                    ? searchIconColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
                    : "#ffffff",
                }}
              />
            </button>
            <button onClick={onClose} className="p-1 hover:opacity-80">
              <X
                className="h-6 w-6"
                style={{
                  color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : "#ffffff",
                }}
              />
            </button>
          </div>
        </div>

        {isSearchVisible && (
          <div className="px-4 py-3 border-b border-white/10">
            <FullSearchBar
              onSearch={handleSearch}
              iconColor={searchIconColor}
              backgroundColor="bg-white/20"
              textColor={textColor}
              placeholder="Search products..."
            />
          </div>
        )}

        <div className="px-4 py-3">
          <Navigation menuItems={NavMenuItems} textColor={textColor} orientation="vertical" onClick={onClose} />
          <div className="py-1 overflow-y-auto"></div>
          <Link
            href={`/e-commerce/${subdomain}/profile`}
            className="block py-2 text-sm hover:underline"
            style={{
              color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : "#ffffff",
            }}
          >
            Profile
          </Link>
          <Link
            href={`/e-commerce/${subdomain}/cart`}
            className="block py-2 text-sm hover:underline"
            style={{
              color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : "#ffffff",
            }}
          >
            Cart
          </Link>
          <Link
            href={`/e-commerce/${subdomain}/favorites`}
            className="block py-2 text-sm hover:underline"
            style={{
              color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : "#ffffff",
            }}
          >
            Favorites
          </Link>
        </div>

        <div className="py-2 overflow-y-auto">
          {MobileMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-sm hover:bg-white/10 transition-colors"
              style={{
                color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : "#ffffff",
              }}
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
    </div>
  )
}

export default MobileMenu
