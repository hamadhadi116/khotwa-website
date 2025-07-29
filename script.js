document.getElementById("regForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const major = document.getElementById("major").value.trim();
  const level = document.getElementById("level").value;

  const student = { name, email, major, level };

  const students = JSON.parse(localStorage.getItem("registrations") || "[]");
  students.push(student);
  localStorage.setItem("registrations", JSON.stringify(students));

  alert("✔️ Registered successfully!");
  this.reset();
});
