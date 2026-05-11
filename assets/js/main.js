/* ============================================
   TAPPIN — Interactions
   - Sticky nav state, mobile menu
   - ROI calculator (live)
   - Forms → mailto:post@tappin.no (placeholder)
     SWAP TO PRODUCTION:  replace handleFormSubmit() body with a fetch()
     to your backend, Formspree, or Web3Forms endpoint.
   - Exit-intent modal
   - Reveal on scroll, animated counters
   ============================================ */

(function () {
  'use strict';

  const $  = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  // --------------------------------------------
  // Nav: scrolled state + mobile toggle
  // --------------------------------------------
  const nav = $('#nav');
  const navToggle = $('#navToggle');
  const navMobile = $('#navMobile');

  const setScrolled = () => {
    if (window.scrollY > 8) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('is-open');
    navMobile.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  $$('#navMobile a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('is-open');
      navMobile.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // --------------------------------------------
  // Announcement bar close
  // --------------------------------------------
  const announce = $('#announce');
  const announceClose = $('.announce-close');
  if (sessionStorage.getItem('announceClosed') === '1') {
    announce.classList.add('is-hidden');
  }
  announceClose && announceClose.addEventListener('click', () => {
    announce.classList.add('is-hidden');
    sessionStorage.setItem('announceClosed', '1');
  });

  // --------------------------------------------
  // ROI Calculator
  // --------------------------------------------
  const roiEvents    = $('#roiEvents');
  const roiAttendees = $('#roiAttendees');
  const roiTeam      = $('#roiTeam');
  const roiEventsOut    = $('#roiEventsOut');
  const roiAttendeesOut = $('#roiAttendeesOut');
  const roiTeamOut      = $('#roiTeamOut');
  const roiHours = $('#roiHours');
  const roiValue = $('#roiValue');

  const fmt = (n) => n.toLocaleString('en-US');

  const calcRoi = () => {
    const events    = parseInt(roiEvents.value, 10);
    const attendees = parseInt(roiAttendees.value, 10);
    const team      = parseInt(roiTeam.value, 10);

    roiEventsOut.textContent    = fmt(events);
    roiAttendeesOut.textContent = fmt(attendees);
    roiTeamOut.textContent      = fmt(team);

    // Heuristic: hours saved per event scales with attendees + team coordination.
    // Real customer benchmark: ~32 hrs saved per event at 350 attendees, 3-person team.
    const baseHoursPerEvent = 6 + (attendees / 350) * 18 + team * 2.4;
    const hoursTotal = Math.round(events * baseHoursPerEvent);
    const hourlyCost = 600; // NOK per hour avg loaded cost

    roiHours.textContent = fmt(hoursTotal);
    roiValue.textContent = 'kr ' + fmt(hoursTotal * hourlyCost);
  };

  [roiEvents, roiAttendees, roiTeam].forEach(el => el && el.addEventListener('input', calcRoi));
  calcRoi();

  // --------------------------------------------
  // FORM HANDLERS
  // All forms route to post@tappin.no via mailto: as a placeholder.
  //
  // ▶ FOR PRODUCTION — swap the mailto block below for:
  //
  //   await fetch('https://api.tappin.no/leads', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(payload)
  //   });
  //
  // Or use a service like Web3Forms / Formspree / HubSpot.
  // --------------------------------------------
  const TARGET_EMAIL = 'post@tappin.no';

  const showToast = (msg) => {
    const toast = $('#toast');
    toast.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 4200);
  };

  const buildMailto = (subject, fields) => {
    const lines = Object.entries(fields)
      .filter(([, v]) => v != null && String(v).trim() !== '')
      .map(([k, v]) => `${k}: ${v}`);
    const body = lines.join('\n');
    return `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const formMeta = {
    demo:     { subject: 'New demo request from tappin.no',         toast: 'Demo request submitted. We\'ll reply within 2 hours.' },
    playbook: { subject: 'Playbook download · tappin.no',           toast: 'Playbook on its way to your inbox.' },
    roi:      { subject: 'ROI breakdown request · tappin.no',       toast: 'ROI breakdown sent. Check your inbox.' },
    exit:     { subject: 'Playbook download (exit) · tappin.no',    toast: 'Playbook on its way. Thank you!' }
  };

  const handleSubmit = (form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const kind = form.dataset.form;
      const data = new FormData(form);
      const fields = {};
      data.forEach((v, k) => fields[k] = v);

      const meta = formMeta[kind] || { subject: 'Inquiry from tappin.no', toast: 'Thanks — message sent.' };
      const href = buildMailto(meta.subject, fields);

      // Try to open user's email client with prefilled message.
      // In production, swap for fetch() to backend (see comment above).
      try {
        const a = document.createElement('a');
        a.href = href;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) { /* noop */ }

      showToast(meta.toast);
      form.reset();
      if (kind === 'exit') closeModal();
      if (kind === 'demo') {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.textContent = '✓ Request received';
          submitBtn.disabled = true;
        }
      }
    });
  };

  $$('[data-form]').forEach(handleSubmit);

  // --------------------------------------------
  // Exit-intent modal (desktop) + scroll-depth trigger (mobile)
  // --------------------------------------------
  const modal = $('#exitModal');
  const openModal = () => {
    if (sessionStorage.getItem('exitShown') === '1') return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    sessionStorage.setItem('exitShown', '1');
  };
  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };
  $$('[data-close]', modal).forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  // Desktop: trigger when mouse exits top of viewport
  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget && e.clientY < 40 && window.innerWidth > 900) {
      openModal();
    }
  });

  // Mobile fallback: trigger after deep scroll + brief pause
  let scrolledDeep = false;
  let lastScrollTime = Date.now();
  window.addEventListener('scroll', () => {
    lastScrollTime = Date.now();
    const pct = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
    if (pct > 0.55 && !scrolledDeep && window.innerWidth <= 900) {
      scrolledDeep = true;
      setTimeout(() => {
        if (Date.now() - lastScrollTime > 4000) openModal();
      }, 5000);
    }
  }, { passive: true });

  // --------------------------------------------
  // Reveal on scroll (subtle fade-up for sections)
  // --------------------------------------------
  const revealTargets = $$('.section-head, .pain-card, .feature-row, .testimonial, .playbook-grid, .roi-grid, .pricing-card, .faq-item, .outcome');
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => io.observe(el));

  // --------------------------------------------
  // Animated counters in the outcomes strip
  // --------------------------------------------
  const counters = $$('[data-count]');
  const counterIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '+';
      const start = performance.now();
      const dur = 1400;
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const val = Math.round(target * ease(t));
        el.textContent = val.toLocaleString('en-US') + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIo.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterIo.observe(el));

  // --------------------------------------------
  // Stagger index — children of grids fade in one after another
  // --------------------------------------------
  const staggerParents = $$('.pain-grid, .value-grid, .team-grid, .stories-grid, .testimonial-grid, .outcomes-stats');
  staggerParents.forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.setProperty('--reveal-i', i);
    });
  });

  // --------------------------------------------
  // Scroll progress bar
  // --------------------------------------------
  const progressEl = document.querySelector('.scroll-progress > span');
  if (progressEl) {
    let ticking = false;
    const updateProgress = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const total = h.scrollHeight - h.clientHeight;
      const pct = total > 0 ? (scrollTop / total) * 100 : 0;
      progressEl.style.width = pct + '%';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
    }, { passive: true });
    updateProgress();
  }

  // --------------------------------------------
  // Card halo — radial highlight follows cursor
  // --------------------------------------------
  const haloCards = $$('.pain-card, .value-card, .testimonial:not(.t-feature), .story-card, .team-card');
  haloCards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  // --------------------------------------------
  // Smooth-scroll offset for sticky nav
  // --------------------------------------------
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
