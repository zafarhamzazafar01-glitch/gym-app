# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` / `npm run preview` — production build (to `dist/`) / serve it
- `npm run lint` — oxlint (config in `.oxlintrc.json`)
- `npm test` — Node's built-in test runner over `src/**/*.test.js` (no Vite/DOM; tests cover pure `utils/` code)
- Single test file: `node --test src/utils/workouts.test.js`; single test: add `--test-name-pattern="<name>"`

## Architecture

FitTrack: a React 19 + Vite single-page fitness tracker (plain JSX, no TypeScript, no router, no backend). Charts use recharts, icons use lucide-react.

- **Navigation is state, not a router.** `App.jsx` holds `activePage` and renders the page by id. Sidebar entries come from `data/navItems.js`; ids without a dedicated page in `App.jsx` fall through to `pages/Placeholder.jsx`. To add a page: add a nav item, then add a branch in `App.jsx`.
- **Dashboard runs on sample data.** `data/sampleData.js` is hard-coded placeholder data (marked in the UI via `SampleBadge`), not user data. It is separate from the real workouts feature.
- **My Workouts is the only real, persisted feature.** Layering:
  - `utils/workoutModel.js` — the canonical Workout/Exercise shape, id/date helpers, and form↔workout converters (forms hold strings; saved workouts hold numbers).
  - `utils/workoutOperations.js` — pure, immutable CRUD (return new arrays) plus sorting.
  - `utils/workoutValidation.js` — form validation.
  - `utils/workoutStorage.js` — the only code touching `localStorage` (key `fittrack.workouts.v1`); load never throws, save returns a boolean.
  - `hooks/useWorkouts.js` — owns state; every change goes through `commit()`, which updates React state and localStorage together and exposes `saveFailed`.
  - `components/workouts/*` and `pages/MyWorkouts.jsx` — UI.
- Utils take injectable dependencies (`storage`, `now`) so they can be unit-tested in plain Node; keep new logic in `utils/` the same way.
- Styles are per-area plain CSS files in `src/styles/` (no CSS framework/modules).
