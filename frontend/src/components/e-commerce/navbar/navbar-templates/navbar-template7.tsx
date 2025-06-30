"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Logo } from "../navbar-components/logo"
import { Navigation } from "../navbar-components/navigation"
import { SearchBar } from "../navbar-components/search-bar"
import { IconsGroup } from "../navbar-components/icons-group"
import MobileMenu from "../navbar-components/mobile-menu"
import { useResizeObserver } from "../../../../hooks/useResizeObserver"

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
  searchIconColor?: string
  isRTL?: boolean
}

export const NavbarTemplate7: React.FC<NavbarTemplate7Props> = ({
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
  searchIconColor = "text-gray-400",
  isRTL = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const rtlClass = isRTL ? "rtl" : ""

  // For div responsiveness when isCustomize is true
  const [navbarRef, navbarSize] = useResizeObserver<HTMLDivElement>()
  const isMobileDiv = isCustomize && navbarSize.width > 0 && navbarSize.width < 768

  // For screen responsiveness
  const [isClient, setIsClient] = useState(false)
  const [screenWidth, setScreenWidth] = useState(1920)

  useEffect(() => {
    setIsClient(true)
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth)
    }

    updateScreenWidth()
    window.addEventListener("resize", updateScreenWidth)
    return () => window.removeEventListener("resize", updateScreenWidth)
  }, [])

  const isScreenMobile = isClient && screenWidth < 768
  const shouldShowMobile = isCustomize ? isMobileDiv || isScreenMobile : isScreenMobile

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
        isCustomize={isCustomize}
      />

      <nav
        ref={navbarRef}
        className={`${isCustomize ? "relative" : "fixed"} top-0 left-0 w-full z-30 backdrop-blur ${fontFamily} ${rtlClass}`}
        style={{
          backgroundColor: backgroundColor.includes("[")
            ? backgroundColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
            : undefined,
          color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#000000" : undefined,
        }}
      >
        <div className="w-full max-w-none mx-auto px-4 lg:px-6">
          {shouldShowMobile ? (
            <div className="flex items-center justify-between h-14">
              <Logo
                brandName={brandName}
                logo={logo}
                textColor={textColor}
                isCustomize={isCustomize}
                containerWidth={navbarSize.width}
              />
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
            /* Desktop Layout */
            <div className="relative flex items-center justify-between h-16 w-full">
              {/* Left - Navigation - Fixed width */}
              <div className={`w-1/3 flex ${isRTL ? "justify-end order-3" : "justify-start order-1"}`}>
                <Navigation
                  menuItems={visibleMenuItems}
                  textColor={textColor}
                  fontFamily={fontFamily}
                  isCustomize={isCustomize}
                  containerWidth={navbarSize.width}
                />
              </div>

              {/* Center - Logo - Absolute centered */}
              <div className={`absolute left-1/2 transform -translate-x-1/2 ${isRTL ? "order-1" : "order-2"}`}>
                <Logo
                  brandName={brandName}
                  logo={logo}
                  textColor={textColor}
                  isCustomize={isCustomize}
                  containerWidth={navbarSize.width}
                />
              </div>

              {/* Right - Search and Icons - Fixed width */}
              <div className={`w-1/3 flex ${isRTL ? "justify-start order-1 flex-row-reverse" : "justify-end order-3"}`}>
                <div className="flex items-center space-x-6">
                  <SearchBar
                    expanded={isSearchOpen}
                    setExpanded={setIsSearchOpen}
                    iconColor={searchIconColor}
                    backgroundColor="bg-white/20"
                    textColor={textColor}
                    isCustomize={isCustomize}
                    containerWidth={navbarSize.width}
                  />
                  <IconsGroup iconColor={iconColor} isCustomize={isCustomize} containerWidth={navbarSize.width} />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
