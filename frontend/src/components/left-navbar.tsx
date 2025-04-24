"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function LeftNavbar() {
  const [isOpen, setIsOpen] = useState(false);

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
      ></div>

      <aside className={`fixed h-full w-64 md:w-80 bg-logo-left-nav text-logo-txt pt-1 space-y-1 transition-transform duration-300 ease-in-out shadow-lg z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:shadow-none lg:z-30`}>
        {/* Logo */}
        <div className="flex justify-center mt-4 lg:mt-1">
          <Link href="/" className="transition-colors hover:opacity-90">
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
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex items-center justify-start pl-4 gap-2"
            >
              <Image 
                src="/icons/home.svg" 
                alt="Overview Icon" 
                width={20} 
                height={20} 
              />
              <span>Overview</span>
            </Button>
          </Link>
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex items-center justify-start pl-4 gap-2"
            >
              <Image 
                src="/icons/template.svg" 
                alt="Template Icon" 
                width={20} 
                height={20} 
              />
              <span>Customize Template</span>
            </Button>
          </Link>
          <Link href="/dashboard/categories" onClick={() => setIsOpen(false)}>
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex items-center justify-start pl-4 gap-2"
            >
              <Image 
                src="/icons/category.svg" 
                alt="Categories Icon" 
                width={20} 
                height={20} 
              />
              <span>Categories</span>
            </Button>
          </Link>
          <Link href="/dashboard/products" onClick={() => setIsOpen(false)}>
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex items-center justify-start pl-4 gap-2"
            >
              <Image 
                src="/icons/products.svg" 
                alt="Products Icon" 
                width={20} 
                height={20} 
              />
              <span>Products</span>
            </Button>
          </Link>
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex items-center justify-start pl-4 gap-2"
            >
              <Image 
                src="/icons/orders.svg" 
                alt="Orders Icon" 
                width={20} 
                height={20} 
              />
              <span>Orders</span>
            </Button>
          </Link>
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex items-center justify-start pl-4 gap-2"
            >
              <Image 
                src="/icons/customers.svg" 
                alt="Customers Icon" 
                width={20} 
                height={20} 
              />
              <span>Customers</span>
            </Button>
          </Link>
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex items-center justify-start pl-4 gap-2"
            >
              <Image 
                src="/icons/analytics.svg" 
                alt="Analytics Icon" 
                width={20} 
                height={20} 
              />
              <span>Analytics</span>
            </Button>
          </Link>
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex items-center justify-start pl-4 gap-2"
            >
              <Image 
                src="/icons/info.svg" 
                alt="Store Info Icon" 
                width={20} 
                height={20} 
              />
              <span>Store Info</span>
            </Button>
          </Link>
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex items-center justify-start pl-4 gap-2"
            >
              <Image 
                src="/icons/shipping.svg" 
                alt="Shipping Icon" 
                width={20} 
                height={20} 
              />
              <span>Shipping Info</span>
            </Button>
          </Link>
        </nav>
      </aside>
    </div>
  );
}