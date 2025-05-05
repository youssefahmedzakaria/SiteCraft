"use client"
import type React from "react"
import {NavbarTemplate1} from "./navbar-templates/navbar-template1"
import {NavbarTemplate2} from "./navbar-templates/navbar-template2"
import {NavbarTemplate3} from "./navbar-templates/navbar-template3"
import {NavbarTemplate4} from "./navbar-templates/navbar-template4"
import {NavbarTemplate5} from "./navbar-templates/navbar-template5"
import {NavbarTemplate6} from "./navbar-templates/navbar-template6"
import {NavbarTemplate7} from "./navbar-templates/navbar-template7"
import {NavbarTemplate8} from "./navbar-templates/navbar-template8"

export interface NavbarTemplateProps {
  brandName?: string | React.ReactNode 
  backgroundColor?: string
  textColor?: string
  fontFamily?: string
  logo?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
  menuItems?: Array<{
    label: string
    href: string
  }>
  isRTL?: boolean
  iconColor?: string
  dividerColor?: string
  searchIconColor?: string
}

export interface NavbarProps extends NavbarTemplateProps {
  template?:
    | "template1"
    | "template2"
    | "template3"
    | "template4"
    | "template5"
    | "template6"
    | "template7"
    | "template8"
}

const navbarComponents: Record<string, React.ComponentType<NavbarTemplateProps>> = {
  template1: NavbarTemplate1,
  template2: NavbarTemplate2,
  template3: NavbarTemplate3,
  template4: NavbarTemplate4,
  template5: NavbarTemplate5,
  template6: NavbarTemplate6,
  template7: NavbarTemplate7,
  template8: NavbarTemplate8,
}

const Navbar: React.FC<NavbarProps> = ({
  template = "template1",
  brandName = "",
  backgroundColor = "bg-white",
  textColor = "text-black",
  fontFamily = "font-sans",
  logo = {
    src: "/logo.png",
    alt: "Logo",
    width: 50,
    height: 50,
  },
  menuItems,
  iconColor = "text-black",
  dividerColor = "border-gray-200",
  searchIconColor = "text-black",
}) => {
  const Component = navbarComponents[template] || NavbarTemplate1

  return (
    <Component
      brandName={brandName}
      backgroundColor={backgroundColor}
      textColor={textColor}
      fontFamily={fontFamily}
      logo={logo}
      menuItems={menuItems}
      iconColor={iconColor}
      dividerColor={dividerColor}
      searchIconColor={searchIconColor}
    />
  )
}
export default Navbar
