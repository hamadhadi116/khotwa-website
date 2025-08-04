window.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const toggleBtn = document.getElementById("darkToggle");
  const savedTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", savedTheme);
  if (toggleBtn) toggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌓";

  toggleBtn?.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    toggleBtn.textContent = next === "dark" ? "☀️" : "🌓";
  });

  const authLinks = document.getElementById("authLinks");
  if (authLinks) {
    const isLogged =
      sessionStorage.getItem("isLogged") === "true" ||
      localStorage.getItem("isLogged") === "true";
    const page = location.pathname.split("/").pop();
    authLinks.innerHTML = isLogged
      ? `<li><a href="profile.html"${page === "profile.html" ? ' class="active"' : ''}>Profile</a></li><li><a href="#" id="logoutLink">Logout</a></li>`
      : `<li><a href="login.html"${page === "login.html" ? ' class="active"' : ''}>Login</a></li>`;
    document.getElementById("logoutLink")?.addEventListener("click", e => {
      e.preventDefault();
      sessionStorage.removeItem("isLogged");
      localStorage.removeItem("isLogged");
      alert("Logged out");
      location.href = "login.html";
    });
  }
});
