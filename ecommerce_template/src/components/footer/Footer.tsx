import { CompanyLogo } from "../footer/footer-components/CompanyLogo";
import { AboutLinks } from"../footer/footer-components/AboutLinks";
import { Copyright } from "../footer/footer-components/Copyright";
import { SocialMedia } from "../footer/footer-components/SocialMedia";
interface FooterProps {
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
  backgroundColor = "bg-white",
  textColor = "text-black",
  companyLogo = {
    src: "/logo.png",
    alt: "Company Logo",
    width: 50,
    height: 50
  },
  companyName = "BRAND",
  aboutLinks = [
    { 
      label: "Contact Us", 
      href: "/contact",
      font: "font-sans",
      fontSize: "text-sm md:text-base",
      fontWeight: "font-normal",
      fontColor: "text-gray-700"
    },
    { 
      label: "About Us", 
      href: "/about",
      font: "font-sans",
      fontSize: "text-sm md:text-base",
      fontWeight: "font-normal",
      fontColor: "text-gray-700"
    },
    { 
      label: "Policies", 
      href: "/policies",
      font: "font-sans",
      fontSize: "text-sm md:text-base",
      fontWeight: "font-normal",
      fontColor: "text-gray-700"
    }
  ],
  socialMedia = {
    facebook: "https://facebook.com/yourpage",
    instagram: "https://instagram.com/yourpage",
    youtube: "https://youtube.com/yourpage",
    pinterest: "https://pinterest.com/yourpage",
    twitter: "https://twitter.com/yourpage",
    email: "yourpage@example.com"
  },
  socialMediaStyles = {
    iconSize: 20,
    iconColor: "currentColor",
    hoverColor: "opacity-70"
  },
  copyrightStyles = {
    font: "font-sans",
    fontSize: "text-xs md:text-sm",
    fontWeight: "font-normal",
    fontColor: "text-gray-600"
  },
  copyrightText = `© ${new Date().getFullYear()} ${companyName}`
}: FooterProps) => {
  return (
    <div className={`py-8 md:py-12 px-4 md:px-8 lg:px-16 ${backgroundColor} mt-12 md:mt-24`}>
      {/* Main content row */}
      <div className="flex flex-col items-center md:flex-row justify-between w-full gap-6 md:gap-0">
        {/* Left - Logo - Centered on mobile */}
        <div className="w-full flex justify-center md:justify-start md:flex-1">
          <CompanyLogo logo={companyLogo} name={companyName} textColor={textColor} />
        </div>
        
        {/* Center - Navigation Links - Stacked on mobile */}
        <div className="w-full flex justify-center md:flex-1">
          <AboutLinks links={aboutLinks} />
        </div>
        
        {/* Right - Social Media - Centered on mobile */}
        <div className="w-full flex justify-center md:justify-end md:flex-1">
          <SocialMedia 
            socialMedia={socialMedia} 
            styles={{
              iconSize: socialMediaStyles.iconSize || 20,
              iconColor: socialMediaStyles.iconColor || "currentColor",
              hoverColor: socialMediaStyles.hoverColor || "opacity-70"
            }}
            textColor={textColor}
          />
        </div>
      </div>

      {/* Copyright - Adjusted for mobile */}
      <Copyright 
        text={copyrightText}
        styles={{
          font: copyrightStyles.font || "font-sans",
          fontSize: copyrightStyles.fontSize || "text-xs md:text-sm",
          fontWeight: copyrightStyles.fontWeight || "font-normal",
          fontColor: copyrightStyles.fontColor || "text-gray-600"
        }}
      />
    </div>
  );
};