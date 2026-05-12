# Changelog

## v2.3.1 — 2026-05-12

Adds another ~200 Norwegian text-map entries to extend body coverage to almost every visible string.

### Added
- **Homepage FAQ** — all 6 questions + answers translated
- **Homepage testimonials** — all 6 customer quotes + role labels
- **All "Who it's for" cards** across 3 solution pages + 4 platform pages (21 cards total: title + body)
- **About page** — full coverage: 6 brand values, 8 team role titles, 6 industries with descriptions, "Why Norway" 3-paragraph editorial
- **Contact page** — "What to expect" 4-step timeline + 6 demo FAQ Q&A pairs
- **Stories page** — 6 topic cluster descriptions + 3-paragraph editorial promise + all 12 story card titles + descriptions
- **Legal pages** — section headings (Introduction, What we collect, How we use it, Retention, Your rights, etc.) across Privacy/GDPR/DPA

### Coverage now
- Nav, footer, hero on every page: 100% NB
- Body content on all marketing pages (home, solutions, platform, about, contact, stories): comprehensive NB coverage
- Long-form blog article body (1400 words): still EN — would need a dedicated translation pass
- Legal page detailed prose paragraphs: still EN — recommend native review before translating legal text

---

## v2.3.0 — 2026-05-12

Expands Norwegian coverage to the full body content of every page using a text-node walker. Adds a separate v1 deployment for side-by-side comparison.

### Added
- **Comprehensive Norwegian text map** (`translations.nbText`) — ~150 English→Norwegian mappings covering body text that wasn't tagged with `data-i18n`: pain points, features, ROI calculator, outcomes, testimonials, playbook, pricing, FAQ heading, demo form, exit modal, common section labels
- **Text-node walker** in `i18n.js` — walks all body text nodes (skipping `script, style, [data-i18n], input, textarea, select`) and applies the text map on language toggle
- **Form placeholder translation** — input/textarea placeholders translate from the same text map
- **Separate v1 deployment** at https://tappin-website-v1.vercel.app — a frozen snapshot of v2.1.0 (pre-language, pre-cursor) for side-by-side comparison with the current site

### Coverage now
- Nav, footer, mobile CTA: fully translated
- Hero on every page (eyebrow + H1 + sub): fully translated
- Body content: comprehensive translation via text-node walker for headings, intro paragraphs, button labels, card titles, list items, form labels, and short content lines
- Long-form prose (full FAQ answers, blog article body, legal page paragraphs): still English on toggle, will translate in v2.4 if requested

### Notes
- Norwegian translations are first-pass. Native Norwegian copy editor review still recommended before public launch.
- Text-node walker is exact-match (trimmed). Body text that doesn't exactly match a dictionary key stays English. This is by design — partial substring matching is too risky for production.

---

## v2.2.0 — 2026-05-11

Adds bilingual (English / Norwegian Bokmål) support with smart language detection, plus a premium custom cursor for desktop visitors. Both ship across all 15 pages.

### Added
- **Language toggle (EN | NO pill)** in the header nav — visible on every page
- **Norwegian translations dictionary** (`assets/js/translations.js`) covering nav, dropdowns, footer, announcement bar, mobile CTA, hero (eyebrow + H1 + sub) on every page, common CTAs, section eyebrows
- **i18n runtime** (`assets/js/i18n.js`) — applies translations to `[data-i18n]` elements at runtime, caches English originals for restore, updates `<html lang>`
- **Smart language detection chain:**
  1. `localStorage` choice wins
  2. Browser language (`nb-NO`, `no`, `nn`) → Norwegian
  3. IP geolocation via `api.country.is` — visitors from Norway, Sweden, Denmark, Finland, Iceland default to Norwegian
  4. English fallback
- **Custom cursor** for desktop (non-touch, non-reduced-motion):
  - Small navy dot tracks the exact pointer position
  - Larger turquoise ring follows with smooth lag (~18% interpolation per frame)
  - Ring grows + fills with turquoise haze over any interactive element (`a, button, .btn, input, textarea, select`)
  - Click pulse shrinks the ring
  - Hidden on touch / coarse pointer devices, hidden when `prefers-reduced-motion: reduce`

### Coverage
- ~29 translatable strings tagged per page (nav + footer + announce + hero + mobile CTA + common buttons)
- 14/15 pages have hero H1/eyebrow/sub tagged (blog-post uses a unique post-hero structure — translate in v2.3)

### Notes
- Long-form body content (FAQ answers, value-card bodies, blog body, legal-page prose) stays in English on Norwegian toggle. Infrastructure is in place to extend coverage in v2.3.
- Norwegian translations are first-pass; final review by a Norwegian copy editor recommended before public launch.

---

## v2.1.0 — 2026-05-11

Adds a site-wide motion layer — calm, premium, on-brand. Every page now has subtle animation cues without crossing into flashy territory.

### Added
- **Body page-enter fade** — every page fades in on load (0.6s ease-out)
- **Hero blob drift** — two slow keyframed loops (22s + 28s) for the radial blobs in hero backgrounds
- **Hero screenshot float** — `.mock-window` gently floats with a 0.2deg tilt
- **Gradient text shimmer** — `.text-grad` spans continuously sweep their gradient (9s loop)
- **Stagger reveal** — grid children (pain cards, value cards, team cards, story cards, testimonials, outcome stats) fade in sequentially when their grid enters the viewport
- **Card halo** — cursor-tracked radial highlight on `.pain-card`, `.value-card`, `.testimonial`, `.story-card`, `.team-card` (pointer-driven)
- **CTA arrow micro-shift** — SVG arrows inside buttons nudge 3px right on hover
- **Link-arrow underline sweep** — the inline `.link-arrow` gains a left-to-right underline draw on hover
- **FAQ smooth open** — answer paragraph animates in with translate + fade when a `<details>` opens
- **Section heading underline** — H2s draw a 56px turquoise underline once their section becomes visible
- **Scroll progress bar** — a 3px turquoise gradient bar at the top of every page tracks read progress
- **Logo strip pause on hover** — visitors can read partner names mid-scroll
- **Hero floating cards pause on hover** — let users read the floating badges

### Changed
- `.reveal` transitions now honor a `--reveal-i` CSS variable for stagger delays (set via JS per grid child)

### Accessibility
- Full `prefers-reduced-motion` support — all keyframe animations and transitions collapse to instant when the user has reduced motion enabled

---

## v2.0.0 — 2026-05-11

First production-ready rebuild of the Tappin website. Complete replacement of the live tappin.no front-end with a lead-generation-optimized, SEO-complete static build.

### Added
- **15 new pages** — homepage + 3 solution pages + 4 platform pages + 2 blog pages + about + contact + 3 legal pages
- **Interactive ROI calculator** with live sliders, email-gated breakdown
- **Lead magnet** — 2026 Event Engagement Playbook with email gate
- **Exit-intent modal** (desktop mouseout + mobile scroll-depth fallback)
- **Sticky mobile CTA bar** for thumb-reach conversion
- **18+ contextual CTAs** across the site (was 3 on live tappin.no)
- **JSON-LD structured data** — Organization, WebSite, Service, AboutPage, ContactPage, LocalBusiness, BlogPosting, FAQPage, BreadcrumbList, SoftwareApplication
- **robots.txt + sitemap.xml** with all 15 URLs
- **SEO-KEYWORDS.md** — focus + secondary keyword map per page
- **Real Tappin product screenshots** in hero sections (dashboard, participants, order management, registration form)
- **Self-hosted Galano Grotesque** — 6 weights (Regular, Medium, Bold + italics) loaded via @font-face
- **Official brand logo** — `logo-main.png` in nav, `logo-reverse.png` in footer
- **Vercel configuration** with clean URLs, security headers, immutable asset caching, legacy-URL redirects

### Changed
- **Hero copy** — every page H1 now contains its focus keyword naturally
- **Outcomes section** redesigned from a thin 4-col strip to a 2-col layout (intro + 2x2 stats grid)
- **Navigation** — dropdowns for Platform (4 items) + Solutions (3 items), matching live-site IA
- **Typography** — Galano Grotesque is the primary face site-wide
- **Logo sizing** — 56px nav, 72px footer (44/56px on mobile)

### Removed
- **All 330 em-dashes and 18 en-dashes** — replaced with cleaner punctuation (commas, periods, hyphens for ranges)
- Google Fonts request (Manrope/Open Sans) — Galano is now self-hosted, no third-party font request
- CSS-rendered fake product mockups — replaced with real screenshots
- Galano text-rendering of the wordmark — official brand logo image is used instead

### Internal linking
- Every solution page links to all 4 platform pages by focus keyword anchor text
- Every platform page cross-links to relevant solution pages
- Blog post body has 8 contextual internal links to product pages
- Footer (every page) links to all 15 pages in 4 columns
- Legal pages cross-reference each other (Privacy ↔ GDPR ↔ DPA)

### Performance
- No build step, no framework, no JS bundle
- Hero screenshot preloaded (`loading="eager"`); all other product screenshots lazy-loaded
- Long-cache headers on `/assets/*` via vercel.json
- Inline-critical CSS not yet split out (future optimization)

---

## v1.x — Live tappin.no (pre-redesign)

The previous Tappin website. Not version-controlled in this repo. v2 was built from scratch using:
- Brand Guidelines v5 (March 2026)
- Official Tappin product screenshots (April–May 2026)
- Content audit of the live site (om-tappin, fysisk-event, hybrid-event, digital-event, stories)
