# Clock App

A minimalist **Timer** and **Stopwatch** app built with React, featuring an animated analog clock visualization, iOS-style scroll-wheel input, and a dark/light theme toggle.

---

## Site Link:
link:  [TicTacToe-Game](https://mahin-katariya.github.io/clock/)

---

## Core Logic Flow

The app operates on a clean unidirectional data flow, keeping the UI perfectly in sync with the running state at all times.

1. **State Representation:** Each mode (timer/stopwatch) tracks a single numeric value — `remaining` seconds for the timer and `elapsed` seconds for the stopwatch. All derived values (progress angle, formatted time, button labels) are computed on every render from this single source of truth.

2. **Move Validation (Guardrails):**
   - **Empty Input Check:** The Start button is disabled and visually dimmed when the timer input is `00:00:00`, preventing a zero-duration countdown.
   - **Conclusion Check:** The timer freezes on reaching zero, transitions to a `done` state, and swaps the Pause button for a Restart button to prevent post-completion modifications.

3. **Derived Logic:** Winner/completion state is never stored explicitly. Instead, `status` drives the interval — it is set to `'done'` inside the `setInterval` callback the moment `remaining` hits zero, and the interval is immediately cleared via the `useEffect` cleanup. This keeps the state minimal and the transitions predictable.

4. **Clock Angle Algorithm:** The hand angle is computed geometrically on every animation frame:
   - **Timer:** `angle = (elapsed / total) × 360` — sweeps 0 → 360° over the full duration.
   - **Stopwatch:** `angle = (elapsed % 60) / 60 × 360` — one full rotation per 60 seconds, like a seconds hand.

5. **Animation:** A `requestAnimationFrame` loop runs independently of React renders. It lerps the displayed angle toward the target angle (~110 ms chase), appends to a trail array when the hand moves more than 1.1°, and detects wrap-around (diff < −180°) to clear the trail cleanly on stopwatch cycles.

---

## Technical Stack

- **React** — Functional components and Hooks (`useState`, `useEffect`, `useRef`)
- **JavaScript (ES2022)** — No TypeScript; canvas drawing uses modern APIs (`roundRect`, shadow blur)
- **HTML5 Canvas** — All clock rendering is done via the 2D canvas API at 2× pixel density for sharp HiDPI display
- **CSS** — Scroll-snap for the iOS picker; `linear-gradient` overlays for fade; `@import` from Google Fonts for Geist
- **Vite** — Dev server and production bundler

---

## Project Structure

```
clock-app/
├── index.html                  # Entry HTML; Google Fonts @import lives in index.css
└── src/
    ├── main.jsx                # Vite entry — mounts <App />
    ├── index.css               # Reset, scrollbar hide, button interaction classes
    ├── theme.js                # Dark/light design tokens (TH.d / TH.l)
    ├── App.jsx                 # Root: tab switcher, theme toggle, SunIcon/MoonIcon
    ├── components/
    │   ├── ClockCanvas.jsx     # Canvas + rAF loop, lerp animation, ghost trail
    │   ├── PickerCol.jsx       # iOS scroll-snap picker column (hh / mm / ss)
    │   ├── Btn.jsx             # Reusable rounded pill button
    │   ├── TimerView.jsx       # Timer tab — picker → clock + countdown → controls
    │   └── StopwatchView.jsx   # Stopwatch tab — clock + elapsed time → controls
    ├── hooks/
    │   └── useInterval.js      # Safe setInterval hook (always calls latest callback)
    └── utils/
        ├── clockDraw.js        # paintClock, paintHand, prand — pure canvas functions
        └── format.js           # fmt(seconds) → "hh:mm:ss"
```

---

## Getting Started

```bash
# 1. Scaffold and enter the project
npm create vite@latest clock-app -- --template react
cd clock-app

# 2. Replace the generated src/ and index.html with the project files
#    (delete src/App.css and src/assets — they are not used)

# 3. Install dependencies and start the dev server
npm install
npm run dev
```

### Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

### Deploy

The `dist/` folder is a self-contained static site — drop it anywhere:

| Platform | Method |
|---|---|
| **Vercel** | `npx vercel` in the project root |
| **Netlify** | Drag and drop `dist/` into netlify.com/drop |
| **GitHub Pages** | Use the `gh-pages` npm package or a GitHub Actions workflow |
| **Cloudflare Pages** | Connect the repo; set build command `npm run build`, output dir `dist` |
