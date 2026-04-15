/**
 * WEST FORK LANDING — MAIN SCRIPT
 * Reads SITE_CONFIG (content/config.js) and:
 *  1. Populates all config-driven content (prices, open house, agent)
 *  2. Shows/hides open house banner + modal based on config flag
 *  3. Runs gallery lightbox
 *  4. Handles open house modal (auto-show on first visit)
 *  5. Sticky nav scroll effect
 */

(function () {
  'use strict';

  /* ── 1. POPULATE CONFIG-DRIVEN CONTENT ──────────────────────── */
  function populateConfig() {
    const cfg = window.SITE_CONFIG;
    if (!cfg) return;

    // Helper: set text content on all matching elements
    function setText(selector, value) {
      document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
    }
    function setHref(selector, value) {
      document.querySelectorAll(selector).forEach(el => { el.href = value; });
    }

    // Open house
    const oh = cfg.openHouse;
    if (!oh.active) {
      document.querySelectorAll('[data-oh]').forEach(el => el.classList.add('hidden'));
    } else {
      setText('[data-oh-date]',    oh.date);
      setText('[data-oh-time]',    oh.time);
      setText('[data-oh-address]', oh.address);
      setHref('[data-oh-gcal]',    oh.googleCalendarUrl);
    }

    // Prices
    setText('[data-home-price]',   cfg.home.price);
    setText('[data-lot-price]',    cfg.lot.price);
    setText('[data-combined-price]', cfg.compound.combinedPrice);
    setText('[data-home-price-pill-label]', cfg.compound.homePriceLabel);
    setText('[data-lot-price-pill-label]',  cfg.compound.lotPriceLabel);
    setText('[data-home-price-pill-val]',   cfg.home.price);
    setText('[data-lot-price-pill-val]',    cfg.lot.price);

    // Hero stats
    const statEls = document.querySelectorAll('[data-hero-stat]');
    statEls.forEach(el => {
      const idx = parseInt(el.dataset.heroStat, 10);
      const stat = cfg.heroStats[idx];
      if (!stat) return;
      const num = el.querySelector('.hero-stat-num');
      const lbl = el.querySelector('.hero-stat-label');
      if (num) num.textContent = stat.num;
      if (lbl) lbl.textContent = stat.label;
    });

    // Agent / contact
    const a = cfg.agent;
    setText('[data-agent-name]',  a.name);
    setText('[data-agent-title]', a.title);
    setText('[data-agent-phone-text]', '📞 ' + a.phone);
    setText('[data-agent-email-text]', '✉ ' + a.email);
    setHref('[data-agent-phone-href]', 'tel:' + a.phone.replace(/\D/g, ''));
    setHref('[data-agent-email-href]', 'mailto:' + a.email);

    // Footer disclaimer
    setText('[data-footer-disc]', cfg.footer.disclaimer);
    setHref('[data-trec-link]',   cfg.footer.trecUrl);
  }


  /* ── 2. NAV SCROLL EFFECT ────────────────────────────────────── */
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 60
        ? 'rgba(16,41,90,0.99)'
        : 'rgba(16,41,90,0.96)';
    }, { passive: true });
  }


  /* ── 3. GALLERY LIGHTBOX ─────────────────────────────────────── */
  // All gallery images — grid cells + full image list in order
  const GALLERY_IMAGES = [
    { src: 'images/gallery/aerial-1.jpg',        caption: 'Aerial — West Fork Estates'           },
    { src: 'images/gallery/front-elevation.jpg', caption: '4817 West Fork Blvd — Front Elevation'},
    { src: 'images/gallery/aerial-2.jpg',        caption: 'Aerial — Golf Course & River Views'   },
    { src: 'images/gallery/aerial-3.jpg',        caption: 'Aerial — Property Overview'           },
    { src: 'images/gallery/aerial-4.jpg',        caption: 'Aerial — River Greenbelt'             },
    { src: 'images/gallery/backyard.jpg',        caption: 'Backyard — Golf Course Views'         },
    { src: 'images/gallery/deck-staged.png',     caption: 'Covered Back Porch — Virtually Staged'},
    { src: 'images/gallery/living-staged.png',   caption: 'Living Room — Virtually Staged'       },
    { src: 'images/gallery/dining-staged.png',   caption: 'Dining Room — Virtually Staged'       },
    { src: 'images/gallery/kitchen.jpg',         caption: 'Chef\'s Kitchen'                      },
    { src: 'images/gallery/entryway.jpg',        caption: 'Grand Entryway'                       },
    { src: 'images/gallery/primary-staged.png',  caption: 'Primary Suite — Virtually Staged'     },
    { src: 'images/gallery/primary-bedroom.jpg', caption: 'Primary Bedroom'                      },
    { src: 'images/gallery/dining.jpg',          caption: 'Dining Room'                          },
  ];

  let currentIndex = 0;

  function initLightbox() {
    const lightbox  = document.getElementById('lightbox');
    const lbImg     = document.getElementById('lb-img');
    const lbCaption = document.getElementById('lb-caption');
    const lbCounter = document.getElementById('lb-counter');
    if (!lightbox || !lbImg) return;

    function openAt(idx) {
      currentIndex = Math.max(0, Math.min(idx, GALLERY_IMAGES.length - 1));
      const item = GALLERY_IMAGES[currentIndex];
      lbImg.src = item.src;
      lbImg.alt = item.caption;
      if (lbCaption) lbCaption.textContent = item.caption;
      if (lbCounter) lbCounter.textContent = (currentIndex + 1) + ' / ' + GALLERY_IMAGES.length;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function prev() { openAt(currentIndex === 0 ? GALLERY_IMAGES.length - 1 : currentIndex - 1); }
    function next() { openAt(currentIndex === GALLERY_IMAGES.length - 1 ? 0 : currentIndex + 1); }

    // Wire up photo grid cells
    document.querySelectorAll('.photo-cell[data-gallery-idx]').forEach(cell => {
      cell.addEventListener('click', () => openAt(parseInt(cell.dataset.galleryIdx, 10)));
    });

    // "View all photos" button
    document.querySelectorAll('[data-open-gallery]').forEach(btn => {
      btn.addEventListener('click', () => openAt(0));
    });

    // Controls
    document.getElementById('lb-close')?.addEventListener('click', close);
    document.getElementById('lb-prev')?.addEventListener('click', prev);
    document.getElementById('lb-next')?.addEventListener('click', next);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

    // Keyboard
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape')      close();
      if (e.key === 'ArrowLeft')   prev();
      if (e.key === 'ArrowRight')  next();
    });
  }


  /* ── 4. OPEN HOUSE MODAL ─────────────────────────────────────── */
  function initOhModal() {
    const cfg = window.SITE_CONFIG;
    if (!cfg?.openHouse?.active) return;

    const overlay = document.getElementById('oh-modal');
    if (!overlay) return;

    function open()  { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
    function close() { overlay.classList.remove('active'); document.body.style.overflow = ''; }

    document.getElementById('oh-modal-close')?.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.querySelectorAll('[data-open-oh-modal]').forEach(btn => {
      btn.addEventListener('click', open);
    });

    // Auto-show once per session
    if (!sessionStorage.getItem('oh-modal-shown')) {
      setTimeout(() => {
        open();
        sessionStorage.setItem('oh-modal-shown', '1');
      }, 2500);
    }
  }


  /* ── 5. SMOOTH SCROLL FOR NAV LINKS ─────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }


  /* ── INIT ────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    populateConfig();
    initNavScroll();
    initLightbox();
    initOhModal();
    initSmoothScroll();
  });

})();
