---
name: Obsidian Kinetic
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#0050cc'
  on-secondary: '#ffffff'
  secondary-container: '#0266ff'
  on-secondary-container: '#f9f7ff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#dae1ff'
  secondary-fixed-dim: '#b3c5ff'
  on-secondary-fixed: '#001849'
  on-secondary-fixed-variant: '#003fa4'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  display-2xl:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '800'
    lineHeight: 76px
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system is engineered for a high-performance e-commerce experience that blends the structural precision of premium tech with the kinetic energy of elite athletics. The brand personality is authoritative yet breathable, favoring extreme clarity over decorative clutter.

The aesthetic follows a **Neo-Minimalist** approach: 
- **Spaciousness:** Generous white space to allow high-fidelity product photography to lead the narrative.
- **High Contrast:** A "Panda" tonal strategy that uses absolute blacks and whites to create a rhythmic visual pace.
- **Precision:** A focus on alignment and micro-interactions that feel snappy and deliberate, evoking a sense of innovation and reliability.

## Colors
The palette is strictly functional, designed to disappear so that products stand out.

- **Primary (Obsidian):** `#000000` is used for primary text, branding, and core UI boundaries. It represents strength and permanence.
- **Accent (Electric Blue):** `#0066FF` is used sparingly for primary Call-to-Actions (CTAs), active states, and critical notifications. It provides the "high-energy" spark against the monochrome base.
- **Neutral Scale:** A range of grays from `#F5F5F7` (Apple-inspired surface tint) to `#737373` (subtle labels) handles secondary information and structural borders.
- **Feedback:** Success and error states should utilize the system's high-contrast logic—saturated tones that maintain legibility against white backgrounds.

## Typography
The system utilizes **Inter** across all levels to maintain a systematic, "San Francisco-style" clarity. The hierarchy is defined by extreme weight shifts.

- **Headlines:** Use Bold (700) or ExtraBold (800) with tight letter-spacing for a heavy, impactful "Nike-esque" feel on product launches.
- **Body:** Standard weight (400) with generous line-height to ensure maximum readability during long-form feature descriptions.
- **Labels:** Small, uppercase, and tracked out (0.05em) for secondary metadata and overlines.
- **Scaling:** Display sizes should shrink by approximately 15-20% on mobile devices to maintain visual impact without breaking layouts.

## Layout & Spacing
The layout relies on a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **The 8px Rhythm:** All spacing (padding, margins, gap) must be a multiple of 4px, with 8px and 16px being the standard increments for component internals.
- **Margins:** Desktop views should maintain a minimum of 48px side margins, while mobile reduces to 20px. 
- **Whitespace:** Use "oversized" vertical padding (80px+) between major page sections to create a premium, editorial feel.
- **Reflow:** On tablet, the 12-column grid persists but gutters may reduce to 16px to maximize content density.

## Elevation & Depth
Depth in this design system is subtle and atmospheric, moving away from heavy shadows toward tonal layering and refined outlines.

- **Level 0 (Base):** White (`#FFFFFF`).
- **Level 1 (Cards/Floating):** Use an extremely soft, diffused shadow: `0 4px 20px rgba(0,0,0,0.05)`. This creates a sense of floating without looking "muddy."
- **Level 2 (Modals/Overlays):** A more defined shadow: `0 12px 40px rgba(0,0,0,0.12)`.
- **Structural Lines:** Use 1px solid borders in `#E5E5E7` for segmenting content when shadows feel too heavy.

## Shapes
The shape language is "Modern-Soft"—rounded enough to feel approachable and high-tech (Apple style), but sharp enough to feel athletic and precise.

- **Standard (md):** 8px radius for buttons, input fields, and small cards.
- **Large (lg):** 16px radius for primary product containers and image cards.
- **Extra Large (xl):** 24px radius for large promotional banners and modals.
- **Interactive:** Hover states on buttons should not change the radius, but may slightly increase the shadow spread.

## Components
Components are heavily inspired by `shadcn/ui`, prioritizing clean lines and functional states.

- **Buttons:** 
  - *Primary:* Solid Obsidian background, white text, 8px radius.
  - *Secondary:* White background, 1px Obsidian border, Obsidian text.
  - *Accent:* Solid Electric Blue, white text (reserved for "Add to Cart").
- **Input Fields:** 1px border (`#E5E5E7`) that transitions to Obsidian on focus. No drop shadows on rest.
- **Chips/Badges:** Small, 4px radius, light gray background (`#F5F5F7`) with `label-sm` typography. Use for sizes or categories.
- **Cards:** 16px radius. Images should have a subtle 0.5px inner border to ensure they don't bleed into white backgrounds.
- **Lists:** Clean dividers (`#F5F5F7`) with 16px vertical padding. No chevrons unless the list item is explicitly a link to a new page.
- **Checkboxes & Radios:** Minimalist Obsidian fills when selected. Avoid bulky gradients.