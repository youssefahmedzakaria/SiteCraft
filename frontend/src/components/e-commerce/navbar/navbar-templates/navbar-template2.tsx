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
  searchIconColor?: string
}

export const NavbarTemplate2: React.FC<NavbarTemplate2Props> = ({
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
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // For div responsiveness when isCustomize is true
  const [navbarRef, navbarSize] = useResizeObserver<HTMLDivElement>()
  const isMobileDiv = isCustomize && navbarSize.width > 0 && navbarSize.width < 768

  // For screen responsiveness - track screen size with proper initialization
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
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        backgroundColor={backgroundColor}
        textColor={textColor}
        iconColor={iconColor}
        MobileMenuItems={MobileMenuItems || []}
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
            // Mobile layout
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
                style={{
                  color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#000000" : undefined,
                }}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          ) : (
            // Desktop Layout
            <div className="w-full">
              {/* Top bar with icons on the right */}
              <div className="flex items-center justify-between pt-4 w-full">
                <div className="w-1/3" />
                <div className="w-1/3 flex justify-center">
                  <Logo
                    brandName={brandName}
                    logo={logo}
                    textColor={textColor}
                    isCustomize={isCustomize}
                    containerWidth={navbarSize.width}
                  />
                </div>
                <div className="w-1/3 flex justify-end space-x-4">
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
              {/* Menu items centered below logo */}
              <div className="flex justify-center h-10 mt-4 w-full">
                <Navigation
                  menuItems={visibleMenuItems}
                  textColor={textColor}
                  fontFamily={fontFamily}
                  isCustomize={isCustomize}
                  containerWidth={navbarSize.width}
                />
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
