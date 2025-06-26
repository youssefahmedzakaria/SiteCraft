'use client'

import  { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { usePathname } from "next/navigation";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar
                  template="template1"
                  brandName="Jewelry"
                  backgroundColor="bg-black/50"
                  textColor="text-white"
                  logo={{
                    src: "/logo.png", 
                    alt: "Custom Logo",
                    width: 50,
                    height: 50
                  }}
                  menuItems={[
                    { label: "Home", href: "/" },
                    { label: "Products", href: "/products" },
                    { label: "About Us", href: "/#about-us" },
                    { label: "Contact Us", href: "/#contact" },
                  ]}
                  iconColor="text-white"
                  dividerColor="border-gray-200"
                  searchIconColor="text-white"
                  fontFamily="font-sans"
                    isRTL={false}
              />    
      <main className="flex-1">{children}</main>
       <Footer
            companyName="Jewelry"
            textColor="text-[#4A102A]"
            companyLogo={{
              src: "/logo.png", 
              alt: "Custom Logo",
              width: 50,
              height: 50
            }}
            aboutLinks={[
              {
                label: "Policies",
                href: "#policies",
                font: "font-serif",
                fontSize: "text-lg",
                fontColor: "text-[#4A102A]"
              },
              {
                label: "About Us",
                href: "#about-us",
                font: "font-serif",
                fontSize: "text-lg",
                fontColor: "text-[#4A102A]"
              },
            ]}
            socialMedia={{
              facebook: "https://facebook.com/amnayahia26",
              instagram: "https://instagram.com/amnayahia26",
              email: "amnayahia26@gmail.com",
            }}
            socialMediaStyles={{
              iconSize: 24,
              iconColor: "text-[#4A102A]",
              hoverColor: "text-[#4A102A]"
            }}
            copyrightStyles={{
              font: "font-sans",
              fontSize: "text-s",
              fontWeight: "font-light",
              fontColor: "text-[#4A102A]"
            }}
            backgroundColor="bg-[#F5ECD5]"
          />
    </div>
  );
}