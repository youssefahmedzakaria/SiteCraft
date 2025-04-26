import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Logo } from '../navbar-components/logo';
import { Navigation } from '../navbar-components/navigation';
import { FullSearchBar } from '../navbar-components/full-search-bar';
import { IconsGroup } from '../navbar-components/icons-group';
import  MobileMenu  from '../navbar-components/mobile-menu';

export interface NavbarTemplate5Props {
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

export const NavbarTemplate5: React.FC<NavbarTemplate5Props> = ({
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

      <nav className={`w-full ${backgroundColor} ${textColor} ${fontFamily}`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo and Brand */}
            <Logo brandName={brandName} logo={logo} textColor={textColor} />

            {/* Center/Right - Search Bar & Icons */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:block w-64">
                <FullSearchBar
                  iconColor={searchIconColor}
                  backgroundColor="bg-white/20"
                  textColor={textColor}
                />
              </div>
              
              <div className="hidden md:flex">
                <IconsGroup iconColor={iconColor} />
              </div>
              
              <button
                className="md:hidden p-1 hover:opacity-80"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className={`h-6 w-6 ${iconColor}`} />
              </button>
            </div>
          </div>

          {/* Bottom Section - Navigation */}
          <div className={`border-t ${dividerColor} py-3 hidden md:block`}>
            <Navigation 
              menuItems={menuItems} 
              textColor={textColor} 
            />
          </div>
        </div>
      </nav>
    </>
  );
};