"use client"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"

export interface ContactProps {
  title?: string
  address?: string
  openHours?: string
  phone?: string
  contactEmail?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  template?: "centered" | "minimal-left" | "minimal-right" | "left-aligned" | "right-aligned"
  backgroundColor?: string
  titleFont?: string
  titleColor?: string
  contentColor?: string
  id?: string
  imageUrl?: string
  showMap?: boolean
}

export default function Contact({
  template = "centered",
  backgroundColor = "bg-white",
  title = "Contact Us",
  address = "5th Ave, NY, 10001, USA",
  openHours = "Daily 10:00 AM — 7:00 PM",
  phone = "+1-555-777-1234",
  contactEmail = "email@example.com",
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
  titleFont,
}: ContactProps) {
  const socialIcons = [
    { href: socialLinks.facebook, icon: <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Facebook" },
    { href: socialLinks.instagram, icon: <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Instagram" },
    { href: socialLinks.twitter, icon: <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Twitter" },
  ]

  const Map = () => {
    if (!showMap && imageUrl) {
      return (
        <div className="w-full h-full relative">
          <Image
            src={imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}
            alt="Contact illustration"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )
    }

    if (!address || !showMap) return null

    return (
      <iframe
        src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
        className="w-full h-full border-0"
        loading="lazy"
        title="Store location"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    )
  }

  const ContactInfo = ({ contentColor, titleColor }: { contentColor?: string; titleColor?: string }) => (
    <div className={`flex flex-col justify-center ${contentColor}`}>
      <h2 className={`text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6 ${titleColor} ${titleFont}`}>
        {title}
      </h2>
      <div className="mb-3 sm:mb-4">
        <h3 className={`text-base sm:text-lg md:text-xl font-medium mb-1 sm:mb-2 italic ${titleColor}`}>
          Our address
        </h3>
        <p className="text-sm sm:text-base md:text-lg">{address}</p>
      </div>
      <div className="mb-3 sm:mb-4">
        <h3 className={`text-base sm:text-lg md:text-xl font-medium mb-1 sm:mb-2 italic ${titleColor}`}>
          Open hours
        </h3>
        <p className="text-sm sm:text-base md:text-lg">{openHours}</p>
      </div>
      <div className="mb-3 sm:mb-4">
        <h3 className={`text-base sm:text-lg md:text-xl font-medium mb-1 sm:mb-2 italic ${titleColor}`}>
          Contact info
        </h3>
        <p className="text-sm sm:text-base md:text-lg">{phone}</p>
        <p className="text-sm sm:text-base md:text-lg">{contactEmail}</p>
      </div>
      <div className="flex space-x-3 sm:space-x-4 mt-3 sm:mt-4">
        {socialIcons.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`p-1.5 sm:p-2 border rounded-full hover:bg-gray-100 transition-colors ${contentColor}`}
            aria-label={link.label}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  )

  switch (template) {
    case "centered":
      return (
        <section id={id} className={`relative ${backgroundColor}`} style={{ height: '100vh' }}>
          <div className="absolute inset-0 w-full h-full">
            <Map />
          </div>
          
          <div className="absolute z-10 w-[90vw] max-w-md left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 md:p-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6">
              <ContactInfo contentColor={contentColor} titleColor={titleColor} />
            </div>
          </div>
        </section>
      )

    case "minimal-left":
      return (
        <section id={id} className={`py-12 ${backgroundColor}`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-stretch gap-8 md:gap-12">
              <div className="w-full md:w-1/2 h-[350px] sm:h-[400px] rounded-lg overflow-hidden">
                <Map />
              </div>
              <div className="w-full md:w-1/2 flex items-center p-4 sm:p-0">
                <ContactInfo contentColor={contentColor} titleColor={titleColor} />
              </div>
            </div>
          </div>
        </section>
      )

    case "minimal-right":
      return (
        <section id={id} className={`py-12 ${backgroundColor}`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row-reverse items-stretch gap-8 md:gap-12">
              <div className="w-full md:w-1/2 h-[350px] sm:h-[400px] rounded-lg overflow-hidden">
                <Map />
              </div>
              <div className="w-full md:w-1/2 flex items-center p-4 sm:p-0">
                <ContactInfo contentColor={contentColor} titleColor={titleColor} />
              </div>
            </div>
          </div>
        </section>
      )

case "left-aligned":
  return (
    <section id={id} className={`py-12 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row h-[500px]">
          <div className="md:w-2/5 bg-gray-50 p-6 md:p-8 rounded-lg md:rounded-l-lg md:rounded-r-none">
            <ContactInfo contentColor={contentColor} titleColor={titleColor} />
          </div>
          <div className="md:w-3/5 h-full mt-4 md:mt-0 rounded-lg md:rounded-r-lg md:rounded-l-none overflow-hidden">
            <Map />
          </div>
        </div>
      </div>
    </section>
  )

case "right-aligned":
  return (
    <section id={id} className={`py-12 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row h-[500px]">
          <div className="md:w-3/5 h-full rounded-lg md:rounded-l-lg md:rounded-r-none overflow-hidden">
            <Map />
          </div>
          <div className="md:w-2/5 bg-gray-50 p-6 md:p-8 mt-4 md:mt-0 rounded-lg md:rounded-r-lg md:rounded-l-none">
            <ContactInfo contentColor={contentColor} titleColor={titleColor} />
          </div>
        </div>
      </div>
    </section>
  )

    default:
      return (
        <section id={id} className={`py-12 ${backgroundColor}`}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="flex items-center">
                <ContactInfo contentColor={contentColor} titleColor={titleColor} />
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