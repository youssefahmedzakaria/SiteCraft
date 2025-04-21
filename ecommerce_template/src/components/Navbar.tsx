"use client";

import Link from "next/link";
import Image from 'next/image';
import Menu from "./menu";
import SearchBar from "./SearchBar";
import NavIcons from "./NavIcons";
import { useState } from 'react';

interface NavbarProps {
  height?: string;
  backgroundColor?: string;
  textColor?: string;
  logoPosition?: 'left' | 'center';
  logoSize?: 'sm' | 'md' | 'lg';
  searchBarWidth?: string;
  paddingX?: string;
  fontFamily?: string;
  hideOnMobile?: boolean;
  logo?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  logoText?: string;
}

const Navbar = ({
  height = "h-16",
  backgroundColor = "bg-white",
  textColor = "text-black",
  logoPosition = 'left',
  logoSize = 'md',
  searchBarWidth = "w-full",
  paddingX = "px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64",
  fontFamily = "font-sans",
  hideOnMobile = false,
  logo = {
    src: "/logo.png",
    alt: "Logo",
    width: 25,
    height: 25
  },
  logoText = "BRAND"
}: NavbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const logoTextSize = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl"
  }[logoSize];

  const mobileLogoTextSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  }[logoSize];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      // Handle search navigation
      console.log("Searching for:", searchQuery);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className={`${height} ${backgroundColor} ${textColor} ${paddingX} ${fontFamily} w-full sticky top-0 z-50 shadow-md`}>
      {/* Mobile View */}
      {!hideOnMobile && (
        <div className="h-full flex items-center justify-between md:hidden">
          <Link href="/" className="flex items-center gap-2">
            {logo?.src && (
              <Image 
                src={logo.src} 
                alt={logo.alt} 
                width={logo.width} 
                height={logo.height}
                className="object-contain"
              />
            )}
            <span className={`${mobileLogoTextSize} font-bold`}>{logoText}</span>
          </Link>
          <Menu />
        </div>
      )}
      
      {/* Desktop View */}
      <div className="hidden md:flex h-full items-center justify-between">
        {/* Case 1: Logo on Left */}
        {logoPosition === 'left' && (
          <>
            {/* Left Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center gap-2">
                {logo?.src && (
                  <Image 
                    src={logo.src} 
                    alt={logo.alt} 
                    width={logo.width} 
                    height={logo.height}
                    className="object-contain"
                  />
                )}
                <span className={`${logoTextSize} font-bold`}>{logoText}</span>
              </Link>
            </div>
            
            {/* Centered Search Bar */}
            <div className="flex-1 flex justify-center px-4">
              <div className={`${searchBarWidth} max-w-xl`}>
                <SearchBar />
              </div>
            </div>
            
            {/* Right Icons */}
            <div className="flex items-center flex-shrink-0">
              <NavIcons />
            </div>
          </>
        )}
        
        {/* Case 2: Logo in Center */}
        {logoPosition === 'center' && (
          <>
            {/* Left Search (collapsible) */}
            <div className="flex items-center flex-shrink-0">
              {!searchOpen ? (
                <button 
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Image 
                    src="/search.png" 
                    alt="Search" 
                    width={20} 
                    height={20}
                  />
                </button>
              ) : (
                <form onSubmit={handleSearch} className={`${searchBarWidth} max-w-xs flex items-center`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-transparent outline-none border-b border-gray-300 py-1 px-2"
                    autoFocus
                  />
                  <button type="submit" className="ml-2">
                    <Image 
                      src="/search.png" 
                      alt="Search" 
                      width={20} 
                      height={20}
                    />
                  </button>
                </form>
              )}
            </div>
            
            {/* Centered Logo */}
            <div className="flex items-center justify-center flex-1">
              <Link href="/" className="flex items-center gap-2">
                {logo?.src && (
                  <Image 
                    src={logo.src} 
                    alt={logo.alt} 
                    width={logo.width} 
                    height={logo.height}
                    className="object-contain"
                  />
                )}
                <span className={`${logoTextSize} font-bold`}>{logoText}</span>
              </Link>
            </div>
            
            {/* Right Icons */}
            <div className="flex items-center flex-shrink-0">
              <NavIcons />
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar;