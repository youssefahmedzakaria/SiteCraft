"use client"

import type React from "react"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Logo } from "../navbar-components/logo"
import { SearchBar } from "../navbar-components/search-bar"
import { IconsGroup } from "../navbar-components/icons-group"
import MobileMenu from "../navbar-components/mobile-menu"
import { Navigation } from "../navbar-components/navigation"

export interface NavbarTemplate3Props {
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
}

export const NavbarTemplate3: React.FC<NavbarTemplate3Props> = ({
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
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Filter visible menu items
  const visibleMenuItems = menuItems?.filter((item) => item.isShown !== false) || []

  console.log("NavbarTemplate3 props:", {
    backgroundColor,
    textColor,
    fontFamily,
    iconColor,
    dividerColor,
  })

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

  return (
    <>
      <MobileMenu
        NavMenuItems={visibleMenuItems}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        backgroundColor={backgroundColor}
        textColor={textColor}
        iconColor={iconColor}
        MobileMenuItems={MobileMenuItems}
        dividerColor={dividerColor}
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
            {/* Left - Menu Button */}
            <div className="w-8">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1 hover:opacity-80"
                style={{
                  color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#000000" : undefined,
                }}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Center - Brand Name */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Logo brandName={brandName} logo={logo} textColor={textColor} />
            </div>

            {/* Right - Search and Icons */}
            <div className="flex items-center space-x-6">
              <SearchBar
                expanded={isSearchOpen}
                setExpanded={setIsSearchOpen}
                iconColor={iconColor}
                backgroundColor="bg-white/20"
                textColor={textColor}
              />
              <IconsGroup iconColor={iconColor} />
            </div>
          </div>

          {/* Mobile Layout - Only Logo and Menu Button */}
          <div className="md:hidden flex items-center justify-between h-16">
            <Logo brandName={brandName} logo={logo} textColor={textColor} />
            <button
              className="p-1 hover:opacity-80"
              onClick={() => setIsMobileMenuOpen(true)}
              style={{
                color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#000000" : undefined,
              }}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

        </div>
      </nav>
    </>
  )
}
