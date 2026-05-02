# Landing Page Redesign — Developer Workspace

## Direction
Clean & airy minimal design. Indigo accent on neutral light gray. Dark mode only.

## Tech
- Vite + React + TypeScript
- Vanilla CSS (single `App.css`)
- No routing, no state management, no external component libs

## Sections

### Hero
- Centered layout, large heading with gradient accent, short subtitle, single CTA button ("Add to Chrome — It's free"), subtle screenshot below
- Fade-in animation on heading only

### Features (4 cards, 2×2 grid)
1. **Smart Bookmarks** — Organize with custom categories and smart search
2. **Productivity Tools** — Pomodoro timer, notes, task manager
3. **Smart Features** — Weather, timezones, custom backgrounds
4. **Customization** — Themes and adjustable workspace

### CTA
- Minimal centered band: heading + download button + small rating text

### Footer
- Thin bar: social links (GitHub, Email, Blog, Twitter/X, LinkedIn, Dev.to) + copyright

## Visual spec
- Font: system stack (`Inter, system-ui, sans-serif`)
- Heading sizes: 3rem hero, 1.5rem features, 1.25rem CTA
- Card: white `#fff` bg with dark `#0f172a` text section background, 12px border-radius, subtle border `#e2e8f0`, shadow on hover
- Accent: `#4f46e5` (indigo)
- Max-width: 1100px, centered
- Spacing: 6rem between sections
- No glassmorphism, no floating animations, no theme toggle

## Files
```
index.html
src/
  main.tsx
  App.tsx
  App.css
  components/
    Hero.tsx
    Features.tsx
    Cta.tsx
    Footer.tsx
assets/         (static images — keep existing)
icons/          (Chrome extension icons — keep existing)
```

## Deployment
- `npm run build` → `dist/`
- GitHub Actions workflow updated to build and deploy from `dist/`
