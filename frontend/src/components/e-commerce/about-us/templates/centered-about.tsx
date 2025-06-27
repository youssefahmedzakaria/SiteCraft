import { AboutUs } from "../about-us"
import type { AboutUsProps } from "../about-us"

interface CenteredAboutProps extends Omit<AboutUsProps, "variant"> {
  id?: string
}

export function CenteredAbout(props: CenteredAboutProps) {
  return <AboutUs {...props} variant="centered" />
} 
