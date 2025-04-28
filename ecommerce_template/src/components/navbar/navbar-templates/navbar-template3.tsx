import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Logo } from '../navbar-components/logo';
import { SearchBar } from '../navbar-components/search-bar';
import { IconsGroup } from '../navbar-components/icons-group';
import MobileMenu from '../navbar-components/mobile-menu';
import { SideMenu } from '../navbar-components/side-menu';

export interface NavbarTemplate3Props {
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

export const NavbarTemplate3: React.FC<NavbarTemplate3Props> = ({
  brandName,
  backgroundColor = 'bg-white',
  textColor = 'text-black',
  fontFamily = 'font-sans',
  logo,
  menuItems = [],
  MobileMenuItems = [],
  iconColor = 'text-black',
  dividerColor = 'border-gray-200',
  searchIconColor = 'text-gray-400',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu (for mobile view) */}
      <MobileMenu
        NavMenuItems={menuItems}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        backgroundColor={backgroundColor}
        textColor={textColor}
        iconColor={iconColor}
        MobileMenuItems={MobileMenuItems}
        searchIconColor={searchIconColor}
        dividerColor={dividerColor}
      />

      {/* Side Menu (for desktop view) */}
      <SideMenu
        fullSearchBar={false}
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        backgroundColor={backgroundColor}
        textColor={textColor}
        iconColor={iconColor}
        menuItems={menuItems}
        searchIconColor={searchIconColor}
        dividerColor={dividerColor}
      />

      <nav className={`fixed top-0 left-0 w-full z-30 ${backgroundColor} ${textColor} ${fontFamily}`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between h-16">
            {/* Left - Menu Button */}
            <div className="w-8">
              <button
                onClick={() => setIsSideMenuOpen(true)}
                className="p-1 hover:opacity-80"
                aria-label="Open side menu"
              >
                <Menu className={`h-6 w-6 ${iconColor}`} />
              </button>
            </div>

            {/* Center - Brand Name */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Logo brandName={brandName} logo={logo} textColor={textColor} />
            </div>

            {/* Right - Search and Icons */}
            <div className="flex items-center space-x-6">
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

          {/* Mobile Layout - Only Logo and Menu Button */}
          <div className="md:hidden flex items-center justify-between h-16">
            <Logo brandName={brandName} logo={logo} textColor={textColor} />
            <button
              className="p-1 hover:opacity-80"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu className={`h-6 w-6 ${iconColor}`} />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};