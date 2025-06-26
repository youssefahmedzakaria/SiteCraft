import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Logo } from '../navbar-components/logo';
import { IconsGroup } from '../navbar-components/icons-group';
import MobileMenu from '../navbar-components/mobile-menu';
import { SideMenu } from '../navbar-components/side-menu';

export interface NavbarTemplate8Props {
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

export const NavbarTemplate8: React.FC<NavbarTemplate8Props> = ({
  brandName,
  logo,
  backgroundColor = 'bg-[#8B4513]',
  textColor = 'text-white',
  menuItems = [],
  MobileMenuItems = [],
  iconColor = 'text-white',
  dividerColor = 'border-[#6B3410]',
  searchIconColor = 'text-gray-300',
  fontFamily = 'font-sans',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        NavMenuItems={menuItems}
        MobileMenuItems={MobileMenuItems}
        onClose={() => setIsMobileMenuOpen(false)}
        backgroundColor={backgroundColor}
        textColor={textColor}
        iconColor={iconColor}
        searchIconColor={searchIconColor}
        dividerColor={dividerColor}
      />

      <SideMenu
        isOpen={isSideMenuOpen}
        position='right'
        fullSearchBar={true}
        onClose={() => setIsSideMenuOpen(false)}
        menuItems={menuItems}
        textColor={textColor}
        backgroundColor={backgroundColor}
        iconColor={iconColor}
        dividerColor={dividerColor}
        searchIconColor={searchIconColor}
      />

      <nav className={`fixed top-0 left-0 w-full z-30 backdrop-blur ${backgroundColor} ${textColor} ${fontFamily}`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between h-16 w-full">
            {/* Left - Logo and Brand Name */}
            <div className="flex items-center space-x-2 min-w-0">
              <Logo brandName={brandName} logo={logo} textColor={textColor} />
            </div>
            
            {/* Right - Icons and side menu button */}
            <div className="flex items-center space-x-6 justify-end min-w-0">
              <IconsGroup iconColor={iconColor} />
              <button
                onClick={() => setIsSideMenuOpen(true)}
                className="p-1 hover:opacity-80"
              >
                <Menu className={`h-6 w-6 ${iconColor}`} />
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-between h-16">
            <Logo brandName={brandName} logo={logo} textColor={textColor} />
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 hover:opacity-80"
            >
              <Menu className={`h-6 w-6 ${iconColor}`} />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};