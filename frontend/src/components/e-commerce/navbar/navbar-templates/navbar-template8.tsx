"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Menu, Search } from "lucide-react"
import { Logo } from "../navbar-components/logo"
import { IconsGroup } from "../navbar-components/icons-group"
import MobileMenu from "../navbar-components/mobile-menu"
import { SideMenu } from "../navbar-components/side-menu"
import { useResizeObserver } from "../../../../hooks/useResizeObserver"

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
  searchIconColor?: string
}

export const NavbarTemplate8: React.FC<NavbarTemplate8Props> = ({
  isCustomize = false,
  brandName,
  logo,
  backgroundColor = "bg-[#8B4513]",
  textColor = "text-white",
  menuItems = [],
  MobileMenuItems = [],
  iconColor = "text-white",
  dividerColor = "border-[#6B3410]",
  searchIconColor = "text-gray-300",
  fontFamily = "font-sans",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)

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
        isOpen={isMobileMenuOpen}
        NavMenuItems={visibleMenuItems}
        MobileMenuItems={MobileMenuItems}
        onClose={() => setIsMobileMenuOpen(false)}
        backgroundColor={backgroundColor}
        textColor={textColor}
        iconColor={iconColor}
        searchIconColor={searchIconColor}
        dividerColor={dividerColor}
        isCustomize={isCustomize}
      />

      <SideMenu
        isOpen={isSideMenuOpen}
        position="right"
        fullSearchBar={true}
        onClose={() => setIsSideMenuOpen(false)}
        menuItems={visibleMenuItems}
        textColor={textColor}
        backgroundColor={backgroundColor}
        iconColor={iconColor}
        dividerColor={dividerColor}
        searchIconColor={searchIconColor}
        isCustomize={isCustomize}
      />

      <nav
        ref={navbarRef}
        className={`${isCustomize ? "relative" : "fixed"} top-0 left-0 w-full z-30 backdrop-blur ${fontFamily}`}
        style={{
          backgroundColor: backgroundColor.includes("[")
            ? backgroundColor.split("-[")[1]?.slice(0, -1) || "#8B4513"
            : undefined,
          color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : undefined,
        }}
      >
        <div className="w-full max-w-none mx-auto px-4 lg:px-6">
          {shouldShowMobile ? (
            <div className="flex items-center justify-between h-14">
              <Logo
                brandName={brandName}
                logo={logo}
                textColor={textColor || "#fff"}
                isCustomize={isCustomize}
                containerWidth={navbarSize.width}
              />
              <div className="flex items-center gap-2">
                <button
                  className="p-1 hover:opacity-80"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Toggle search"
                  style={{
                    color: iconColor.includes("[")
                      ? iconColor.split("-[")[1]?.slice(0, -1) || "#fff"
                      : iconColor || "#fff",
                  }}
                >
                  <Search className="h-6 w-6" />
                </button>
                <button
                  className="p-1 hover:opacity-80"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open menu"
                  style={{
                    color: iconColor.includes("[")
                      ? iconColor.split("-[")[1]?.slice(0, -1) || "#fff"
                      : iconColor || "#fff",
                  }}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          ) : (
            /* Desktop Layout */
            <div className="relative flex items-center justify-between h-16 w-full">
              {/* Left - Logo and Brand Name */}
              <div className="flex-shrink-0 flex items-center space-x-2 min-w-0">
                <Logo
                  brandName={brandName}
                  logo={logo}
                  textColor={textColor}
                  isCustomize={isCustomize}
                  containerWidth={navbarSize.width}
                />
              </div>

              {/* Right - Icons and side menu button */}
              <div className="flex-shrink-0 flex items-center space-x-6 justify-end min-w-0">
                <IconsGroup iconColor={iconColor} isCustomize={isCustomize} containerWidth={navbarSize.width} />
                <button
                  onClick={() => setIsSideMenuOpen(true)}
                  className="p-1 hover:opacity-80"
                  style={{
                    color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : undefined,
                  }}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
