"use client";

import { SiteCraftNavbar } from "@/components/SiteCraft/siteCraftNavbar";
import { SiteCraftFooter } from "@/components/SiteCraft/siteCraftFooter";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./e-commerce/navbar/Navbar";
import { Footer } from "./e-commerce/footer/Footer";
import { useEffect, useState } from "react";
import {
  FooterCustomizationAttributes,
  HeaderCustomizationAttributes,
} from "@/lib/customization";
import React from "react";
import { TemplateProvider } from "@/lib/templates";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
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

  const isEcommercePage = pathname?.startsWith("/e-commerce");

  const [initialColors, setInitialColors] = useState({
    primary: "#000000",
    secondary: "#000000",
    accent: "#000000",
  });

  const [headerAttributes, setHeaderAttributes] =
    useState<HeaderCustomizationAttributes>({
      template: "template1",
      brandName: "Brand Name",
      backgroundColor: `bg-[${initialColors.primary}]`, // bg-black/50
      textColor: `text-[${initialColors.secondary}]`, // text-white
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
      iconColor: `text-[${initialColors.secondary}]`, // text-white
      dividerColor: `border-[${initialColors.secondary}]`, // border-gray-200
      fontFamily: "font-sans",
    });
  const [footerAttributes, setFooterAttributes] =
    useState<FooterCustomizationAttributes>({
      brandName: "Brand Name",
      backgroundColor: `bg-[${initialColors.primary}]`,
      textColor: `text-[${initialColors.secondary}]`,
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
          fontColor: `text-[${initialColors.secondary}]`,
          isShown: true,
        },
        {
          label: "About Us",
          href: `/e-commerce/${subdomain}/#about`,
          font: "font-serif",
          fontSize: "text-lg",
          fontColor: `text-[${initialColors.secondary}]`,
          isShown: true,
        },
        {
          label: "Policies",
          href: `/e-commerce/${subdomain}/#policies`,
          font: "font-serif",
          fontSize: "text-lg",
          fontColor: `text-[${initialColors.secondary}]`,
          isShown: true,
        },
      ],
      socialMedia: {
        facebook: "https://facebook.com/yourpage",
        instagram: "https://instagram.com/yourpage",
      },
      socialMediaStyles: {
        iconSize: 20,
        iconColor: `text-[${initialColors.secondary}]`,
        hoverColor: `text-[${initialColors.accent}]`,
      },
      copyrightStyles: {
        font: "font-sans",
        fontSize: "text-sm",
        fontWeight: "font-light",
        fontColor: `text-[${initialColors.secondary}]`,
      },
    });
  const [isLoading, setIsLoading] = useState(true);
  const [isExist, setIsExist] = useState(false);

  // Handle search from navbar
  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Navigate to products page with search query
      router.push(
        `/e-commerce/${subdomain}/products?search=${encodeURIComponent(
          query.trim()
        )}`
      );
    }
  };

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
        const responseSubdomain = await fetch(
          "http://localhost:8080/api/store/getStoreId/" + subdomain,
          {
            method: "GET",
            credentials: "include",
          }
        );
        console.log("fetched subdomain", responseSubdomain);
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
              case "Header":
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
              ...(prev.socialMedia || {}),
              facebook:
                dataStore.store.socialMediaAccounts?.find(
                  (acc: any) => acc.name.toLowerCase() === "facebook"
                )?.link ||
                prev.socialMedia?.facebook ||
                "",
              instagram:
                dataStore.store.socialMediaAccounts?.find(
                  (acc: any) => acc.name.toLowerCase() === "instagram"
                )?.link ||
                prev.socialMedia?.instagram ||
                "",
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
    <TemplateProvider>
      <div className="relative flex min-h-screen flex-col">
        {!isAuthPage && <SiteCraftNavbar />}
        {isEcommercePage && (
          <Navbar
            template={headerAttributes?.template}
            brandName={headerAttributes?.brandName}
            backgroundColor={headerAttributes?.backgroundColor}
            textColor={headerAttributes?.textColor}
            logo={headerAttributes.logo}
            menuItems={headerAttributes.menuItems.map((item) => {
              // Map menu items to their correct URLs
              let href = "#";
              switch (item.label.toLowerCase()) {
                case "home":
                  href = `/e-commerce/${subdomain}`;
                  break;
                case "products":
                  href = `/e-commerce/${subdomain}/products`;
                  break;
                case "categories":
                  href = `/e-commerce/${subdomain}/categories`;
                  break;
                case "about us":
                  href = `/e-commerce/${subdomain}/#about`;
                  break;
                case "contact us":
                  href = `/e-commerce/${subdomain}/#contact`;
                  break;
                default:
                  href = `/e-commerce/${subdomain}`;
              }
              return {
                label: item.label,
                href: href,
                isShown: item.isShown,
              };
            })}
            iconColor={headerAttributes.iconColor}
            dividerColor={headerAttributes.dividerColor}
            fontFamily={headerAttributes.fontFamily}
            onSearch={handleSearch}
          />
        )}
        <main className="flex-1">{children}</main>
        {!isAuthPage && <SiteCraftFooter />}
        {isEcommercePage && (
          <Footer
            isCustomize={false}
            companyName={footerAttributes.brandName}
            textColor={footerAttributes.textColor}
            companyLogo={{
              src: footerAttributes.logo.src || "/placeholder.png",
              alt: footerAttributes.logo.alt,
              width: parseInt(footerAttributes.logo.size) || 50,
              height: parseInt(footerAttributes.logo.size) || 50,
            }}
            aboutLinks={footerAttributes.aboutLinks.map((link) => {
              // Ensure footer links have the correct URLs with subdomain
              let href = link.href;
              if (!href.startsWith("http") && !href.startsWith("mailto:")) {
                // Map specific footer links to their correct URLs
                switch (link.label.toLowerCase()) {
                  case "contact us":
                    href = `/e-commerce/${subdomain}/#contact`;
                    break;
                  case "about us":
                    href = `/e-commerce/${subdomain}/#about`;
                    break;
                  case "policies":
                    href = `/e-commerce/${subdomain}/#policies`;
                    break;
                  default:
                    href = `/e-commerce/${subdomain}`;
                }
              }
              return {
                ...link,
                href: href,
              };
            })}
            socialMedia={footerAttributes.socialMedia}
            socialMediaStyles={footerAttributes.socialMediaStyles}
            copyrightStyles={footerAttributes.copyrightStyles}
            backgroundColor={footerAttributes.backgroundColor}
          />
        )}
      </div>
    </TemplateProvider>
  );
}
