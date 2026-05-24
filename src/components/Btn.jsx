/**
 * Rounded pill button used throughout the app.
 *
 * @param {{
 *   onClick:   () => void,
 *   bg:        string,
 *   fg:        string,
 *   children:  React.ReactNode,
 *   wide?:     boolean,
 *   disabled?: boolean,
 * }} props
 */
export default function Btn({ onClick, bg, fg, children, wide = false, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-hover"
      style={{
        background:     bg,
        color:          fg,
        border:         'none',
        borderRadius:   100,
        padding:        wide ? '16px 56px' : '14px 32px',
        fontSize:       16,
        fontWeight:     400,
        cursor:         disabled ? 'default' : 'pointer',
        fontFamily:     'inherit',
        letterSpacing:  '.01em',
        transition:     'background .2s, color .2s',
        minWidth:       wide ? 160 : 108,
        opacity:        disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  )
}
