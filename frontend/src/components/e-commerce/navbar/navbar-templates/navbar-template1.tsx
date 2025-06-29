import React, { useState } from "react";
import { Menu, Search } from "lucide-react";
import { Logo } from "../navbar-components/logo";
import { Navigation } from "../navbar-components/navigation";
import { FullSearchBar } from "../navbar-components/full-search-bar";
import { IconsGroup } from "../navbar-components/icons-group";
import MobileMenu from "../navbar-components/mobile-menu";

export interface NavbarTemplate1Props {
  isCustomize?: boolean;
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
  onSearch?: (query: string) => void;
}

export const NavbarTemplate1: React.FC<NavbarTemplate1Props> = ({
  isCustomize,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <>
      <MobileMenu
        NavMenuItems={menuItems || []}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        backgroundColor={backgroundColor}
        textColor={textColor}
        iconColor={iconColor}
        MobileMenuItems={MobileMenuItems || []}
        searchIconColor={searchIconColor}
        dividerColor={dividerColor}
        onSearch={handleSearch}
      />

      <nav
        className={`${
          isCustomize ? "relative" : "fixed"
        } top-0 left-0 w-full z-30 backdrop-blur ${backgroundColor} ${textColor} ${fontFamily}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative flex items-center justify-between h-16">
            {/* Left - Logo and Brand */}
            <Logo brandName={brandName} logo={logo} textColor={textColor} />

            {/* Center - Search (Hide on mobile) */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md hidden md:block">
              <FullSearchBar
                iconColor={searchIconColor}
                backgroundColor="bg-white/20"
                textColor={textColor}
                onSearch={handleSearch}
              />
            </div>

            {/* Right - Icons on desktop / Menu button on mobile */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex">
                <IconsGroup iconColor={iconColor} />
              </div>
              <button
                className="md:hidden p-1 hover:opacity-80"
                onClick={() => {
                  setIsMobileMenuOpen(true);
                }}
                aria-label="Toggle search"
              >
                <Search className={`h-6 w-6 ${iconColor}`} />
              </button>
              <button
                className="md:hidden p-1 hover:opacity-80"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className={`h-6 w-6 ${iconColor}`} />
              </button>
            </div>
          </div>

          {/* Bottom Navigation - Desktop only */}
          <div
            className={`hidden md:flex justify-start py-2 border-t ${dividerColor}`}
          >
            <Navigation menuItems={menuItems || []} textColor={textColor} />
          </div>
        </div>
      </nav>
    </>
  );
};
