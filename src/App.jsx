import { useState } from 'react'
import { TH }            from './theme'
import TimerView         from './components/TimerView'
import StopwatchView     from './components/StopwatchView'

/** Minimalist sun icon (4 cardinal ticks + circle outline) */
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="9"    y1="1"    x2="9"    y2="3.2"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9"    y1="14.8" x2="9"    y2="17"   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1"    y1="9"    x2="3.2"  y2="9"    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14.8" y1="9"    x2="17"   y2="9"    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/** Minimalist crescent moon icon */
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.5 10.5A6 6 0 0 1 7.5 3.5a6 6 0 1 0 7 7z" fill="currentColor" />
    </svg>
  )
}

export default function App() {
  const [dark, setDark] = useState(true)
  const [mode, setMode] = useState('timer') // 'timer' | 'stopwatch'
  const t = dark ? TH.d : TH.l

  return (
    <div style={{
      minHeight:   '100vh',
      background:  t.bg,
      fontFamily:  "'Geist', 'Geist Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      color:       t.text,
      display:     'flex',
      flexDirection: 'column',
      alignItems:  'center',
      transition:  'background .35s, color .35s',
      overflowX:   'hidden',
    }}>

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div style={{
        width:      '100%',
        maxWidth:   460,
        padding:    '24px 24px 0',
        display:    'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing:  'border-box',
      }}>

        {/* Mode tabs */}
        <div style={{
          display:    'flex',
          background: t.tabBg,
          borderRadius: 12,
          padding:    4,
          gap:        2,
        }}>
          {['timer', 'stopwatch'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                background:    mode === m ? t.tabOn : 'transparent',
                color:         mode === m ? t.text  : t.muted,
                border:        'none',
                borderRadius:  9,
                padding:       '7px 16px',
                fontSize:      14,
                fontWeight:    mode === m ? 500 : 400,
                cursor:        'pointer',
                fontFamily:    'inherit',
                transition:    'all .2s',
                textTransform: 'capitalize',
                boxShadow:     mode === m && !dark ? '0 1px 4px rgba(0,0,0,.10)' : 'none',
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Dark / light toggle */}
        <button
          onClick={() => setDark(d => !d)}
          style={{
            background: t.tog,
            color:      t.text,
            border:     'none',
            borderRadius: 50,
            width:      40,
            height:     40,
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor:     'pointer',
            transition: 'background .3s, color .3s',
          }}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div style={{ width: '100%', maxWidth: 460, flex: 1, boxSizing: 'border-box' }}>
        {mode === 'timer'
          ? <TimerView     dark={dark} t={t} />
          : <StopwatchView dark={dark} t={t} />
        }
      </div>
    </div>
  )
}
