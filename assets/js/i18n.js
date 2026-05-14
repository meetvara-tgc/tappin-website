/* ============================================
   TAPPIN — i18n runtime (v2.2.0)
   Detects language from localStorage > browser > IP (Nordic countries).
   Applies Norwegian translations to [data-i18n] elements.
   English is the source content (in HTML), so switching back to EN
   restores from cached originals.
   ============================================ */
(function () {
  'use strict';

  const NORDIC_COUNTRIES = ['NO', 'SE', 'DK', 'FI', 'IS'];
  const STORAGE_KEY = 'tappinLang';
  const SUPPORTED = ['en', 'nb'];

  function pickFromBrowser() {
    const list = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || 'en'];
    for (const raw of list) {
      const lang = String(raw).toLowerCase();
      if (lang.startsWith('nb') || lang.startsWith('no') || lang.startsWith('nn')) return 'nb';
    }
    return null;
  }

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }
  function setStored(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
  }

  function cacheOriginals() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (!el.dataset.original) {
        // Allow markup in originals only when needed; default to textContent for safety.
        el.dataset.original = el.innerHTML;
      }
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.dataset.i18nAttr; // "attr:key" e.g. "placeholder:form.namePlaceholder"
      if (!spec) return;
      const [attr] = spec.split(':');
      if (!attr) return;
      const cacheKey = 'original' + attr.charAt(0).toUpperCase() + attr.slice(1);
      if (!el.dataset[cacheKey]) el.dataset[cacheKey] = el.getAttribute(attr) || '';
    });
  }

  // ============================================
  // META SWAP — title + description + OG + Twitter
  // ============================================
  let metaCache = null;
  function getPageId() {
    const m = document.querySelector('meta[name="page-id"]');
    return m ? m.getAttribute('content') : null;
  }
  function setMetaContent(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('content', value);
  }
  function cacheEnMeta() {
    if (metaCache) return;
    const desc = document.querySelector('meta[name="description"]');
    const ogt  = document.querySelector('meta[property="og:title"]');
    const ogd  = document.querySelector('meta[property="og:description"]');
    const ogl  = document.querySelector('meta[property="og:locale"]');
    const twt  = document.querySelector('meta[name="twitter:title"]');
    const twd  = document.querySelector('meta[name="twitter:description"]');
    const htmllang = document.documentElement.getAttribute('lang');
    metaCache = {
      title:           document.title,
      description:     desc ? desc.getAttribute('content') : '',
      ogTitle:         ogt ? ogt.getAttribute('content') : '',
      ogDescription:   ogd ? ogd.getAttribute('content') : '',
      ogLocale:        ogl ? ogl.getAttribute('content') : 'en_NO',
      twitterTitle:    twt ? twt.getAttribute('content') : '',
      twitterDesc:     twd ? twd.getAttribute('content') : '',
      htmlLang:        htmllang || 'en'
    };
  }
  function swapMeta(lang) {
    cacheEnMeta();
    const pageId = getPageId();
    if (lang === 'nb' && pageId && window.nbMeta && window.nbMeta[pageId]) {
      const m = window.nbMeta[pageId];
      document.title = m.title;
      setMetaContent('meta[name="description"]',         m.description);
      setMetaContent('meta[property="og:title"]',        m.title);
      setMetaContent('meta[property="og:description"]',  m.description);
      setMetaContent('meta[property="og:locale"]',       'nb_NO');
      setMetaContent('meta[name="twitter:title"]',       m.title);
      setMetaContent('meta[name="twitter:description"]', m.description);
    } else {
      // Restore English
      document.title = metaCache.title;
      setMetaContent('meta[name="description"]',         metaCache.description);
      setMetaContent('meta[property="og:title"]',        metaCache.ogTitle);
      setMetaContent('meta[property="og:description"]',  metaCache.ogDescription);
      setMetaContent('meta[property="og:locale"]',       metaCache.ogLocale);
      setMetaContent('meta[name="twitter:title"]',       metaCache.twitterTitle);
      setMetaContent('meta[name="twitter:description"]', metaCache.twitterDesc);
    }
  }

  // Original-text cache for text-node walker (so EN can be restored)
  const textNodeCache = new WeakMap();

  function walkText(lang, textMap) {
    // Skip non-rendered subtrees + interactive form fields
    const SKIP_SELECTORS = 'script, style, noscript, .lang-switcher, [data-i18n], [data-i18n-skip], input, textarea, select, code, pre';
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.parentElement) return NodeFilter.FILTER_REJECT;
          if (node.parentElement.closest(SKIP_SELECTORS)) return NodeFilter.FILTER_REJECT;
          const t = node.nodeValue;
          if (!t || !t.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(node => {
      const cached = textNodeCache.get(node);
      const originalText = cached !== undefined ? cached : node.nodeValue;
      if (cached === undefined) textNodeCache.set(node, node.nodeValue);
      if (lang === 'en' || !textMap) {
        node.nodeValue = originalText;
      } else {
        const trimmed = originalText.trim();
        if (textMap[trimmed]) {
          // Preserve leading/trailing whitespace
          const lead = originalText.match(/^\s*/)[0];
          const trail = originalText.match(/\s*$/)[0];
          node.nodeValue = lead + textMap[trimmed] + trail;
        } else {
          node.nodeValue = originalText;
        }
      }
    });
  }

  function apply(lang) {
    cacheOriginals();
    const dict = (lang !== 'en' && window.translations && window.translations[lang]) || null;
    const textMap = (lang !== 'en' && window.translations && window.translations[lang + 'Text']) || null;

    // 1) HTML/markup content via data-i18n (more reliable for elements with mixed content)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (lang === 'en' || !dict || !dict[key]) {
        if (el.dataset.original != null) el.innerHTML = el.dataset.original;
      } else {
        el.innerHTML = dict[key];
      }
    });

    // 2) Attribute content (placeholders, etc.)
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.dataset.i18nAttr;
      if (!spec) return;
      const [attr, key] = spec.split(':');
      if (!attr || !key) return;
      const cacheKey = 'original' + attr.charAt(0).toUpperCase() + attr.slice(1);
      if (lang === 'en' || !dict || !dict[key]) {
        if (el.dataset[cacheKey] != null) el.setAttribute(attr, el.dataset[cacheKey]);
      } else {
        el.setAttribute(attr, dict[key]);
      }
    });

    // 3) Plain text-node walker — covers all remaining English text whose parent
    //    doesn't have data-i18n. Uses a content-keyed map (translations.nbText).
    walkText(lang, textMap);

    // 4) Translate form placeholders that have no data-i18n-attr but match the text map
    if (textMap) {
      document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
        if (!el.dataset.originalPlaceholder) el.dataset.originalPlaceholder = el.getAttribute('placeholder');
        const orig = el.dataset.originalPlaceholder;
        if (lang === 'en') {
          el.setAttribute('placeholder', orig);
        } else if (textMap[orig]) {
          el.setAttribute('placeholder', textMap[orig]);
        }
      });
    } else {
      document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
        if (el.dataset.originalPlaceholder) el.setAttribute('placeholder', el.dataset.originalPlaceholder);
      });
    }

    document.documentElement.setAttribute('lang', lang === 'nb' ? 'nb-NO' : 'en');

    // 5) Swap document title + meta description + OG/Twitter tags per page-id
    swapMeta(lang);

    // Toggle UI state
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    window.dispatchEvent(new CustomEvent('tappin:langchange', { detail: { lang } }));
  }

  function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) lang = 'en';
    setStored(lang);
    apply(lang);
  }
  window.tappinSetLanguage = setLanguage;

  function init() {
    // 1) Stored preference wins
    const stored = getStored();
    if (stored && SUPPORTED.includes(stored)) {
      apply(stored);
      wireToggle();
      return;
    }
    // 2) Browser language
    const fromBrowser = pickFromBrowser();
    if (fromBrowser) {
      apply(fromBrowser);
      setStored(fromBrowser);
      wireToggle();
      return;
    }
    // 3) IP geo for Nordic countries (timeout-bounded so we never block)
    apply('en'); // start in English; switch if Nordic detected
    wireToggle();
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 2000);
      fetch('https://api.country.is/', { signal: controller.signal })
        .then(r => r.json())
        .then(data => {
          clearTimeout(t);
          if (data && data.country && NORDIC_COUNTRIES.includes(data.country) && !getStored()) {
            apply('nb');
            setStored('nb');
          }
        })
        .catch(() => { /* keep English */ });
    } catch { /* keep English */ }
  }

  function wireToggle() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;
      e.preventDefault();
      setLanguage(btn.dataset.lang);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
