import { AboutUs } from "../about-us"
import type { AboutUsProps } from "../about-us"

interface RightAlignedAboutProps extends Omit<AboutUsProps, "variant"> {
  id?: string
}

export function RightAlignedAbout(props: RightAlignedAboutProps) {
  return <AboutUs {...props} variant="right-aligned" />
}
