import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Logo } from '../navbar-components/logo';
import { Navigation } from '../navbar-components/navigation';
import { SearchBar } from '../navbar-components/search-bar';
import { IconsGroup } from '../navbar-components/icons-group';
import MobileMenu from '../navbar-components/mobile-menu';

export interface NavbarTemplate7Props {
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
  isRTL?: boolean;
}

export const NavbarTemplate7: React.FC<NavbarTemplate7Props> = ({
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
  isRTL = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const rtlClass = isRTL ? 'rtl' : '';

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

      <nav className={`w-full ${backgroundColor} ${textColor} ${fontFamily} ${rtlClass}`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between h-16 relative">
            {/* Left - Navigation - Fixed width */}
            <div className={`w-1/3 flex ${isRTL ? 'justify-end order-3' : 'justify-start order-1'}`}>
              <Navigation menuItems={menuItems} textColor={textColor} />
            </div>

            {/* Center - Logo - Absolute centered */}
            <div className={`absolute left-1/2 transform -translate-x-1/2 ${isRTL ? 'order-1' : 'order-2'}`}>
              <Logo brandName={brandName} logo={logo} textColor={textColor} />
            </div>

            {/* Right - Search and Icons - Fixed width */}
            <div className={`w-1/3 flex ${isRTL ? 'justify-start order-1 flex-row-reverse' : 'justify-end order-3'}`}>
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
          </div>

          {/* Mobile Layout - Logo and Menu Button Only */}
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