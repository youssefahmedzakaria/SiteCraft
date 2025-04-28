import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Logo } from '../navbar-components/logo';
import { Navigation } from '../navbar-components/navigation';
import { SearchBar } from '../navbar-components/search-bar';
import { IconsGroup } from '../navbar-components/icons-group';
import  MobileMenu  from '../navbar-components/mobile-menu';

export interface NavbarTemplate2Props {
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

export const NavbarTemplate2: React.FC<NavbarTemplate2Props> = ({
  brandName,
  MobileMenuItems,
  backgroundColor = 'bg-white',
  textColor = 'text-black',
  fontFamily = 'font-sans',
  logo,
  menuItems = [],
  iconColor = 'text-black',
  dividerColor = 'border-gray-200',
  searchIconColor = 'text-gray-400',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
      />

      <nav className={`fixed top-0 left-0 w-full z-30 ${backgroundColor} ${textColor} ${fontFamily}`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Layout */}
          <div className="hidden md:block w-full">
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
              <Navigation menuItems={menuItems} textColor={textColor} />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden w-full">
            <div className="flex items-center justify-between py-4">
              <Logo brandName={brandName} logo={logo} textColor={textColor} />
              <div className="flex items-center space-x-6">
                <button
                  className="p-1 hover:opacity-80"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className={`h-6 w-6 ${iconColor}`} />
                </button>
              </div>
            </div>
          
          </div>
        </div>
      </nav>
    </>
  );
};