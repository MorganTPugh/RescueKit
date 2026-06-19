# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Express + Vite HMR) on port 3000
npm run build        # Build frontend (Vite) + bundle server (esbuild → dist/server.cjs)
npm run start        # Run production build
npm run lint         # Type-check with tsc --noEmit (no test suite exists)
npm run clean        # Remove dist/ and server.js
```

## Environment

Copy `.env.example` to `.env` and set:
- `GEMINI_API_KEY` — required for AI bio generation via `/api/generate-bio`

## Architecture

This is a single-page React app with an Express backend that serves both as a Vite dev middleware and a production static file server.

**Server (`server.ts`)** — Express on port 3000. In dev it wraps Vite as middleware; in production it serves `dist/`. Two API routes:
- `POST /api/generate-bio` — calls Google Gemini (`@google/genai`) to write adoption bios
- `POST /api/feedback` — appends submissions to `feedback_submissions.json` on disk

**Frontend (`src/`)** — React 19 + Tailwind CSS v4 (via `@tailwindcss/vite` plugin, no config file needed). All state lives in `App.tsx` and is passed down as props.

**Data flow:**
1. `src/types.ts` defines `FosterPetData` and `PosterDesignSettings` — the two root state shapes
2. `src/data.ts` exports `SAMPLE_PETS` (presets) and `THEMES` (color schemes)
3. `App.tsx` owns all state and passes `pet`/`setPet`/`settings`/`setSettings` to children
4. `PosterForm` (left column) edits the data; `PosterTemplates` (right column) renders the live poster

**Poster rendering:**
- `PosterTemplates.tsx` — renders all template variants (`whimsical`, `minimalist`, `editorial`, `comic`, `polaroid`, `bio-only`, `two-photos`, `comic-2-photos`) as inline SVG/HTML. The element with `id="print-poster-card"` is captured by `html-to-image` for PNG export.
- `PosterPreviewWrapper.tsx` — scales the fixed-size poster canvas to fit the preview column
- Photo repositioning (drag + zoom) is handled inside `RepositionableImage` in `PosterTemplates.tsx` using mouse event refs

**Three app sections** toggled by `activeSection` state in `App.tsx`:
- `posters` — the poster builder (default)
- `guide` — `FosterGuide.tsx` (static content)
- `grants` — `RescueGrants.tsx` (static content)

**Print/export:** `window.print()` triggers CSS `@media print` which hides `.no-print` elements, leaving only the poster canvas visible. PNG export uses `html-to-image` with `pixelRatio: 3`.
