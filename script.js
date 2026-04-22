/* ============================================================
   VERMILLION ACADEMY — JavaScript
   ============================================================ */

/* ---- 0. PRELOADER ---- */
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Hide preloader after ~2 seconds (allow CSS fill animation to finish)
  function hidePreloader() {
    preloader.classList.add('hidden');
    // Re-enable scroll after preloader hides
    document.body.style.overflow = '';
  }

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';

  // Minimum 2s display, then hide on window load (whichever is later)
  const minDelay = new Promise(resolve => setTimeout(resolve, 2000));
  const pageLoad = new Promise(resolve => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve);
  });

  Promise.all([minDelay, pageLoad]).then(hidePreloader);
})();


/* ---- 1. HEADER SCROLL EFFECT ---- */
(function () {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ---- 2. MOBILE MENU ---- */
(function () {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
    const expanded = hamburger.classList.contains('open');
    hamburger.setAttribute('aria-expanded', expanded);
  });

  // Close menu when a link is clicked
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    });
  });
})();


/* ---- 2B. DROPDOWN MENUS ---- */
(function () {
  const dropdownItems = document.querySelectorAll('.nav__item--dropdown');
  if (!dropdownItems.length) return;

  const isMobile = () => window.innerWidth <= 900;

  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.nav__link--has-dropdown');
    if (!trigger) return;

    // Mobile: toggle on click
    trigger.addEventListener('click', function (e) {
      if (!isMobile()) return;
      e.preventDefault();
      const isOpen = item.classList.contains('open');
      // Close all others
      dropdownItems.forEach(other => other !== item && other.classList.remove('open'));
      item.classList.toggle('open', !isOpen);
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav__item--dropdown')) {
      dropdownItems.forEach(item => item.classList.remove('open'));
    }
  });

  // Close dropdowns on resize to desktop
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      dropdownItems.forEach(item => item.classList.remove('open'));
    }
  });
})();


/* ---- 3. SCROLL REVEAL ANIMATIONS ---- */
(function () {
  const revealSelectors = '.reveal-up, .reveal-left, .reveal-right';
  const elements = document.querySelectorAll(revealSelectors);

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.style.getPropertyValue('--delay') || '0s';
          const delayMs = parseFloat(delay) * 1000;
          setTimeout(() => {
            el.classList.add('revealed');
          }, delayMs);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ---- 4. HERO FADE-IN ON LOAD ---- */
(function () {
  const heroContent = document.querySelector('.reveal-hero');
  if (!heroContent) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      heroContent.classList.add('revealed');
    }, 200);
  });
})();


/* ---- 5. COUNTER ANIMATION ---- */
(function () {
  const counters = document.querySelectorAll('.stat-item__num[data-target]');
  if (!counters.length) return;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000; // ms
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.round(easedProgress * target);

      // Format with commas if large
      el.textContent = current >= 1000
        ? current.toLocaleString()
        : current;

      // Append % if the label contains "%"
      const label = el.nextElementSibling ? el.nextElementSibling.textContent : '';
      if (label.includes('%') && progress >= 1) {
        el.textContent = target + '%';
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
})();


/* ---- 6. CONTACT FORM SUBMIT ---- */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#2a7a2a';
      form.reset();

      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
})();


/* ---- 7. SMOOTH ANCHOR SCROLL (with header offset) ---- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = document.getElementById('header')?.offsetHeight || 76;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
