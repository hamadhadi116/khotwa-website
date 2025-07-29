window.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkToggle");
  const themeLink = document.getElementById("theme-link");

  // تبديل الوضع عند الضغط
  toggle.addEventListener("click", () => {
    const isDark = themeLink.getAttribute("href") === "styles.css";
    themeLink.setAttribute("href", isDark ? "dark.css" : "styles.css");
    toggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // عند تحميل الصفحة، استخدام التفضيل المحفوظ
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    themeLink.setAttribute("href", "dark.css");
    toggle.textContent = "☀️";
  } else {
    toggle.textContent = "🌙";
  }
});
