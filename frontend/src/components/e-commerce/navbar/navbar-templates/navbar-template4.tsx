"use client"

import type React from "react"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Logo } from "../navbar-components/logo"
import { Navigation } from "../navbar-components/navigation"
import { SearchBar } from "../navbar-components/search-bar"
import { IconsGroup } from "../navbar-components/icons-group"
import MobileMenu from "../navbar-components/mobile-menu"

export interface NavbarTemplate4Props {
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
  menuItems?: Array<{
    label: string
    href: string
    isShown?: boolean
  }>
  MobileMenuItems?: Array<{
    label: string
    href: string
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

export const NavbarTemplate4: React.FC<NavbarTemplate4Props> = ({
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
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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
        onSearch={onSearch}
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
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between h-16">
            {/* Left side - Brand and Navigation */}
            <div className="flex items-center space-x-8">
              <Logo brandName={brandName} logo={logo} textColor={textColor} />
              <Navigation menuItems={visibleMenuItems} textColor={textColor} fontFamily={fontFamily} isCustomize={isCustomize} />
            </div>

            {/* Right side - Search and Icons */}
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

          {/* Mobile Layout - Only Logo and Menu Button */}
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
