"use client"
import type React from "react"
import { X } from "lucide-react"
import { FullSearchBar } from "./full-search-bar"
import Link from "next/link"
import { Navigation } from "./navigation"
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  MobileMenuItems: Array<{
    label: string
    href: string
  }>
  NavMenuItems: Array<{
    label: string
    href: string
  }>
  backgroundColor?: string
  textColor?: string
  iconColor?: string
  searchIconColor?: string
  dividerColor?: string
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  MobileMenuItems,
  NavMenuItems,
  backgroundColor = "bg-black",
  textColor = "text-white",
  iconColor = "text-white",
  dividerColor = "border-transparent"
}) => {
  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 flex`}>
      <div className={`w-64 ${backgroundColor} ${textColor} h-full shadow-lg`} onClick={(e) => e.stopPropagation()}>
        <div className={`${dividerColor} flex items-center justify-between p-4`}>
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={onClose} className="p-1 hover:opacity-80">
            <X className={`h-6 w-6 ${iconColor}`} />
          </button>
        </div>

        <div className={`${dividerColor} px-4 py-3`}>
          <FullSearchBar />
        </div>

        <div className={`${dividerColor} px-4 py-3`}>
          <Navigation
            menuItems={NavMenuItems}
            textColor={textColor}
            orientation="vertical"
            onClick={onClose}
          />
          <div className="py-1 overflow-y-auto"></div>
          <Link href="/profile" className=" block py-2 text-sm hover:underline ">Profile</Link>
          <Link href="/cart" className=" block py-2 text-sm hover:underline ">Cart</Link>
          <Link href="/favorites" className="block py-2 text-sm hover:underline ">Favorites</Link>
        </div>

        <div className={`${dividerColor} py-2 overflow-y-auto`}>
          {MobileMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-sm hover:bg-white/10 transition-colors"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
    </div>
  )
}

export default MobileMenu
