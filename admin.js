const ADMIN_PASSWORD = "khotwa123";

window.onload = () => {
  // تسجيل دخول تلقائي إذا سبق الدخول
  if (localStorage.getItem("khotwa_admin") === "ok") {
    document.getElementById('loginScreen').style.display = "none";
    document.getElementById('adminPanel').style.display = "block";
    initAdmin();
  }
};

// تسجيل الدخول
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

// لوحة التحكم
function initAdmin() {
  // الوضع الليلي
  const toggle = document.getElementById('darkToggle');
  const themeLink = document.getElementById('theme-link');
  toggle.addEventListener('click', () => {
    const isDark = themeLink.getAttribute('href') === 'styles.css';
    themeLink.setAttribute('href', isDark ? 'dark.css' : 'styles.css');
    toggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  if (localStorage.getItem('theme') === 'dark') {
    themeLink.setAttribute('href', 'dark.css');
    toggle.textContent = '☀️';
  }

  // زر تسجيل الخروج
  document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('khotwa_admin');
    location.reload();
  };

  // تحميل وتحرير النصوص
  const aboutText = document.getElementById('aboutText');
  const contactText = document.getElementById('contactText');

  aboutText.value = localStorage.getItem('aboutText') || '';
  contactText.value = localStorage.getItem('contactText') || '';

  document.getElementById('saveAbout').onclick = () => {
    localStorage.setItem('aboutText', aboutText.value);
    alert("About saved!");
  };

  document.getElementById('saveContact').onclick = () => {
    localStorage.setItem('contactText', contactText.value);
    alert("Contact saved!");
  };

  // إدارة الأحداث
  function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const list = document.getElementById('eventsList');
    list.innerHTML = '';
    events.forEach((ev, i) => {
      const imgTag = ev.image
        ? `<img src="${ev.image}" class="event-image-thumb" alt="Event Image" />`
        : '';
      const li = document.createElement('li');
      li.innerHTML = `
        ${imgTag}
        <span>${ev.date} - ${ev.title}</span>
        <button onclick="removeEvent(${i})">Delete</button>
      `;
      list.appendChild(li);
    });
  }

  window.removeEvent = function(i) {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.splice(i, 1);
    localStorage.setItem('events', JSON.stringify(events));
    loadEvents();
  };

  document.getElementById('newEventForm').onsubmit = e => {
    e.preventDefault();
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const file = document.getElementById('eventImage').files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        saveEvent(title, date, evt.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      saveEvent(title, date, null);
    }

    e.target.reset();
  };

  function saveEvent(title, date, imageDataUrl) {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push({ title, date, image: imageDataUrl });
    localStorage.setItem('events', JSON.stringify(events));
    loadEvents();
  }

  // الطلاب المسجلين
  function loadStudents() {
    const list = document.getElementById('registeredList');
    list.innerHTML = '';
    const students = JSON.parse(localStorage.getItem('registrations') || '[]');
    students.forEach(s => {
      const li = document.createElement('li');
      li.textContent = `${s.name} – ${s.email}`;
      list.appendChild(li);
    });
  }

  loadEvents();
  loadStudents();
}
