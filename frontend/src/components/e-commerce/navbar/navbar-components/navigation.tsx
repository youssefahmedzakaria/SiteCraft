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
}) => {
  return (
    <div
      className={`
      ${orientation === "horizontal" ? "flex space-x-6" : "flex flex-col space-y-4"}
      ${className}
    `}
    >
      {menuItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="text-sm hover:underline transition-all"
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
