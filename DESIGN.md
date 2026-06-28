---
name: RescueKit
description: Create gorgeous, high-impact printable and digital posters for foster animals.
colors:
  primary: "#4f46e5"
  accent-peach: "#f43f5e"
  accent-sage: "#047857"
  accent-gold: "#f59e0b"
  accent-terra: "#c2410c"
  accent-berry: "#a21caf"
  neutral-bg: "#f8fafc"
  neutral-ink: "#0f172a"
  sky-tint: "#f0f9ff"
  emerald-success: "#10b981"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  xxl: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.xl}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "#3730a3"
  button-success:
    backgroundColor: "{colors.emerald-success}"
    textColor: "#ffffff"
    rounded: "{rounded.xl}"
    padding: "12px 8px"
  button-success-hover:
    backgroundColor: "#047857"
  form-input:
    backgroundColor: "#fafaf9"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.lg}"
    padding: "10px"
---

# Design System: RescueKit

## 1. Overview

**Creative North Star: "The Caring Canvas"**

RescueKit's user interface is styled as a clean, hope-focused layout where structural off-white containers sit on top of subtle sky-blue and indigo gradients. It is a highly approachable, Canva-like, and flexible workspace that focuses on giving foster volunteers and rescue coordinators creative freedom without technical overhead.

The interface purposefully rejects the heavy guilt-trip aesthetics of traditional animal charity marketing, avoids childlike cartoon bubble shapes, and eschews analytical SaaS dashboards filled with metric cards. The visual vibe is bright, spacious, and supportive.

**Key Characteristics:**
- Low-contrast, ambient sky-blue backgrounds for focus.
- Generous, organic corner rounding (24px on main app containers).
- Accent colors reserved for primary action items and state indications.
- Dynamic multi-stepper navigation that keeps forms clear and step-based.

## 2. Colors

The interface uses a Restrained color strategy for the editor shell to ensure the foster animal's photo remains the focal point, while supporting a rich palette of theme presets for the poster canvas itself.

### Primary
- **Electric Indigo** (#4f46e5): Used for tab states, primary selections, focus rings, and main call-to-actions.

### Secondary
- **Warm Coral** (#f43f5e): Peach accent variant used for whimsical poster themes.
- **Emerald Green** (#047857): Used for success toasts, print instructions, and Zero-Hurdle info boards.

### Neutral
- **Clean Sky Tint** (#f0f9ff): Background canvas color to keep the environment feeling light and airy.
- **Grounded Slate** (#0f172a): Deep high-contrast ink for body text, headings, and readable instructions.

### Named Rules
**The Accent Isolation Rule.** The primary Indigo accent is used on ≤10% of any given screen. Its purpose is to guide focus, not decorate.

**The Output Drenching Rule.** Saturated colors and secondary accents are reserved exclusively for the generated adoption flyer outputs. The editor chrome remains strictly neutral.

## 3. Typography

**Display Font:** Space Grotesk (with sans-serif fallback)
**Body Font:** Inter (with ui-sans-serif fallback)
**Label/Mono Font:** JetBrains Mono

**Character:** The pairing of Space Grotesk for Display and Inter for body text establishes a clean, modern, and highly legible interface. Space Grotesk brings structural confidence to headers, while Inter's neutral glyphs maintain comfortable reading lengths in form settings.

### Hierarchy
- **Display** (Bold, 1.5rem, 1.2): Used for main app section titles and page headers.
- **Headline** (Semi-bold, 1.25rem, 1.25): Used for modal titles and component block headers.
- **Title** (Bold, 0.875rem, 1.25): Used for input labels and step titles.
- **Body** (Medium, 0.75rem, 1.5): Used for general form descriptors and instruction text. Max line length is capped at 65ch.
- **Label** (Black, 0.625rem, uppercase, letter-spacing 0.1em): Used for kicker headings and uppercase metadata labels.

### Named Rules
**The Single UI Font Rule.** All editor controls, stepper navigation, and system status text use the Inter sans-serif font stack. Special display fonts (e.g. Fraunces, Caveat, Fredoka) are strictly restricted to the poster preview canvas.

## 4. Elevation

RescueKit relies primarily on thin border strokes and soft ambient shadow glows to create structural layers, maintaining a modern, lightweight physical layout.

### Shadow Vocabulary
- **Soft Ambient Glow** (`box-shadow: 0 20px 25px -5px rgba(224, 242, 254, 0.6)`): Used under the main form card and preview card.
- **Focus Glow** (`box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15)`): Applied to active form inputs and focused selector options.

### Named Rules
**The Ambient-Only Shadow Rule.** Shadows must never be solid black or high-opacity. They should use sky-blue tint overlays to preserve a bright, optimistic visual posture.

## 5. Components

### Buttons
- **Shape:** Rounded full (9999px) for aspect ratio pill selectors; Rounded XL (12px) for form actions.
- **Primary:** bg-sky-600, text-white, padding 8px 16px.
- **Secondary (Preset Loaders):** bg-sky-50, border-sky-200, text-sky-800, padding 10px 4px.
- **Danger (Start Fresh):** bg-orange-50, border-orange-200, text-orange-700, padding 12px 4px.

### Cards / Containers
- **Corner Style:** Rounded 3xl (24px) on main editor boxes; Rounded 2xl (16px) on minor notices.
- **Background:** bg-white or bg-emerald-50/50.
- **Border:** 1px border in sky-100/60.
- **Internal Padding:** 24px (p-6) for desktop layouts, scaled to 16px (p-4) on mobile viewports.

### Inputs / Fields
- **Style:** bg-stone-50/70, border-2 border-stone-200, radius 12px, padding 10px.
- **Focus:** border-sky-400 with an outline-none state.

### Navigation
- **Style:** Tab bar container wrapper in bg-sky-50/70 with 4px inner padding.
- **Active state:** bg-sky-600 text-white shadow-md shadow-sky-200.
- **Inactive state:** text-sky-900/75 hover:text-sky-950 hover:bg-white/80.

## 6. Do's and Don'ts

### Do:
- **Do** use OKLCH color space for styling updates inside the stylesheet.
- **Do** confirm with a confirmation modal guard before executing "Start Fresh" to prevent accidental volunteer data loss.
- **Do** map the Escape key to close all overlay modals and preview windows.
- **Do** keep font sizes for subtitles above 10px to ensure legibility on low-quality mobile devices.

### Don't:
- **Don't** use cartoon fonts, bubble shapes, or primary-color overload on the UI chrome (avoid crayon-cute aesthetics).
- **Don't** use dark mode with heavy purple gradients, neon accents, or glassmorphism (avoid sad-charity or SaaS dashboard clichés).
- **Don't** use border-left or border-right greater than 1px as a colored accent strip on cards or callouts (avoid side-stripe borders).
- **Don't** use gradient text (`background-clip: text`) on UI headings or labels.
- **Don't** animate image scale or rotation on hover of the flyer preview elements.
