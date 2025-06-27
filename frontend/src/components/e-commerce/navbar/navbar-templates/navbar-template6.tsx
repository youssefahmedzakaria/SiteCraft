"use client";
import React, { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Logo } from "../navbar-components/logo";
import { Navigation } from "../navbar-components/navigation";
import { SearchBar } from "../navbar-components/search-bar";
import MobileMenu from "../navbar-components/mobile-menu";
import { usePathname } from "next/navigation";

export interface NavbarTemplate6Props {
  brandName?: string | React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  logo?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  MobileMenuItems?: Array<{
    label: string;
    href: string;
  }>;
  menuItems?: Array<{
    label: string;
    href: string;
  }>;
  iconColor?: string;
  dividerColor?: string;
  searchIconColor?: string;
}

export const NavbarTemplate6: React.FC<NavbarTemplate6Props> = ({
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
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <MobileMenu
        NavMenuItems={menuItems}
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
        className={`fixed top-0 left-0 w-full z-30 backdrop-blur ${backgroundColor} ${textColor} ${fontFamily}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between h-16">
            {/* Left side - Brand and Navigation */}
            <div className="flex items-center space-x-8">
              <Logo brandName={brandName} logo={logo} textColor={textColor} />
              <Navigation menuItems={menuItems} textColor={textColor} />
            </div>

            {/* Right side - Search and Text Links */}
            <div className="flex items-center space-x-6">
              <SearchBar
                expanded={isSearchOpen}
                setExpanded={setIsSearchOpen}
                iconColor={searchIconColor}
                backgroundColor="bg-white/20"
                textColor={textColor}
              />

              <div className="flex items-center space-x-6">
                <Link
                  href={`/e-commerce/${subdomain}/profile`}
                  className={`text-sm hover:underline transition-all ${textColor}`}
                >
                  Profile
                </Link>
                <Link
                  href={`/e-commerce/${subdomain}/cart`}
                  className={`text-sm hover:underline transition-all ${textColor}`}
                >
                  Shopping Cart
                </Link>
                <Link
                  href={`/e-commerce/${subdomain}/favorites`}
                  className={`text-sm hover:underline transition-all ${textColor}`}
                >
                  Favorites
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Layout - Only Logo and Menu Button */}
          <div className="md:hidden flex items-center justify-between h-16">
            <Logo brandName={brandName} logo={logo} textColor={textColor} />
            <button
              className="p-1 hover:opacity-80"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className={`h-6 w-6 ${iconColor}`} />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};
