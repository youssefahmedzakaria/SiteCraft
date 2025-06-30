import { useEffect, useRef, useState, MutableRefObject } from 'react'

export function useResizeObserver<T extends HTMLElement = HTMLDivElement>(): [MutableRefObject<T | null>, { width: number; height: number }] {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return
    const element = ref.current
    const observer = new window.ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setSize({ width: entry.contentRect.width, height: entry.contentRect.height })
        }
      }
    })
    observer.observe(element)
    // Set initial size
    setSize({ width: element.offsetWidth, height: element.offsetHeight })
    return () => {
      observer.disconnect()
    }
  }, [])

  return [ref, size]
} 