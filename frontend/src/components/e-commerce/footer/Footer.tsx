"use client";

import { CompanyLogo } from "./footer-components/CompanyLogo";
import { SocialMedia } from "./footer-components/SocialMedia";
import { Copyright } from "./footer-components/Copyright";
import { AboutLinks } from "./footer-components/AboutLinks";

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
      href: "/Home/#contact",
      font: "font-sans",
      fontSize: "text-sm",
      fontWeight: "font-normal",
      fontColor: "text-gray-700",
      isShown: true,
    },
    {
      label: "About Us",
      href: "/Home/#about",
      font: "font-sans",
      fontSize: "text-sm",
      fontWeight: "font-normal",
      fontColor: "text-gray-700",
      isShown: true,
    },
    {
      label: "Policies",
      href: "/Home/#policies",
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
    hoverColor: "text-primary-500",
  },
  copyrightStyles = {
    font: "font-sans",
    fontSize: "text-xs",
    fontWeight: "font-normal",
    fontColor: "text-gray-600",
  },
  copyrightText = `© ${new Date().getFullYear()} ${companyName}`,
}: FooterProps) => {
  return (
    <div
      className={
        "py-8 md:py-12 px-4 md:px-8 lg:px-16"
      }
      style={{
        backgroundColor: backgroundColor?.includes("[")
          ? backgroundColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
          : undefined,
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
        {/* Left - Logo */}
        <div className="flex justify-center md:justify-start flex-1 mb-4 md:mb-0">
          <CompanyLogo
            logo={companyLogo}
            name={companyName}
            textColor={textColor}
            isCustomize={isCustomize}
            selectedTab={selectedTab}
          />
        </div>

        {/* Center - About Links (now using AboutLinks component) */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8 mb-4 md:mb-0">
          <AboutLinks
            links={aboutLinks}
            isCustomize={isCustomize}
          />
        </div>

        {/* Right - Social Media */}
        <div className="flex justify-center md:justify-end flex-1">
          <SocialMedia
            socialMedia={socialMedia}
            styles={{
              iconSize: socialMediaStyles.iconSize || 20,
              iconColor:
                socialMediaStyles.iconColor || textColor || "#374151",
              hoverColor: socialMediaStyles.hoverColor || textColor || "#3b82f6",
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
    </div>
  );
};
