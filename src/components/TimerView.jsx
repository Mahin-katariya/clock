import { useState, useRef, useEffect } from 'react'
import ClockCanvas  from './ClockCanvas'
import PickerCol    from './PickerCol'
import Btn          from './Btn'
import { fmt }      from '../utils/format'

/**
 * Timer tab.
 *
 * States:  idle → running → paused → done
 *
 * @param {{ dark: boolean, t: object }} props  — t is the active theme object
 */
export default function TimerView({ dark, t }) {
  const [inp, setInp]     = useState({ h: 0, m: 0, s: 10 })
  const [total, setTotal] = useState(0)
  const [rem, setRem]     = useState(0)
  const [status, setStatus] = useState('idle') // idle | running | paused | done
  const itv = useRef(null)

  const totalSecs = inp.h * 3600 + inp.m * 60 + inp.s
  const elapsed   = total - rem

  // ── Controls ───────────────────────────────────────────────────────────────
  const start  = () => {
    if (!totalSecs) return
    setTotal(totalSecs)
    setRem(totalSecs)
    setStatus('running')
  }
  const pause  = () => setStatus('paused')
  const resume = () => setStatus('running')
  const reset  = () => { setStatus('idle'); setTotal(0); setRem(0) }

  // ── Countdown interval ─────────────────────────────────────────────────────
  useEffect(() => {
    if (status === 'running') {
      itv.current = setInterval(() => {
        setRem(r => {
          if (r <= 1) { setStatus('done'); return 0 }
          return r - 1
        })
      }, 1000)
    } else {
      clearInterval(itv.current)
    }
    return () => clearInterval(itv.current)
  }, [status])

  const started = status !== 'idle'
  const paused  = status === 'paused'
  const done    = status === 'done'

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0 48px' }}>
      {!started ? (
        <>
          {/* iOS scroll picker */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <PickerCol value={inp.h} max={24}  onChange={h => setInp(p => ({ ...p, h }))} dark={dark} grad={t.grad} />
            <div style={{ width: 22, textAlign: 'center', fontSize: 30, fontWeight: 200, color: t.muted }}>:</div>
            <PickerCol value={inp.m} max={60} onChange={m => setInp(p => ({ ...p, m }))} dark={dark} grad={t.grad} />
            <div style={{ width: 22, textAlign: 'center', fontSize: 30, fontWeight: 200, color: t.muted }}>:</div>
            <PickerCol value={inp.s} max={60} onChange={s => setInp(p => ({ ...p, s }))} dark={dark} grad={t.grad} />
          </div>

          {/* Column labels */}
          <div style={{ display: 'flex', width: 290, marginBottom: 36 }}>
            <div style={{ width: 82, textAlign: 'center', fontSize: 12, color: t.dim, letterSpacing: '.06em' }}>hours</div>
            <div style={{ width: 22 }} />
            <div style={{ width: 82, textAlign: 'center', fontSize: 12, color: t.dim, letterSpacing: '.06em' }}>min</div>
            <div style={{ width: 22 }} />
            <div style={{ width: 82, textAlign: 'center', fontSize: 12, color: t.dim, letterSpacing: '.06em' }}>sec</div>
          </div>

          <Btn
            onClick={start}
            bg={totalSecs ? t.green : t.gray}
            fg={totalSecs ? t.greenFg : t.muted}
            wide
            disabled={!totalSecs}
          >
            Start
          </Btn>
        </>
      ) : (
        <>
          {/* Clock visualization — dims when done */}
          <div style={{ opacity: done ? 0.3 : 1, transition: 'opacity .7s', marginBottom: 10 }}>
            <ClockCanvas elapsed={elapsed} total={total} dark={dark} size={224} />
          </div>

          {/* Remaining time (smaller, below clock) */}
          <div style={{
            fontSize: 38, fontWeight: 300, letterSpacing: '.08em',
            fontVariantNumeric: 'tabular-nums',
            color: done ? t.muted : t.text,
            transition: 'color .4s',
            marginBottom: 38,
          }}>
            {fmt(rem)}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 14 }}>
            <Btn onClick={reset} bg={t.gray} fg={t.grayFg}>Reset</Btn>
            {!done
              ? (
                <Btn
                  onClick={paused ? resume : pause}
                  bg={paused ? t.green : t.orange}
                  fg={paused ? t.greenFg : t.orangeFg}
                >
                  {paused ? 'Resume' : 'Pause'}
                </Btn>
              ) : (
                <Btn onClick={start} bg={t.green} fg={t.greenFg}>Restart</Btn>
              )
            }
          </div>
        </>
      )}
    </div>
  )
}
