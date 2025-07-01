"use client";

import { CompanyLogo } from "./footer-components/CompanyLogo";
import { SocialMedia } from "./footer-components/SocialMedia";
import { Copyright } from "./footer-components/Copyright";

interface FooterProps {
  isCustomize?: boolean;
  selectedTab?: "desktop" | "tablet" | "mobile";
  backgroundColor?: string;
  textColor?: string;
  companyLogo?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  companyName?: string;
  aboutLinks?: {
    label: string;
    href: string;
    font?: string;
    fontSize?: string;
    fontWeight?: string;
    fontColor?: string;
    isShown?: boolean;
  }[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    pinterest?: string;
    twitter?: string;
    email?: string;
    [key: string]: string | undefined;
  };
  socialMediaStyles?: {
    iconSize?: number;
    iconColor?: string;
    hoverColor?: string;
  };
  copyrightStyles?: {
    font?: string;
    fontSize?: string;
    fontWeight?: string;
    fontColor?: string;
  };
  copyrightText?: string;
}

export const Footer = ({
  isCustomize = false,
  selectedTab,
  backgroundColor = "bg-white",
  textColor = "text-black",
  companyLogo,
  companyName = "BRAND",
  aboutLinks = [
    {
      label: "Contact Us",
      href: "/contact",
      font: "font-sans",
      fontSize: "text-sm",
      fontWeight: "font-normal",
      fontColor: "text-gray-700",
      isShown: true,
    },
    {
      label: "About Us",
      href: "/about",
      font: "font-sans",
      fontSize: "text-sm",
      fontWeight: "font-normal",
      fontColor: "text-gray-700",
      isShown: true,
    },
    {
      label: "Policies",
      href: "/policies",
      font: "font-sans",
      fontSize: "text-sm",
      fontWeight: "font-normal",
      fontColor: "text-gray-700",
      isShown: true,
    },
  ],
  socialMedia = {
    facebook: "https://facebook.com/yourpage",
    instagram: "https://instagram.com/yourpage",
    youtube: "https://youtube.com/yourpage",
    pinterest: "https://pinterest.com/yourpage",
    twitter: "https://twitter.com/yourpage",
    email: "yourpage@example.com",
  },
  socialMediaStyles = {
    iconSize: 20,
    iconColor: "currentColor",
    hoverColor: "opacity-70",
  },
  copyrightStyles = {
    font: "font-sans",
    fontSize: "text-xs",
    fontWeight: "font-normal",
    fontColor: "text-gray-600",
  },
  copyrightText = `© ${new Date().getFullYear()} ${companyName}`,
}: FooterProps) => {
  // Determine layout based on selectedTab in customize mode
  const shouldShowMobile = isCustomize
    ? selectedTab === "mobile" || selectedTab === "tablet"
    : false;

  return (
    <div
      className={`${
        shouldShowMobile ? "py-4 px-4" : "py-8 md:py-12 px-4 md:px-8 lg:px-16"
      }`}
      style={{
        backgroundColor: backgroundColor?.includes("[")
          ? backgroundColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
          : undefined,
      }}
    >
      {shouldShowMobile ? (
        // Mobile Layout - Vertical Stack
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Logo */}
          <div className="flex justify-center">
            <CompanyLogo
              logo={companyLogo}
              name={companyName}
              textColor={textColor}
              isCustomize={isCustomize}
              selectedTab={selectedTab}
            />
          </div>

          {/* Navigation Links - Vertical */}
          <div className="flex flex-col items-center gap-2">
            {aboutLinks.map(
              (link, index) =>
                link.isShown && (
                  <a
                    key={index}
                    href={isCustomize ? "#" : link.href}
                    className="hover:underline text-center hover:opacity-80 transition-opacity"
                    style={{
                      font: link.font || "font-sans",
                      fontSize: link.fontSize || "text-xs",
                      fontWeight:
                        link.fontWeight?.replace("font-", "") || "normal",
                      color: link.fontColor?.includes("[")
                        ? link.fontColor.split("-[")[1]?.slice(0, -1) ||
                          "#374151"
                        : textColor?.includes("[")
                        ? textColor.split("-[")[1]?.slice(0, -1) || "#374151"
                        : "#374151",
                    }}
                    onClick={
                      isCustomize ? (e) => e.preventDefault() : undefined
                    }
                  >
                    {link.label}
                  </a>
                )
            )}
          </div>

          {/* Social Media */}
          <div className="flex justify-center">
            <SocialMedia
              socialMedia={socialMedia}
              styles={{
                iconSize: Math.max(
                  (socialMediaStyles.iconSize || 20) * 0.9,
                  16
                ),
                iconColor:
                  socialMediaStyles.iconColor || textColor || "currentColor",
                hoverColor: socialMediaStyles.hoverColor || "opacity-70",
              }}
              textColor={textColor}
              isCustomize={isCustomize}
              selectedTab={selectedTab}
            />
          </div>

          {/* Copyright */}
          <div className="text-center mt-2">
            <Copyright
              text={copyrightText}
              styles={{
                font: copyrightStyles.font || "font-sans",
                fontSize: copyrightStyles.fontSize || "text-xs",
                fontWeight: copyrightStyles.fontWeight || "font-normal",
                fontColor:
                  copyrightStyles.fontColor || textColor || "text-gray-600",
              }}
              isCustomize={isCustomize}
              selectedTab={selectedTab}
            />
          </div>
        </div>
      ) : (
        // Desktop Layout
        <>
          <div className="flex flex-row justify-between items-center w-full gap-6">
            {/* Left - Logo */}
            <div className="flex justify-start flex-1">
              <CompanyLogo
                logo={companyLogo}
                name={companyName}
                textColor={textColor}
                isCustomize={isCustomize}
                selectedTab={selectedTab}
              />
            </div>

            {/* Center - Navigation Links */}
            <div className="flex flex-row justify-center items-center gap-8">
              {aboutLinks.map(
                (link, index) =>
                  link.isShown && (
                    <a
                      key={index}
                      href={isCustomize ? "#" : link.href}
                      className={`hover:underline text-center hover:opacity-80 transition-opacity ${
                        link.font || ""
                      } ${link.fontSize || ""}`}
                      style={{
                        fontWeight:
                          link.fontWeight?.replace("font-", "") || "normal",
                        color: link.fontColor?.includes("[")
                          ? link.fontColor.split("-[")[1]?.slice(0, -1) ||
                            "#374151"
                          : textColor?.includes("[")
                          ? textColor.split("-[")[1]?.slice(0, -1) || "#374151"
                          : "#374151",
                      }}
                      onClick={
                        isCustomize ? (e) => e.preventDefault() : undefined
                      }
                    >
                      {link.label}
                    </a>
                  )
              )}
            </div>

            {/* Right - Social Media */}
            <div className="flex justify-end flex-1">
              <SocialMedia
                socialMedia={socialMedia}
                styles={{
                  iconSize: socialMediaStyles.iconSize || 20,
                  iconColor:
                    socialMediaStyles.iconColor || textColor || "currentColor",
                  hoverColor: socialMediaStyles.hoverColor || "opacity-70",
                }}
                textColor={textColor}
                isCustomize={isCustomize}
                selectedTab={selectedTab}
              />
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-4">
            <Copyright
              text={copyrightText}
              styles={{
                font: copyrightStyles.font || "font-sans",
                fontSize: copyrightStyles.fontSize || "text-xs",
                fontWeight: copyrightStyles.fontWeight || "font-normal",
                fontColor:
                  copyrightStyles.fontColor || textColor || "text-gray-600",
              }}
              isCustomize={isCustomize}
              selectedTab={selectedTab}
            />
          </div>
        </>
      )}
    </div>
  );
};
