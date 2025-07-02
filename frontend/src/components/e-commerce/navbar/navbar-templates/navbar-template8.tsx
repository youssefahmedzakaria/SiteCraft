"use client"

import type React from "react"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Logo } from "../navbar-components/logo"
import { Navigation } from "../navbar-components/navigation"
import { IconsGroup } from "../navbar-components/icons-group"
import MobileMenu from "../navbar-components/mobile-menu"
import { SearchBar } from "../navbar-components/search-bar"

export interface NavbarTemplate8Props {
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

export const NavbarTemplate8: React.FC<NavbarTemplate8Props> = ({
  isCustomize = false,
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
        isCustomize={isCustomize}
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
        <div className="w-full max-w-none mx-auto px-4 lg:px-6">
          {/* Mobile layout - hidden on md and larger screens */}
          <div className="flex items-center justify-between h-14 md:hidden">
            <Logo
              brandName={brandName}
              logo={logo}
              textColor={textColor}
              isCustomize={isCustomize}
            />
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

          {/* Desktop Layout - hidden on screens smaller than md */}
          <div className="hidden md:flex items-center justify-between h-16 w-full">
            {/* Left - Logo */}
            <div className="flex-shrink-0">
              <Logo
                brandName={brandName}
                logo={logo}
                textColor={textColor}
                isCustomize={isCustomize}
              />
            </div>

            {/* Center - Navigation */}
            <div className="flex-1 flex justify-center">
              <Navigation
                menuItems={visibleMenuItems}
                textColor={textColor}
                fontFamily={fontFamily}
                isCustomize={isCustomize}
              />
            </div>

            {/* Right - Icons */}
            <div className="flex items-center space-x-6 justify-end min-w-0">
              <IconsGroup iconColor={iconColor} />
              <SearchBar
                expanded={isSearchOpen}
                setExpanded={setIsSearchOpen}
                iconColor={iconColor}
                backgroundColor="bg-white/20"
                textColor={textColor}
              />
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1 hover:opacity-80"
                style={{
                  color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : undefined,
                }}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
