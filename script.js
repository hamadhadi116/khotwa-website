document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form?.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim();

    if (!name || !email) {
      alert("Please fill in all fields.");
      return;
    }

    const registrations = JSON.parse(localStorage.getItem("registrations") || "[]");
    registrations.push({ name, email });
    localStorage.setItem("registrations", JSON.stringify(registrations));

    alert("🎉 Registration successful!");
    form.reset();
  });
});
