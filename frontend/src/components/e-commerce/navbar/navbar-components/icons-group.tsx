"use client"
import type React from "react"
import { User, ShoppingBag, Heart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface IconsGroupProps {
  iconColor?: string
  showLabels?: boolean
  textColor?: string
  orientation?: "horizontal" | "vertical"
  isCustomize?: boolean
  containerWidth?: number
}

export const IconsGroup: React.FC<IconsGroupProps> = ({
  iconColor = "text-white",
  showLabels = false,
  textColor = "text-white",
  orientation = "horizontal",
  isCustomize = false,
  containerWidth = 0,
}) => {
  const path = usePathname()
  const pathSegments = path.split("/")
  const subdomain = pathSegments[2]

  // Responsive to div size when isCustomize is true
  const isCompact = isCustomize && containerWidth > 0 && containerWidth < 640

  // Combine Tailwind responsive classes with div-responsive logic
  const iconSize = isCompact ? "h-4 w-4 sm:h-5 sm:w-5" : "h-5 w-5"
  const spacing = isCompact ? "space-x-2 sm:space-x-4" : "space-x-4 sm:space-x-6"
  const verticalSpacing = isCompact ? "space-y-1 sm:space-y-2" : "space-y-2 sm:space-y-4"

  const icons = [
    { Icon: User, label: "Profile", href: `/e-commerce/${subdomain}/profile` },
    { Icon: ShoppingBag, label: "Cart", href: `/e-commerce/${subdomain}/cart` },
    {
      Icon: Heart,
      label: "Favorites",
      href: `/e-commerce/${subdomain}/favorites`,
    },
  ]

  return (
    <div className={`flex ${orientation === "horizontal" ? spacing : `flex-col ${verticalSpacing}`}`}>
      {icons.map(({ Icon, label, href }) => (
        <Link
          key={label}
          href={href}
          className={`p-1 hover:opacity-80 flex ${
            orientation === "horizontal" ? "items-center" : "flex-col items-center"
          }`}
        >
          <Icon
            className={iconSize}
            style={{
              color: iconColor.includes("[") ? iconColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : "#ffffff",
            }}
          />
          {showLabels && (
            <span
              className={`${orientation === "horizontal" ? "ml-2" : "mt-1"} ${isCompact ? "text-xs sm:text-sm" : "text-sm"}`}
              style={{
                color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : "#ffffff",
              }}
            >
              {label}
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}
