"use client";

import Image from "next/image";

interface CompanyLogoProps {
  logo?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  name: string;
  textColor: string;
  isCustomize?: boolean;
  selectedTab?: "desktop" | "tablet" | "mobile";
}

export const CompanyLogo = ({
  logo,
  name,
  textColor,
  isCustomize = false,
  selectedTab,
}: CompanyLogoProps) => {
  const shouldShowMobile = isCustomize
    ? selectedTab === "mobile" || selectedTab === "tablet"
    : false;

  return (
    <div className="flex items-center">
      {logo ? (
        <Image
          src={logo.src || "/placeholder.png?height=40&width=40"}
          alt={logo.alt}
          width={shouldShowMobile ? Math.max(logo.width * 0.8, 24) : logo.width}
          height={
            shouldShowMobile ? Math.max(logo.height * 0.8, 24) : logo.height
          }
          className="h-auto"
        />
      ) : (
        <span
          className={`${
            shouldShowMobile ? "text-lg" : "text-2xl"
          } font-bold tracking-wide`}
          style={{
            color: textColor?.includes("[")
              ? textColor.split("-[")[1]?.slice(0, -1) || "#000000"
              : undefined,
          }}
        >
          {name}
        </span>
      )}
    </div>
  );
};
