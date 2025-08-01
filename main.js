window.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkToggle");
  const html = document.documentElement;
  const saved = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", saved);
  if(toggle) toggle.textContent = saved === "dark" ? "☀️" : "🌙";

  toggle?.addEventListener("click", () => {
    const current = html.getAttribute("data-theme"),
          next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    toggle.textContent = next === "dark" ? "☀️" : "🌙";
  });

  const authLinks = document.getElementById("authLinks"),
        isAuth = localStorage.getItem("isLogged")==="true" || localStorage.getItem("rememberMe")==="true";
  if(authLinks) {
    authLinks.innerHTML = isAuth
      ? '<li><a href="#" id="logoutBtn">Logout</a></li>'
      : '<li><a href="login.html">Login</a></li>';
    const ln = document.getElementById("logoutBtn");
    if(ln) ln.addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("isLogged");
      localStorage.removeItem("rememberMe");
      location.reload();
    });
  }
});
