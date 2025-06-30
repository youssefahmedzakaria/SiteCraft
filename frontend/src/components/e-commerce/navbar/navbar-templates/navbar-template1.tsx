import React, { useState } from "react"
import { Menu, Search } from 'lucide-react'
import { Logo } from "../navbar-components/logo"
import { Navigation } from "../navbar-components/navigation"
import { FullSearchBar } from "../navbar-components/full-search-bar"
import { IconsGroup } from "../navbar-components/icons-group"
import MobileMenu from "../navbar-components/mobile-menu"
import { useEffect } from 'react'
import { useResizeObserver } from '../../../../hooks/useResizeObserver'

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
  searchIconColor?: string
  onSearch?: (query: string) => void
}

export const NavbarTemplate1: React.FC<NavbarTemplate1Props> = ({
  isCustomize = false,
  brandName,
  backgroundColor = "bg-white",
  textColor = "text-black",
  fontFamily = "font-sans",
  logo,
  menuItems,
  MobileMenuItems,
  iconColor = "text-black",
  dividerColor = "border-gray-200",
  searchIconColor = "text-gray-400",
  onSearch,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // For div responsiveness when isCustomize is true
  const [navbarRef, navbarSize] = useResizeObserver<HTMLDivElement>()
  const isMobileDiv = isCustomize && navbarSize.width > 0 && navbarSize.width < 768

  // For screen responsiveness - track screen size with proper initialization
  const [isClient, setIsClient] = useState(false)
  const [screenWidth, setScreenWidth] = useState(1920) // Default to desktop size

  useEffect(() => {
    setIsClient(true)
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth)
    }

    updateScreenWidth()
    window.addEventListener("resize", updateScreenWidth)
    return () => window.removeEventListener("resize", updateScreenWidth)
  }, [])

  // Only apply screen mobile logic after client-side hydration
  const isScreenMobile = isClient && screenWidth < 768

  // Determine if we should show mobile layout
  const shouldShowMobile = isCustomize ? isMobileDiv || isScreenMobile : isScreenMobile

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query)
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
        searchIconColor={searchIconColor}
        dividerColor={dividerColor}
        onSearch={handleSearch}
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
          {/* Mobile layout - when screen is small OR div is small (if customizing) */}
          {shouldShowMobile ? (
            <div className="flex items-center justify-between h-14">
              <Logo
                brandName={brandName}
                logo={logo}
                textColor={textColor}
                isCustomize={isCustomize}
                containerWidth={navbarSize.width}
              />
              <div className="flex items-center gap-2">
                <button
                  className="p-1 hover:opacity-80"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Toggle search"
                  style={{
                    color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#000000" : undefined,
                  }}
                >
                  <Search className="h-6 w-6" />
                </button>
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
            </div>
          ) : (
            /* Desktop layout - when screen is large AND div is large (if customizing) */
            <>
              <div className="relative flex items-center justify-between h-16 w-full">
                {/* Left - Logo and Brand */}
                <div className="flex-shrink-0">
                  <Logo
                    brandName={brandName}
                    logo={logo}
                    textColor={textColor}
                    isCustomize={isCustomize}
                    containerWidth={navbarSize.width}
                  />
                </div>

                {/* Center - Search */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
                  <FullSearchBar
                    iconColor={searchIconColor}
                    backgroundColor="bg-white/20"
                    textColor={textColor}
                    onSearch={handleSearch}
                    isCustomize={isCustomize}
                    containerWidth={navbarSize.width}
                  />
                </div>

                {/* Right - Icons */}
                <div className="flex-shrink-0">
                  <IconsGroup iconColor={iconColor} isCustomize={isCustomize} containerWidth={navbarSize.width} />
                </div>
              </div>

              {/* Bottom Navigation - Desktop only */}
              <div
                className="flex justify-start py-2 border-t w-full"
                style={{
                  borderColor: dividerColor.includes("[")
                    ? dividerColor.split("-[")[1]?.slice(0, -1) || "#e5e7eb"
                    : undefined,
                }}
              >
                <Navigation
                  menuItems={visibleMenuItems}
                  textColor={textColor}
                  fontFamily={fontFamily}
                  isCustomize={isCustomize}
                  containerWidth={navbarSize.width}
                />
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  )
}
