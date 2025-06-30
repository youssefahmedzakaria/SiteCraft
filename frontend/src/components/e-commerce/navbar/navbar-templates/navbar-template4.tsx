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
  searchIconColor?: string
}

export const NavbarTemplate4: React.FC<NavbarTemplate4Props> = ({
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
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // For div responsiveness when isCustomize is true
  const [navbarRef, navbarSize] = useResizeObserver<HTMLDivElement>()
  const isMobileDiv = isCustomize && navbarSize.width > 0 && navbarSize.width < 1024

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

  const isScreenMobile = isClient && screenWidth < 1024
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
        className={`${isCustomize ? "relative" : "fixed"} top-0 left-0 w-full z-30 backdrop-blur ${fontFamily}`}
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
              {/* Left side - Brand and Navigation */}
              <div className="flex-shrink-0 flex items-center space-x-8">
                <Logo
                  brandName={brandName}
                  logo={logo}
                  textColor={textColor}
                  isCustomize={isCustomize}
                  containerWidth={navbarSize.width}
                />
                <Navigation
                  menuItems={visibleMenuItems}
                  textColor={textColor}
                  fontFamily={fontFamily}
                  isCustomize={isCustomize}
                  containerWidth={navbarSize.width}
                />
              </div>

              {/* Right side - Search and Icons */}
              <div className="flex-shrink-0 flex items-center space-x-6">
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
          )}
        </div>
      </nav>
    </>
  )
}
