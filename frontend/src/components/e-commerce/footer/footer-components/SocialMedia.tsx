"use client"

import { Facebook, Instagram, Mail, Twitter, Youtube } from "lucide-react"

interface SocialMediaProps {
  socialMedia: Record<string, string | undefined>
  styles?: {
    iconSize?: number
    iconColor?: string
    hoverColor?: string
  }
  textColor?: string
  className?: string
  isCustomize?: boolean
  selectedTab?: "desktop" | "tablet" | "mobile"
}

export const SocialMedia = ({
  socialMedia,
  styles = {
    iconSize: 24,
    iconColor: "text-gray-600",
    hoverColor: "text-primary-500",
  },
  textColor = "text-black",
  className = "",
  isCustomize = false,
  selectedTab,
}: SocialMediaProps) => {
  const shouldShowMobile = isCustomize ? selectedTab === "mobile" || selectedTab === "tablet" : false

  const iconComponents = {
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    email: Mail,
  }

  const iconSize = shouldShowMobile ? Math.max((styles.iconSize || 24) * 0.8, 16) : styles.iconSize || 24

  // Parse colors properly
  const getColor = (colorProp: string) => {
    if (colorProp?.includes("[")) {
      return colorProp.split("-[")[1]?.slice(0, -1) || "#374151"
    }
    return colorProp || "#374151"
  }

  const iconColor = getColor(styles.iconColor || textColor || "text-gray-600")
  const hoverColor = getColor(styles.hoverColor ||textColor|| "text-gray-400")

  return (
    <div className={`flex ${shouldShowMobile ? "gap-3" : "gap-4 md:gap-6"} ${className}`}>
      {Object.entries(socialMedia).map(([platform, url]) => {
        if (!url) return null

        const Icon = iconComponents[platform as keyof typeof iconComponents]
        if (!Icon) return null

        const iconElement = (
          <Icon
            size={iconSize}
            className="transition-colors duration-200"
            style={{
              color: iconColor,
            }}
            onMouseEnter={(e) => {
              if (!isCustomize) {
                e.currentTarget.style.color = hoverColor
              }
            }}
            onMouseLeave={(e) => {
              if (!isCustomize) {
                e.currentTarget.style.color = iconColor
              }
            }}
          />
        )

        if (platform === "email") {
          return (
            <a
              key={platform}
              href={isCustomize ? "#" : `mailto:${url}`}
              rel="noopener noreferrer"
              aria-label={`Email ${url}`}
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
              onClick={isCustomize ? (e) => e.preventDefault() : undefined}
            >
              {iconElement}
            </a>
          )
        }

        return (
          <a
            key={platform}
            href={isCustomize ? "#" : url}
            target={isCustomize ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={`Visit our ${platform}`}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
            onClick={isCustomize ? (e) => e.preventDefault() : undefined}
          >
            {iconElement}
          </a>
        )
      })}
    </div>
  )
}
