"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

interface LinkItem {
  label: string
  href: string
  font?: string
  fontSize?: string
  fontWeight?: string
  fontColor?: string
}

interface AboutLinksProps {
  links: LinkItem[]
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

export const AboutLinks = ({ links, isCustomize = false, containerWidth = 0 }: AboutLinksProps) => {
  // For div responsiveness when isCustomize is true
  const isMobileDiv = isCustomize && containerWidth > 0 && containerWidth < 640

  // For screen responsiveness - track screen size with proper initialization
  const [isClient, setIsClient] = useState(false)
  const [screenWidth, setScreenWidth] = useState(1920)

  useEffect(() => {
    setIsClient(true)
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth)
    }

    updateScreenWidth()
    window.addEventListener("resize", updateScreenWidth)
    return () => window.removeEventListener("resize", updateScreenWidth)
  }, [])

  const isScreenMobile = isClient && screenWidth < 640
  const shouldShowMobile = isCustomize ? isMobileDiv || isScreenMobile : isScreenMobile

  const getFontSize = (fontSize: string, isCompact = false) => {
    if (fontSize?.includes("text-")) {
      const sizeMap: Record<string, string> = {
        "text-xs": isCompact ? "0.625rem" : "0.75rem",
        "text-sm": isCompact ? "0.75rem" : "0.875rem",
        "text-base": isCompact ? "0.875rem" : "1rem",
        "text-lg": isCompact ? "1rem" : "1.125rem",
        "text-xl": isCompact ? "1.125rem" : "1.25rem",
        "text-2xl": isCompact ? "1.25rem" : "1.5rem",
        "text-3xl": isCompact ? "1.5rem" : "1.875rem",
        "text-4xl": isCompact ? "1.875rem" : "2.25rem",
      }
      return sizeMap[fontSize] || (isCompact ? "0.75rem" : "0.875rem")
    }
    return fontSize || (isCompact ? "0.75rem" : "0.875rem")
  }

  return (
    <div
      className={`flex ${shouldShowMobile ? "flex-col" : "flex-col sm:flex-row"} justify-center items-center ${shouldShowMobile ? "gap-2" : "gap-4 md:gap-8"} w-full`}
    >
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className="hover:underline text-center hover:opacity-80 transition-opacity"
          style={{
            fontFamily: link.font ? getFontFamily(link.font) : undefined,
            fontSize: getFontSize(link.fontSize || "text-sm", shouldShowMobile),
            fontWeight: link.fontWeight?.replace("font-", "") || "normal",
            color: link.fontColor?.includes("[") ? link.fontColor.split("-[")[1]?.slice(0, -1) || "#374151" : "#374151",
          }}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
