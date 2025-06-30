"use client"

import type React from "react"
import Link from "next/link"

export interface NavigationProps {
  menuItems: Array<{ label: string; href: string }>
  textColor?: string
  fontFamily?: string
  orientation?: "horizontal" | "vertical"
  className?: string
  onClick?: () => void
  isCustomize?: boolean
  containerWidth?: number
}

const getFontFamily = (fontFamily: string) => {
  switch (fontFamily) {
    case "font-inter":
      return "Inter, sans-serif"
    case "font-roboto":
      return "Roboto, sans-serif"
    case "font-open-sans":
      return "Open Sans, sans-serif"
    case "font-poppins":
      return "Poppins, sans-serif"
    case "font-lato":
      return "Lato, sans-serif"
    default:
      return "system-ui, sans-serif"
  }
}

export const Navigation: React.FC<NavigationProps> = ({
  menuItems,
  textColor,
  fontFamily = "font-sans",
  orientation = "horizontal",
  className = "",
  onClick,
  isCustomize = false,
  containerWidth = 0,
}) => {
  // Responsive to div size when isCustomize is true
  const isCompact = isCustomize && containerWidth > 0 && containerWidth < 768

  // Combine Tailwind responsive classes with div-responsive logic
  const spacing = isCompact ? "space-x-2 sm:space-x-3" : "space-x-4 sm:space-x-6"
  const verticalSpacing = isCompact ? "space-y-1 sm:space-y-2" : "space-y-2 sm:space-y-4"

  return (
    <div
      className={`
      ${orientation === "horizontal" ? `flex ${spacing}` : `flex flex-col ${verticalSpacing}`}
      ${className}
    `}
    >
      {menuItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`${isCompact ? "text-xs sm:text-sm" : "text-sm"} hover:underline transition-all`}
          style={{
            color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
            fontFamily: getFontFamily(fontFamily),
          }}
          onClick={onClick}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}
