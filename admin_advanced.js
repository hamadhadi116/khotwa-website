let users = JSON.parse(localStorage.getItem("users")) || [{ name: "أحمد محمد", email: "ahmad@mail.com", role: "عضو" }];
let events = JSON.parse(localStorage.getItem("events")) || [];

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg; toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function refreshUsers() {
  const tbody = document.getElementById("usersBody");
  tbody.innerHTML = "";
  users.forEach((u, i) => {
    tbody.innerHTML += `<tr><td>${i+1}</td><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td>
      <td><button onclick="editUser(${i})">✏️</button> <button onclick="deleteUser(${i})">🗑️</button></td></tr>`;
  });
  localStorage.setItem("users", JSON.stringify(users));
}

function addUser() {
  const name = prompt("Name:"), email = prompt("Email:"), role = prompt("Role:");
  if (name && email && role) { users.push({ name, email, role }); refreshUsers(); updateDashboard(); showToast("✅ User added"); }
}

function editUser(i) {
  const u = users[i];
  const name = prompt("New Name:", u.name), email = prompt("New Email:", u.email), role = prompt("New Role:", u.role);
  if (name && email && role) { users[i] = { name, email, role }; refreshUsers(); updateDashboard(); showToast("✏️ Updated"); }
}

function deleteUser(i) {
  if (confirm("Delete this user?")) { users.splice(i,1); refreshUsers(); updateDashboard(); showToast("🗑️ Deleted"); }
}

function refreshEvents() {
  const tbody = document.getElementById("eventsBody");
  tbody.innerHTML = "";
  events.forEach((ev, i) => {
    tbody.innerHTML += `<tr><td>${i+1}</td><td>${ev.title}</td><td>${ev.date}</td>
      <td><button onclick="editEvent(${i})">✏️</button> <button onclick="deleteEvent(${i})">🗑️</button></td></tr>`;
  });
  localStorage.setItem("events", JSON.stringify(events));
}

function addEvent() {
  const title = prompt("Event Title:"), date = prompt("Date (YYYY-MM-DD):");
  if (title && date) { events.push({ title, date }); refreshEvents(); updateDashboard(); showToast("✅ Event added"); }
}

function editEvent(i) {
  const ev = events[i];
  const title = prompt("New Title:", ev.title), date = prompt("New Date:", ev.date);
  if (title && date) { events[i] = { title, date }; refreshEvents(); updateDashboard(); showToast("✏️ Updated event"); }
}

function deleteEvent(i) {
  if (confirm("Delete event?")) { events.splice(i,1); refreshEvents(); updateDashboard(); showToast("🗑️ Deleted"); }
}

function updateDashboard() {
  const msgs = JSON.parse(localStorage.getItem("contacts") || "[]").length;
  document.getElementById("countUsers").textContent = users.length;
  document.getElementById("countEvents").textContent = events.length;
  document.getElementById("countMessages").textContent = msgs;
}

window.addEventListener("DOMContentLoaded", () => {
  refreshUsers(); refreshEvents(); updateDashboard();
});
