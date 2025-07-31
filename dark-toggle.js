window.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkToggle");
  const themeLink = document.getElementById("theme-link");

  if (!toggle || !themeLink) return;

  const saved = localStorage.getItem("theme");
  const isSavedDark = saved === "dark";

  // تحميل الوضع المحفوظ
  if (isSavedDark) {
    themeLink.setAttribute("href", "dark.css");
    toggle.textContent = "☀️";
  } else {
    themeLink.setAttribute("href", "styles.css");
    toggle.textContent = "🌙";
  }

  // تبديل عند الضغط
  toggle.addEventListener("click", () => {
    const isDark = themeLink.getAttribute("href") === "styles.css";
    themeLink.setAttribute("href", isDark ? "dark.css" : "styles.css");
    toggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});
