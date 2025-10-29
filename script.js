document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');

  // Determine initial theme: saved preference or system preference
  const saved = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = saved ? saved === 'dark' : systemPrefersDark;
  if (shouldUseDark) body.classList.add('dark-mode');

  // Update toggle label
  const setToggleLabel = () => {
    if (!themeToggle) return;
    themeToggle.textContent = body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  };
  setToggleLabel();

  // Toggle theme
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
      setToggleLabel();
    });
  }

  // Optional: react to OS theme changes if user hasn't explicitly chosen
  if (!saved && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (e.matches) body.classList.add('dark-mode'); else body.classList.remove('dark-mode');
      setToggleLabel();
    });
  }

  // Contact Form Submission (only on contact page)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      alert('Thank you for reaching out! I will get back to you soon.');
      contactForm.reset();
    });
  }
});
