# Developer Workspace — AGENTS.md

## Project
Vite + React + TypeScript landing page for a Chrome extension.

## Commands
- `npm run dev` — start dev server with HMR
- `npm run build` — typecheck + production build to `dist/`
- `npm run preview` — preview the production build locally

## Deployment
- GitHub Pages: pushes to `home` branch trigger `.github/workflows/jekyll-gh-pages.yml`
- Live at: https://developer-workspace.blogspot.com
- Workflow runs `npm ci && npm run build`, uploads `dist/`

## Structure
- `src/App.tsx` — root component, composes Hero → Features → Cta → Footer
- `src/components/*.tsx` — one component per section (no routing, no state management)
- `src/App.css` — single stylesheet, CSS custom properties, responsive breakpoints
- `public/assets/` — screenshots, logo, favicons (copied as-is by Vite)
- `icons/` — Chrome extension icons (16/32/48px), not used by the landing page
- `docs/plans/` — design docs

## Conventions
- Default branch is `home` (not `main` or `master`)
- Dark/light theme toggled via fixed button in top-right; preference persisted to `localStorage`, falls back to `prefers-color-scheme`
- Inline SVG icons in components (no icon library)
- System font stack (`Inter, system-ui, sans-serif`)
- `npm run build` runs `tsc -b && vite build` — fix TS errors first if build fails
