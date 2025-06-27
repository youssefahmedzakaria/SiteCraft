/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import type React from "react";
import { X, Search } from "lucide-react";
import { FullSearchBar } from "./full-search-bar";
import Link from "next/link";
import { Navigation } from "./navigation";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  MobileMenuItems: Array<{
    label: string;
    href: string;
  }>;
  NavMenuItems: Array<{
    label: string;
    href: string;
  }>;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  searchIconColor?: string;
  dividerColor?: string;
  onSearch?: (query: string) => void;
  products?: any[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  MobileMenuItems,
  NavMenuItems,
  backgroundColor = "bg-black",
  textColor = "text-white",
  iconColor = "text-white",
  searchIconColor = "text-white",
  dividerColor = "border-transparent",
  onSearch,
  products = [],
}) => {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];
  
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
    // You can also implement local search logic here
    console.log("Searching for:", query);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex backdrop-blur`}>
      <div
        className={`w-64 ${backgroundColor} ${textColor} h-full shadow-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`${dividerColor} flex items-center justify-between p-4`}
        >
          <h2 className="text-xl font-semibold">Menu</h2>
          <div className="flex items-center gap-2">
            {/* Search Icon Button */}
            <button
              onClick={handleSearchToggle}
              className="p-1 hover:opacity-80 transition-opacity"
              aria-label="Toggle search"
            >
              <Search className={`h-5 w-5 ${searchIconColor}`} />
            </button>
            {/* Close Button */}
            <button onClick={onClose} className="p-1 hover:opacity-80">
              <X className={`h-6 w-6 ${iconColor}`} />
            </button>
          </div>
        </div>

        {/* Conditional Search Bar */}
        {isSearchVisible && (
          <div className={`${dividerColor} px-4 py-3 border-b border-white/10`}>
            <FullSearchBar
              onSearch={handleSearch}
              iconColor={searchIconColor}
              backgroundColor="bg-white/20"
              textColor={textColor}
              placeholder="Search products..."
            />
          </div>
        )}

        <div className={`${dividerColor} px-4 py-3`}>
          <Navigation
            menuItems={NavMenuItems}
            textColor={textColor}
            orientation="vertical"
            onClick={onClose}
          />
          <div className="py-1 overflow-y-auto"></div>
          <Link
            href={`/e-commerce/${subdomain}/profile`}
            className=" block py-2 text-sm hover:underline "
          >
            Profile
          </Link>
          <Link
            href={`/e-commerce/${subdomain}/cart`}
            className=" block py-2 text-sm hover:underline "
          >
            Cart
          </Link>
          <Link
            href={`/e-commerce/${subdomain}/favorites`}
            className="block py-2 text-sm hover:underline "
          >
            Favorites
          </Link>
        </div>

        <div className={`${dividerColor} py-2 overflow-y-auto`}>
          {MobileMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-sm hover:bg-white/10 transition-colors"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
    </div>
  );
};

export default MobileMenu;
