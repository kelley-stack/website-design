/**
 * WEST FORK LANDING — MAIN SCRIPT
 * Reads SITE_CONFIG (content/config.js) and:
 *  1. Populates all config-driven content (prices, open house, agent)
 *  2. Shows/hides open house elements based on config flag
 *  3. Gallery lightbox with keyboard navigation
 *  4. Open house modal (auto-shows once per session)
 *  5. Nav scroll state
 *  6. Keyboard accessibility for gallery grid
 */

(function () {
  'use strict';

  /* ── 1. POPULATE CONFIG-DRIVEN CONTENT ──────────────────────── */
  function populateConfig() {
    const cfg = window.SITE_CONFIG;
    if (!cfg) return;

    function setText(selector, value) {
      document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
    }
    function setHref(selector, value) {
      document.querySelectorAll(selector).forEach(el => { el.href = value; });
    }

    // Open house visibility
    if (!cfg.openHouse.active) {
      document.querySelectorAll('[data-oh]').forEach(el => el.classList.add('hidden'));
    } else {
      setText('[data-oh-date]',    cfg.openHouse.date);
      setText('[data-oh-time]',    cfg.openHouse.time);
      setText('[data-oh-address]', cfg.openHouse.address);
      setHref('[data-oh-gcal]',    cfg.openHouse.googleCalendarUrl);
    }

    // Prices
    setText('[data-home-price]',          cfg.home.price);
    setText('[data-lot-price]',           cfg.lot.price);
    setText('[data-combined-price]',      cfg.compound.combinedPrice);
    setText('[data-home-price-pill-label]', cfg.compound.homePriceLabel);
    setText('[data-lot-price-pill-label]',  cfg.compound.lotPriceLabel);
    setText('[data-home-price-pill-val]',   cfg.home.price);
    setText('[data-lot-price-pill-val]',    cfg.lot.price);

    // Hero stats
    document.querySelectorAll('[data-hero-stat]').forEach(el => {
      const stat = cfg.heroStats[parseInt(el.dataset.heroStat, 10)];
      if (!stat) return;
      const num = el.querySelector('.hero-stat-num');
      const lbl = el.querySelector('.hero-stat-label');
      if (num) num.textContent = stat.num;
      if (lbl) lbl.textContent = stat.label;
    });

    // Agent contact
    const a = cfg.agent;
    setText('[data-agent-name]',  a.name);
    setText('[data-agent-title]', a.title);
    setText('[data-agent-phone-text]', a.phone);
    setText('[data-agent-email-text]', a.email);
    setHref('[data-agent-phone-href]', 'tel:' + a.phone.replace(/\D/g, ''));
    setHref('[data-agent-email-href]', 'mailto:' + a.email);

    // CTA phone button — keep "Call Kelley — " prefix
    const phoneBtn = document.querySelector('.cta-actions [data-agent-phone-text]');
    if (phoneBtn) phoneBtn.textContent = 'Call Kelley — ' + a.phone;

    // Footer
    setText('[data-footer-disc]', cfg.footer.disclaimer);
    setHref('[data-trec-link]',   cfg.footer.trecUrl);
  }


  /* ── 2. NAV SCROLL STATE ─────────────────────────────────────── */
  function initNav() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ── 3. GALLERY LIGHTBOX ─────────────────────────────────────── */
  const GALLERY = [
    { src: 'images/gallery/p01.jpg',  caption: '4817 West Fork Blvd — Front Elevation'  },
    { src: 'images/gallery/p02.png',  caption: '4817 West Fork Blvd — Photo 2'          },
    { src: 'images/gallery/p03.png',  caption: '4817 West Fork Blvd — Photo 3'          },
    { src: 'images/gallery/p04.png',  caption: '4817 West Fork Blvd — Photo 4'          },
    { src: 'images/gallery/p05.png',  caption: '4817 West Fork Blvd — Photo 5'          },
    { src: 'images/gallery/p06.jpg',  caption: '4817 West Fork Blvd — Photo 6'          },
    { src: 'images/gallery/p07.jpg',  caption: '4817 West Fork Blvd — Photo 7'          },
    { src: 'images/gallery/p08.png',  caption: '4817 West Fork Blvd — Photo 8'          },
    { src: 'images/gallery/p09.jpg',  caption: '4817 West Fork Blvd — Photo 9'          },
    { src: 'images/gallery/p10.png',  caption: '4817 West Fork Blvd — Photo 10'         },
    { src: 'images/gallery/p11.png',  caption: '4817 West Fork Blvd — Photo 11'         },
    { src: 'images/gallery/p12.png',  caption: '4817 West Fork Blvd — Photo 12'         },
    { src: 'images/gallery/p13.png',  caption: '4817 West Fork Blvd — Photo 13'         },
    { src: 'images/gallery/p14.png',  caption: '4817 West Fork Blvd — Photo 14'         },
  ];

  let currentIdx = 0;

  function initLightbox() {
    const lb      = document.getElementById('lightbox');
    const lbImg   = document.getElementById('lb-img');
    const lbCap   = document.getElementById('lb-caption');
    const lbCount = document.getElementById('lb-counter');
    if (!lb || !lbImg) return;

    function show(idx) {
      currentIdx = ((idx % GALLERY.length) + GALLERY.length) % GALLERY.length;
      const item = GALLERY[currentIdx];
      lbImg.src = item.src;
      lbImg.alt = item.caption;
      if (lbCap)   lbCap.textContent   = item.caption;
      if (lbCount) lbCount.textContent = `${currentIdx + 1} / ${GALLERY.length}`;
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.getElementById('lb-close')?.focus();
    }

    function close() {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Grid cell clicks
    document.querySelectorAll('.photo-cell[data-gallery-idx]').forEach(cell => {
      cell.addEventListener('click', () => show(parseInt(cell.dataset.galleryIdx, 10)));
      cell.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          show(parseInt(cell.dataset.galleryIdx, 10));
        }
      });
    });

    document.getElementById('lb-close')?.addEventListener('click', close);
    document.getElementById('lb-prev')?.addEventListener('click',  () => show(currentIdx - 1));
    document.getElementById('lb-next')?.addEventListener('click',  () => show(currentIdx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  show(currentIdx - 1);
      if (e.key === 'ArrowRight') show(currentIdx + 1);
    });
  }


  /* ── 4. OPEN HOUSE MODAL ─────────────────────────────────────── */
  function initModal() {
    const cfg = window.SITE_CONFIG;
    if (!cfg?.openHouse?.active) return;

    const overlay = document.getElementById('oh-modal');
    if (!overlay) return;

    function open()  {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.getElementById('oh-modal-close')?.focus();
    }
    function close() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    document.getElementById('oh-modal-close')?.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.querySelectorAll('[data-open-oh-modal]').forEach(btn => {
      btn.addEventListener('click', open);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) close();
    });

    // Auto-show once per browser session
    if (!sessionStorage.getItem('oh-shown')) {
      setTimeout(() => {
        open();
        sessionStorage.setItem('oh-shown', '1');
      }, 2800);
    }
  }


  /* ── 5. SMOOTH SCROLL ────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 64; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }


  /* ── INIT ────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    populateConfig();
    initNav();
    initLightbox();
    initModal();
    initSmoothScroll();
  });

})();
