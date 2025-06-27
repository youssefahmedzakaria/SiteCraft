import { NewCollectionSlide } from "../slide"
import type { NewCollectionSlideProps } from "../slide"
import { cn } from "@/lib/utils"

interface MinimalRightNewCollectionProps extends Omit<NewCollectionSlideProps, "variant"> {
  id?: string
}

export function MinimalRightNewCollection(props: MinimalRightNewCollectionProps) {
  return <NewCollectionSlide {...props} variant="minimalRight" />
}
