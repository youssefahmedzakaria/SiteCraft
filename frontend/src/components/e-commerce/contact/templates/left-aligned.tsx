import {Contact} from "../contact"

interface LeftAlignedContactProps {
  id?: string
  backgroundColor?: string
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
  showMap?: boolean
  imageUrl?: string
  titleFont?: string
  titleColor?: string
  contentColor?: string
  contentFont?: string
  contentSize?: string
  titleSize?: string  
}

export function LeftAlignedContact(props: LeftAlignedContactProps) {
  return <Contact {...props} variant="left-aligned" />
}
