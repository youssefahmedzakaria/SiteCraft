"use client"

import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ContactProps {
  title?: string
  address?: string
  addressUrl?: string
  openHours?: string
  phone?: string
  contactEmail?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  variant?: "centered" | "minimal-left" | "minimal-right" | "left-aligned" | "right-aligned"
  backgroundColor?: string
  titleFont?: string
  titleColor?: string
  titleSize?: string
  contentFont?: string
  contentColor?: string
  contentSize?: string
  id?: string
  imageUrl?: string
  showMap?: boolean
  className?: string
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
    case "font-serif":
      return "serif"
    case "font-sans":
      return "system-ui, sans-serif"
    default:
      return "system-ui, sans-serif"
  }
}

const getFontSize = (fontSize: string) => {
  const sizeMap: Record<string, string> = {
    "text-xs": "0.75rem",
    "text-sm": "0.875rem",
    "text-base": "1rem",
    "text-lg": "1.125rem",
    "text-xl": "1.25rem",
    "text-2xl": "1.5rem",
    "text-3xl": "1.875rem",
    "text-4xl": "2.25rem",
    "text-5xl": "3rem",
    "text-6xl": "3.75rem",
  }
  return sizeMap[fontSize] || "1rem"
}

export function Contact({
  variant = "centered",
  backgroundColor = "bg-white",
  title = "Contact Us",
  address = "",
  addressUrl = "",
  openHours = "",
  phone = "",
  contactEmail = "",
  socialLinks = {
    facebook: "#",
    instagram: "#",
    twitter: "#",
  },
  id,
  imageUrl,
  showMap = true,
  titleColor = "text-black",
  contentColor = "text-black",
  titleFont = "font-semibold",
  titleSize = "text-2xl",
  contentFont = "font-normal",
  contentSize = "text-sm",
  className = "",
}: ContactProps) {
  const socialIcons = [
    { href: socialLinks?.facebook, icon: <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Facebook" },
    { href: socialLinks?.instagram, icon: <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Instagram" },
    { href: socialLinks?.twitter, icon: <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Twitter" },
  ].filter((link) => link.href && link.href !== "#")

  const Map = () => {
    if (!showMap && imageUrl) {
      return (
        <div className="w-full h-full relative">
          <Image
            src={imageUrl}
            alt="Contact illustration"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      )
    }

    if (!showMap) {
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Map disabled</p>
        </div>
      )
    }

    if (!addressUrl) {
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No address provided</p>
        </div>
      )
    }

    // Simple embedding without API key - works for basic map display
    const getEmbedUrl = (url: string) => {
      // If it's already a Google Maps URL, try to extract the query
      if (url.includes("google.com/maps")) {
        // Check if it's already an embed URL
        if (url.includes("/embed")) {
          return url
        }

        // Extract query from various Google Maps URL formats
        let query = ""

        // Try to extract from q= parameter
        const qMatch = url.match(/[?&]q=([^&]+)/)
        if (qMatch) {
          query = decodeURIComponent(qMatch[1])
        } else {
          // Try to extract from URL path or use address as fallback
          query = address || "New York"
        }

        // Use the basic embed format without API key (limited functionality but works)
        return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
      }

      // For non-Google URLs, assume it's an address and create embed URL
      const location = url.includes("http") ? address : url
      return `https://maps.google.com/maps?q=${encodeURIComponent(location || address || "New York")}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    }

    return (
      <iframe
        src={getEmbedUrl(addressUrl)}
        className="w-full h-full border-0"
        loading="lazy"
        title="Store location"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    )
  }

  const ContactInfo = () => (
    <div className="flex flex-col justify-center">
      <h2
        className="mb-4 sm:mb-6"
        style={{
          fontFamily: titleFont ? getFontFamily(titleFont) : undefined,
          color: titleColor?.includes("[") ? titleColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
          fontSize: titleSize ? getFontSize(titleSize) : undefined,
        }}
      >
        {title}
      </h2>

      {address && (
        <div className="mb-3 sm:mb-4">
          <h3
            className="font-medium mb-1 sm:mb-2 italic"
            style={{
              fontFamily: contentFont ? getFontFamily(contentFont) : undefined,
              color: titleColor?.includes("[") ? titleColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
              fontSize: contentSize ? getFontSize(contentSize) : undefined,
            }}
          >
            Our address
          </h3>
          {addressUrl ? (
            <a
              href={addressUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline cursor-pointer"
              style={{
                fontFamily: contentFont ? getFontFamily(contentFont) : undefined,
                color: contentColor?.includes("[") ? contentColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
                fontSize: contentSize ? getFontSize(contentSize) : undefined,
              }}
            >
              {address}
            </a>
          ) : (
            <p
              style={{
                fontFamily: contentFont ? getFontFamily(contentFont) : undefined,
                color: contentColor?.includes("[") ? contentColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
                fontSize: contentSize ? getFontSize(contentSize) : undefined,
              }}
            >
              {address}
            </p>
          )}
        </div>
      )}

      {openHours && (
        <div className="mb-3 sm:mb-4">
          <h3
            className="font-medium mb-1 sm:mb-2 italic"
            style={{
              fontFamily: contentFont ? getFontFamily(contentFont) : undefined,
              color: titleColor?.includes("[") ? titleColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
              fontSize: contentSize ? getFontSize(contentSize) : undefined,
            }}
          >
            Open hours
          </h3>
          <p
            style={{
              fontFamily: contentFont ? getFontFamily(contentFont) : undefined,
              color: contentColor?.includes("[") ? contentColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
              fontSize: contentSize ? getFontSize(contentSize) : undefined,
            }}
          >
            {openHours}
          </p>
        </div>
      )}

      {(phone || contactEmail) && (
        <div className="mb-3 sm:mb-4">
          <h3
            className="font-medium mb-1 sm:mb-2 italic"
            style={{
              fontFamily: contentFont ? getFontFamily(contentFont) : undefined,
              color: titleColor?.includes("[") ? titleColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
              fontSize: contentSize ? getFontSize(contentSize) : undefined,
            }}
          >
            Contact info
          </h3>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="hover:underline block"
              style={{
                fontFamily: contentFont ? getFontFamily(contentFont) : undefined,
                color: contentColor?.includes("[") ? contentColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
                fontSize: contentSize ? getFontSize(contentSize) : undefined,
              }}
            >
              {phone}
            </a>
          )}
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="hover:underline block"
              style={{
                fontFamily: contentFont ? getFontFamily(contentFont) : undefined,
                color: contentColor?.includes("[") ? contentColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
                fontSize: contentSize ? getFontSize(contentSize) : undefined,
              }}
            >
              {contactEmail}
            </a>
          )}
        </div>
      )}

      {socialIcons.length > 0 && (
        <div className="flex space-x-3 sm:space-x-4 mt-3 sm:mt-4">
          {socialIcons.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 border rounded-full hover:bg-gray-100 transition-colors"
              style={{
                color: contentColor?.includes("[") ? contentColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
              }}
              aria-label={link.label}
            >
              {link.icon}
            </a>
          ))}
        </div>
      )}
    </div>
  )

  const baseClassName = cn(className)

  switch (variant) {
    case "centered":
      return (
        <section
          id={id}
          className={cn("relative h-[60vh] sm:h-[70vh] md:h-[100vh]", baseClassName)}
          style={{
            backgroundColor: backgroundColor?.includes("[")
              ? backgroundColor.split("-[")[1]?.slice(0, -1) || undefined
              : undefined,
          }}
        >
          <div className="absolute inset-0 w-full h-full">
            <Map />
          </div>

          <div className="absolute z-10 w-[90vw] max-w-md left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 md:p-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6">
              <ContactInfo />
            </div>
          </div>
        </section>
      )

    case "minimal-left":
      return (
        <section
          id={id}
          className={cn("py-12", baseClassName)}
          style={{
            backgroundColor: backgroundColor?.includes("[")
              ? backgroundColor.split("-[")[1]?.slice(0, -1) || undefined
              : undefined,
          }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-stretch gap-8 md:gap-12">
              <div className="w-full md:w-1/2 h-[350px] sm:h-[400px] rounded-lg overflow-hidden">
                <Map />
              </div>
              <div className="w-full md:w-1/2 flex items-center p-4 sm:p-0">
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>
      )

    case "minimal-right":
      return (
        <section
          id={id}
          className={cn("py-12", baseClassName)}
          style={{
            backgroundColor: backgroundColor?.includes("[")
              ? backgroundColor.split("-[")[1]?.slice(0, -1) || undefined
              : undefined,
          }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row-reverse items-stretch gap-8 md:gap-12">
              <div className="w-full md:w-1/2 h-[350px] sm:h-[400px] rounded-lg overflow-hidden">
                <Map />
              </div>
              <div className="w-full md:w-1/2 flex items-center p-4 sm:p-0">
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>
      )

    case "left-aligned":
      return (
        <section
          id={id}
          className={cn("py-12", baseClassName)}
          style={{
            backgroundColor: backgroundColor?.includes("[")
              ? backgroundColor.split("-[")[1]?.slice(0, -1) || undefined
              : undefined,
          }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row h-auto md:h-[500px]">
              <div className="md:w-2/5 bg-gray-50 p-6 md:p-8 rounded-lg md:rounded-l-lg md:rounded-r-none">
                <ContactInfo />
              </div>
              <div className="md:w-3/5 h-[350px] md:h-full mt-4 md:mt-0 rounded-lg md:rounded-r-lg md:rounded-l-none overflow-hidden">
                <Map />
              </div>
            </div>
          </div>
        </section>
      )

    case "right-aligned":
      return (
        <section
          id={id}
          className={cn("py-12", baseClassName)}
          style={{
            backgroundColor: backgroundColor?.includes("[")
              ? backgroundColor.split("-[")[1]?.slice(0, -1) || undefined
              : undefined,
          }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row h-auto md:h-[500px]">
              <div className="md:w-3/5 h-[350px] md:h-full rounded-lg md:rounded-l-lg md:rounded-r-none overflow-hidden">
                <Map />
              </div>
              <div className="md:w-2/5 bg-gray-50 p-6 md:p-8 mt-4 md:mt-0 rounded-lg md:rounded-r-lg md:rounded-l-none">
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>
      )

    default:
      return (
        <section
          id={id}
          className={cn("py-12", baseClassName)}
          style={{
            backgroundColor: backgroundColor?.includes("[")
              ? backgroundColor.split("-[")[1]?.slice(0, -1) || undefined
              : undefined,
          }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="flex items-center">
                <ContactInfo />
              </div>
              <div className="h-[350px] sm:h-[400px] rounded-lg overflow-hidden">
                <Map />
              </div>
            </div>
          </div>
        </section>
      )
  }
}
