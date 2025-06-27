// frontend/src/components/sidebar/sidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { sidebarElements } from "@/lib/sidebarElements";
import { SidebarElementComponent } from "./sidebarElementComponent";
import { CornerDownRight } from "lucide-react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isReportsActive = pathname === "/dashboard/analytics/reports";

  return (
    <div>
      {/* Hamburger Button (Mobile Only) */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-logo-left-nav text-logo-txt fixed w-full z-50">
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
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:shadow-none lg:z-30`}
      >
        {/* Logo */}
        <div className="flex justify-center mt-4 lg:mt-1">
          <Link
            href="/dashboard"
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
        <nav className="flex flex-col space-y-2 mt-6">
          {sidebarElements.map((element) => (
            <div key={element.id}>
              {/* Add a divider before Account Settings */}
              {element.id === "10" && (
                <div className="border-t border-primary-foreground my-2 mx-4"></div>
              )}

              <Link href={element.destination} onClick={() => setIsOpen(false)}>
                <SidebarElementComponent element={element} />
              </Link>
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
                      <span>Reports</span>
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
