window.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const toggle = document.getElementById("darkToggle");

  // ✅ تفعيل الوضع المظلم/النهاري
  const savedTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", savedTheme);
  if (toggle) toggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

  toggle?.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    toggle.textContent = next === "dark" ? "☀️" : "🌙";
  });

  // ✅ روابط تسجيل الدخول/الخروج + البروفايل
  const authLinks = document.getElementById("authLinks");
  if (authLinks) {
    const isLogged = localStorage.getItem("isLogged") === "true" || localStorage.getItem("rememberMe") === "true";
    if (isLogged) {
      authLinks.innerHTML = `
        <li><a href="profile.html">Profile</a></li>
        <li><a href="#" id="logoutLink">Logout</a></li>
      `;
      const logoutLink = document.getElementById("logoutLink");
      logoutLink?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("isLogged");
        localStorage.removeItem("rememberMe");
        alert("✅ تم تسجيل الخروج بنجاح");
        location.href = "login.html";
      });
    } else {
      authLinks.innerHTML = `<li><a href="login.html">Login</a></li>`;
    }
  }

  // ✅ التحقق من صفحة التسجيل وتشغيلها إذا وُجدت
  const form = document.getElementById("regForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim().toLowerCase();
      const major = form.major.value.trim();
      const level = form.level.value;

      if (!name || !email || !major || !level) {
        return alert("❗ All fields are required.");
      }

      const registrations = JSON.parse(localStorage.getItem("registrations") || "[]");
      if (registrations.some(r => r.email === email)) {
        return alert("⚠️ This email is already registered.");
      }

      registrations.push({ name, email, major, level });
      localStorage.setItem("registrations", JSON.stringify(registrations));
      alert("✔️ Registration successful!");
      form.reset();
    });
  }
});
