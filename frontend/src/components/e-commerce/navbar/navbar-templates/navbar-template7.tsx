"use client"

import type React from "react"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Logo } from "../navbar-components/logo"
import { Navigation } from "../navbar-components/navigation"
import { SearchBar } from "../navbar-components/search-bar"
import { IconsGroup } from "../navbar-components/icons-group"
import MobileMenu from "../navbar-components/mobile-menu"

export interface NavbarTemplate7Props {
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
  isRTL?: boolean
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

export const NavbarTemplate7: React.FC<NavbarTemplate7Props> = ({
  isCustomize,
  brandName,
  backgroundColor = "bg-white",
  textColor = "text-black",
  fontFamily = "font-sans",
  logo,
  menuItems = [],
  MobileMenuItems = [],
  iconColor = "text-black",
  dividerColor = "border-gray-200",
  onSearch,
  isRTL = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const rtlClass = isRTL ? "rtl" : ""

  // Filter visible menu items
  const visibleMenuItems = menuItems?.filter((item) => item.isShown !== false) || []

  return (
    <>
      <MobileMenu
        NavMenuItems={visibleMenuItems}
        MobileMenuItems={MobileMenuItems}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        backgroundColor={backgroundColor}
        textColor={textColor}
        iconColor={iconColor}
        dividerColor={dividerColor}
      />

      <nav
        className={`${isCustomize ? "relative" : "fixed"} top-0 left-0 w-full z-30 backdrop-blur ${rtlClass}`}
        style={{
          backgroundColor: backgroundColor.includes("[")
            ? backgroundColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
            : backgroundColor,
          color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#000000" : textColor,
          fontFamily: getFontFamily(fontFamily),
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between h-16 relative">
            {/* Left - Navigation - Fixed width */}
            <div className={`w-1/3 flex ${isRTL ? "justify-end order-3" : "justify-start order-1"}`}>
              <Navigation menuItems={visibleMenuItems} textColor={textColor} fontFamily={fontFamily} isCustomize={isCustomize} />
            </div>

            {/* Center - Logo - Absolute centered */}
            <div className={`absolute left-1/2 transform -translate-x-1/2 ${isRTL ? "order-1" : "order-2"}`}>
              <Logo brandName={brandName} logo={logo} textColor={textColor} />
            </div>

            {/* Right - Search and Icons - Fixed width */}
            <div className={`w-1/3 flex ${isRTL ? "justify-start order-1 flex-row-reverse" : "justify-end order-3"}`}>
              <div className="flex items-center space-x-6">
                <SearchBar
                  expanded={isSearchOpen}
                  setExpanded={setIsSearchOpen}
                  iconColor={iconColor}
                  backgroundColor="bg-white/20"
                  textColor={textColor}
                  onSearch={onSearch}
                />
                <div className="hidden md:flex">
                  <IconsGroup iconColor={iconColor} isCustomize={isCustomize} />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout - Logo and Menu Button Only */}
          <div className="md:hidden flex items-center justify-between h-16">
            <Logo brandName={brandName} logo={logo} textColor={textColor} />
            <button
              className="p-1 hover:opacity-80"
              onClick={isCustomize ? undefined : () => setIsMobileMenuOpen(true)}
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
      </nav>
    </>
  )
}
