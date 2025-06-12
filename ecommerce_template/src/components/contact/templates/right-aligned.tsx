import Contact from "../contact"

interface RightAlignedContactProps {
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
  imageUrl?: string
  showMap?: boolean
  titleFont?: string
  titleColor?: string
  contentColor?: string
  contentFont?: string
  contentSize?: string
  titleSize?: string
}

export function RightAlignedContact(props: RightAlignedContactProps) {
  return <Contact {...props} template="right-aligned" />
}
