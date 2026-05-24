import { useRef, useEffect } from 'react'
import { paintClock } from '../utils/clockDraw'

const TRAIL_MAX = 22

/**
 * Animated canvas clock.
 *
 * For the timer:  pass elapsed + total  → hand sweeps 0→360 over the duration.
 * For stopwatch:  pass elapsed + total=0 → one full rotation per 60 s.
 *
 * @param {{ elapsed: number, total: number, dark: boolean, size?: number }} props
 */
export default function ClockCanvas({ elapsed, total, dark, size = 224 }) {
  const cvs = useRef(null)

  // All mutable animation state lives in a single ref to avoid stale closures
  const st = useRef({
    disp:   0,      // current displayed angle (lerped)
    lastT:  0,      // last angle appended to trail
    trail:  [],     // array of past angles
    raf:    null,   // requestAnimationFrame id
    t0:     0,      // last frame timestamp
    target: 0,      // target angle derived from props
  })

  // Sync target angle whenever elapsed / total change
  useEffect(() => {
    st.current.target = total > 0
      ? (elapsed / total) * 360
      : (elapsed % 60) / 60 * 360
  }, [elapsed, total])

  // Animation loop — restarts only when dark mode changes
  useEffect(() => {
    const c = cvs.current
    if (!c) return
    const s = st.current
    s.t0 = performance.now()

    function frame(now) {
      const dt   = Math.min(now - s.t0, 80)
      s.t0       = now
      const diff = s.target - s.disp

      if (diff < -180) {
        // Wrap-around: stopwatch cycled back to 0 — clear the trail
        s.trail = []
        s.lastT = s.target
        s.disp  = s.target
      } else {
        // Smooth lerp toward target (~110 ms chase)
        if (Math.abs(diff) > 0.01) s.disp += diff * Math.min(dt / 110, 1)
        else                        s.disp  = s.target

        // Append to trail when the hand has moved enough
        if (Math.abs(s.disp - s.lastT) > 1.1) {
          s.trail = [...s.trail.slice(-(TRAIL_MAX - 1)), s.lastT]
          s.lastT = s.disp
        }
      }

      paintClock(c, s.disp, s.trail, dark)
      s.raf = requestAnimationFrame(frame)
    }

    s.raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(s.raf)
  }, [dark])

  // Canvas is rendered at 2× resolution for sharp HiDPI display
  return (
    <canvas
      ref={cvs}
      width={size * 2}
      height={size * 2}
      style={{ width: size, height: size, display: 'block' }}
    />
  )
}
