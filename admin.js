<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script>document.documentElement.setAttribute("data-theme", localStorage.getItem("theme")||"light");</script>
  <title>Admin Panel – Khotwa</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="loginScreen" class="login-screen">
    <h2>🔒 Admin Login</h2>
    <input type="password" id="adminPass" placeholder="Enter Admin Password">
    <button onclick="checkLogin()">Login</button>
  </div>
  <div id="adminPanel" style="display:none;">
    <header class="navbar"><div class="logo">KHOTWA ADMIN</div>
      <div class="navbar-actions">
        <button id="darkToggle" class="dark-btn">🌙</button>
        <button id="logoutBtn" class="logout-btn">Logout</button>
      </div>
    </header>
    <main class="admin-panel">
      <section class="card">
        <h2>Edit Site Content</h2>
        <textarea id="aboutText" rows="4"></textarea><button id="saveAbout">Save About</button>
        <textarea id="contactText" rows="3"></textarea><button id="saveContact">Save Contact</button>
      </section>
      <section class="card">
        <h2>Manage Events</h2>
        <form id="newEventForm">
          <input type="text" id="eventTitle" placeholder="Title" required>
          <input type="date" id="eventDate" required>
          <input type="file" id="eventImage" accept="image/*">
          <button type="submit">Add</button>
        </form>
        <ul id="eventsList" class="data-list"></ul>
      </section>
      <section class="card">
        <h2>Registered Students</h2>
        <ul id="registeredList" class="data-list"></ul>
      </section>
    </main>
    <footer class="footer">&copy; 2025 KHOTWA Student Council</footer>
  </div>
  <script src="dark-toggle.js"></script>
  <script src="admin.js"></script>
</body>
</html>
