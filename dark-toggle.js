window.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkToggle");
  const html = document.documentElement;

  // استرجاع التفضيل المحفوظ
  const savedTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", savedTheme);
  if (toggle) toggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

  // عند الضغط
  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const newTheme = current === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      toggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
    });
  }
});
