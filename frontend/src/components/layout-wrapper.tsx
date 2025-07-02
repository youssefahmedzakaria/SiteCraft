"use client";

import { SiteCraftNavbar } from "@/components/SiteCraft/siteCraftNavbar";
import { SiteCraftFooter } from "@/components/SiteCraft/siteCraftFooter";
import { usePathname } from "next/navigation";
import Navbar from "./e-commerce/navbar/Navbar";
import { Footer } from "./e-commerce/footer/Footer";
import { useEffect, useState } from "react";
import {
  FooterCustomizationAttributes,
  HeaderCustomizationAttributes,
} from "@/lib/customization";
import React from "react";

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

  const [headerAttributes, setHeaderAttributes] =
    useState<HeaderCustomizationAttributes>({
      template: "template1",
      brandName: "Brand Name",
      backgroundColor: "bg-[#00000080]", // bg-black/50
      textColor: "text-[#FFFFFF]", // text-white
      logo: {
        src: "/placeholder.png",
        alt: "Custom Logo",
        width: 50,
        height: 50,
      },
      menuItems: [
        { label: "Home", isShown: true },
        { label: "Products", isShown: true },
        { label: "Categories", isShown: true },
        { label: "About Us", isShown: true },
        { label: "Contact Us", isShown: true },
      ],
      iconColor: "text-[#FFFFFF]", // text-white
      dividerColor: "border-[#E5E7EB]", // border-gray-200
      fontFamily: "font-sans",
    });
  const [footerAttributes, setFooterAttributes] =
    useState<FooterCustomizationAttributes>({
      brandName: "Brand Name",
      backgroundColor: "bg-[#FFFFFF]",
      textColor: "text-[#000000]",
      logo: {
        src: "/placeholder.png",
        alt: "Brand Logo",
        size: "24",
      },
      aboutLinks: [
        {
          label: "Contact Us",
          href: `/e-commerce/${subdomain}/#contact`,
          font: "font-serif",
          fontSize: "text-lg",
          fontColor: "text-[#000000]",
          isShown: true,
        },
        {
          label: "About Us",
          href: `/e-commerce/${subdomain}/#about`,
          font: "font-serif",
          fontSize: "text-lg",
          fontColor: "text-[#000000]",
          isShown: true,
        },
        {
          label: "Policies",
          href: `/e-commerce/${subdomain}/#policies`,
          font: "font-serif",
          fontSize: "text-lg",
          fontColor: "text-[#000000]",
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://facebook.com/yourpage",
        instagram: "https://instagram.com/yourpage",
      },
      socialMediaStyles: {
        iconSize: 20,
        iconColor: "text-[#000000]",
        hoverColor: "text-[#000000]",
      },
      copyrightStyles: {
        font: "font-sans",
        fontSize: "text-sm",
        fontWeight: "font-light",
        fontColor: "text-[#000000]",
      },
    });
  const [isLoading, setIsLoading] = useState(true);
  const [isExist, setIsExist] = useState(false);

  if (isEcommercePage) {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/customize/getTemplateBySubdomain/" + subdomain,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const responseStore = await fetch(
          "http://localhost:8080/api/store/getStoreSettings",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        const dataStore = await responseStore.json();
        console.log("fetched template", data);
        console.log("fetched store", dataStore);
        if (
          data.success &&
          data["Customized Template"] &&
          dataStore.success &&
          dataStore.store
        ) {
          setIsExist(true);
          // ---------------------Customize Template----------------------------------
          const sortedTemplate = [...data["Customized Template"]].sort(
            (a, b) => a.index - b.index
          );
          sortedTemplate.forEach((section: any, idx: number) => {
            switch (section.title) {
              case "Header&Menu":
                setHeaderAttributes(section.value);
                break;
              case "Footer":
                setFooterAttributes(section.value);
                break;
            }
          });
          // ---------------------Store Settings----------------------------------
          // Update header logo
          setHeaderAttributes((prev) => ({
            ...prev,
            brandName: dataStore.store.storeName || prev.brandName,
            logo: {
              ...prev.logo,
              src:
                dataStore.store.logo && dataStore.store.logo !== ""
                  ? dataStore.store.logo
                  : "/placeholder.png",
            },
          }));
          setFooterAttributes((prev) => ({
            ...prev,
            brandName: dataStore.store.storeName || prev.brandName,
            logo: {
              ...prev.logo,
              src:
                dataStore.store.logo && dataStore.store.logo !== ""
                  ? dataStore.store.logo
                  : "/placeholder.png",
            },
            socialMedia: {
              facebook:
                dataStore.store.socialMediaAccounts?.find(
                  (acc: any) => acc.name.toLowerCase() === "facebook"
                )?.link || prev.socialMedia.facebook,
              instagram:
                dataStore.store.socialMediaAccounts?.find(
                  (acc: any) => acc.name.toLowerCase() === "instagram"
                )?.link || prev.socialMedia.instagram,
            },
          }));
        }
      } catch (error) {
        console.error("Failed to fetch template:", error);
      }
    };

    useEffect(() => {
      const fetchAll = async () => {
        await Promise.all([fetchTemplate()]);
        setIsLoading(false);
      };
      fetchAll();
    }, []);

    if (isLoading) {
      return (
        <div className="h-screen flex-1 flex items-center justify-center">
          <span>Loading customization...</span>
        </div>
      );
    }

    if (!isExist) {
      return (
        <div className="h-screen flex-1 flex items-center justify-center">
          <span>Subdomain not found</span>
        </div>
      );
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isAuthPage && <SiteCraftNavbar />}
      {isEcommercePage && (
        <Navbar
          template="template8"
          brandName="Jewelry"
          backgroundColor="bg-[#ffffff]"
          textColor="text-[#000000]"
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
          iconColor="text-[#0000ff]"
          dividerColor="border-[#e5e5e5]"
          fontFamily="font-sans"
        />
      )}
      <main className="flex-1">{children}</main>
      {!isAuthPage && <SiteCraftFooter />}
      {isEcommercePage && (
        <Footer
          companyName={footerAttributes.brandName}
          textColor={footerAttributes.textColor}
          companyLogo={{
            src: footerAttributes.logo.src || "/placeholder.png",
            alt: footerAttributes.logo.alt,
            width: parseInt(footerAttributes.logo.size) || 50,
            height: parseInt(footerAttributes.logo.size) || 50,
          }}
          aboutLinks={footerAttributes.aboutLinks}
          socialMedia={footerAttributes.socialMedia}
          socialMediaStyles={footerAttributes.socialMediaStyles}
          copyrightStyles={footerAttributes.copyrightStyles}
          backgroundColor={footerAttributes.backgroundColor}
        />
      )}
    </div>
  );
}
