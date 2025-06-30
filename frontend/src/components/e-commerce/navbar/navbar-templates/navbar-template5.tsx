"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
            <>
              {/* Top Bar */}
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

                {/* Center/Right - Search Bar & Icons */}
                <div className="flex-shrink-0 flex items-center space-x-6">
                  <div className="w-64">
                    <FullSearchBar
                      iconColor={searchIconColor}
                      backgroundColor="bg-white/20"
                      textColor={textColor}
                      isCustomize={isCustomize}
                      containerWidth={navbarSize.width}
                    />
                  </div>
                  <IconsGroup iconColor={iconColor} isCustomize={isCustomize} containerWidth={navbarSize.width} />
                </div>
              </div>

              {/* Bottom Section - Navigation */}
              <div
                className="py-3 border-t w-full"
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
