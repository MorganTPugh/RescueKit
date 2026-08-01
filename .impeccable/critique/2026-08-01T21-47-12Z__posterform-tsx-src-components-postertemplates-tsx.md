---
target: Flyers & Bios poster builder (App.tsx, PosterForm.tsx, PosterTemplates.tsx)
total_score: 27
p0_count: 1
p1_count: 3
timestamp: 2026-08-01T21-47-12Z
slug: posterform-tsx-src-components-postertemplates-tsx
---
# Design Critique — RescueKit "Flyers & Bios" Poster Builder

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Selecting a 5th trait past the stated "up to 4" cap gives zero feedback either way |
| 2 | Match System / Real World | 3 | Plain, volunteer-friendly copy throughout; "Gemini's AI Bio-writer" surfaces a vendor name irrelevant to a foster's mental model |
| 3 | User Control and Freedom | 3 | Free step navigation + guarded "Start Fresh"; no undo when AI generation overwrites hand-typed text |
| 4 | Consistency and Standards | 2 | "SELECT CORE TRAITS (UP TO 4)" is false — 5+ traits can be selected with no cap enforced |
| 5 | Error Prevention | 2 | No confirmation before AI bio generation silently replaces existing text |
| 6 | Recognition Rather Than Recall | 3 | Step tabs + preset loader reduce recall load well |
| 7 | Flexibility and Efficiency | 3 | Steps are directly clickable, not gated sequentially |
| 8 | Aesthetic and Minimalist Design | 3 | Poster outputs are clean; editor chrome undercut by 3 arbitrarily-colored AI-bio buttons |
| 9 | Error Recovery | 3 | Error banner gives a concrete manual-edit workaround |
| 10 | Help and Documentation | 3 | "How to export & share" modal is concrete and well-scoped |
| **Total** | | **27/40** | **Acceptable (upper edge)** |

## Anti-Patterns Verdict

**LLM assessment**: Not classic AI-slop at a glance — no gradient-mesh hero, no purple-glow SaaS cliché, and the generated poster *outputs* are genuinely well-crafted. But the editor shell has drifted from its own documented design system: DESIGN.md specifies Electric Indigo (#4f46e5) as the sole accent on ≤10% of any screen, yet the shipped app uses `sky-600` blue everywhere (tabs, CTAs, focus rings, borders) — Indigo appears exactly once, as a swatch inside the poster's own color picker.

**Deterministic scan**: CLI scan (`detect.mjs` against the 3 target files) returned exit code 2 with 15 findings — 9 `design-system-color` advisories (hex colors not matching any established token, `App.tsx:366` and `PosterTemplates.tsx:1026`/`2184`) and 7 `gray-on-color` contrast warnings (all in `PosterTemplates.tsx`, e.g. `text-slate-700` on `bg-indigo-50`). The live-page browser overlay additionally surfaced 23 anti-patterns via console: a body-text cluster running as small as 7–9px, all-caps body copy, 1.20 line-height (below the 1.3 floor), prose lines running 85–125 characters (vs. the 65–75ch guideline), a `cubic-bezier(0.34, 1.56, 0.64, 1)` **bounce easing** applied at the `body` level (an explicitly-banned motion pattern), a "ghost-card" combination (1px border + 25–50px shadow blur) on the main poster/print card, and 4 instances of cards nested inside cards.

**False positives / caveats**: the `skipped-heading` findings (h1→h4 skipping h2) are likely incidental markup from the AI-bio preview text rather than an authored heading-hierarchy choice. `overused-font: inter 97%` is intentional (single-font product-register design, not a defect). The `design-system-color` hex flags are advisory-only since the detector doesn't have visibility into this project's actual DESIGN.md tokens.

## Overall Impression

The generated poster *output* is the strongest part of this tool — genuinely on-brand, well-typeset, professional. The **editor chrome around it** is where the gap is: it doesn't match its own documented design system (wrong accent color, arbitrary button colors), has a real functional bug in the trait picker, and carries a cluster of small-but-compounding typography issues (tiny text, tight leading, long lines) that undercut the "usable without strain, wide age range and device quality" accessibility baseline the product itself commits to in PRODUCT.md. None of this is catastrophic, but it's the difference between "good enough" and the Canva-level polish the brand explicitly aims for.

## What's Working

1. **Preset loader + guarded "Start Fresh"** — solves the blank-page problem instantly for first-time users while protecting against accidental data loss with a targeted confirm dialog.
2. **Direct step-tab navigation** — steps aren't gated behind Next-only progression; jumping straight to step 4 works, serving efficiency without punishing users who want structure.
3. **"How to export & share" modal** — concrete and scoped to real use cases (bulletin-board PDF vs. Instagram square) instead of generic export filler.

## Priority Issues

**[P0] Personality trait cap is broken, and the UI actively lies about it.**
Why it matters: The label reads "SELECT CORE TRAITS (UP TO 4)" but selecting a 5th, 6th, etc. trait succeeds with no cap enforced (verified live: 5 traits simultaneously checked). This is a stated-limit-vs-actual-behavior mismatch — exactly the kind of thing that erodes trust in every other stated constraint in the tool (photo counts, character limits, dimensions).
Fix: Either enforce the cap (disable/shake unselected chips past 4) or drop the false "(up to 4)" claim from the copy.
Suggested command: `$impeccable harden`

**[P1] Editor chrome doesn't match its own documented color system.**
Why it matters: DESIGN.md states saturated accents are reserved for poster *output*, with the editor chrome staying neutral and Indigo used sparingly (≤10%) as the sole accent. In practice, the shipped editor uses `sky-600` blue everywhere and Indigo appears exactly once. Compounding this, the 3 "AI Bio-writer" style buttons use three unrelated saturated hues (dark brown, pink, sky) matching no documented token — corroborated by the detector's `design-system-color` flags on the same files.
Fix: Recolor the shipped editor chrome to Indigo per spec (or formally update DESIGN.md if sky-blue is now the real intended primary — right now the two disagree), and restyle the 3 AI-bio buttons as neutral pill toggles with one consistent accent for the active state.
Suggested command: `$impeccable audit`, then `$impeccable colorize`

**[P1] A compounding cluster of typography/readability issues across the poster templates.**
Why it matters: The detector found body text as small as 7–9px, all-caps body copy, line-height at 1.20 (below the 1.3 floor for readable body text), and prose running 85–125 characters per line (vs. the 65–75ch guideline) — all inside `PosterTemplates.tsx`. Individually minor, but they compound directly against PRODUCT.md's own accessibility baseline ("usable without strain... wide age range and device quality").
Fix: Establish a typography floor (no body text below ~10-11px in the editor UI; posters can go smaller by design but should stay ≥1.3 line-height), and cap prose line lengths inside bio/description boxes.
Suggested command: `$impeccable typeset`

**[P1] Bounce/elastic easing applied at the `body` level violates a hard motion rule.**
Why it matters: The detector found `cubic-bezier(0.34, 1.56, 0.64, 1)` — a bounce curve — set on `body`, meaning it likely cascades into transitions across the whole app rather than being an isolated, intentional flourish. The shared design guidance is explicit: exponential ease-out only, no bounce, no elastic, anywhere.
Fix: Replace with an ease-out-quart/quint curve at the body level; reserve any bounce (if truly wanted) for one small, deliberate, isolated interaction — never global.
Suggested command: `$impeccable animate`

**[P2] Mobile step-tab strip overflows with no discoverability cue.**
Why it matters: At a 375×812 viewport (the primary context for this tool's on-the-go foster audience), the step-tab strip scrolls horizontally with no fade edge, arrow, or dot indicator — step 4 "Flyer Style" is invisible without accidental swipe-discovery. A first-time user may believe the wizard ends at step 3.
Fix: Add a right-edge fade/gradient mask or chevron affordance when the strip is scrollable, or switch to a 2×2 grid of step labels below a certain viewport width.
Suggested command: `$impeccable clarify`

## Persona Red Flags

**Jordan (First-Timer)**: On mobile, step 4 is invisible without accidental swipe (see P2 above). Separately, the silently-broken trait cap will confuse a first-timer who takes the "(up to 4)" instruction at face value and second-guesses their own selections when nothing stops them from adding more.

**Sam (Accessibility-Dependent)**: The 3 AI-bio-writer buttons have no `aria-pressed`/selected-state semantics distinguishing "style used" from "style available" — a screen-reader user gets no indication which style actually produced the current bio text. Separately, several `gray-on-color` contrast pairings (e.g. `text-slate-700` on `bg-indigo-50`) fall short of comfortable reading contrast.

**Riley (Stress-Tester)**: Rapidly clicking every trait chip produces no error state, no cap enforcement, and no visible limit — a stress test immediately surfaces the same state-corruption underlying the P0 finding above.

## Minor Observations

- **Ghost-card pattern + nested cards**: the main poster/print card pairs a 1px border with a 25–50px shadow blur (an explicitly-named anti-pattern), and 4 instances of cards nested inside cards were detected (e.g. a `bg-sky-50/70` box wrapped inside a further `bg-sky-50/50` container).
- **No confirmation before AI-generated bio overwrites hand-typed text** — if a foster has hand-written a heartfelt bio and taps a style button out of curiosity, that work is silently replaced. Worth a lightweight inline confirm ("Replace your current description?") when the existing text looks substantive.
- Success toast copy ("Bio generated! Check the preview on the right...") is well-written and actionable.
- "Gemini is dreaming up the perfect pet profile..." loading copy is charming but ties user-facing language to a vendor/model name — a minor rebrand/support risk given this exact vendor's models have already needed a deprecation workaround this session.
- Two `skipped-heading` (h1→h4, missing h2) instances are likely incidental from the AI-bio preview markup rather than an authored hierarchy choice — low priority.

## Questions to Consider

1. If Indigo is core to the "Grounded. Capable. Caring." brand personality, why does the entire shipped editor use sky-blue instead — has DESIGN.md described an aspiration that was never implemented, or has the app quietly drifted since it was written?
2. Is the "up to 4" trait cap a real product decision (keep bios focused) that a bug quietly disabled, or was it always aspirational copy that nobody wired up?
3. Should the AI generator ever expose "Gemini" to end users at all, given the target foster volunteer has no reason to care which model wrote it — and the team is already managing backend model-deprecation churn?
