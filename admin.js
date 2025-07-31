const ADMIN_PASSWORD = "khotwa123";

// تحميل تلقائي إن كان الأدمن مسجل مسبقًا
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("khotwa_admin") === "ok") {
    document.getElementById('loginScreen').style.display = "none";
    document.getElementById('adminPanel').style.display = "block";
    initAdmin();
  }
});

// التحقق من تسجيل الدخول
function checkLogin() {
  const input = document.getElementById('adminPass').value;
  if (input === ADMIN_PASSWORD) {
    document.getElementById('loginScreen').style.display = "none";
    document.getElementById('adminPanel').style.display = "block";
    localStorage.setItem("khotwa_admin", "ok");
    initAdmin();
  } else {
    alert("Incorrect password ❌");
  }
}

function initAdmin() {
  const toggle = document.getElementById('darkToggle');
  const themeLink = document.getElementById('theme-link');

  // الوضع الليلي
  if (toggle && themeLink) {
    toggle.addEventListener("click", () => {
      const isDark = themeLink.getAttribute("href") === "styles.css";
      themeLink.setAttribute("href", isDark ? "dark.css" : "styles.css");
      toggle.textContent = isDark ? "☀️" : "🌙";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      themeLink.setAttribute("href", "dark.css");
      toggle.textContent = "☀️";
    } else {
      themeLink.setAttribute("href", "styles.css");
      toggle.textContent = "🌙";
    }
  }

  // زر تسجيل الخروج
  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("khotwa_admin");
    window.location.href = "index.html";
  };

  // حفظ بيانات about/contact
  const aboutText = document.getElementById("aboutText");
  const contactText = document.getElementById("contactText");

  aboutText.value = localStorage.getItem("aboutText") || '';
  contactText.value = localStorage.getItem("contactText") || '';

  document.getElementById("saveAbout").onclick = () => {
    localStorage.setItem("aboutText", aboutText.value);
    alert("✅ About updated");
  };

  document.getElementById("saveContact").onclick = () => {
    localStorage.setItem("contactText", contactText.value);
    alert("✅ Contact updated");
  };

  // الأحداث
  function loadEvents() {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const list = document.getElementById("eventsList");
    list.innerHTML = "";

    events.forEach((ev, i) => {
      const li = document.createElement("li");
      const img = ev.image ? `<img src="${ev.image}" class="event-image-thumb" />` : '';
      li.innerHTML = `
        ${img}
        <span>${ev.date} - ${ev.title}</span>
        <button onclick="removeEvent(${i})">Delete</button>
      `;
      list.appendChild(li);
    });
  }

  window.removeEvent = function (index) {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    loadEvents();
  };

  document.getElementById("newEventForm").onsubmit = function (e) {
    e.preventDefault();
    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;
    const imageFile = document.getElementById("eventImage").files[0];

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        saveEvent(title, date, event.target.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      saveEvent(title, date, null);
    }

    this.reset();
  };

  function saveEvent(title, date, image) {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    events.push({ title, date, image });
    localStorage.setItem("events", JSON.stringify(events));
    loadEvents();
  }

  // عرض الطلاب المسجلين
  function loadStudents() {
    const students = JSON.parse(localStorage.getItem("registrations") || "[]");
    const list = document.getElementById("registeredList");
    list.innerHTML = '';
    students.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = `${s.name} – ${s.email}`;
      list.appendChild(li);
    });
  }

  loadEvents();
  loadStudents();
}
