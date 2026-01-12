<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>من نحن – Khotwa</title>
  <link rel="stylesheet" href="/assets/main.css">
  <link rel="stylesheet" href="/assets/design-system.css">
  <link rel="stylesheet" href="/assets/khotwa-redesign.css">
  <link rel="stylesheet" href="/assets/enhanced-navbar.css">
  <style>
    :root { --primary: #1e40af; --ring: #e2e8f0; }
    .hero-about { padding: 4rem 0; text-align: center; background: #f8fafc; border-bottom: 1px solid var(--ring); }
    .grid-about { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 3rem 0; }
    .card-about { background: white; border: 1px solid var(--ring); border-radius: 16px; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); transition: 0.3s; }
    .card-about:hover { transform: translateY(-5px); }
    .card-about h3 { color: var(--primary); margin-top: 0; margin-bottom: 1rem; font-size: 1.4rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 0.5rem; }
    
    /* تنسيق الأعضاء مطابق للسكريبت */
    .members { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 2rem; margin-top: 2rem; }
    .member-card { background: white; border: 1px solid var(--ring); border-radius: 16px; overflow: hidden; text-align: center; transition: 0.3s; }
    .member-card img { width: 100%; aspect-ratio: 1/1; object-fit: cover; background: #f1f5f9; }
    .member-card h3 { margin: 1rem 0 0.5rem; font-size: 1.1rem; }
    .member-card p { color: #64748b; font-size: 0.9rem; margin-bottom: 1rem; }
    [hidden] { display: none !important; }
  </style>
</head>
<body>

  <nav class="navbar">
    <div class="container nav-inner">
      <a class="brand" href="/index.html">
        <img src="/assets/apple-touch-icon.png" class="logo" alt="Logo">
        <span data-lang="ar">مجلس طلاب خطوة</span>
        <span data-lang="en" hidden>Khotwa Student Council</span>
      </a>
      <button id="menu-toggle" class="menu-toggle">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
      <div class="nav-links" id="primary-nav" data-open="false">
        <a href="/index.html"><span data-lang="ar">الرئيسية</span><span data-lang="en" hidden>Home</span></a>
        <a href="/about.html" class="active"><span data-lang="ar">من نحن</span><span data-lang="en" hidden>About</span></a>
        <a href="/news.html"><span data-lang="ar">الأخبار</span><span data-lang="en" hidden>News</span></a>
        <a href="/events.html"><span data-lang="ar">الفعاليات</span><span data-lang="en" hidden>Events</span></a>
        <a href="/calendar.html"><span data-lang="ar">التقويم</span><span data-lang="en" hidden>Calendar</span></a>
        <a href="/contact.html"><span data-lang="ar">تواصل معنا</span><span data-lang="en" hidden>Contact</span></a>
        <button class="lang-toggle" id="lang-toggle">English</button>
      </div>
    </div>
  </nav>

  <header class="hero-about">
    <div class="container">
      <h1 data-lang="ar">من نحن</h1>
      <h1 data-lang="en" hidden>About Us</h1>
      <p class="muted">مجلس طلاب خطوة - جامعة لا تروب، ملبورن</p>
    </div>
  </header>

  <main class="container">
    <div class="grid-about">
      <article class="card-about" data-section="vision">
        <h3 data-lang="ar">الرؤية</h3><h3 data-lang="en" hidden>Vision</h3>
        <p>بناء مجتمع طلابي داعم ومبادر يسهم في نجاح أفراده.</p>
      </article>
      
      <article class="card-about" data-section="mission">
        <h3 data-lang="ar">الرسالة</h3><h3 data-lang="en" hidden>Mission</h3>
        <p>توفير الأنشطة والخدمات التي تعزز تجربة الطالب الدراسية.</p>
      </article>

      <article class="card-about" data-section="organization">
        <h3 data-lang="ar">التنظيم</h3><h3 data-lang="en" hidden>Structure</h3>
        <p>إدارة منظمة تشمل لجان الفعاليات، الإعلام، والعلاقات العامة.</p>
      </article>
    </div>

    <section style="margin-bottom: 5rem;">
      <h2 style="text-align: center;" data-lang="ar">أعضاء المجلس والإدارة</h2>
      <h2 style="text-align: center;" data-lang="en" hidden>Council & Management</h2>
      
      <div class="members" id="council-members-container">
        <p style="text-align: center; grid-column: 1/-1;" class="muted">جاري تحميل أعضاء الفريق...</p>
      </div>
    </section>
  </main>

  <footer style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 2rem 0;">
    <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
      <p>© <span id="year"></span> Khotwa Council</p>
      <a href="https://instagram.com/khotwa.sc" target="_blank">Instagram</a>
    </div>
  </footer>

  <script src="/js/config.js"></script>
  <script src="/js/language-toggle.js"></script>
  <script src="/js/menu-toggle.js"></script>
  <script src="/js/about-loader.js"></script> 
  
  <script>
    document.getElementById('year').textContent = new Date().getFullYear();
    // كود إضافي للتأكد من توافق اللغة مع سكريبت التحميل الخاص بك
    window.addEventListener('language:changed', () => {
       // يتم استدعاء initAboutPage تلقائياً من ملفك
    });
  </script>
</body>
</html>
