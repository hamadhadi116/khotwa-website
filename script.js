window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("regForm");
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

  form?.addEventListener("submit", e => {
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
});
