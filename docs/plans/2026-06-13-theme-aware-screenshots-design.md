# Theme-Aware Screenshots

## Goal

Use the supplied light screenshots when the landing page is in light mode and
the supplied dark screenshots when it is in dark mode.

## Design

- Import all six screenshot assets explicitly so Vite includes them reliably.
- Pass `isDarkMode` to the hero preview and select the matching home screenshot.
- Store a light and dark source on each gallery screenshot entry and select the
  matching source while rendering.
- Keep the screenshot files, layout, dimensions, alt text, and lazy-loading
  behavior unchanged.

## Verification

- Build the production bundle and confirm all six assets are emitted.
- Run the existing Vitest suite.
- Audit the source mappings for the hero, tools, and settings screenshots.
