# Tappin Website — Redesigned

Lead-generation focused redesign of [tappin.no](https://tappin.no), Norway's event platform.

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
- `SEO-KEYWORDS.md` — keyword map for all 15 pages

## Stack

- Pure HTML + Tailwind-style custom CSS + vanilla JS (no build step)
- Brand colors: Tappin Turquoise `#00CCC2` + Navy `#00183E`
- Manrope (Galano Grotesque fallback) + Open Sans

## Forms

All forms route to `post@tappin.no` via mailto: (placeholder). Production setup: swap the handler in `assets/js/main.js` for a fetch call to your backend, Formspree, or Web3Forms endpoint.

## Local preview

Open `index.html` directly in a browser, or run a tiny static server:

```
npx serve .
```

## Deployment

Configured for Vercel — see `vercel.json`. Static-hosted; no build needed.
