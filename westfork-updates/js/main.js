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


  /* ── 2b. MOBILE NAV DRAWER ───────────────────────────────────── */
  function initMobileNav() {
    const toggle    = document.getElementById('nav-toggle');
    const drawer    = document.getElementById('nav-drawer');
    const backdrop  = document.getElementById('nav-drawer-backdrop');
    const closeBtn  = document.getElementById('nav-drawer-close');
    if (!toggle || !drawer || !backdrop) return;

    const focusables = () => drawer.querySelectorAll('a, button');
    let lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      drawer.classList.add('active');
      backdrop.classList.add('active');
      drawer.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
      setTimeout(() => closeBtn?.focus(), 50);
    }
    function close() {
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    toggle.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    backdrop.addEventListener('click', close);

    // Close after any in-drawer nav link tap
    drawer.querySelectorAll('[data-drawer-link]').forEach(link => {
      link.addEventListener('click', () => setTimeout(close, 80));
    });

    document.addEventListener('keydown', e => {
      if (!drawer.classList.contains('active')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        const items = Array.from(focusables());
        if (!items.length) return;
        const first = items[0];
        const last  = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }


  /* ── 2c. SCROLL REVEAL ───────────────────────────────────────── */
  function initScrollReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length || !('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    // Stagger children index for grids using data-reveal-stagger
    document.querySelectorAll('[data-reveal-stagger]').forEach(parent => {
      Array.from(parent.children).forEach((child, i) => {
        child.style.setProperty('--reveal-i', i);
      });
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }


  /* ── 2d. HERO STAT COUNT-UP ──────────────────────────────────── */
  function initHeroStatCountUp() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const nums = document.querySelectorAll('.hero-stat-num');
    if (!nums.length || !('IntersectionObserver' in window)) return;

    function animate(el) {
      const txt = el.textContent;
      // Skip stats with multiple numeric groups (e.g. "4BR / 4.5BA", "$690K | $90K")
      const groups = txt.match(/[\d,]+\.?\d*/g);
      if (!groups || groups.length !== 1) return;
      const match = txt.match(/[\d,]+\.?\d*/);
      const target = parseFloat(match[0].replace(/,/g, ''));
      if (!Number.isFinite(target) || target < 10) return;
      const hasComma = /,/.test(match[0]);
      const decimals = (match[0].split('.')[1] || '').length;
      const prefix   = txt.slice(0, match.index);
      const suffix   = txt.slice(match.index + match[0].length);
      const duration = 1100;
      const start    = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const cur = target * eased;
        const formatted = decimals
          ? cur.toFixed(decimals)
          : Math.round(cur).toString();
        const withCommas = hasComma
          ? formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : formatted;
        el.textContent = prefix + withCommas + suffix;
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach(el => io.observe(el));
  }


  /* ── 2e. GALLERY CELL FADE-IN ────────────────────────────────── */
  function initGalleryReveal() {
    const cells = document.querySelectorAll('.photo-cell');
    if (!cells.length) return;
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cells.forEach(c => c.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.galleryIdx, 10) || 0;
          entry.target.style.transitionDelay = ((idx % 6) * 50) + 'ms';
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });
    cells.forEach(c => io.observe(c));
  }


  /* ── 3. GALLERY LIGHTBOX ─────────────────────────────────────── */
  const GALLERY = [
    { src: 'images/gallery/1.jpg',                                    caption: '4817 West Fork Blvd — Front Elevation'                  },
    { src: 'images/gallery/2%20Deck%20virtually%20staged.jpg',        caption: 'Deck (Virtually Staged)'                                },
    { src: 'images/gallery/3%20deck%20virtually%20staged.jpg',        caption: 'Deck — Additional View (Virtually Staged)'              },
    { src: 'images/gallery/4.jpg',                                    caption: '4817 West Fork Blvd — Exterior'                         },
    { src: 'images/gallery/5%20entryway.jpg',                         caption: 'Entryway'                                               },
    { src: 'images/gallery/6%20dining%20room%20virtually%20staged.jpg', caption: 'Dining Room (Virtually Staged)'                       },
    { src: 'images/gallery/7%20office%20virtrually%20staged.jpg',     caption: 'Office (Virtually Staged)'                              },
    { src: 'images/gallery/8%20study.jpg',                            caption: 'Study'                                                  },
    { src: 'images/gallery/9%20family%20room%20virtually%20staged.jpg', caption: 'Family Room (Virtually Staged)'                       },
    { src: 'images/gallery/10%20family%20room.jpg',                   caption: 'Family Room'                                            },
    { src: 'images/gallery/11%20family%20room.jpg',                   caption: 'Family Room — Additional View'                          },
    { src: 'images/gallery/12%20kitchen.jpg',                         caption: 'Kitchen'                                                },
    { src: 'images/gallery/13%20breakfast%20area%20virtually%20staged.jpg', caption: 'Breakfast Area (Virtually Staged)'                },
    { src: 'images/gallery/14%20kitchen.jpg',                         caption: 'Kitchen — Additional View'                              },
    { src: 'images/gallery/15%20kitchen.jpg',                         caption: 'Kitchen — Additional Angle'                             },
    { src: 'images/gallery/16%20primary%20bedroom%20virtually%20staged.jpg', caption: 'Primary Bedroom (Virtually Staged)'              },
    { src: 'images/gallery/17%20primary%20bedroom.jpg',               caption: 'Primary Bedroom'                                        },
    { src: 'images/gallery/18%20primary%20bathroom.jpg',              caption: 'Primary Bathroom'                                       },
    { src: 'images/gallery/19%20primay%20bathroom.jpg',               caption: 'Primary Bathroom — Additional View'                     },
    { src: 'images/gallery/20%20primary%20closet%20virtually%20staged.jpg', caption: 'Primary Closet (Virtually Staged)'                },
    { src: 'images/gallery/22%20game.media%20room%20virtually%20staged.jpg', caption: 'Game / Media Room (Virtually Staged)'            },
    { src: 'images/gallery/23%20game.media%20room.jpg',               caption: 'Game / Media Room'                                      },
    { src: 'images/gallery/24%20secondary%20bedroom%20virtually%20staged.jpg', caption: 'Secondary Bedroom (Virtually Staged)'          },
    { src: 'images/gallery/25%20secondary%20bedroom%20virtually%20staged.jpg', caption: 'Secondary Bedroom — Additional View (Virtually Staged)' },
    { src: 'images/gallery/26%20secondary%20bedroom.jpg',             caption: 'Secondary Bedroom'                                      },
    { src: 'images/gallery/27%20second%20primary%20up%20virtually%20staged.jpg', caption: 'Second Primary Suite Upstairs (Virtually Staged)' },
    { src: 'images/gallery/27%20secondary%20primary%20up%20dif%20angle.jpg', caption: 'Second Primary Suite — Additional Angle'         },
    { src: 'images/gallery/28%20en%20suite.jpg',                      caption: 'En Suite Bathroom'                                      },
    { src: 'images/gallery/29%20en%20suite%20br.jpg',                 caption: 'En Suite Bedroom'                                       },
    { src: 'images/gallery/31.jpg',                                   caption: '4817 West Fork Blvd — Photo 31'                         },
    { src: 'images/gallery/32.jpg',                                   caption: '4817 West Fork Blvd — Photo 32'                         },
    { src: 'images/gallery/33-web-or-mls-DSC00121.jpg',               caption: '4817 West Fork Blvd — Photo 33'                         },
    { src: 'images/gallery/33.jpg',                                   caption: '4817 West Fork Blvd — Photo 33B'                        },
    { src: 'images/gallery/34.jpg',                                   caption: '4817 West Fork Blvd — Photo 34'                         },
    { src: 'images/gallery/35.jpg',                                   caption: '4817 West Fork Blvd — Photo 35'                         },
    { src: 'images/gallery/36.jpg',                                   caption: '4817 West Fork Blvd — Photo 36'                         },
    { src: 'images/gallery/37.JPG',                                   caption: '4817 West Fork Blvd — Photo 37'                         },
    { src: 'images/gallery/50.jpg',                                   caption: '4817 West Fork Blvd — Photo 50'                         },
    { src: 'images/gallery/51.jpg',                                   caption: '4817 West Fork Blvd — Photo 51'                         },
    { src: 'images/gallery/52-web-or-mls-DSC00011.jpg',               caption: '4817 West Fork Blvd — Photo 52'                         },
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

    // Auto-show once per browser session — desktop only (avoid intrusive popup on mobile)
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;
    if (isDesktop && !sessionStorage.getItem('oh-shown')) {
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
    initMobileNav();
    initLightbox();
    initModal();
    initSmoothScroll();
    initScrollReveal();
    initHeroStatCountUp();
    initGalleryReveal();
  });

})();
