document.getElementById("regForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const major = document.getElementById("major").value.trim();
  const level = document.getElementById("level").value;

  if (!name || !email || !major || !level) {
    alert("❗ Please fill in all fields.");
    return;
  }

  const student = { name, email, major, level };
  const students = JSON.parse(localStorage.getItem("registrations") || "[]");

  // تحقق من عدم التكرار بالإيميل
  const exists = students.some(s => s.email === email);
  if (exists) {
    alert("⚠️ This email is already registered.");
    return;
  }

  students.push(student);
  localStorage.setItem("registrations", JSON.stringify(students));

  alert("✔️ Registered successfully!");
  this.reset();
});
