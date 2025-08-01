const ADMIN_PASSWORD = "khotwa123";

window.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkToggle");
  if (toggle) toggle.click?.(); // لمزامنة الثيم فور التحميل

  if (localStorage.getItem("khotwa_admin") === "ok") {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    initAdmin();
  }
});

function checkLogin() {
  if (document.getElementById("adminPass").value === ADMIN_PASSWORD) {
    localStorage.setItem("khotwa_admin", "ok");
    location.reload();
  } else {
    alert("❌ Incorrect password");
  }
}

function initAdmin() {
  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("khotwa_admin");
    location.href = "index.html";
  };

  const about = document.getElementById("aboutText");
  about.value = localStorage.getItem("aboutText") || "";
  document.getElementById("saveAbout").onclick = () => {
    localStorage.setItem("aboutText", about.value);
    alert("📝 About updated");
  };

  const contact = document.getElementById("contactText");
  contact.value = localStorage.getItem("contactText") || "";
  document.getElementById("saveContact").onclick = () => {
    localStorage.setItem("contactText", contact.value);
    alert("📧 Contact updated");
  };

  loadEvents();
  loadStudents();

  document.getElementById("newEventForm").onsubmit = e => {
    e.preventDefault();
    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;
    const file = document.getElementById("eventImage").files[0];

    if (!title || !date) return alert("Title and date required");

    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        saveEvent(title, date, reader.result);
      reader.readAsDataURL(file);
    } else {
      saveEvent(title, date, null);
    }
    e.target.reset();
  };
}

function saveEvent(title, date, image) {
  const arr = JSON.parse(localStorage.getItem("events") || "[]");
  arr.push({ title, date, image });
  localStorage.setItem("events", JSON.stringify(arr));
  loadEvents();
}

function loadEvents() {
  const list = JSON.parse(localStorage.getItem("events") || "[]");
  const container = document.getElementById("eventsList");
  container.innerHTML = "";
  list.forEach((ev, idx) => {
    const html = `<li>
      ${ev.image ? `<img src="${ev.image}" class="event-image-thumb">` : ""}
      <span><strong>${ev.title}</strong> (${ev.date})</span>
      <button onclick="editEvent(${idx})">Edit</button>
      <button onclick="removeEvent(${idx})">Delete</button>
    </li>`;
    container.insertAdjacentHTML("beforeend", html);
  });
}

window.removeEvent = idx => {
  const arr = JSON.parse(localStorage.getItem("events") || "[]");
  arr.splice(idx, 1);
  localStorage.setItem("events", JSON.stringify(arr));
  loadEvents();
};

window.editEvent = idx => {
  const arr = JSON.parse(localStorage.getItem("events") || "[]");
  const ev = arr[idx];
  const nt = prompt("New title", ev.title);
  const nd = prompt("New date (YYYY-MM-DD)", ev.date);
  if (nt && nd) {
    ev.title = nt; ev.date = nd;
    localStorage.setItem("events", JSON.stringify(arr));
    loadEvents();
  }
};

function loadStudents() {
  const arr = JSON.parse(localStorage.getItem("registrations") || "[]");
  const container = document.getElementById("registeredList");
  container.innerHTML = "";
  arr.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.name} – ${s.email} – ${s.major} – ${s.level}`;
    container.appendChild(li);
  });
}
