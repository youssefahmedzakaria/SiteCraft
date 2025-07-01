import type React from "react"
import Image from "next/image"

export interface LogoProps {
  brandName?: string | React.ReactNode
  logo?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
  textColor?: string
  isCustomize?: boolean
  containerWidth?: number
}

export const Logo: React.FC<LogoProps> = ({ brandName, logo, textColor, isCustomize = false, containerWidth = 0 }) => {
  // Responsive to div size when isCustomize is true
  const isCompact = isCustomize && containerWidth > 0 && containerWidth < 640

  return (
    <div className="flex items-center space-x-3">
      {logo && (
        <Image
          src={logo.src || "/placeholder.svg"}
          alt={logo.alt}
          width={isCompact ? (logo.width || 32) * 0.8 : logo.width || 32}
          height={isCompact ? (logo.height || 32) * 0.8 : logo.height || 32}
          className="object-contain"
        />
      )}
      {typeof brandName === "string" ? (
        <span
          className={`${isCompact ? "text-base" : "text-lg"} font-semibold`}
          style={{
            color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
          }}
        >
          {brandName}
        </span>
      ) : (
        brandName
      )}
    </div>
  )
}
