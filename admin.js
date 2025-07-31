const ADMIN_PASSWORD = "khotwa123";

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("khotwa_admin") === "ok") {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    initAdmin();
  }
});

function checkLogin() {
  const input = document.getElementById("adminPass").value;
  if (input === ADMIN_PASSWORD) {
    localStorage.setItem("khotwa_admin", "ok");
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    initAdmin();
  } else {
    alert("❌ Incorrect password");
  }
}

function initAdmin() {
  setupDarkToggle();
  setupLogout();
  setupContentEditor();
  setupEvents();
  setupStudents();
  showNotification("✅ Welcome, Admin!");
}

function setupDarkToggle() {
  const toggle = document.getElementById("darkToggle");
  const themeLink = document.getElementById("theme-link");
  if (!toggle || !themeLink) return;

  themeLink.setAttribute(
    "href",
    localStorage.getItem("theme") === "dark" ? "dark.css" : "styles.css"
  );
  toggle.textContent =
    localStorage.getItem("theme") === "dark" ? "☀️" : "🌙";

  toggle.addEventListener("click", () => {
    const isDark = themeLink.getAttribute("href") === "styles.css";
    themeLink.setAttribute("href", isDark ? "dark.css" : "styles.css");
    toggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

function setupLogout() {
  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("khotwa_admin");
    window.location.href = "index.html";
  };
}

function setupContentEditor() {
  const about = document.getElementById("aboutText");
  const contact = document.getElementById("contactText");
  about.value = localStorage.getItem("aboutText") || "";
  contact.value = localStorage.getItem("contactText") || "";

  document.getElementById("saveAbout").onclick = () => {
    localStorage.setItem("aboutText", about.value);
    showNotification("📝 About updated!");
  };
  document.getElementById("saveContact").onclick = () => {
    localStorage.setItem("contactText", contact.value);
    showNotification("📧 Contact updated!");
  };
}

function setupEvents() {
  const form = document.getElementById("newEventForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;
    const file = document.getElementById("eventImage").files[0];

    if (!title || !date) {
      alert("❗ Title and date are required");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => saveEvent(title, date, reader.result);
      reader.readAsDataURL(file);
    } else {
      saveEvent(title, date, null);
    }
    form.reset();
  });
  loadEvents();
}

function saveEvent(title, date, image) {
  const list = JSON.parse(localStorage.getItem("events") || "[]");
  list.push({ title, date, image });
  localStorage.setItem("events", JSON.stringify(list));
  loadEvents();
  showNotification("📅 Event added!");
}

function loadEvents() {
  const events = JSON.parse(localStorage.getItem("events") || "[]");
  const list = document.getElementById("eventsList");
  list.innerHTML = "";
  events.forEach((ev, i) => {
    const imgHtml = ev.image
      ? `<img src="${ev.image}" class="event-image-thumb"/>`
      : "";
    const li = document.createElement("li");
    li.innerHTML = `<span>${imgHtml}<strong>${ev.title}</strong> (${ev.date})</span>
      <button onclick="editEvent(${i})">Edit</button>
      <button onclick="removeEvent(${i})">Delete</button>`;
    list.appendChild(li);
  });
}

window.removeEvent = (i) => {
  const list = JSON.parse(localStorage.getItem("events") || "[]");
  list.splice(i, 1);
  localStorage.setItem("events", JSON.stringify(list));
  loadEvents();
  showNotification("🗑️ Event removed!");
};

window.editEvent = (i) => {
  const list = JSON.parse(localStorage.getItem("events") || "[]");
  const ev = list[i];
  const newTitle = prompt("New title:", ev.title);
  const newDate = prompt("New date (YYYY‑MM‑DD):", ev.date);
  if (newTitle && newDate) {
    ev.title = newTitle;
    ev.date = newDate;
    list[i] = ev;
    localStorage.setItem("events", JSON.stringify(list));
    loadEvents();
    showNotification("✏️ Event updated!");
  }
};

function setupStudents() {
  const students = JSON.parse(localStorage.getItem("registrations") || "[]");
  const list = document.getElementById("registeredList");
  list.innerHTML = "";
  students.forEach((s) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${s.name}</strong> – ${s.email} – ${s.major} – ${s.level}`;
    list.appendChild(li);
  });
}

function showNotification(msg) {
  let note = document.getElementById("notifier");
  if (!note) {
    note = document.createElement("div");
    note.id = "notifier";
    note.className = "notifier";
    document.body.appendChild(note);
  }
  note.textContent = msg;
  note.classList.add("show");
  setTimeout(() => note.classList.remove("show"), 2500);
}
