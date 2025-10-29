document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // THEME: system-detect + toggle + persist
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  if (initialDark) body.classList.add('dark-mode');

  const sunIcon = '\u2600'; // sun symbol
  const moonIcon = '\u{1F319}'; // crescent moon

  const setToggleLabel = () => {
    if (!themeToggle) return;
    const dark = body.classList.contains('dark-mode');
    themeToggle.textContent = dark ? sunIcon : moonIcon;
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('aria-pressed', String(dark));
  };
  setToggleLabel();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
      setToggleLabel();
    });
  }
  if (!savedTheme && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      body.classList.toggle('dark-mode', e.matches);
      setToggleLabel();
    });
  }

  // NAV: mobile hamburger toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const expanded = navLinks.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', String(expanded));
    });

    const closeMenu = () => {
      if (!navLinks.classList.contains('active')) return;
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    navLinks.addEventListener('click', (event) => {
      const target = event.target.closest('a');
      if (!target) return;

      const sectionSelector = target.dataset.section;
      if (sectionSelector) {
        const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
        const targetPath = new URL(target.href).pathname.replace(/\/index\.html$/, '/');
        if (currentPath === targetPath) {
          event.preventDefault();
          const sectionEl = document.querySelector(sectionSelector);
          if (sectionEl) {
            sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }

      closeMenu();
    });
  }

  // NAV: add scrolled state for blur + shadow
  const navbar = document.querySelector('.navbar');
  const onScrollNav = () => {
    if (!navbar) return;
    if (window.scrollY > 8) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  // FADE-UP animations for sections and cards
  const observed = Array.from(document.querySelectorAll('section, .card, .project-card, .job, .degree'));
  observed.forEach(el => el.classList.add('fade-up'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0 });
    observed.forEach(el => io.observe(el));
  } else {
    observed.forEach(el => el.classList.add('visible'));
  }

  // SCROLL TO TOP button
  const makeScrollTop = () => {
    const btn = document.createElement('button');
    btn.className = 'scroll-to-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);
    const toggleBtn = () => {
      if (window.scrollY > 600) btn.classList.add('show'); else btn.classList.remove('show');
    };
    toggleBtn();
    window.addEventListener('scroll', toggleBtn, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };
  makeScrollTop();

  // CONTACT: safe submission UX only on contact page
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      alert('Thank you for reaching out! I will get back to you soon.');
      contactForm.reset();
    });
  }
});
