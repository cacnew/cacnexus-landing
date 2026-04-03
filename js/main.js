/* ============================================
   CAC NEXUS — main.js
   ============================================ */

/* ---- 1. Navbar scroll behavior ---- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on init
})();

/* ---- 2. Mobile nav toggle ---- */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ---- 3. Smooth scroll for all anchor links ---- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight ?? 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ---- 4. IntersectionObserver — reveal on scroll ---- */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // stagger siblings within same parent
          const siblings = Array.from(
            entry.target.parentElement?.querySelectorAll('.reveal') ?? []
          );
          const index = siblings.indexOf(entry.target);
          const delay = index * 80;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(el => observer.observe(el));
})();

/* ---- 5. Terminal typewriter effect ---- */
(function initTerminal() {
  const container = document.getElementById('terminalBody');
  if (!container) return;

  const LINES = [
    { text: '$ cacnexus init --project novo-sistema',  cls: ['t-prompt', 't-cmd'] },
    { text: '# Iniciando ambiente de desenvolvimento...', cls: ['t-comment'] },
    { text: '',                                          cls: ['t-empty'] },
    { text: '✓ Dependências instaladas',                cls: ['t-success'] },
    { text: '✓ Banco de dados conectado',               cls: ['t-success'] },
    { text: '✓ IA configurada',                         cls: ['t-success'] },
    { text: '',                                          cls: ['t-empty'] },
    { text: '$ deploy --env production',               cls: ['t-prompt', 't-cmd'] },
    { text: '  building... ━━━━━━━━━━ 100%',           cls: ['t-purple'] },
    { text: '',                                          cls: ['t-empty'] },
    { text: '  🚀 Online em cacnexus.com',              cls: ['t-cyan'] },
    { text: '',                                          cls: ['t-empty'] },
    { text: '$ _',                                       cls: ['t-prompt'] },
  ];

  let lineIndex  = 0;
  let charIndex  = 0;
  let cursorEl   = null;

  function createLine(cls) {
    const span = document.createElement('span');
    span.className = 'terminal-line ' + cls.join(' ');
    container.appendChild(span);
    return span;
  }

  function removeCursor() {
    if (cursorEl) {
      cursorEl.remove();
      cursorEl = null;
    }
  }

  function addCursor(afterEl) {
    removeCursor();
    cursorEl = document.createElement('span');
    cursorEl.className = 'terminal-cursor';
    afterEl.appendChild(cursorEl);
  }

  function typeNextLine() {
    if (lineIndex >= LINES.length) return;

    const { text, cls } = LINES[lineIndex];
    const lineEl = createLine(cls);

    // Empty line — no typing needed
    if (!text) {
      lineIndex++;
      setTimeout(typeNextLine, 120);
      return;
    }

    charIndex = 0;
    addCursor(lineEl);

    function typeChar() {
      if (charIndex < text.length) {
        // Insert char before cursor
        lineEl.insertBefore(
          document.createTextNode(text[charIndex]),
          cursorEl
        );
        charIndex++;
        const delay = 28 + Math.random() * 30;
        setTimeout(typeChar, delay);
      } else {
        lineIndex++;
        const pause = lineIndex < LINES.length ? 260 : 0;
        setTimeout(typeNextLine, pause);
      }
    }

    typeChar();
  }

  // Start after a short delay so hero loads first
  setTimeout(typeNextLine, 600);
})();
