/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils"
import Image from "next/image"
import { NewCollectionSlide } from "../slide"
import type { NewCollectionSlideProps } from "../slide"

interface MinimalLeftNewCollectionProps extends Omit<NewCollectionSlideProps, "variant"> {
  id?: string
}

export function MinimalLeftNewCollection(props: MinimalLeftNewCollectionProps) {
  return <NewCollectionSlide {...props} variant="minimalLeft" />
}
