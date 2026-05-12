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

  function apply(lang) {
    cacheOriginals();
    const dict = (lang !== 'en' && window.translations && window.translations[lang]) || null;

    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (lang === 'en' || !dict || !dict[key]) {
        if (el.dataset.original != null) el.innerHTML = el.dataset.original;
      } else {
        el.innerHTML = dict[key];
      }
    });

    // Attribute content (e.g., input placeholder)
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

    document.documentElement.setAttribute('lang', lang === 'nb' ? 'nb-NO' : 'en');

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
