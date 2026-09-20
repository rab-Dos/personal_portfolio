# N8n — Style Reference
> Workflow engine at midnight — the feeling of a live automation canvas running in a dark server room, lit by status indicators and data flows.

**Themes:** light and dark. Light is the default; dark follows the operating-system preference unless the user has explicitly selected a theme.

n8n's visual origin is a workflow canvas at night — deep purple-black surfaces lit from within by orange fire and electric blue current. The light theme translates that same character into rose-white and cool lilac surfaces rather than simply inverting the dark palette. The signature visual move remains the orange-to-red Ember CTA. Typography runs entirely in geomanist at weights 300 and 400. Cards feel embedded through surface stepping and restrained inset edges instead of heavy shadows.

## Tokens — Colors

### Dark palette

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Base | `#0e0918` | `--color-void-base` | Primary page background and hero section — the near-black violet creates depth without being neutral charcoal |
| Elevated Surface | `#1a1624` | `--color-elevated-surface` | Card backgrounds (rgb(26,22,36)) — one step above void, visible as panels |
| Deep Panel | `#1b1728` | `--color-deep-panel` | Secondary card surface (rgb(27,23,40)) — close to Elevated Surface, used for 24px-radius feature cards |
| Muted Shell | `#2c2834` | `--color-muted-shell` | Ghost button backgrounds — semi-transparent frosted layer over dark surfaces |
| Border Smoke | `#3e3a46` | `--color-border-smoke` | Nav and container borders — low-contrast edge definition on dark surfaces |
| Ash Text | `#d1cece` | `--color-ash-text` | Primary body and UI text — warm-gray rather than pure white, reducing harshness against dark bg |
| Fog Text | `#9d9797` | `--color-fog-text` | Secondary body text, captions, de-emphasized labels |
| Silver Rail | `#e5e7eb` | `--color-silver-rail` | Border lines across components and nav — light border on dark background creates fine hairline edges |
| Cloud White | `#ffffff` | `--color-cloud-white` | High-emphasis headings, icon fills, badge text, active nav items |
| Steel Muted | `#48556a` | `--color-steel-muted` | Badge text on light badge backgrounds |
| Ember CTA | `linear-gradient(30deg, rgb(253, 137, 37), rgb(255, 12, 0))` | `--color-ember-cta` | Primary CTA buttons — orange-to-red gradient (rgb(253,137,37) → rgb(255,12,0)) burns against the dark void; the only warm-chromatic element above the fold, creating immediate focal pull |
| Electric Current | `linear-gradient(141deg, rgb(7, 122, 199), rgb(107, 33, 239))` | `--color-electric-current` | Decorative link underline glow and node connection lines — blue-to-violet gradient (rgb(7,122,199) → rgb(107,33,239)) signals data flow; do not use for text or focus rings |
| Ember Scorch | `#ff492c` | `--color-ember-scorch` | Icon fills and secondary highlight accents — pure saturated red-orange for SVG emphasis marks |
| Crimson Glow | `#56312d` | `--color-crimson-glow` | Card box-shadow tint — dark muted red used in shadow layers beneath cards, creating a heat-haze underneath panels |

### Light palette

The light theme keeps the same violet undertone and ember/electric accents. It is not a neutral-white inversion: cool lilac surfaces replace the dark violet depth, while ink colors preserve the original nocturnal character.

| Name | Value | Token | Role |
|------|-------|-------|------|
| Dawn Base | `#fffafa` | `--color-dawn-base` | Page background; a near-white with a restrained rose-violet cast |
| Paper Surface | `#ffffff` | `--color-paper-surface` | Cards and navigation surfaces |
| Lilac Panel | `#f2edf5` | `--color-lilac-panel` | Large feature panels and grouped regions |
| Mist Shell | `#e7e0eb` | `--color-mist-shell` | Inputs, tags, and tertiary controls |
| Graphite Violet | `#251d2f` | `--color-graphite-violet` | Primary text and headings |
| Plum Gray | `#5f5868` | `--color-plum-gray` | Secondary text and metadata |
| Accessible Border | `#76707e` | `--color-accessible-border-light` | Meaningful control boundaries and focus-adjacent edges |
| Current Blue | `#075f9e` | `--color-current-blue-light` | Links and focus rings on light surfaces |
| Current Violet | `#5a24c9` | `--color-current-violet-light` | Active states and the second stop of decorative current gradients |

### Semantic theme tokens

Components must consume these semantic tokens rather than a raw light or dark color. This makes both themes complete and prevents a component from retaining dark-theme colors after a theme change.

| Purpose | Light | Dark | Semantic token |
|---------|-------|------|----------------|
| Page canvas | `#fffafa` | `#0e0918` | `--surface-page` |
| Card surface | `#ffffff` | `#1a1624` | `--surface-card` |
| Feature panel | `#f2edf5` | `#1b1728` | `--surface-panel` |
| Muted control | `#e7e0eb` | `#2c2834` | `--surface-muted` |
| Primary text | `#251d2f` | `#d1cece` | `--text-primary` |
| High-emphasis text | `#0e0918` | `#ffffff` | `--text-strong` |
| Secondary text | `#5f5868` | `#9d9797` | `--text-secondary` |
| Meaningful border | `#76707e` | `#77717f` | `--border-control` |
| Decorative divider | `#d9d2df` | `#3e3a46` | `--border-subtle` |
| Link / focus | `#075f9e` | `#63a9e8` | `--interactive-accent` |
| CTA text | `#0e0918` | `#0e0918` | `--text-on-ember` |

### Accessibility contract (WCAG 2.2 AA)

- Normal text must reach at least **4.5:1** against every solid color or gradient stop beneath it; large text (at least 24px regular or 18.66px bold) must reach **3:1**.
- Meaningful control boundaries, icons, focus indicators, and state graphics must reach **3:1** against adjacent colors. `--border-subtle` is decorative only and must not be the sole boundary of an input or interactive control.
- The vivid Ember gradient uses `--text-on-ember` (`#0e0918`), not white. Its worst stop is `#ff0c00`, producing **4.95:1**; white on the orange stop is only **2.39:1** and is prohibited.
- The Electric Current gradient is decorative or graphical only. For text links and focus rings, use the solid `--interactive-accent` token because the violet dark-theme stop reaches only **2.88:1** against Void Base.
- Verified representative text pairs: dark primary on Void Base **12.54:1**, dark secondary on Void Base **6.82:1**, light primary on Dawn Base **15.68:1**, and light secondary on Dawn Base **6.59:1**.
- Do not communicate status, selection, validation, or theme using color alone. Pair color with text, an icon, shape, underline, or another persistent cue.
- Focus indicators are at least 2 CSS px thick, have a 2 CSS px offset, remain visible in both themes, and are never removed without an equivalent replacement.

Worst-case ratios across all four semantic surfaces:

| Foreground / boundary | Light minimum | Dark minimum | Requirement | Result |
|-----------------------|---------------|--------------|-------------|--------|
| Primary text | 12.55:1 | 9.20:1 | 4.5:1 | Pass AA / AAA |
| Secondary text | 5.28:1 | 5.00:1 | 4.5:1 | Pass AA |
| Link and focus color | 5.18:1 | 5.73:1 | 4.5:1 text; 3:1 focus | Pass AA |
| Meaningful border | 3.70:1 | 3.05:1 | 3:1 | Pass |
| CTA text across Ember gradient | 4.95:1 | 4.95:1 | 4.5:1 | Pass AA |

## Tokens — Typography

### geomanist — The sole display and body typeface. Weight 300 at 48–54px is the defining choice — headlines whisper against the dark background rather than asserting. Weight 400 handles body copy at 15–18px with 1.5–1.7 line-height for comfortable reading in dark contexts. The compressed line-height of 0.88 at 54px stacks headline lines into a dense visual block. · `--font-geomanist`
- **Substitute:** DM Sans, Inter (variable, set to weight 300 for display)
- **Weights:** 300, 400
- **Sizes:** 12px, 14px, 15px, 16px, 18px, 20px, 24px, 48px, 54px
- **Line height:** 0.88–1.70 (tight 0.88 at display sizes, 1.5–1.7 at body sizes)
- **Letter spacing:** -1.08px at 54px, -0.86px at 48px (from -0.018em to -0.020em; tight negative tracking at display sizes, normal at body)
- **Role:** The sole display and body typeface. Weight 300 at 48–54px is the defining choice — headlines whisper against the dark background rather than asserting. Weight 400 handles body copy at 15–18px with 1.5–1.7 line-height for comfortable reading in dark contexts. The compressed line-height of 0.88 at 54px stacks headline lines into a dense visual block.

### geomanist-book — Medium-emphasis subheadings and section labels. The 'book' variant sits optically between 300 and regular 400, used for callout text in feature cards and section introductions at 20–24px. · `--font-geomanist-book`
- **Substitute:** DM Sans 500
- **Weights:** 400
- **Sizes:** 16px, 18px, 20px, 24px
- **Line height:** 1.00, 1.50
- **Letter spacing:** -0.29px at 16px (from -0.0180em); -0.17px at 24px (from -0.0070em)
- **Role:** Medium-emphasis subheadings and section labels. The 'book' variant sits optically between 300 and regular 400, used for callout text in feature cards and section introductions at 20–24px.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | -0.29px | `--text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 20px | 1.25 | — | `--text-heading-sm` |
| heading | 24px | 1.2 | -0.17px | `--text-heading` |
| heading-lg | 48px | 0.94 | -0.86px | `--text-heading-lg` |
| display | 54px | 0.88 | -1.08px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| nodes | 12px |
| pills | 9999px |
| badges | 24px |
| inputs | 8px |
| buttons | 8px |
| cardsLarge | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.2) 0px 1px 1px 0px inset, rgba(8, 8...` | `--shadow-subtle` |
| sm | `rgba(0, 0, 0, 0.26) 0px 0px 8px 0px` | `--shadow-sm` |
| subtle-2 | `rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset, rgba(255,...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Element gap:** 16-24px

## Components

### Ember Gradient CTA Button
**Role:** Primary call-to-action, top nav and hero section

Background: linear-gradient(30deg, rgb(253,137,37), rgb(255,12,0)). Text: `--text-on-ember` (#0e0918), geomanist 400 14–16px. Border-radius: 8px. Padding: 10–14px vertical, 20–24px horizontal. No border. On hover, change elevation or brightness only if the new full gradient remains at least 4.5:1 with the label. This is the only warm-chromatic element in the nav.

### Ghost Outline Button
**Role:** Secondary action, hero section ('Talk to sales')

Background: transparent. Border: 1px solid `--border-control`. Text: `--text-strong`, geomanist 400. Border-radius: 6px. Padding: 24px all sides (generous equal padding creates a square-ratio for short labels). Shadow: none.

### Frosted Ghost Button
**Role:** Tertiary actions and icon buttons over dark card surfaces

Background: `--surface-muted`. Border: 1px solid `--border-control`. Text: `--text-primary`. Border-radius: 8px. Padding: 14px all sides. In dark mode only, the optional halo is rgba(0,0,0,0.26) 0px 0px 8px 0px. The solid semantic surface avoids contrast changing unpredictably with content behind the control.

### Pill Tag Button
**Role:** Use-case category pills and filter selectors

Background: `--surface-muted`. Border: 1px solid `--border-control`. Text: `--text-primary`. Border-radius: 8px. Padding: 0 20px. Minimum target size: 44 × 44 CSS px. Selected state adds an icon or checkmark as well as color. Flat matte surface, no gradient.

### Feature Card
**Role:** Primary content panels in features section

Background: `--surface-card`. Border-radius: 16px. Padding: 48px 44px. No box-shadow in dark mode; in light mode use a 1px `--border-subtle` edge so white cards remain distinguishable from Dawn Base.

### Glowing Inset Card
**Role:** Highlighted stats, testimonials, community proof cards

Background: transparent so the page shows through. Border-radius: 24px. Dark mode uses the original white-10% inset hairline plus orange bottom glow; light mode uses a 1px `--border-subtle` inset plus rgba(198,66,24,0.28) bottom glow. Neither decorative edge may be the sole indicator of interactivity.

### Dark Feature Panel
**Role:** Full-width section panels with workflow canvas previews

Background: `--surface-panel`. Border-radius: 24px. No padding on container (content bleeds). Used as a viewport-wide stage for product screenshots in either theme.

### Hiring Badge
**Role:** Status indicator tags (e.g., 'Hiring' label in footer nav)

Background: `--text-strong`. Text: `--surface-page`, geomanist 400 12px. Border-radius: 24px. Padding: 4px 10px. Include a textual status label; the color inversion is supplementary.

### Workflow Node
**Role:** Canvas node objects in workflow diagram illustrations

Background: `--surface-card` or an app-brand color that has been contrast-tested with its icon. Border-radius: 12px. Connections may use the Electric Current gradient as non-text graphics. Icons are centered in 40–48px containers and must have an accessible name when they convey information.

### Nav Bar
**Role:** Sticky top navigation

Background: `--surface-page` (full-bleed). Border-bottom: 1px solid `--border-subtle`. Height: 66px. Left: n8n logo with chain-link icon. Center: nav links in geomanist 400 14px, color `--text-primary`; active links also use `aria-current` and a persistent underline. Right: GitHub star count, 'Sign in', and the Ember CTA with `--text-on-ember`.

### Social Proof Row
**Role:** Logo bar showing enterprise customers

Background: transparent. Logos use `--text-primary` as a monochrome mask or theme-specific asset — desaturated to prevent brand color competition. Every meaningful logo has accessible text. No card wrapper; use a horizontal flex layout with 32–48px column gap.

### Footer Mega-Nav
**Role:** Site-wide footer with multi-column link grid

Background: a theme-specific subtle rose radial glow over `--surface-page`. Column headers use geomanist 400 14px `--text-strong`; links use geomanist 300 14px `--text-secondary` and underline on hover/focus. The 5-column grid collapses responsively. Social icons use `--text-primary` at 24px and include accessible names.

## Do's and Don'ts

### Do
- Use #0e0918 as the dark page background and #fffafa as its light counterpart; both retain the palette's violet/rose undertone
- Apply the Ember gradient (linear-gradient(30deg, rgb(253,137,37), rgb(255,12,0))) exclusively to primary CTA buttons — using it for decorative elements dilutes its focal pull
- Use `--text-on-ember` for CTA labels and semantic tokens for every component color
- Set geomanist 300 at line-height 0.88 for 48–54px display headlines with letter-spacing -0.018em to -0.020em; the tight stack is intentional
- Use theme-specific inset edges on transparent-background cards; their purpose is decorative, not control identification
- Maintain three surface levels in both themes: page → card → panel
- Use 8px border-radius for buttons and inputs, 16px for standard cards, 24px for large feature panels — apply the correct tier per component scale
- Apply the Electric Current gradient only to decorative underlines and canvas connections; use `--interactive-accent` for readable links and focus rings
- Respect `prefers-color-scheme` by default, persist explicit user choice with `data-theme`, and expose the toggle as a button with `aria-pressed` or an equivalent accessible name/state

### Don't
- Never use a warm or neutral gray (#1a1a1a, #222, #333, #f5f5f5) as a primary surface — both themes carry a violet undertone
- Never use geomanist 700 or 800 weight — the type system is intentionally limited to 300 and 400; heavy weight breaks the restrained visual register
- Never place body text in #ffffff at normal reading sizes — use #d1cece or #e5e7eb; pure white at 15–16px creates harshness against the violet-black background
- Never place white text on the Ember gradient; it fails AA at the orange stop
- Never use drop-shadows (outset box-shadows) for card elevation — elevation is expressed through background color stepping, not shadow lifting
- Never use the Ember gradient as a background fill for sections or banners — it appears only on interactive CTA buttons
- Never apply 9999px radius to cards or section containers — pill radius (9999px) is reserved for tags, status indicators, and circular icon wrappers only
- Never use a low-contrast decorative divider as the only visible boundary of a control
- Never show partner/customer logos in their brand colors — use monochrome `--text-primary` to avoid palette pollution

## Surfaces

| Level | Semantic token | Light | Dark | Purpose |
|-------|----------------|-------|------|---------|
| 0 | `--surface-page` | `#fffafa` | `#0e0918` | Page, hero, and full-bleed sections |
| 1 | `--surface-card` | `#ffffff` | `#1a1624` | Primary cards |
| 2 | `--surface-panel` | `#f2edf5` | `#1b1728` | Feature panels and workflow canvases |
| 3 | `--surface-muted` | `#e7e0eb` | `#2c2834` | Inputs, tags, and tertiary controls |

## Elevation

n8n uses color-stepping instead of drop shadows for elevation. Dark moves #0e0918 → #1a1624 → #1b1728; light moves #fffafa → #ffffff → #f2edf5 and uses a subtle `--border-subtle` edge where adjacent whites would otherwise merge. The dark frosted ghost button may keep its rgba(0,0,0,0.26) halo. Highlighted cards use theme-specific inset edges and ember glows, but a selected or active state also needs a non-color cue.

## Imagery

Primary visual is a single hero 3D illustration — a glowing orange-red lightning bolt rendered with volumetric light, glass-like facets, and bloom glow, positioned right-bleed over the dark background. This is product-metaphor imagery, not photography. The bolt bleeds off the right edge with no containment, which creates asymmetric tension with the left-aligned headline block. Workflow canvas screenshots appear in product sections as contained flat UI captures with 24px border-radius clipping — the product IS the imagery. Section backgrounds use subtle radial gradients (warm ember at corners, faint blue halos) that function as atmospheric depth rather than visible graphics. No photography, no lifestyle imagery. Icons in workflow nodes are multi-color brand icons (Slack, Jira, etc.) appearing at 32–48px within 12px-radius containers — the only colorful elements outside the CTA and hero illustration. Overall density is image-light with one hero hero and one product-screenshot per section.

## Layout

Full-bleed themed canvas with max-width ~1200px content columns centered horizontally. Hero is left-aligned headline + CTA column with a right-bleed 3D illustration occupying 50% viewport width — the illustration breaks the content boundary intentionally. Below hero: a social proof logo bar flush to section bottom. Feature sections use large 24px-radius panels (full content width) containing split layouts: text column left, product screenshot right. A 'use case' section uses a left sidebar of vertical tab pills next to a right-fill product canvas — asymmetric 30/70 split. Stats/proof section: 3-column equal card grid using Glowing Inset Cards. Integration section: centered headline over a dense icon grid. Vertical section rhythm uses ~80–120px gaps with no divider lines — sections are distinguished by semantic surface changes. Footer is full-bleed with a theme-specific ember/rose glow in the upper-right corner, with the link grid collapsing from five columns on narrow viewports.

## Gradient System

Two primary gradients drive the entire chromatic identity:

1. EMBER (CTAs): linear-gradient(30deg, rgb(253,137,37), rgb(255,12,0)) — orange-to-red at shallow angle. Applied ONLY to the 'Get Started' primary button. Creates fire-colored focal anchor against the void.

2. ELECTRIC CURRENT (connectivity): linear-gradient(141deg, rgb(7,122,199), rgb(107,33,239)) — blue-to-violet at steep diagonal. Applied to decorative link underlines and workflow canvas edge connections. It is not valid for text or focus rings; use `--interactive-accent` there.

3. ATMOSPHERIC EMBER (backgrounds): radial-gradient(126.99% 234.27% at 10.15% 142.35%, rgba(217,126,75,0.133) 0%, rgba(255,255,255,0) 37%) — very-low-opacity warm glow used as section atmosphere. Opacity 13% makes it subliminal, not visible at a glance.

4. FOOTER ROSE (footer header): radial-gradient(circle farthest-side at 100% -80%, rgba(175,106,140,0.46), rgba(98,65,83,0.38) 39%, rgba(0,0,0,0) 55%) — muted rose/wine glow behind footer top edge. References the orange brand hue through a cooled, desaturated variant.

## Agent Prompt Guide

QUICK COLOR REFERENCE:
- Page background: `--surface-page` (#fffafa light / #0e0918 dark)
- Primary text: `--text-primary` (#251d2f light / #d1cece dark)
- Headline text: `--text-strong` (#0e0918 light / #ffffff dark)
- Card surface: `--surface-card` (#ffffff light / #1a1624 dark)
- CTA button: linear-gradient(30deg, rgb(253,137,37), rgb(255,12,0))
- CTA text: `--text-on-ember` (#0e0918 in both themes)
- Meaningful border: `--border-control` (#76707e light / #77717f dark)
- Secondary text: `--text-secondary` (#5f5868 light / #9d9797 dark)
- Link / focus: `--interactive-accent` (#075f9e light / #63a9e8 dark)

EXAMPLE COMPONENT PROMPTS:

1. HERO SECTION: Full-bleed `--surface-page`. Left column (50%): headline 54px geomanist weight 300 `--text-strong`, letter-spacing -1.08px, line-height 0.88, stacked 2 lines. Below headline: body text 16px geomanist 400 `--text-primary`, line-height 1.5. CTA row: 'Get started' button with the Ember gradient, `--text-on-ember`, 8px radius, 12px 24px padding. 'Talk to sales' ghost button: transparent, 1px solid `--border-control`, `--text-strong`, 6px radius, 24px padding. Right side: 3D illustration bleeding off right edge.

2. FEATURE CARD: Background `--surface-card`, border-radius 16px, padding 48px 44px. Section label: 12px geomanist 400 `--text-secondary` uppercase. Card headline: 24px geomanist-book 400 `--text-strong`, letter-spacing -0.17px. Body: 16px geomanist 300 `--text-primary`, line-height 1.5. No box-shadow; light mode may use a subtle inset edge.

3. GLOWING PROOF CARD: Background transparent. Theme-specific inset edge and ember glow. Border-radius 24px. Padding 24px 32px. Body text 14px geomanist 400 `--text-primary`. Emphasis label in `--text-strong`.

4. NAV BAR: Background `--surface-page`, border-bottom 1px solid `--border-subtle`, height 66px. Logo left. Center links: geomanist 400 14px `--text-primary` with chevron for dropdowns. Right: GitHub count pill using `--surface-muted` and `--border-control`, 'Sign in' in `--text-primary`, and 'Get Started' using the Ember gradient with dark label text.

5. FOOTER COLUMN: Background `--surface-page` with a theme-specific radial rose glow top-right. Column header: geomanist 400 14px `--text-strong`. Links: geomanist 300 14px `--text-secondary`, line-height 1.7, underlined on hover and focus. Five-column desktop grid with 32px gap; collapse responsively.

## Similar Brands

- **Retool** — Same dark violet-black surface palette with orange accent buttons and workflow canvas product screenshots as primary imagery
- **Zapier** — Shared automation-platform category but inverted: where n8n uses dark violet + ember, Zapier uses white + orange — both isolate warm CTA against monochrome field
- **Temporal.io** — Dark dev-tools aesthetic with deep purple-black surfaces, light-weight display type, and electric-gradient accent on interactive elements
- **Supabase** — Dark background with single electric-green/blue accent isolated on CTA, geomanist-class geometric sans at light weight for headlines
- **Linear** — Violet-tinted dark surfaces (#0e0918 vs Linear's #0f0f10), weight-300 display headlines, inset border cards without drop shadows

## Quick Start

### CSS Custom Properties

```css
:root {
  color-scheme: light;

  /* Raw dark palette */
  --color-void-base: #0e0918;
  --color-elevated-surface: #1a1624;
  --color-deep-panel: #1b1728;
  --color-muted-shell: #2c2834;
  --color-border-smoke: #3e3a46;
  --color-ash-text: #d1cece;
  --color-fog-text: #9d9797;
  --color-silver-rail: #e5e7eb;
  --color-cloud-white: #ffffff;
  --color-steel-muted: #48556a;
  --color-ember-cta: #fd8925;
  --gradient-ember-cta: linear-gradient(30deg, rgb(253, 137, 37), rgb(255, 12, 0));
  --color-electric-current: #077ac7;
  --gradient-electric-current: linear-gradient(141deg, rgb(7, 122, 199), rgb(107, 33, 239));
  --color-ember-scorch: #ff492c;
  --color-crimson-glow: #56312d;

  /* Raw light palette */
  --color-dawn-base: #fffafa;
  --color-paper-surface: #ffffff;
  --color-lilac-panel: #f2edf5;
  --color-mist-shell: #e7e0eb;
  --color-graphite-violet: #251d2f;
  --color-plum-gray: #5f5868;
  --color-accessible-border-light: #76707e;
  --color-current-blue-light: #075f9e;
  --color-current-violet-light: #5a24c9;

  /* Semantic theme: light/default */
  --surface-page: var(--color-dawn-base);
  --surface-card: var(--color-paper-surface);
  --surface-panel: var(--color-lilac-panel);
  --surface-muted: var(--color-mist-shell);
  --text-primary: var(--color-graphite-violet);
  --text-strong: var(--color-void-base);
  --text-secondary: var(--color-plum-gray);
  --text-on-ember: var(--color-void-base);
  --border-control: var(--color-accessible-border-light);
  --border-subtle: #d9d2df;
  --interactive-accent: var(--color-current-blue-light);

  /* Typography — Font Families */
  --font-geomanist: 'geomanist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geomanist-book: 'geomanist-book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.29px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.25;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: -0.17px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 0.94;
  --tracking-heading-lg: -0.86px;
  --text-display: 54px;
  --leading-display: 0.88;
  --tracking-display: -1.08px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-nodes: 12px;
  --radius-pills: 9999px;
  --radius-badges: 24px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-cardslarge: 24px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.2) 0px 1px 1px 0px inset, rgba(8, 8, 8, 0.2) 0px 1px 2px 0px, rgba(8, 8, 8, 0.08) 0px 4px 4px 0px, rgb(7, 122, 199) 0px 7px 0px -12px, rgba(255, 255, 255, 0.12) 0px 6px 12px 0px inset;
  --shadow-sm: rgba(0, 0, 0, 0.26) 0px 0px 8px 0px;
  --shadow-subtle-2: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset, rgba(255, 142, 93, 0.3) 0px 1px 0px 0px inset;

  /* Surfaces */
  --surface-void-base: var(--surface-page);
  --surface-elevated-surface: var(--surface-card);
  --surface-deep-panel: var(--surface-panel);
  --surface-muted-shell: var(--surface-muted);
}

[data-theme="dark"] {
  color-scheme: dark;
  --surface-page: var(--color-void-base);
  --surface-card: var(--color-elevated-surface);
  --surface-panel: var(--color-deep-panel);
  --surface-muted: var(--color-muted-shell);
  --text-primary: var(--color-ash-text);
  --text-strong: var(--color-cloud-white);
  --text-secondary: var(--color-fog-text);
  --text-on-ember: var(--color-void-base);
  --border-control: #77717f;
  --border-subtle: var(--color-border-smoke);
  --interactive-accent: #63a9e8;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    color-scheme: dark;
    --surface-page: var(--color-void-base);
    --surface-card: var(--color-elevated-surface);
    --surface-panel: var(--color-deep-panel);
    --surface-muted: var(--color-muted-shell);
    --text-primary: var(--color-ash-text);
    --text-strong: var(--color-cloud-white);
    --text-secondary: var(--color-fog-text);
    --text-on-ember: var(--color-void-base);
    --border-control: #77717f;
    --border-subtle: var(--color-border-smoke);
    --interactive-accent: #63a9e8;
  }
}

:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 2px;
}
```

### Tailwind v4

```css
@theme inline {
  /* Raw brand colors */
  --color-void-base: #0e0918;
  --color-elevated-surface: #1a1624;
  --color-deep-panel: #1b1728;
  --color-muted-shell: #2c2834;
  --color-border-smoke: #3e3a46;
  --color-ash-text: #d1cece;
  --color-fog-text: #9d9797;
  --color-silver-rail: #e5e7eb;
  --color-cloud-white: #ffffff;
  --color-steel-muted: #48556a;
  --color-ember-cta: #fd8925;
  --color-electric-current: #077ac7;
  --color-ember-scorch: #ff492c;
  --color-crimson-glow: #56312d;
  --color-dawn-base: #fffafa;
  --color-paper-surface: #ffffff;
  --color-lilac-panel: #f2edf5;
  --color-mist-shell: #e7e0eb;
  --color-graphite-violet: #251d2f;
  --color-plum-gray: #5f5868;
  --color-accessible-border-light: #76707e;
  --color-current-blue-light: #075f9e;
  --color-current-violet-light: #5a24c9;

  /* Theme-aware utilities: bg-surface-page, text-text-primary, etc. */
  --color-surface-page: var(--surface-page);
  --color-surface-card: var(--surface-card);
  --color-surface-panel: var(--surface-panel);
  --color-surface-muted: var(--surface-muted);
  --color-text-primary: var(--text-primary);
  --color-text-strong: var(--text-strong);
  --color-text-secondary: var(--text-secondary);
  --color-text-on-ember: var(--text-on-ember);
  --color-border-control: var(--border-control);
  --color-border-subtle: var(--border-subtle);
  --color-interactive-accent: var(--interactive-accent);

  /* Typography */
  --font-geomanist: 'geomanist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geomanist-book: 'geomanist-book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.29px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.25;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: -0.17px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 0.94;
  --tracking-heading-lg: -0.86px;
  --text-display: 54px;
  --leading-display: 0.88;
  --tracking-display: -1.08px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.2) 0px 1px 1px 0px inset, rgba(8, 8, 8, 0.2) 0px 1px 2px 0px, rgba(8, 8, 8, 0.08) 0px 4px 4px 0px, rgb(7, 122, 199) 0px 7px 0px -12px, rgba(255, 255, 255, 0.12) 0px 6px 12px 0px inset;
  --shadow-sm: rgba(0, 0, 0, 0.26) 0px 0px 8px 0px;
  --shadow-subtle-2: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset, rgba(255, 142, 93, 0.3) 0px 1px 0px 0px inset;
}
```
