import { cn } from "@/lib/utils"
import { NewCollectionSlide } from "../slide"
import type { NewCollectionSlideProps } from "../slide"

interface LeftAlignedNewCollectionProps extends Omit<NewCollectionSlideProps, "variant"> {
  id?: string
}

export function LeftAlignedNewCollection(props: LeftAlignedNewCollectionProps) {
  return <NewCollectionSlide {...props} variant="left" />
}
