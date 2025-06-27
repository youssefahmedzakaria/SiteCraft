import { NewCollectionSlide } from "../slide"
import type { NewCollectionSlideProps } from "../slide"

interface CenteredNewCollectionProps extends Omit<NewCollectionSlideProps, "variant"> {
  id?: string
}

export function CenteredNewCollection(props: CenteredNewCollectionProps) {
  return <NewCollectionSlide {...props} variant="centered" />
}
