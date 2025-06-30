"use client"

import type React from "react"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Logo } from "../navbar-components/logo"
import { Navigation } from "../navbar-components/navigation"
import { FullSearchBar } from "../navbar-components/full-search-bar"
import { IconsGroup } from "../navbar-components/icons-group"
import MobileMenu from "../navbar-components/mobile-menu"
import { useResizeObserver } from "../../../../hooks/useResizeObserver"

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
  searchIconColor?: string
}

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
  searchIconColor = "text-gray-400",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Responsive to div size
  const [navbarRef, navbarSize] = useResizeObserver<HTMLDivElement>()
  const isMobileDiv = navbarSize.width > 0 && navbarSize.width < 1024

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
        searchIconColor={searchIconColor}
        dividerColor={dividerColor}
      />

      <nav
        ref={navbarRef}
        className={`${isCustomize ? "relative" : "fixed"} top-0 left-0 w-full z-30 backdrop-blur ${fontFamily}`}
        style={{
          backgroundColor: backgroundColor.includes("[")
            ? backgroundColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
            : undefined,
          color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#000000" : undefined,
        }}
      >
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          {/* Compact layout for small divs */}
          {isMobileDiv ? (
            <div className="flex items-center justify-between h-14">
              <Logo brandName={brandName} logo={logo} textColor={textColor} />
              <button
                className="p-1 hover:opacity-80"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
                style={{
                  color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#000000" : undefined,
                }}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          ) : (
            <>
              {/* Top Bar */}
              <div className="flex items-center justify-between h-16">
                {/* Left - Logo and Brand */}
                <Logo brandName={brandName} logo={logo} textColor={textColor} />

                {/* Center/Right - Search Bar & Icons */}
                <div className="flex items-center space-x-6">
                  <div className="hidden md:block w-64">
                    <FullSearchBar iconColor={searchIconColor} backgroundColor="bg-white/20" textColor={textColor} />
                  </div>

                  <div className="hidden md:flex">
                    <IconsGroup iconColor={iconColor} />
                  </div>

                  <button
                    className="md:hidden p-1 hover:opacity-80"
                    onClick={() => setIsMobileMenuOpen(true)}
                    style={{
                      color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#000000" : undefined,
                    }}
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
            </>
          )}
        </div>
      </nav>
    </>
  )
}
