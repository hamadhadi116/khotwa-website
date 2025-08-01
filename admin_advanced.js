// بيانات افتراضية
const stats = { users: 45, events: 7, messages: 12 };
const users = [
  { name: 'أحمد', email: 'ahmad@example.com', role: 'Member' },
  { name: 'سارة', email: 'sara@example.com', role: 'Admin' },
  // المزيد من البيانات...
];

// عرض الإحصائيات
document.getElementById('countUsers').innerText = stats.users;
document.getElementById('countEvents').innerText = stats.events;
document.getElementById('countMessages').innerText = stats.messages;

// Chart: نمو المستخدمين الشهري
const ctx = document.getElementById('userGrowthChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['May', 'Jun', 'Jul', 'Aug'],
    datasets: [{ label: 'New Users', data: [5, 12, 9, stats.users], borderColor: '#00703c', fill: false }]
  },
  options: { responsive: true, plugins: { legend: { display: false } } }
});

// إضافة البيانات إلى الجدول
function populateTable() {
  const tbody = document.getElementById('adminTableBody');
  tbody.innerHTML = '';
  users.forEach((user, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${user.name}</td><td>${user.email}</td><td>${user.role}</td>
      <td class="action-btns">
        <button onclick="editRow(this)">✏️</button>
        <button onclick="deleteRow(this)">🗑️</button>
      </td>`;
    tbody.appendChild(tr);
  });
}
populateTable();

// التحكم بالجدول
function addRow() {
  const name = prompt("Name:");
  const email = prompt("Email:");
  const role = prompt("Role:");
  if (name && email && role) {
    users.push({ name, email, role });
    stats.users++;
    refreshUI();
  }
}
function editRow(btn) {
  const tr = btn.closest('tr');
  const idx = tr.children[0].innerText - 1;
  const name = prompt("New Name:", users[idx].name);
  const email = prompt("New Email:", users[idx].email);
  const role = prompt("New Role:", users[idx].role);
  if (name && email && role) {
    Object.assign(users[idx], { name, email, role });
    refreshUI();
  }
}
function deleteRow(btn) {
  const idx = btn.closest('tr').children[0].innerText - 1;
  users.splice(idx, 1);
  stats.users--;
  refreshUI();
}

// بحث داخل الجدول
function searchTable() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  users.forEach((u,i) => {
    const tr = document.getElementById('adminTableBody').children[i];
    tr.style.display = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) ? '' : 'none';
  });
}

// تحديث الإحصائيات والجدول
function refreshUI() {
  document.getElementById('countUsers').innerText = stats.users;
  populateTable();
}
