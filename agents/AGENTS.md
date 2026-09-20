# Implementation Guide — Personal Portfolio

This file defines the architecture, SEO, accessibility, performance, and quality rules for the personal portfolio. It applies to the entire project governed by this directory. User instructions and `DESIGN.md` take precedence when they are more specific, provided they do not reduce accessibility, security, or factual accuracy.

## Objective

Build a fast, accessible, and easily indexable personal portfolio that clearly presents:

- who the person is;
- their specialties and experience;
- the projects they have completed and their individual contribution;
- how to contact them or review their public work.

The primary experience must work with semantic HTML and CSS. JavaScript is progressive enhancement, not a requirement for reading, navigating, or making contact. Do not promise a specific search ranking or perfect audit score; implement and measure sound practices.

## Lessons from the Alexandria reference project

Preserve these proven patterns from the reference site:

- Astro as a static site generator that produces complete HTML during the build.
- `Layout.astro` as the single source of shared metadata.
- `site` configured in `astro.config.mjs`, absolute canonical URLs, and an automatically generated sitemap.
- Page-specific titles, descriptions, Open Graph metadata, and X/Twitter cards.
- JSON-LD that matches visible page content.
- Semantic landmarks, one `main`, a logical heading hierarchy, and a skip-to-content link.
- Keyboard-operable navigation, visible focus, `hidden` for collapsed content, and synchronized ARIA states.
- `prefers-reduced-motion`, pausing animations outside the viewport, and deferred loading of non-critical resources.
- Local fonts with `font-display: swap`, explicitly sized images, and optimized social assets.
- `robots.txt`, a sitemap, legal pages when applicable, and inspection of the final generated HTML.

Do not copy these decisions without adapting them:

- Alexandria declares Astro 4; the new project must start with the current stable release.
- Do not use `LocalBusiness` or `ProfessionalService` for a person unless it is factually and legally appropriate. For this portfolio, primarily use `Person`, `WebSite`, and project-specific types.
- `llms.txt` is optional and does not replace SEO, a sitemap, visible content, or structured data.
- Do not add a web app manifest or PWA behavior unless the site provides a genuinely installable experience.
- Do not declare dimensions, MIME types, icons, social profiles, dates, clients, metrics, or skills that have not been verified.
- An element with `aria-hidden="true"` must not retain focusable descendants. Closed menus must use `hidden` or `inert`, not merely be positioned off-screen.

## Source graphic resources

- The base graphic assets are stored in `resources/`.
- Inspect `resources/` before searching for, generating, or recreating any logo, portrait, project image, icon, texture, illustration, or brand asset.
- Reuse suitable source assets rather than creating visually inconsistent replacements.
- Preserve original source files. Create optimized derivatives in `src/assets/` or `public/images/` as appropriate; do not overwrite the originals in `resources/`.
- Record the source and intended use when an asset is copied or transformed.
- Verify usage rights before publishing any resource whose ownership or license is unclear.
- Decorative assets must not replace semantic HTML or essential text.

## Required stack

Stable release lines verified on September 20, 2026:

- Astro 7.2 as the current stable line; install the latest available patch with `astro@latest`.
- Tailwind CSS 4.3 as the current stable line; install the latest available patch with `tailwindcss@latest` and `@tailwindcss/vite@latest`.
- A Node.js version supported by the installed Astro version; declare it in `package.json` and, when used, `.nvmrc`.
- One package manager only. Prefer `pnpm` and preserve `pnpm-lock.yaml`.

Rules:

1. Prefer `.astro` files, semantic HTML, CSS, and native JavaScript.
2. Do not install React, Svelte, Solid, Alpine, jQuery, or another UI framework.
3. Vue 3 is the only permitted framework when a component genuinely requires complex state or reactivity.
4. Do not install Vue preemptively. Add it through the official `@astrojs/vue` integration only when there is a concrete use case.
5. A Vue island must remain small and use the least aggressive hydration directive possible: `client:visible`, `client:idle`, or `client:media`. Reserve `client:load` for essential controls that must respond immediately.
6. SEO content, primary navigation, projects, and contact information must not depend on a hydrated island.
7. Use Tailwind 4 through the Vite plugin; do not use the deprecated `@astrojs/tailwind` integration.
8. Configure Tailwind with a CSS-first approach: `@import "tailwindcss";` and tokens in `@theme` or CSS custom properties. Do not create `tailwind.config.js` unless a demonstrated requirement calls for it.
9. Do not construct Tailwind class names dynamically through string interpolation. Keep complete class names detectable in source code or use explicit maps.
10. Lock resolved versions in the lockfile. Use `@latest` only during deliberate creation or upgrades, not during every build.

Preferred initialization commands:

```bash
pnpm create astro@latest
pnpm astro add tailwind
```

If Vue becomes necessary:

```bash
pnpm astro add vue
```

## Target architecture

```text
resources/                    # original base graphic resources; preserve source files
public/
  favicon.svg
  robots.txt
  images/                     # public optimized derivatives when required
  fonts/                      # only when fonts are self-hosted
src/
  assets/                     # graphic resources processed by Astro
  components/
    layout/
    sections/
    ui/
  content/
    projects/                 # project collection in Markdown/MDX or typed data
  layouts/
    BaseLayout.astro
    ProjectLayout.astro
  pages/
    index.astro
    proyectos/
      index.astro
      [slug].astro
    sobre-mi.astro            # only when the content warrants a separate page
    contacto.astro            # or a home section; avoid duplicated content
    404.astro
  scripts/                    # small, shared native JavaScript
  styles/
    global.css
    tokens.css                # optional; align with DESIGN.md
astro.config.mjs
package.json
```

Keep components focused. Extract a component when it has reusable semantics, its own behavior, or a clear responsibility; do not fragment every HTML element into a separate file.

Featured projects should have their own URL when there is enough meaningful information. A dedicated project page improves sharing, indexing, and the explanation of context, problem, role, decisions, technologies, results, and links. Do not generate empty or nearly identical pages simply to increase the number of URLs.

## Portfolio content

- Use real, specific, and verifiable content. Never invent employers, clients, testimonials, metrics, awards, certifications, or results.
- If information is missing, leave a clear editorial marker in source code or ask for it; do not publish filler text.
- Explain the person's individual contribution to each project, rather than only describing the product.
- Distinguish personal, collaborative, and professional work.
- List technologies only when they were actually used in the described project.
- For confidential projects, explain the problem and contribution without revealing private information.
- The primary call to action should lead to projects or contact information; avoid generic CTAs.
- Write for people first. Keywords should appear naturally in titles, introductions, project names, and internal links.

## Technical SEO

### Base configuration

- Set the production URL in `astro.config.mjs` through `site`.
- Install and configure `@astrojs/sitemap`.
- Serve HTTPS and choose one canonical domain variant.
- Every indexable page must return `200`, have a stable URL, and appear in the sitemap.
- Create `robots.txt` with the absolute sitemap URL. Do not use `robots.txt` to hide private content; use authentication or `noindex` as appropriate.
- The 404 page must return an HTTP 404 status on the deployment platform.

### Layout and metadata

`BaseLayout.astro` must accept at least:

```ts
interface Props {
  title: string;
  description: string;
  canonical?: URL | string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}
```

For every page:

- Use `<html lang="es-MX">` unless the page genuinely uses another language.
- Provide a unique, clear, descriptive `<title>`; normally include the person's name and specialty without repeating terms.
- Provide a unique meta description that summarizes the page in natural language.
- Generate an absolute canonical URL from `Astro.site` and the normalized route.
- Add `meta name="robots"` only when needed; use `noindex, nofollow` for private previews.
- Open Graph must include `og:type`, `og:url`, `og:site_name`, `og:title`, `og:description`, `og:image`, dimensions, and `og:image:alt`.
- X/Twitter must include `summary_large_image`, title, description, image, and alternative text.
- The social image must be 1200 × 630, use an absolute URL, have a reasonable file size, and declare a MIME type that matches the actual file.
- Keep `theme-color` and favicons consistent with light and dark themes.
- Do not add `meta keywords`.

The visible page title and `<title>` must describe the same subject, although they do not have to be identical. Do not enforce rigid character limits; prioritize clarity and inspect how the result is presented.

### Content structure

- Use one descriptive `h1` per page.
- Keep headings in logical order; do not choose `h3` merely for its visual size.
- Use `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer` when they describe the actual structure.
- Every relevant `section` must have a heading or accessible name.
- Link text must describe its destination. Avoid repeated “click here” or “read more” links without context, and avoid raw URLs as link text.
- Keep primary content in generated HTML. Canvas, CSS pseudo-elements, and images do not replace indexable text.
- Add internal links among the homepage, project listing, project detail pages, and personal profile.
- For a bilingual site, each language needs its own URL, `lang`, canonical, and correct `hreflang`. Do not translate the site exclusively with JavaScript.

### Structured data

- Homepage: use `Person` and, when useful, `WebSite`.
- `Person`: include only the public name, URL, image, role or specialty, general location, and genuinely public profiles through `sameAs`.
- Project page: use `CreativeWork`, `SoftwareSourceCode`, or another specific type only when it accurately describes the content.
- Add `BreadcrumbList` to project pages when a visible hierarchical path exists.
- JSON-LD values must match visible page content. Do not add ratings, offers, organizations, or employment information that is not visible and verifiable.
- Serialize JSON-LD from objects to avoid invalid JSON and test it with Rich Results Test or Schema Markup Validator.

### Images and crawlable assets

- Review `resources/` first, then use `src/assets` and Astro's `<Image />` component for content images whenever possible.
- Specify `width` and `height`, or an aspect ratio, to prevent layout shifts.
- Provide useful `alt` text for informative images and `alt=""` for decorative images.
- Do not repeat adjacent text in `alt` and do not begin it with “image of.”
- The LCP image should use `loading="eager"` and, when justified, high fetch priority. Other images should use `loading="lazy"` and `decoding="async"`.
- Produce responsive sizes and modern formats while preserving sufficient quality.
- External or injected SVG must come from a trusted source and be sanitized.

## Accessibility — WCAG 2.2 AA

Conformance must be evaluated through automated tools and manual testing. ARIA supplements HTML; it does not replace the correct native element.

### Semantics and navigation

- Include a skip link that becomes visible on focus and points to `#main-content`.
- Use exactly one `main` per page and name landmarks when they repeat.
- Use `button` for actions and `a` for navigation.
- Do not add redundant roles such as `role="banner"` to `header` or `role="contentinfo"` to `footer` unless there is a real need.
- Keep DOM order aligned with visual and logical order.
- Everything must work with a keyboard: Tab, Shift+Tab, Enter, Space, Escape, and arrow keys when the interaction pattern requires them.
- Do not create keyboard traps. When a modal dialog or menu closes, return focus to the control that opened it.
- Prefer `<details>/<summary>` for simple disclosures. For custom tabs, menus, or dialogs, follow the complete WAI-ARIA pattern: name, role, state, focus, and keyboard behavior.
- Closed content must leave the tab order through `hidden`, `inert`, or the corresponding native behavior.

### Focus, target size, and color

- Never remove `outline` without an equivalent replacement.
- `:focus-visible` must be at least 2px thick, perceptibly offset, and reach at least 3:1 contrast with adjacent colors.
- Normal text requires at least 4.5:1 contrast; large text requires 3:1; controls, informative icons, and necessary boundaries require 3:1.
- Do not communicate status with color alone; add text, an icon, a pattern, or a shape.
- Recommended touch target: 44 × 44 CSS px. The WCAG 2.2 AA minimum is 24 × 24 CSS px with exceptions, but it is not the design target.
- Follow the light and dark color system defined in `DESIGN.md`. Test every state: default, hover, focus, active, disabled, error, and selected.

### Light and dark themes

- Both themes must be complete and use semantic tokens rather than raw colors inside components.
- Respect `prefers-color-scheme` by default and allow an explicit user selection.
- Apply `color-scheme: light dark` or the active theme value to native controls.
- The theme selector must be a button with an accessible name and state.
- Persist the choice locally only as a device preference.
- Prevent a flash of the wrong theme with a minimal script in `<head>` when necessary.

### Text, zoom, motion, and forms

- Main body text should normally be at least 1rem with a readable line height.
- The site must remain usable at 200% text zoom, 400% page zoom, and a 320 CSS px viewport without two-dimensional scrolling, except for content that inherently requires it, such as a table.
- Keep long reading lines approximately 45–80 characters wide.
- Respect `prefers-reduced-motion: reduce`: remove non-essential movement, parallax, auto-animation, and smooth scrolling.
- Pause animations when they are outside the viewport or the browser tab is not visible.
- Do not autoplay audio or video.
- Every form control requires a visible `label`, `name`, correct type, and appropriate `autocomplete` value.
- Errors must explain what happened and how to fix it, be associated through `aria-describedby`, and not rely on color alone.
- Dynamic success and error messages must be announced non-intrusively through an appropriate live region.
- Do not prevent users from pasting into fields or require unnecessary cognitive challenges.

## CSS and visual design

- Read `DESIGN.md` before creating or modifying styles.
- Inspect the base assets in `resources/` before defining visual replacements or additional imagery.
- Define colors, typography, spacing, radii, and shadows as tokens. Components consume semantic tokens.
- Keep global styles for reset, tokens, base typography, and genuinely shared utilities. Use Astro scoped styles for component-specific rules.
- Tailwind may handle composition and states, but it must not produce unmanageable class strings. Extract components or semantic classes when a combination repeats or requires explanation.
- Prefer logical properties such as `margin-inline` and `padding-block` when appropriate.
- Avoid `!important`, except for well-justified accessibility utilities such as reduced motion or visually hidden content.
- Do not hide essential content with `content-visibility` without testing keyboard navigation, find-in-page, and screen readers.
- Avoid text embedded in images.

## JavaScript and Vue

- Essential content and navigation must remain available if JavaScript fails.
- Prefer native APIs and elements: `details`, `dialog`, the Popover API when supported by the browser target, `IntersectionObserver`, and progressive form validation.
- Do not use JavaScript for effects that CSS can implement accessibly.
- Delegate events or share observers when many equivalent elements exist.
- Clean up listeners, observers, timers, and `requestAnimationFrame` when a component is no longer used.
- Do not query layout inside animation loops unless measurement proves it necessary.
- Do not download large libraries for one minor interaction.
- A Vue island must receive renderable content from Astro and remain limited to interaction. Do not turn the entire page into a SPA.

## Performance and experience

- Generate a static site by default (`output: 'static'`) unless a real requirement needs server rendering.
- Initial budget: primary content must ship no framework JavaScript.
- Keep first-party CSS and JS small; justify every new dependency by function, weight, and accessibility.
- Self-host fonts when legally and operationally appropriate; limit families and weights, and preload only the critical font actually used above the fold.
- Reserve space for images, videos, embeds, and asynchronous components.
- Load analytics and third-party scripts after primary content and with consent when required.
- Do not use a preloader that blocks access to content.
- Avoid canvas or WebGL backgrounds unless they add clear value. If used, they must be decorative, hidden from assistive technology, reduce resolution or FPS on mobile, stop when out of view, and disable under reduced motion.
- Pre-publication mobile laboratory targets: Lighthouse Performance ≥ 90 and Accessibility/Best Practices/SEO ≥ 95. These numbers do not replace real testing.
- Field Core Web Vitals targets at the 75th percentile: LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1.

## Privacy and security

- Publish only contact information explicitly authorized by the portfolio owner.
- Do not include secrets, tokens, private email addresses, private phone numbers, or client data in the repository or generated HTML.
- External links with `target="_blank"` must use `rel="noopener noreferrer"`.
- Do not inject untrusted HTML through `set:html` or `v-html`.
- Apply a reasonable Content Security Policy at deployment when the integrations permit it.
- If analytics is added, prefer a privacy-respecting option and document cookies and collected data. Create legal notices only from real, reviewed information; do not copy Alexandria's legal text.

## Agent workflow

Before editing:

1. Read this file and `DESIGN.md` completely.
2. Inspect `resources/` and inventory the available source graphics relevant to the task.
3. Inspect `package.json`, `astro.config.mjs`, layouts, the affected page, and related styles.
4. Preserve the package manager and lockfile.
5. Confirm the available personal content; do not invent missing information.

During implementation:

1. Create semantic HTML and content that is readable without JavaScript.
2. Select and optimize suitable assets from `resources/` without overwriting their source files.
3. Apply tokens and responsive CSS.
4. Add native interaction or small JavaScript enhancements.
5. Use Vue only when the preceding alternatives do not reasonably cover the requirement.
6. Add page-specific metadata and structured data.
7. Implement loading, empty, error, and success states when they exist.

Before delivery:

- Run a reproducible installation and keep the lockfile current.
- Run `pnpm build` and fix relevant errors or warnings.
- Run `pnpm astro check` when the project includes `@astrojs/check`.
- Inspect generated HTML, not only Astro source files.
- Confirm that canonical URLs, Open Graph metadata, JSON-LD, robots rules, and the sitemap use the correct production domain.
- Test the complete experience using only the keyboard and visible focus.
- Test at 320px, mobile and desktop widths, 200% text zoom, and 400% page zoom.
- Test light and dark themes, contrast, and reduced motion.
- Run Lighthouse against `pnpm preview` with a mobile profile and address each finding rather than only the score.
- Run an automated axe audit or equivalent and resolve serious and critical impacts.
- Validate structured data and internal and external links.
- Confirm there are no console errors, missing resources, visible CLS, or essential content that depends on JavaScript.

## Definition of done

A task is not complete merely because it compiles. It must:

- preserve the visual intent of `DESIGN.md` in both themes;
- reuse appropriate base graphics from `resources/` or document why a new asset is required;
- produce semantic and indexable HTML;
- work with keyboard input and reasonable assistive technology use;
- preserve essential content without hydration;
- provide accurate, page-specific metadata;
- introduce no dependencies or frameworks outside this policy;
- pass the build and checks proportional to the change;
- document any known exception or technical debt.

## Standards and technical references

- Astro styling and Tailwind: https://docs.astro.build/en/guides/styling/
- Astro + Vue: https://docs.astro.build/en/guides/integrations-guide/vue/
- Tailwind CSS: https://tailwindcss.com/docs
- Google Search Central: https://developers.google.com/search/docs
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI-ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- Schema.org: https://schema.org/
