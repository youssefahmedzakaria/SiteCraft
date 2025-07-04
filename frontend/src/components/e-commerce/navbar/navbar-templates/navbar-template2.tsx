"use client"

import type React from "react"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Logo } from "../navbar-components/logo"
import { Navigation } from "../navbar-components/navigation"
import { SearchBar } from "../navbar-components/search-bar"
import { IconsGroup } from "../navbar-components/icons-group"
import MobileMenu from "../navbar-components/mobile-menu"

export interface NavbarTemplate2Props {
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

export const NavbarTemplate2: React.FC<NavbarTemplate2Props> = ({
  isCustomize,
  brandName,
  MobileMenuItems,
  backgroundColor = "bg-white",
  textColor = "text-black",
  fontFamily = "font-sans",
  logo,
  menuItems = [],
  iconColor = "text-black",
  dividerColor = "border-gray-200",
  onSearch,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Filter visible menu items
  const visibleMenuItems = menuItems?.filter((item) => item.isShown !== false) || []

  console.log("NavbarTemplate2 props:", {
    backgroundColor,
    textColor,
    fontFamily,
    iconColor,
    dividerColor,
  })

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
          <div className="hidden md:block w-full">
            {/* Top bar with icons on the right */}
            <div className="flex items-center justify-between pt-4">
              <div className="w-1/3" />
              <div className="w-1/3 flex justify-center">
                <Logo brandName={brandName} logo={logo} textColor={textColor} />
              </div>
              <div className="w-1/3 flex justify-end space-x-4">
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
            {/* Menu items centered below logo */}
            <div className="flex justify-center h-10 mt-4">
              <Navigation menuItems={visibleMenuItems} textColor={textColor} fontFamily={fontFamily} isCustomize={isCustomize} />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden w-full">
            <div className="flex items-center justify-between py-4">
              <Logo brandName={brandName} logo={logo} textColor={textColor} />
              <div className="flex items-center space-x-6">
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
          </div>
        </div>
      </nav>
    </>
  )
}
