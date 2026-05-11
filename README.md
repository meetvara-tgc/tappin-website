# Tappin Website — Version 2

Lead-generation focused redesign of [tappin.no](https://tappin.no), Norway's event platform.

> **Version 2** marks the first complete production-ready rebuild: 15 SEO-optimized pages, real product screenshots, official brand assets, self-hosted Galano Grotesque, and a deploy-ready Vercel config.

---

## What's in here

**15 SEO-optimized pages** (all 1,000+ words, fully internally linked):

- `index.html` — Homepage with ROI calculator, lead magnet, exit-intent
- `about.html`, `contact.html` — Company pages
- `physical-event.html`, `hybrid-event.html`, `digital-event.html` — Solution pages
- `payments-registrations.html`, `event-access.html`, `event-app.html`, `interactivity-gamification.html` — Platform pages
- `stories.html`, `blog-post.html` — Blog index + sample article
- `privacy.html`, `gdpr.html`, `data-processing.html` — Legal pages

**Plus:**
- `robots.txt` + `sitemap.xml`
- `SEO-KEYWORDS.md` — focus + secondary keyword map for all 15 pages
- `VERSION` — current version string
- `vercel.json` — clean URLs, security headers, redirects to live-site slugs

---

## What's new in v2 (vs the live tappin.no)

- **Lead generation:** 18+ CTAs across the site (vs 3 on live), ROI calculator, exit-intent modal, lead magnet, sticky mobile CTA, demo form
- **15 pages built, fully cross-linked** — solutions, platform, stories, legal, blog
- **SEO:** focus keyword per page (Norway-first), JSON-LD structured data, OG + Twitter cards, canonical URLs, breadcrumbs, FAQ schema
- **Brand-faithful:** official Tappin logo + reverse, Galano Grotesque self-hosted, Turquoise `#00CCC2` + Navy `#00183E` per brand guide v5
- **Real product screenshots** in hero sections (no AI-rendered mockups)
- **Em-dash free** — clean, human writing site-wide
- **Performance:** static HTML, no build step, lazy-loaded screenshots, preloaded brand fonts

---

## Stack

- Pure HTML + custom CSS + vanilla JS (no build step, no framework)
- Brand colors: Tappin Turquoise `#00CCC2` + Navy `#00183E`
- Typography: Galano Grotesque (self-hosted, 6 weights) with Manrope + Open Sans fallback
- Logo: official brand PNGs (`assets/logo-main.png`, `assets/logo-reverse.png`)

---

## Forms

All forms route to `post@tappin.no` via mailto: (placeholder). Production setup: swap the handler in `assets/js/main.js` for a fetch call to your backend, Formspree, or Web3Forms endpoint.

---

## Local preview

Open `index.html` directly in a browser, or run a tiny static server:

```
npx serve .
```

---

## Deployment

Configured for Vercel — see `vercel.json`. Static-hosted; no build needed.

- `main` branch deploys to production automatically when Vercel is connected
- Clean URLs enabled (`/about` serves `about.html`)
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- Long-cache headers on `/assets/*` (immutable)
- Redirects from live-site slugs (`/fysisk-event`, `/om-tappin`, etc.) to v2 routes

---

## Version history

See `VERSION` for the current version string and `CHANGELOG.md` (if added) for release notes. The current production release is tagged `v2.0.0` in git.
