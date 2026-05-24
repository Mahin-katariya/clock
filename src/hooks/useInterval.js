import { useEffect, useRef } from 'react'

/**
 * A safe setInterval hook that always calls the latest version of `callback`
 * without needing to restart the interval when the callback changes.
 *
 * Pass `delay = null` to pause the interval.
 *
 * @param {() => void} callback
 * @param {number | null} delay - milliseconds, or null to pause
 */
export function useInterval(callback, delay) {
  const savedCallback = useRef(callback)

  // Keep ref in sync with the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}
