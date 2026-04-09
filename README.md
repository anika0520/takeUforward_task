# 📅 Interactive Wall Calendar — Frontend Engineering Challenge

A polished, pixel-perfect wall calendar built with **Next.js 14**, **TypeScript**, and custom CSS. Every detail is intentional — from the spiral binding at the top to the month-specific illustrated hero panels and the three-theme switcher.

---

## ✨ Features

### Core Requirements (All Implemented)

- **Wall Calendar Aesthetic** — Physical wall calendar look with spiral binding, hero illustration panel, and paper textures
- **Day Range Selector** — Click to set start, click again to set end; live hover preview with visual range spanning across cells; clear visual states for start, end, in-range, today, and weekend days
- **Integrated Notes** — Type notes, pick a color, optionally attach to selected date range; notes persist via `localStorage`; delete individual notes
- **Fully Responsive** — Side-by-side layout on desktop, stacked on mobile; touch-friendly tap targets

### Bonus / Stand-Out Features

- 🎨 **12 unique month illustrations** — SVG-based scenes (mountain peaks, aurora, blooms, harvest moon, etc.) that change per month
- 🔄 **Page-flip animation** — CSS 3D perspective flip when navigating months
- 🌙 **Three themes** — Warm Parchment, Cool Blue, Midnight Dark — with instant switching
- 🟡 **Holiday markers** — Indian national holidays shown as gold dots with tooltips
- 🔵 **Hover range preview** — While selecting, the range preview follows your cursor in real time
- 📌 **Color-coded notes** — 5 accent colors for notes; range-attached notes show the date span
- 💾 **LocalStorage persistence** — Notes survive page refresh
- 📐 **Visual legend** — Inline legend explaining all day states

---

## 🛠 Tech Stack

| Layer      | Choice                               | Reason                                        |
| ---------- | ------------------------------------ | --------------------------------------------- |
| Framework  | Next.js 14 (App Router)              | Modern, performant, SSR-ready                 |
| Language   | TypeScript                           | Type safety for all state & props             |
| Styling    | Custom CSS + Tailwind utilities      | Full creative control with utility helpers    |
| Date utils | `date-fns`                           | Lightweight, tree-shakeable                   |
| Icons      | `lucide-react`                       | Consistent, minimal icon set                  |
| Fonts      | Playfair Display + DM Sans + DM Mono | Editorial serif + clean sans + monospace grid |
| Animations | Pure CSS (keyframes + transitions)   | No JS animation overhead                      |

---

## 🚀 Running Locally

```bash
# Clone / unzip the project
cd wall-calendar

# Install dependencies
npm install

# Start dev server
npm run dev

# Open in browser
open http://localhost:3000
```

**Requires:** Node.js 18+

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css       # All custom CSS, CSS variables, animation keyframes
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Entry point
├── components/
│   ├── WallCalendar.tsx  # Main orchestrator — layout, nav, themes
│   ├── HeroImage.tsx     # Month-specific SVG illustration panel
│   ├── CalendarGrid.tsx  # Day cells with range/hover/holiday states
│   └── NotesPanel.tsx    # Note input, color picker, notes list
└── hooks/
    └── useCalendar.ts    # All state management (selection, navigation, notes)
```

---

## 🎯 Design Decisions

**Aesthetic:** I chose a refined editorial direction — think _Monocle_ magazine meets physical stationery. The Playfair Display serif anchors the month name with gravitas while DM Mono gives the date grid a crisp, typeset feel.

**Architecture:** State is entirely in `useCalendar.ts` using a single `useState` object to avoid stale closure issues with date calculations. The hook exposes derived values (`getDayState`, `calendarDays`) so components stay pure and predictable.

**Range UX:** The selection model is "click to anchor start → hover to preview → click to confirm end", which matches how people naturally think about date ranges. The range highlight extends across the full cell background (not just the number circle) to make spans visually obvious.

**No backend:** All persistence uses `localStorage`. Notes are serialized as JSON per the spec.

---

_Built with care for the Frontend Engineering Internship Challenge._
