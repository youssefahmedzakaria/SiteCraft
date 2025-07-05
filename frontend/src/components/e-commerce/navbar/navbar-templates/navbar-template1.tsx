"use client"

import type React from "react"
import { useState } from "react"
import { Menu, Search } from "lucide-react"
import { Logo } from "../navbar-components/logo"
import { Navigation } from "../navbar-components/navigation"
import { FullSearchBar } from "../navbar-components/full-search-bar"
import { IconsGroup } from "../navbar-components/icons-group"
import MobileMenu from "../navbar-components/mobile-menu"

export interface NavbarTemplate1Props {
  isCustomize?: boolean
  brandName?: string | React.ReactNode
  backgroundColor?: string
  textColor?: string
  fontFamily?: string
  logo?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
  MobileMenuItems?: Array<{
    label: string
    href: string
  }>
  menuItems?: Array<{
    label: string
    href: string
    isShown?: boolean
  }>
  iconColor?: string
  dividerColor?: string
  onSearch?: (query: string) => void
}

// Utility for font family (local, not imported)
const getFontFamily = (fontFamily: string) => {
  switch (fontFamily) {
    case "font-inter":
      return "Inter, sans-serif";
    case "font-roboto":
      return "Roboto, sans-serif";
    case "font-open-sans":
      return "Open Sans, sans-serif";
    case "font-poppins":
      return "Poppins, sans-serif";
    case "font-lato":
      return "Lato, sans-serif";
    default:
      return "system-ui, sans-serif";
  }
};

export const NavbarTemplate1: React.FC<NavbarTemplate1Props> = ({
  isCustomize,
  brandName,
  backgroundColor = "bg-[#ffffff]",
  textColor = "text-[#000000]",
  fontFamily = "font-sans",
  logo,
  menuItems,
  MobileMenuItems,
  iconColor = "text-[#000000]",
  dividerColor = "border-[#e5e5e5]",
  onSearch,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query)
    } else {
      // Default behavior - navigate to products page with search
      const pathSegments = window.location.pathname.split("/")
      const subdomain = pathSegments[2]
      if (subdomain) {
        window.location.href = `/e-commerce/${subdomain}/products?search=${encodeURIComponent(query.trim())}`
      }
    }
  }

  // Filter visible menu items
  const visibleMenuItems = menuItems?.filter((item) => item.isShown !== false) || []

  return (
    <>
      <MobileMenu
        NavMenuItems={visibleMenuItems}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        backgroundColor={backgroundColor}
        textColor={textColor}
        iconColor={iconColor}
        MobileMenuItems={MobileMenuItems || []}
        dividerColor={dividerColor}
        onSearch={handleSearch}
      />

      <nav
        className={`${isCustomize ? "relative" : "fixed"} top-0 left-0 w-full z-30 backdrop-blur`}
        style={{
          backgroundColor: backgroundColor.includes("[")
            ? backgroundColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
            : backgroundColor,
          color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#000000" : textColor,
          fontFamily: getFontFamily(fontFamily),
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative flex items-center justify-between h-16">
            {/* Left - Logo and Brand */}
            <Logo brandName={brandName} logo={logo} textColor={textColor} />

            {/* Center - Search (Hide on mobile) */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md hidden md:block">
              <FullSearchBar
                iconColor={iconColor}
                backgroundColor="bg-white/20"
                textColor={textColor}
                onSearch={handleSearch}
              />
            </div>

            {/* Right - Icons on desktop / Menu button on mobile */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex">
                <IconsGroup iconColor={iconColor} isCustomize={isCustomize} />
              </div>
              <button
                className="md:hidden p-1 hover:opacity-80"
                onClick={isCustomize ? undefined : () => { setIsMobileMenuOpen(true) }}
                aria-label="Toggle search"
                style={{
                  color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#000000" : undefined,
                  opacity: isCustomize ? 0.5 : 1,
                  pointerEvents: isCustomize ? 'none' : undefined,
                }}
                disabled={isCustomize}
              >
                <Search className="h-6 w-6" />
              </button>
              <button
                className="md:hidden p-1 hover:opacity-80"
                onClick={isCustomize ? undefined : () => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
                style={{
                  color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#000000" : undefined,
                  opacity: isCustomize ? 0.5 : 1,
                  pointerEvents: isCustomize ? 'none' : undefined,
                }}
                disabled={isCustomize}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Bottom Navigation - Desktop only */}
          <div
            className="hidden md:flex justify-start py-2 border-t"
            style={{
              borderColor: dividerColor.includes("[")
                ? dividerColor.split("-[")[1]?.slice(0, -1) || "#e5e7eb"
                : undefined,
            }}
          >
            <Navigation menuItems={visibleMenuItems} textColor={textColor} fontFamily={fontFamily} isCustomize={isCustomize} />
          </div>
        </div>
      </nav>
    </>
  )
}
