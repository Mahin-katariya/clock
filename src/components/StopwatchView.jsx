import { useState, useRef, useEffect } from 'react'
import ClockCanvas from './ClockCanvas.jsx'
import Btn         from './Btn.jsx'
import { fmt }     from '../utils/format.js'

/**
 * Stopwatch tab.
 *
 * States: idle → running → paused
 * Clock appears once started; one full rotation = 60 s (like a seconds hand).
 *
 * @param {{ dark: boolean, t: object }} props  — t is the active theme object
 */
export default function StopwatchView({ dark, t }) {
  const [elapsed, setElapsed] = useState(0)
  const [status, setStatus]   = useState('idle') // idle | running | paused
  const itv = useRef(null)

  // ── Controls ───────────────────────────────────────────────────────────────
  const start  = () => setStatus('running')
  const stop   = () => { setStatus('idle'); setElapsed(0) }
  const pause  = () => setStatus('paused')
  const resume = () => setStatus('running')

  // ── Elapsed-time interval ──────────────────────────────────────────────────
  useEffect(() => {
    if (status === 'running') {
      itv.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      clearInterval(itv.current)
    }
    return () => clearInterval(itv.current)
  }, [status])

  const started = status !== 'idle'
  const paused  = status === 'paused'

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 0 48px' }}>

      {/* Clock — visible only when running or paused */}
      {started && (
        <div style={{ marginBottom: 10 }}>
          {/* total=0 triggers the 60-second cycle formula inside ClockCanvas */}
          <ClockCanvas elapsed={elapsed} total={0} dark={dark} size={224} />
        </div>
      )}

      {/* Elapsed time display — large when idle, smaller when running */}
      <div style={{
        fontSize: started ? 38 : 72,
        fontWeight: started ? 300 : 200,
        letterSpacing: '.08em',
        fontVariantNumeric: 'tabular-nums',
        color: t.text,
        transition: 'font-size .3s, font-weight .3s',
        marginBottom: 40,
      }}>
        {fmt(elapsed)}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 14 }}>
        {!started ? (
          <Btn onClick={start} bg={t.green} fg={t.greenFg} wide>Start</Btn>
        ) : (
          <>
            <Btn onClick={stop} bg={t.gray} fg={t.grayFg}>Stop</Btn>
            <Btn
              onClick={paused ? resume : pause}
              bg={paused ? t.green : t.orange}
              fg={paused ? t.greenFg : t.orangeFg}
            >
              {paused ? 'Resume' : 'Pause'}
            </Btn>
          </>
        )}
      </div>
    </div>
  )
}
