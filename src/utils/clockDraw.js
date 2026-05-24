/**
 * Seeded pseudo-random number in [0, 1).
 * Returns the same value for the same seed — no flicker on re-renders.
 * @param {number} n
 */
export function prand(n) {
  const x = Math.sin(n + 1) * 10000
  return x - Math.floor(x)
}

/**
 * Draws a single clock hand (rounded rectangle) onto a canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx   - canvas centre X
 * @param {number} cy   - canvas centre Y
 * @param {number} deg  - angle in degrees (0 = 12 o'clock, clockwise)
 * @param {number} len  - hand length in px
 * @param {number} w    - hand width in px
 * @param {number} c    - greyscale channel value (0–255)
 * @param {number} alpha
 * @param {boolean} glow - whether to add a luminescent shadow (dark mode)
 */
export function paintHand(ctx, cx, cy, deg, len, w, c, alpha, glow) {
  const rad = (deg - 90) * Math.PI / 180
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(rad)

  if (glow) {
    ctx.shadowBlur = w * 6
    ctx.shadowColor = `rgba(${c},${c},${c},.6)`
  }

  ctx.fillStyle = `rgba(${c},${c},${c},${alpha})`
  const hw = w / 2
  ctx.beginPath()
  ctx.roundRect
    ? ctx.roundRect(-hw, -len, w, len, hw)
    : ctx.rect(-hw, -len, w, len)
  ctx.fill()

  if (glow) ctx.shadowBlur = 0
  ctx.restore()
}

/**
 * Full clock frame render: dots, ghost trail, main hand, centre pivot.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number}   angle - current hand angle in degrees
 * @param {number[]} trail - array of recent past angles (oldest → newest)
 * @param {boolean}  dark  - dark or light theme
 */
export function paintClock(canvas, angle, trail, dark) {
  const ctx = canvas.getContext('2d')
  const S = canvas.width
  const cx = S / 2, cy = S / 2
  const R  = S * 0.41   // dots ring radius
  const hL = S * 0.33   // hand length
  const hW = S * 0.028  // hand width
  const dS = S * 0.031  // dot size

  ctx.clearRect(0, 0, S, S)
  const c = dark ? 255 : 15

  // ── 12 square tick dots ───────────────────────────────────────────────────
  for (let i = 0; i < 12; i++) {
    const dd = i * 30
    const a  = (dd - 90) * Math.PI / 180
    const dx = cx + Math.cos(a) * R
    const dy = cy + Math.sin(a) * R

    // A dot is "swept" if the hand has already passed its position
    const swept = angle > 4 && dd > 0 && dd < Math.min(angle, 360)

    if (swept) {
      // Particle dissolution: scatter deterministic pseudo-random rectangles
      for (let p = 0; p < 11; p++) {
        const ox = (prand(i * 97 + p * 3)      - 0.5) * dS * 7.5
        const oy = (prand(i * 97 + p * 3 + 30) - 0.5) * dS * 7.5
        const ps = dS * (0.10 + prand(i * 97 + p * 3 + 60) * 0.30)
        const pa = 0.04 + prand(i * 97 + p * 3 + 90) * 0.17
        ctx.fillStyle = `rgba(${c},${c},${c},${pa})`
        ctx.fillRect(dx + ox - ps / 2, dy + oy - ps / 2, ps, ps)
      }
    } else {
      // Solid square, rotated to face radially outward
      ctx.save()
      ctx.translate(dx, dy)
      ctx.rotate(a + Math.PI / 2)
      if (dark) {
        ctx.shadowBlur  = dS * 1.8
        ctx.shadowColor = 'rgba(255,255,255,.30)'
      }
      ctx.fillStyle = `rgba(${c},${c},${c},.90)`
      ctx.fillRect(-dS / 2, -dS / 2, dS, dS)
      ctx.shadowBlur = 0
      ctx.restore()
    }
  }

  // ── Ghost trail (chronophotography / motion blur) ─────────────────────────
  for (let i = 0; i < trail.length; i++) {
    const r = (i + 1) / trail.length
    paintHand(ctx, cx, cy, trail[i], hL * (0.58 + r * 0.42), hW * (0.32 + r * 0.68), c, r * 0.27, false)
  }

  // ── Main hand ─────────────────────────────────────────────────────────────
  paintHand(ctx, cx, cy, angle, hL, hW, c, 1.0, dark)

  // ── Centre pivot dot ──────────────────────────────────────────────────────
  ctx.beginPath()
  ctx.arc(cx, cy, hW * 1.4, 0, Math.PI * 2)
  if (dark) {
    ctx.shadowBlur  = hW * 6
    ctx.shadowColor = 'rgba(255,255,255,.85)'
  }
  ctx.fillStyle = `rgba(${c},${c},${c},1)`
  ctx.fill()
  ctx.shadowBlur = 0
}
