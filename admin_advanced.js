// بيانات أولية
const stats = { users: 2, events: 7, messages: 12 };
const users = [
  { name: "أحمد", email: "ahmad@example.com", role: "عضو" },
  { name: "سارة", email: "sara@example.com", role: "مشرف" }
];

// تحديث عناصر الإحصائيات
function updateStats() {
  document.getElementById("countUsers").textContent = stats.users;
  document.getElementById("countEvents").textContent = stats.events;
  document.getElementById("countMessages").textContent = stats.messages;
}

// إنشاء الرسم البياني للمستخدمين
function createChart() {
  const ctx = document.getElementById("userGrowthChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["May", "Jun", "Jul", "Aug"],
      datasets: [{
        label: "New Users",
        data: [5, 12, 9, stats.users],
        borderColor: "#00703c",
        backgroundColor: "#00703c33",
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// تعبئة الجدول
function populateTable() {
  const tbody = document.getElementById("adminTableBody");
  tbody.innerHTML = "";
  users.forEach((u, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td class="action-btns">
        <button onclick="editRow(${i})">✏️</button>
        <button onclick="deleteRow(${i})">🗑️</button>
      </td>`;
    tbody.appendChild(row);
  });
}

// التحكم بالجدول
function addRow() {
  const name = prompt("الاسم:");
  const email = prompt("البريد الإلكتروني:");
  const role = prompt("الدور:");
  if (name && email && role) {
    users.push({ name, email, role });
    stats.users++;
    refreshUI();
  }
}
function editRow(i) {
  const user = users[i];
  const name = prompt("الاسم الجديد:", user.name);
  const email = prompt("البريد الجديد:", user.email);
  const role = prompt("الدور الجديد:", user.role);
  if (name && email && role) {
    users[i] = { name, email, role };
    refreshUI();
  }
}
function deleteRow(i) {
  if (confirm("هل أنت متأكد من حذف المستخدم؟")) {
    users.splice(i, 1);
    stats.users--;
    refreshUI();
  }
}

// البحث في الجدول
function searchTable() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const trs = document.querySelectorAll("#adminTableBody tr");
  users.forEach((u, i) => {
    const match = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    trs[i].style.display = match ? "" : "none";
  });
}

// تحديث شامل للواجهة
function refreshUI() {
  updateStats();
  populateTable();
}

// بدء التهيئة بعد تحميل الصفحة
window.addEventListener("DOMContentLoaded", () => {
  updateStats();
  populateTable();
  createChart();
});
