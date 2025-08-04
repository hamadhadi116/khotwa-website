window.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const toggleBtn = document.getElementById("darkToggle");

  const savedTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", savedTheme);
  if (toggleBtn) toggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌓";

  toggleBtn?.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    toggleBtn.textContent = next === "dark" ? "☀️" : "🌓";
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
