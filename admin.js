const ADMIN_PASSWORD = "khotwa123";

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

if (localStorage.getItem("khotwa_admin") === "ok") {
  document.getElementById('loginScreen').style.display = "none";
  document.getElementById('adminPanel').style.display = "block";
  initAdmin();
}

function initAdmin() {
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

  // Content editing
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

  // Events management
  function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const list = document.getElementById('eventsList');
    list.innerHTML = '';
    events.forEach((ev, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${ev.date} - ${ev.title}</span><button onclick="removeEvent(${i})">Delete</button>`;
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
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push({ title, date });
    localStorage.setItem('events', JSON.stringify(events));
    loadEvents();
    e.target.reset();
  };

  // Student list
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
