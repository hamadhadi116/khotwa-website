const toggle = document.getElementById('darkToggle');
const themeLink = document.getElementById('theme-link');

toggle.addEventListener('click', () => {
  const curr = themeLink.getAttribute('href');
  const nowDark = curr === 'styles.css';
  themeLink.setAttribute('href', nowDark ? 'dark.css' : 'styles.css');
  toggle.textContent = nowDark ? '☀️' : '🌙';
  localStorage.setItem('theme', nowDark ? 'dark' : 'light');
});

// عند التحميل:
const saved = localStorage.getItem('theme');
if (saved === 'dark') {
  themeLink.setAttribute('href', 'dark.css');
  toggle.textContent = '☀️';
}
