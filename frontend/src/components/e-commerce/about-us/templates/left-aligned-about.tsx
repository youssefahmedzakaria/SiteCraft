import { AboutUs } from "../about-us"
import type { AboutUsProps } from "../about-us"

interface LeftAlignedAboutProps extends Omit<AboutUsProps, "variant"> {
  id?: string
}

export function LeftAlignedAbout(props: LeftAlignedAboutProps) {
  return <AboutUs {...props} variant="left-aligned" />
}
