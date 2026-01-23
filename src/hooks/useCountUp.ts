import { useState, useEffect, useRef } from 'react'

interface UseCountUpOptions {
  end: number
  suffix?: string
  duration?: number
}

interface UseCountUpReturn {
  value: string
  blur: number
  isAnimating: boolean
}

export function useCountUp({ end, suffix = '', duration = 2000 }: UseCountUpOptions): UseCountUpReturn {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(easeOut * end)

      setCount(currentCount)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setCount(end)
        setIsAnimating(false)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [end, duration])

  // Calculate blur based on animation progress (0-8px blur)
  const blur = isAnimating ? Math.max(0, 8 * (1 - count / end)) : 0

  // Format number with commas and add suffix
  const formattedValue = count.toLocaleString() + suffix

  return {
    value: formattedValue,
    blur,
    isAnimating
  }
}
