/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils"
import { NewCollectionSlide } from "../slide"
import type { NewCollectionSlideProps } from "../slide"

interface RightAlignedNewCollectionProps extends Omit<NewCollectionSlideProps, "variant"> {
  id?: string
}

export function RightAlignedNewCollection(props: RightAlignedNewCollectionProps) {
  return <NewCollectionSlide {...props} variant="right" />
}
