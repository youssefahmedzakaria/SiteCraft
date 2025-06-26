import { AboutUs } from "../about-us"
import type { AboutUsProps } from "../about-us"

interface TopImageAboutProps extends Omit<AboutUsProps, "variant"> {
  id?: string
}

export function TopImageAbout(props: TopImageAboutProps) {
  return <AboutUs {...props} variant="top-image" />
}
