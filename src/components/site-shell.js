(function () {
  const THEME_KEY = 'portfolio-theme';
  const navItems = [
    //{ label: 'Home', href: 'index.html#top', slug: 'home' },
    { label: 'About', href: 'index.html#about', slug: 'about' },
    { label: 'Experience', href: 'experience.html', slug: 'experience' },
    { label: 'Projects', href: 'project-1.html', slug: 'projects' },
    { label: 'Events', href: 'global-experience.html', slug: 'global-experience' },
    { label: 'Education', href: 'education.html', slug: 'education' },
    { label: 'Skills', href: 'skills.html', slug: 'skills' },
    { label: 'Contact', href: '#contact', slug: 'contact' }
  ];

  function getCurrentPage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === '' || path === 'index.html') return 'home';
    return path.replace('.html', '');
  }

  function getPreferredTheme() {
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;

    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    const icon = toggle.querySelector('.theme-toggle__icon');
    const label = toggle.querySelector('.theme-toggle__label');

    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

    if (icon) {
      icon.textContent = theme === 'dark' ? '☀' : '🌙';
    }

    if (label) {
      label.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
  }

  function initializeTheme() {
    const theme = getPreferredTheme();
    setTheme(theme);
  }

  function buildHeader() {
    const currentPage = getCurrentPage();
    const links = navItems.map((item) => {
      const isCurrent = item.slug === currentPage || (currentPage === 'home' && item.slug === 'home');
      return `<li><a href="${item.href}"${isCurrent ? ' aria-current="page"' : ''}>${item.label}</a></li>`;
    }).join('');

    return `
      <header class="site-nav">
        <div class="nav-inner">
          <a class="name" href="index.html#top">Ali MELLOUL</a>
          <div class="nav-actions">
            <button class="theme-toggle" type="button" aria-label="Switch to dark mode">
              <span class="theme-toggle__icon" aria-hidden="true">🌙</span>
              <span class="theme-toggle__label">Dark</span>
            </button>
            <ul class="nav-links">${links}</ul>
          </div>
        </div>
      </header>
    `;
  }

  function buildFooter() {
    return `
      <footer id="contact" class="site-footer">
        <div class="wrap">
          <div class="record-marker">
            <div class="sq"></div>
            <div class="label">Contact</div>
            <div class="rule"></div>
          </div>
          <div class="site-footer-links">
            <a href="mailto:a_mel1988@yahoo.com"><span class="ico">@</span> a_mel1988@yahoo.com</a>
            <a href="https://www.linkedin.com/in/ali-melloul-29552740b" target="_blank" rel="noopener"><span class="ico">in</span> linkedin.com/in/ali-melloul</a>
            <a href="tel:+97433668783"><span class="ico">#</span> +974 33668783</a>
          </div>
          <p class="copyright">© <span class="year"></span> Ali MELLOUL. Built with care.</p>
        </div>
      </footer>
    `;
  }

  function bindThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(THEME_KEY, currentTheme);
      setTheme(currentTheme);
    });
  }

  function initializeRevealEffects() {
    const revealTargets = document.querySelectorAll('.reveal, .fade-in, .entry, .project-card, .skill-chip, .edu-entry, .lang-row, .visit-button, .status, .country-card');

    if (!('IntersectionObserver' in window)) {
      revealTargets.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible', 'visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach((element) => observer.observe(element));
  }

  function renderShell() {
    const headerContainer = document.querySelector('[data-site-header]');
    const footerContainer = document.querySelector('[data-site-footer]');

    if (headerContainer) {
      headerContainer.outerHTML = buildHeader();
    }

    if (footerContainer) {
      footerContainer.outerHTML = buildFooter();
    }

    initializeTheme();
    bindThemeToggle();
    initializeRevealEffects();

    document.querySelectorAll('.year, #year, #contact-year').forEach((element) => {
      element.textContent = new Date().getFullYear();
    });

    window.setTimeout(() => {
      document.body.classList.add('loaded');
    }, 140);
  }

  initializeTheme();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderShell);
  } else {
    renderShell();
  }
})();


document.querySelectorAll(".dropdown-btn").forEach(button => {
  button.addEventListener("click", function (e) {
    e.stopPropagation();

    // Close other dropdowns
    document.querySelectorAll(".dropdown").forEach(drop => {
      if (drop !== this.parentElement) {
        drop.classList.remove("active");
      }
    });

    // Toggle current one
    this.parentElement.classList.toggle("active");
  });
});

// Close dropdown when clicking elsewhere
document.addEventListener("click", () => {
  document.querySelectorAll(".dropdown").forEach(drop => {
    drop.classList.remove("active");
  });
});