import { useRef, useEffect } from 'react'

/** Height of each picker item in px */
export const ITEM_HEIGHT = 58

/**
 * A single iOS-style scroll-snap picker column.
 *
 * @param {{
 *   value:    number,
 *   max:      number,
 *   onChange: (n: number) => void,
 *   dark:     boolean,
 *   grad:     string,   // background colour for the gradient fade overlay
 * }} props
 */
export default function PickerCol({ value, max, onChange, dark, grad }) {
  const ref  = useRef(null)
  const busy = useRef(false)   // true while user is actively scrolling
  const tmr  = useRef(null)
  const fg   = dark ? 255 : 0

  // Programmatically sync scroll position to the value prop
  useEffect(() => {
    if (ref.current && !busy.current) {
      ref.current.scrollTop = value * ITEM_HEIGHT
    }
  }, [value])

  const onScroll = () => {
    busy.current = true
    clearTimeout(tmr.current)
    // After the user stops scrolling, snap to the nearest item
    tmr.current = setTimeout(() => {
      if (ref.current) {
        const i = Math.max(
          0,
          Math.min(max - 1, Math.round(ref.current.scrollTop / ITEM_HEIGHT)),
        )
        ref.current.scrollTop = i * ITEM_HEIGHT
        onChange(i)
      }
      busy.current = false
    }, 110)
  }

  const IH = ITEM_HEIGHT

  return (
    <div style={{ position: 'relative', width: 82, height: IH * 5, flexShrink: 0, userSelect: 'none' }}>

      {/* Selection highlight band (centre row) */}
      <div style={{
        position: 'absolute', top: IH * 2, height: IH,
        left: 8, right: 8, borderRadius: 12,
        background: dark ? 'rgba(255,255,255,.09)' : 'rgba(0,0,0,.06)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {/* Top gradient fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: IH * 2 + 16,
        background: `linear-gradient(to bottom, ${grad} 50%, transparent)`,
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: IH * 2 + 16,
        background: `linear-gradient(to top, ${grad} 50%, transparent)`,
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Scrollable list */}
      <div
        ref={ref}
        className="ns"
        onScroll={onScroll}
        style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollPaddingTop: `${IH * 2}px`,
          scrollbarWidth: 'none',
        }}
      >
        {/* Top padding — keeps item[0] centerable */}
        <div style={{ height: IH * 2 }} />

        {Array.from({ length: max }, (_, i) => {
          const dist  = Math.abs(i - value)
          const alpha = dist === 0 ? 1 : dist === 1 ? 0.42 : 0.18
          return (
            <div
              key={i}
              style={{
                height: IH,
                scrollSnapAlign: 'start',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 35,
                fontWeight: dist === 0 ? 400 : 300,
                letterSpacing: '.04em',
                color: `rgba(${fg},${fg},${fg},${alpha})`,
                cursor: 'pointer',
              }}
            >
              {String(i).padStart(2, '0')}
            </div>
          )
        })}

        {/* Bottom padding */}
        <div style={{ height: IH * 2 }} />
      </div>
    </div>
  )
}
