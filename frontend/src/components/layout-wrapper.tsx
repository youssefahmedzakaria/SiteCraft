"use client";

import { SiteCraftNavbar } from "@/components/SiteCraft/siteCraftNavbar";
import { SiteCraftFooter } from "@/components/SiteCraft/siteCraftFooter";
import { usePathname } from "next/navigation";
import Navbar from "./e-commerce/navbar/Navbar";
import { Footer } from "./e-commerce/footer/Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const subdomain = pathSegments[2];

  const isAuthPage =
    pathname?.includes("/login") ||
    pathname?.includes("/signup") ||
    pathname?.includes("/dashboard") ||
    pathname?.includes("/branding") ||
    pathname?.includes("/templates") ||
    pathname?.includes("/forgot-password") ||
    pathname?.includes("/e-commerce");

  const isEcommercePage = pathname?.includes("/e-commerce");
  return (
    <div className="relative flex min-h-screen flex-col">
      {!isAuthPage && <SiteCraftNavbar />}
      {isEcommercePage && (
        <Navbar
          template="template2"
          brandName="Jewelry"
          backgroundColor="bg-black/50"
          textColor="text-white"
          logo={{
            src: "/logo.png",
            alt: "Custom Logo",
            width: 50,
            height: 50,
          }}
          menuItems={[
            { label: "Home", href: `/e-commerce/${subdomain}` },
            { label: "Products", href: `/e-commerce/${subdomain}/products` },
            { label: "About Us", href: `/e-commerce/${subdomain}/#about` },
            { label: "Contact Us", href: `/e-commerce/${subdomain}/#contact` },
          ]}
          iconColor="text-white"
          dividerColor="border-gray-200"
          searchIconColor="text-white"
          fontFamily="font-sans"
        />
      )}
      <main className="flex-1">{children}</main>
      {!isAuthPage && <SiteCraftFooter />}
      {isEcommercePage && (
        <Footer
          companyName="Jewelry"
          textColor="text-black"
          companyLogo={{
            src: "/logo.png",
            alt: "Custom Logo",
            width: 50,
            height: 50,
          }}
          aboutLinks={[
            {
              label: "Policies",
              href: `/e-commerce/${subdomain}/#policies`,
              font: "font-serif",
              fontSize: "text-lg",
              fontColor: "text-black",
              isShown: true,
            },
            {
              label: "About Us",
              href: `/e-commerce/${subdomain}/#about`,
              font: "font-serif",
              fontSize: "text-lg",
              fontColor: "text-black",
              isShown: true,
            },
          ]}
          socialMedia={{
            facebook: "https://facebook.com/amnayahia26",
            instagram: "https://instagram.com/amnayahia26",
            email: "amnayahia26@gmail.com",
          }}
          socialMediaStyles={{
            iconSize: 24,
            iconColor: "text-black",
            hoverColor: "text-black",
          }}
          copyrightStyles={{
            font: "font-sans",
            fontSize: "text-s",
            fontWeight: "font-light",
            fontColor: "text-black",
          }}
          backgroundColor="bg-white"
        />
      )}
    </div>
  );
}
