window.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const toggle = document.getElementById("darkToggle");

  const theme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", theme);
  toggle && (toggle.textContent = theme === "dark" ? "☀️" : "🌓");

  toggle?.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    toggle.textContent = next === "dark" ? "☀️" : "🌓";
  });

  const authLinks = document.getElementById("authLinks");
  if (authLinks) {
    const isLogged = localStorage.getItem("isLogged") === "true" ||
                     localStorage.getItem("rememberMe") === "true";
    authLinks.innerHTML = isLogged
      ? `<li><a href="profile.html">Profile</a></li>
         <li><a href="#" id="logoutLink">Logout</a></li>`
      : `<li><a href="login.html">Login</a></li>`;

    document.getElementById("logoutLink")?.addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("isLogged");
      localStorage.removeItem("rememberMe");
      alert("Logged out");
      location.href = "login.html";
    });
  }
});
