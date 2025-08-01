window.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkToggle");
  const html = document.documentElement;

  const saved = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", saved);
  if (toggle) toggle.textContent = saved === "dark" ? "☀️" : "🌙";

  toggle?.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    toggle.textContent = next === "dark" ? "☀️" : "🌙";
  });

  // ✅ Login Navigation (if available)
  const authLinks = document.getElementById("authLinks");
  if (authLinks) {
    const isLogged = localStorage.getItem("isLogged") === "true" || localStorage.getItem("rememberMe") === "true";
    if (isLogged) {
      authLinks.innerHTML = `
        <li><a href="profile.html">Profile</a></li>
        <li><a href="#" id="logoutLink">Logout</a></li>
      `;
      const logoutLink = document.getElementById("logoutLink");
      logoutLink.addEventListener("click", () => {
        localStorage.removeItem("isLogged");
        localStorage.removeItem("rememberMe");
        alert("تم تسجيل الخروج بنجاح");
        location.href = "login.html";
      });
    } else {
      authLinks.innerHTML = `<li><a href="login.html">Login</a></li>`;
    }
  }

  // ✅ التسجيل (إن وُجد)
  const form = document.getElementById("regForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim().toLowerCase();
      const major = form.major.value.trim();
      const level = form.level.value;

      if (!name || !email || !major || !level) {
        return alert("All fields are required");
      }

      const arr = JSON.parse(localStorage.getItem("registrations") || "[]");
      if (arr.some(s => s.email === email)) {
        return alert("Email already registered");
      }

      arr.push({ name, email, major, level });
      localStorage.setItem("registrations", JSON.stringify(arr));
      alert("Registration successful! ✔️");
      form.reset();
    });
  }
});
