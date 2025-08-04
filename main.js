window.addEventListener("DOMContentLoaded", () => {
  // Dark Mode Toggle
  const html = document.documentElement;
  const toggleBtn = document.getElementById("darkToggle");
  const savedTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", savedTheme);
  toggleBtn && (toggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌓");
  toggleBtn?.addEventListener("click", () => {
    const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    toggleBtn.textContent = newTheme === "dark" ? "☀️" : "🌓";
  });

  // Auth Links (Profile / Logout or Login)
  const authLinks = document.getElementById("authLinks");
  if (authLinks) {
    const logged = localStorage.getItem("isLogged") === "true" ||
                   localStorage.getItem("rememberMe") === "true";
    authLinks.innerHTML = logged
      ? `<li><a href="profile.html">Profile</a></li><li><a href="#" id="logoutLink">Logout</a></li>`
      : `<li><a href="login.html">Login</a></li>`;
    document.getElementById("logoutLink")?.addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("isLogged");
      localStorage.removeItem("rememberMe");
      alert("✅ Logged out");
      location.href = "login.html";
    });
  }

  // AOS Init if present
  if (typeof AOS === "object") {
    window.addEventListener("load", () => AOS.init({ duration: 800, once: true }));
  }

  // Navbar Scroll Shadow
  const navbar = document.getElementById("mainNavbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("navbar-scrolled", window.scrollY > 50);
    });
  }

  // CTA Button Effect
  const ctaBtn = document.getElementById("ctaBtn");
  ctaBtn?.addEventListener("mouseenter", () => ctaBtn.style.transform = "scale(1.05)");
  ctaBtn?.addEventListener("mouseleave", () => ctaBtn.style.transform = "");

  // Update counter stats on index
  const statMembers = document.getElementById("countMembers");
  const statEvents = document.getElementById("countEvents");
  const statMessages = document.getElementById("countMessages");
  statMembers && (statMembers.textContent =
    JSON.parse(localStorage.getItem("registrations") || "[]").length);
  statEvents && (statEvents.textContent =
    JSON.parse(localStorage.getItem("events") || "[]").length);
  statMessages && (statMessages.textContent =
    JSON.parse(localStorage.getItem("contacts") || "[]").length);

  // Hamburger Menu Toggle
  const hamburger = document.getElementById("hamburgerBtn");
  const navContainer = document.getElementById("navMenu");
  hamburger?.addEventListener("click", () => {
    navContainer.classList.toggle("nav-open");
  });
});
