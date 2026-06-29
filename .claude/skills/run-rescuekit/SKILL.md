---
name: run-rescuekit
description: Run, start, launch, smoke test, or verify RescueKit — the React + Express foster-pet toolkit. Use when asked to run the app, test an endpoint, confirm a change works, or take a screenshot.
---

RescueKit is a React 19 + Tailwind SPA served by an Express dev server with Vite middleware. The server also exposes two API routes (`/api/generate-bio` and `/api/feedback`). The agent path is a `curl`-based smoke script; visual verification requires opening `http://localhost:3000` in a browser.

## Prerequisites

Node 18+ and npm already present in this repo. No additional OS packages needed.

`GEMINI_API_KEY` in `.env` is required for `/api/generate-bio` to return a real bio. Without it the route returns a 503; routing and all other checks still pass.

## Build

```bash
npm install
```

No separate compile step for dev mode — `tsx server.ts` handles everything via Vite middleware.

## Run (agent path)

```bash
bash .claude/skills/run-rescuekit/smoke.sh
```

The script:
1. Starts `npm run dev` in the background on port 3000
2. Waits up to 10 s for the server to accept connections
3. Asserts `GET /` → HTTP 200
4. Asserts `POST /api/feedback` with a valid payload → `{"success":true}`
5. Asserts `POST /api/generate-bio` with a pet object → either a bio (real key) or a Gemini key error — both confirm routing is wired correctly
6. Kills the server on exit

All output goes to stdout; the script exits non-zero on the first failure.

To test a specific API change, hit the endpoint directly after starting the server:

```bash
# Start server in background
GEMINI_API_KEY=placeholder npm run dev &
sleep 5

# Hit feedback
curl -s -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@t.com","subject":"S","message":"Hello"}'

# Hit generate-bio (needs real GEMINI_API_KEY in .env for a real response)
curl -s -X POST http://localhost:3000/api/generate-bio \
  -H "Content-Type: application/json" \
  -d '{"pet":{"name":"Luna","species":"dog","breed":"Labrador","age":"2 years","gender":"girl","weight":"45lbs","traits":["playful"],"goodWithDogs":"yes","goodWithCats":"yes","goodWithKids":"yes","houseTrained":"yes"},"style":"playful"}'
```

## Run (human path)

```bash
npm run dev
```

Opens `http://localhost:3000` — the full React UI with the poster builder, Foster Guide, Grants Hub, and Rescue Forms sections.

## Gotchas

- **`chromium-cli` is not available on this macOS machine** — visual/screenshot verification must be done by opening `http://localhost:3000` in a real browser. The smoke script covers all server-side behavior.
- **Feedback submissions are appended to `feedback_submissions.json`** on disk — smoke test runs will leave a stale entry there. That file is gitignored-by-convention (not yet in `.gitignore`), so it won't pollute commits, but delete it manually if needed.
- **The `GEMINI_API_KEY=placeholder` trick** initializes the Gemini client and attempts a real API call — it reaches Google's servers and gets a 400 back. Perfectly safe for smoke testing. If you need to avoid any outbound calls, check for `!ai` in `server.ts:38` and hit the endpoint without setting the env var at all (returns 503 instead).
- **Port 3000 must be free** before running the smoke script. If something else is on it: `lsof -ti:3000 | xargs kill`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Address already in use` | `lsof -ti:3000 \| xargs kill` |
| `GEMINI_API_KEY not defined` warning in logs | Normal without a real key; bio generation returns 503, all other routes still work |
| Smoke script times out waiting for server | Run `npm install` first; `tsx` cold-start on first run can be slow |
| `tsx: command not found` | `npm install` — tsx is a devDependency |
