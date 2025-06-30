"use client"

interface CopyrightProps {
  text: string
  styles: {
    font: string
    fontSize: string
    fontWeight: string
    fontColor: string
  }
  isCustomize?: boolean
  selectedTab?: "desktop" | "tablet" | "mobile"
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

export const Copyright = ({ text, styles, isCustomize = false, selectedTab }: CopyrightProps) => {
  const shouldShowMobile = isCustomize ? selectedTab === "mobile" || selectedTab === "tablet" : false

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
      return sizeMap[fontSize] || (isCompact ? "0.625rem" : "0.75rem")
    }
    return fontSize || (isCompact ? "0.625rem" : "0.75rem")
  }

  return (
    <div
      className={`${shouldShowMobile ? "mt-4" : "mt-8"} text-center`}
      style={{
        fontFamily: getFontFamily(styles.font),
        fontSize: getFontSize(styles.fontSize || "text-xs", shouldShowMobile),
        fontWeight: styles.fontWeight?.replace("font-", "") || "normal",
        color: styles.fontColor?.includes("[") ? styles.fontColor.split("-[")[1]?.slice(0, -1) || "#6b7280" : "#6b7280",
      }}
    >
      {text}
      <span className="mx-2">|</span>
      <a
        href={isCustomize ? "#" : ""}
        target={isCustomize ? undefined : "_blank"}
        rel="noopener noreferrer"
        className="hover:underline"
        style={{
          color: styles.fontColor?.includes("[")
            ? styles.fontColor.split("-[")[1]?.slice(0, -1) || "#6b7280"
            : "#6b7280",
        }}
        onClick={isCustomize ? (e) => e.preventDefault() : undefined}
      >
        Powered by SiteCraft
      </a>
    </div>
  )
}
