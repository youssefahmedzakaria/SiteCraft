"use client"

import type React from "react"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Logo } from "../navbar-components/logo"
import { Navigation } from "../navbar-components/navigation"
import { FullSearchBar } from "../navbar-components/full-search-bar"
import { IconsGroup } from "../navbar-components/icons-group"
import MobileMenu from "../navbar-components/mobile-menu"

export interface NavbarTemplate5Props {
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

export const NavbarTemplate5: React.FC<NavbarTemplate5Props> = ({
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

  // Filter visible menu items
  const visibleMenuItems = menuItems?.filter((item) => item.isShown !== false) || []

  console.log("NavbarTemplate5 props:", {
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
        MobileMenuItems={MobileMenuItems}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        backgroundColor={backgroundColor}
        textColor={textColor}
        iconColor={iconColor}
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
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo and Brand */}
            <Logo brandName={brandName} logo={logo} textColor={textColor} />

            {/* Center/Right - Search Bar & Icons */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:block w-64">
                <FullSearchBar iconColor={iconColor} backgroundColor="bg-white/20" textColor={textColor} />
              </div>

              <div className="hidden md:flex">
                <IconsGroup iconColor={iconColor} />
              </div>

              <button
                className="md:hidden p-1 hover:opacity-80"
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

          {/* Bottom Section - Navigation */}
          <div
            className="py-3 hidden md:block border-t"
            style={{
              borderColor: dividerColor.includes("[")
                ? dividerColor.split("-[")[1]?.slice(0, -1) || "#e5e7eb"
                : undefined,
            }}
          >
            <Navigation menuItems={visibleMenuItems} textColor={textColor} fontFamily={fontFamily} />
          </div>
        </div>
      </nav>
    </>
  )
}
