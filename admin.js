// dark-toggle.js يتكفل بتغيير الوضع الليلي

function deleteRow(btn) {
  const row = btn.parentElement.parentElement;
  row.remove();
}

function editRow(btn) {
  const row = btn.parentElement.parentElement;
  const name = prompt("أدخل الاسم الجديد:", row.children[1].innerText);
  const email = prompt("أدخل البريد الجديد:", row.children[2].innerText);
  const role = prompt("أدخل الدور الجديد:", row.children[3].innerText);

  if (name && email && role) {
    row.children[1].innerText = name;
    row.children[2].innerText = email;
    row.children[3].innerText = role;
  }
}

function addRow() {
  const tbody = document.getElementById("adminTableBody");
  const row = document.createElement("tr");

  const id = tbody.children.length + 1;
  const name = prompt("الاسم:");
  const email = prompt("البريد الإلكتروني:");
  const role = prompt("الدور:");

  if (name && email && role) {
    row.innerHTML = `
      <td>${id}</td>
      <td>${name}</td>
      <td>${email}</td>
      <td>${role}</td>
      <td>
        <button onclick="editRow(this)">✏️</button>
        <button onclick="deleteRow(this)">🗑️</button>
      </td>
    `;
    tbody.appendChild(row);
  }
}
