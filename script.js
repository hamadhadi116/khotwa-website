window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("regForm");
  const toggle = document.getElementById("darkToggle");
  const themeLink = document.getElementById("theme-link");

  // Dark mode initialization
  if (toggle && themeLink) {
    const saved = localStorage.getItem("theme") || "light";
    themeLink.setAttribute("href", saved === "dark" ? "dark.css" : "styles.css");
    toggle.textContent = saved === "dark" ? "☀️" : "🌙";

    toggle.addEventListener("click", () => {
      const isDark = themeLink.getAttribute("href") === "styles.css";
      themeLink.setAttribute("href", isDark ? "dark.css" : "styles.css");
      toggle.textContent = isDark ? "☀️" : "🌙";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // Registration form handling
  form?.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const major = document.getElementById("major").value.trim();
    const level = document.getElementById("level").value;

    if (!name || !email || !major || !level) {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    const students = JSON.parse(localStorage.getItem("registrations") || "[]");
    if (students.some(s => s.email === email)) {
      alert("❗ This email is already registered.");
      return;
    }

    students.push({ name, email, major, level });
    localStorage.setItem("registrations", JSON.stringify(students));

    alert("✅ Registration successful!");
    this.reset();
  });
});
