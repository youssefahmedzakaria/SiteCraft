import { useEffect, useState, useRef, MutableRefObject } from 'react'

export function useIntersectionObserver(options = {}): [MutableRefObject<HTMLDivElement | null>, boolean] {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, {
      threshold: 0.1,
      ...options
    })

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [options])

  return [elementRef, isVisible]
} 