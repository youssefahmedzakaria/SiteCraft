"use client"
import type React from "react"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Logo } from "../navbar-components/logo"
import { Navigation } from "../navbar-components/navigation"
import { SearchBar } from "../navbar-components/search-bar"
import { IconsGroup } from "../navbar-components/icons-group"
import MobileMenu from "../navbar-components/mobile-menu"
import { useResizeObserver } from '../../../../hooks/useResizeObserver'

interface NavItem {
  label: string
  href: string
}

interface NavbarProps {
  brandName: string
  logo: string
  menuItems: NavItem[]
  visibleMenuItems?: NavItem[]
  MobileMenuItems?: NavItem[]
  backgroundColor: string
  textColor: string
  iconColor: string
  searchIconColor: string
  dividerColor: string
  fontFamily: string
  isCustomize?: boolean
}

export const NavbarTemplate2: React.FC<NavbarProps> = ({
  brandName,
  logo,
  menuItems,
  visibleMenuItems = menuItems,
  MobileMenuItems,
  backgroundColor,
  textColor,
  iconColor,
  searchIconColor,
  dividerColor,
  fontFamily,
  isCustomize,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Responsive to div size
  const [navbarRef, navbarSize] = useResizeObserver<HTMLDivElement>()
  const isMobileDiv = navbarSize.width > 0 && navbarSize.width < 1024

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
        <div className="max-w-7xl mx-auto px-4">
          {isMobileDiv ? (
            // Compact layout for small containers
            <div className="flex items-center justify-between h-14">
              <Logo brandName={brandName} logo={logo} textColor={textColor} />
              <button
                className="p-1 hover:opacity-80"
                onClick={() => setIsMobileMenuOpen(true)}
                style={{
                  color: iconColor.includes("[")
                    ? iconColor.split("-[")[1]?.slice(0, -1) || "#000000"
                    : undefined,
                }}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          ) : (
            // Desktop Layout
            <div className="w-full">
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
                    iconColor={searchIconColor}
                    backgroundColor="bg-white/20"
                    textColor={textColor}
                  />
                  <IconsGroup iconColor={iconColor} />
                </div>
              </div>
              {/* Menu items centered below logo */}
              <div className="flex justify-center h-10 mt-4">
                <Navigation menuItems={visibleMenuItems} textColor={textColor} fontFamily={fontFamily} />
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
