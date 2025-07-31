window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("regForm");

  form?.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const major = document.getElementById("major").value.trim();
    const level = document.getElementById("level").value;

    if (!name || !email || !major || !level) {
      alert("❗ All fields are required.");
      return;
    }

    const students = JSON.parse(localStorage.getItem("registrations") || "[]");
    if (students.some(s => s.email === email)) {
      alert("⚠️ This email is already registered.");
      return;
    }

    students.push({ name, email, major, level });
    localStorage.setItem("registrations", JSON.stringify(students));

    alert("✔️ Registration successful!");
    this.reset();
  });
});
