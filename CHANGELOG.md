# Changelog

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
