import { NewCollectionSlide } from "../slide"
import type { NewCollectionSlideProps } from "../slide"
import { cn } from "@/lib/utils"

interface OverlayNewCollectionProps extends Omit<NewCollectionSlideProps, "variant"> {
  id?: string
}

export function OverlayNewCollection(props: OverlayNewCollectionProps) {
  return <NewCollectionSlide {...props} variant="overlay" />
}
