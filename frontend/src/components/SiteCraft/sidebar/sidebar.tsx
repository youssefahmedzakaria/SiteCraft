// frontend/src/components/sidebar/sidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { getFilteredSidebarElements } from "@/lib/sidebarElements";
import { SidebarElementComponent } from "./sidebarElementComponent";
import { CornerDownRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/contexts/translation-context";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { t, isRTL } = useTranslation();

  const isReportsActive = pathname === "/dashboard/analytics/reports";
  
  // Filter sidebar elements based on user role
  const filteredSidebarElements = getFilteredSidebarElements(user?.role || null);

  // Sidebar positioning classes
  const sidebarPosition = isRTL
    ? 'right-0 left-auto'
    : 'left-0 right-auto';
  const sidebarTranslate = isRTL
    ? (isOpen ? 'translate-x-0' : 'translate-x-full')
    : (isOpen ? 'translate-x-0' : '-translate-x-full');
  const sidebarLgPosition = isRTL
    ? 'lg:right-0 lg:left-auto'
    : 'lg:left-0 lg:right-auto';

  return (
    <div>
      {/* Hamburger Button (Mobile Only) */}
      <div className={`lg:hidden flex items-center justify-between px-4 py-2 bg-logo-left-nav text-logo-txt fixed w-full z-50 ${isRTL ? 'right-0 left-auto' : 'left-0 right-auto'}`}>
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="SiteCraft Logo" width={28} height={28} />
          <Image src="/font.png" alt="SiteCraft" width={100} height={20} />
        </Link>
        <Button
          className="bg-logo-left-nav text-logo-txt hover:text-logo-txt hover:bg-logo-dark-button-hover"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed h-full w-64 md:w-80 bg-logo-left-nav text-logo-txt pt-1 space-y-1 transition-transform duration-300 ease-in-out shadow-lg z-50
          ${sidebarPosition} ${sidebarTranslate} ${sidebarLgPosition} lg:translate-x-0 lg:shadow-none lg:z-30`}
      >
        {/* Logo */}
        <div className="flex justify-center mt-4 lg:mt-1">
          <Link
            href="http://localhost:3000/"
            className="transition-colors hover:opacity-90"
          >
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="SiteCraft Logo"
                width={32}
                height={32}
                className="h-6 w-auto object-contain"
              />
              <Image
                src="/font.png"
                alt="SiteCraft"
                width={120}
                height={24}
                className="h-18 w-auto object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-1">
          {filteredSidebarElements.map((element, index) => (
            <div key={element.id}>
              {/* Add a divider before Logout button for all users */}
              {element.titleKey === 'sidebar.logOut' && (
                <div className="border-t border-primary-foreground my-2 mx-4"></div>
              )}

              {/* Handle logout differently - don't wrap in Link */}
              {element.titleKey === 'sidebar.logOut' ? (
                <div onClick={() => setIsOpen(false)}>
                  <SidebarElementComponent element={{...element, title: t(element.titleKey)}} />
                </div>
              ) : (
                <Link href={element.destination} onClick={() => setIsOpen(false)}>
                  <SidebarElementComponent element={{...element, title: t(element.titleKey)}} />
                </Link>
              )}
              
              {/* Only show Reports submenu if Analytics is visible and user is on analytics page */}
              {element.destination === "/dashboard/analytics" &&
                pathname.startsWith("/dashboard/analytics") && (
                  <Link
                    href="/dashboard/analytics/reports"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center ml-8 mt-1 mr-1 py-2 text-sm font-medium hover:bg-logo-light-button-hover ${
                      isReportsActive
                        ? " text-logo-txt-hover"
                        : "text-primary-foreground hover:text-logo-txt-hover"
                    } rounded px-2 py-1 space-x-2`}
                  >
                    <div className="flex items-center space-x-2">
                      <CornerDownRight size={18} />
                      <span>{t('sidebar.reports')}</span>
                    </div>
                  </Link>
                )}
            </div>
          ))}
        </nav>
      </aside>
    </div>
  );
}
