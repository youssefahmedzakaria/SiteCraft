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
import { useResizeObserver } from "../../../../hooks/useResizeObserver";

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
  isCustomize?: boolean;
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
  isCustomize = false,
}) => {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Responsive to div size when isCustomize is true
  const [menuRef, menuSize] = useResizeObserver<HTMLDivElement>();
  const isCompact = isCustomize && menuSize.width > 0 && menuSize.width < 300;

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
    console.log("Searching for:", query);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex backdrop-blur">
      <div
        ref={menuRef}
        className={`${isCompact ? "w-48" : "w-64"} h-full shadow-lg`}
        style={{
          backgroundColor: backgroundColor.includes("[")
            ? backgroundColor.split("-[")[1]?.slice(0, -1) || "#000000"
            : "#000000",
          color: textColor.includes("[")
            ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
            : "#ffffff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex items-center justify-between ${
            isCompact ? "p-2" : "p-4"
          }`}
        >
          <h2 className={`${isCompact ? "text-lg" : "text-xl"} font-semibold`}>
            Menu
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSearchToggle}
              className="p-1 hover:opacity-80 transition-opacity"
              aria-label="Toggle search"
            >
              <Search
                className={`${isCompact ? "h-4 w-4" : "h-5 w-5"}`}
                style={{
                  color: searchIconColor.includes("[")
                    ? searchIconColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
                    : "#ffffff",
                }}
              />
            </button>
            <button onClick={onClose} className="p-1 hover:opacity-80">
              <X
                className={`${isCompact ? "h-5 w-5" : "h-6 w-6"}`}
                style={{
                  color: iconColor.includes("[")
                    ? iconColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
                    : "#ffffff",
                }}
              />
            </button>
          </div>
        </div>

        {isSearchVisible && (
          <div
            className={`${
              isCompact ? "px-2 py-2" : "px-4 py-3"
            } border-b border-white/10`}
          >
            <FullSearchBar
              onSearch={handleSearch}
              iconColor={searchIconColor}
              backgroundColor="bg-white/20"
              textColor={textColor}
              placeholder="Search products..."
              isCustomize={isCustomize}
              containerWidth={menuSize.width}
            />
          </div>
        )}

        <div className={`${isCompact ? "px-2 py-2" : "px-4 py-3"}`}>
          <Navigation
            menuItems={NavMenuItems}
            textColor={textColor}
            orientation="vertical"
            onClick={onClose}
            isCustomize={isCustomize}
            containerWidth={menuSize.width}
          />
          <div className="py-1 overflow-y-auto"></div>
          <Link
            href={isCustomize ? "#" : `/e-commerce/${subdomain}/profile`}
            className={`block py-2 ${
              isCompact ? "text-xs" : "text-sm"
            } hover:underline`}
            style={{
              color: textColor.includes("[")
                ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
                : "#ffffff",
            }}
          >
            Profile
          </Link>
          <Link
            href={isCustomize ? "#" : `/e-commerce/${subdomain}/cart`}
            className={`block py-2 ${
              isCompact ? "text-xs" : "text-sm"
            } hover:underline`}
            style={{
              color: textColor.includes("[")
                ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
                : "#ffffff",
            }}
          >
            Cart
          </Link>
          <Link
            href={isCustomize ? "#" : `/e-commerce/${subdomain}/favorites`}
            className={`block py-2 ${
              isCompact ? "text-xs" : "text-sm"
            } hover:underline`}
            style={{
              color: textColor.includes("[")
                ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
                : "#ffffff",
            }}
          >
            Favorites
          </Link>
        </div>

        <div className="py-2 overflow-y-auto">
          {MobileMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`block ${
                isCompact ? "px-2 py-2 text-xs" : "px-4 py-3 text-sm"
              } hover:bg-white/10 transition-colors`}
              style={{
                color: textColor.includes("[")
                  ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
                  : "#ffffff",
              }}
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
