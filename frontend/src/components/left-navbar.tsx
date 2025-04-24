"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

export function LeftNavbar() {
  return (
      <aside className="w-80 space-y-1 bg-logo-left-nav text-logo-txt pt-1 fixed h-full">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className=" transition-colors hover:opacity-90">
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
        <nav className="flex flex-col space-y-4 mt-6">
          <Link href="/login">
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex justify-start pl-4"
            >
              <Image 
                src="/icons/home.svg" 
                alt="Shipping Icon" 
                width={20} 
                height={20} 
              />
              Overview
            </Button>
          </Link>
          <Link href="/login">
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex justify-start pl-4"
            >
              <Image 
                src="/icons/template.svg" 
                alt="Shipping Icon" 
                width={20} 
                height={20} 
              />
              Customize Template
            </Button>
          </Link>
          <Link href="/dashboard/categories">
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex justify-start pl-4"
            >
              <Image 
                src="/icons/category.svg" 
                alt="Shipping Icon" 
                width={20} 
                height={20} 
              />
              Categories
            </Button>
          </Link>
          <Link href="/dashboard/products">
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex justify-start pl-4"
            >
              <Image 
                src="/icons/products.svg" 
                alt="Shipping Icon" 
                width={20} 
                height={20} 
              />
              Products
            </Button>
          </Link>
          <Link href="/login">
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex justify-start pl-4"
            >
              <Image 
                src="/icons/orders.svg" 
                alt="Shipping Icon" 
                width={20} 
                height={20} 
              />
              Orders
            </Button>
          </Link>
          <Link href="/login">
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex justify-start pl-4"
            >
              <Image 
                src="/icons/customers.svg" 
                alt="Shipping Icon" 
                width={20} 
                height={20} 
              />
              Customers
            </Button>
          </Link>
          <Link href="/login">
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex justify-start pl-4"
            >
              <Image 
                src="/icons/analytics.svg" 
                alt="Shipping Icon" 
                width={20} 
                height={20} 
              />
              Analytics
            </Button>
          </Link>
          <Link href="/login">
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex justify-start pl-4"
            >
              <Image 
                src="/icons/info.svg" 
                alt="Shipping Icon" 
                width={20} 
                height={20} 
              />
              Store Info
            </Button>
          </Link>
          <Link href="/login">
            <Button 
              variant="ghost"
              className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex justify-start pl-4"
            >
              <Image 
                src="/icons/shipping.svg" 
                alt="Shipping Icon" 
                width={20} 
                height={20} 
              />
              Shipping Info
            </Button>
          </Link>
        </nav>
      </aside>
  );
}