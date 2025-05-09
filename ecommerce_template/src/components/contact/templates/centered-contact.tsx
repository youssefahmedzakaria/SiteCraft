import Contact from "../contact"

interface CenteredContactProps {
  id?: string
  backgroundColor?: string
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
  imageUrl?: string
  showMap?: boolean
  titleFont?: string
  titleColor?: string
  contentColor?: string
  
}

export function CenteredContact(props: CenteredContactProps) {
  return <Contact {...props} template="centered" />
}
