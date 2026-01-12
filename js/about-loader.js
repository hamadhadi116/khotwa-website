<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>من نحن – Khotwa</title>
  
  <link rel="stylesheet" href="/assets/main.css">
  <link rel="stylesheet" href="/assets/enhanced-navbar.css">

  <style>
    /* منع تداخل المنيو فوق الكلام */
    .navbar { z-index: 1000 !important; position: sticky; top: 0; background: #fff; }
    .mega-menu { z-index: 1100 !important; }
    
    :root { --primary: #1e40af; --ring: #e2e8f0; }
    .hero-about { padding: 4rem 0; text-align: center; background: #f8fafc; border-bottom: 1px solid var(--ring); }
    .grid-about { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 3rem 0; }
    .card-about { background: white; border: 1px solid var(--ring); border-radius: 16px; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .card-about h3 { color: var(--primary); margin-top: 0; margin-bottom: 1rem; font-size: 1.4rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 0.5rem; }
    
    /* تنسيق كروت الأعضاء لضمان ظهور الصور */
    .members { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 2rem; margin-top: 2rem; }
    .member-card { background: white; border: 1px solid var(--ring); border-radius: 16px; overflow: hidden; text-align: center; transition: 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .member-card:hover { transform: translateY(-5px); }
    .member-card img { width: 100%; aspect-ratio: 1/1; object-fit: cover; background: #f1f5f9; display: block; }
    .member-card h3 { margin: 1rem 0 0.5rem; font-size: 1.1rem; padding: 0 10px; }
    .member-card p { color: #64748b; font-size: 0.9rem; margin-bottom: 1rem; padding: 0 10px; }
    
    [hidden] { display: none !important; }
  </style>
</head>
<body>

  <nav class="navbar">
    <div class="container nav-inner" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
      <a class="brand" href="/index.html">
        <img src="/assets/apple-touch-icon.png" width="40" alt="Logo">
        <span data-lang="ar">مجلس طلاب خطوة</span>
        <span data-lang="en" hidden>Khotwa Student Council</span>
      </a>
      <div class="nav-links">
        <a href="/index.html">الرئيسية</a>
        <a href="/about.html" class="active">من نحن</a>
        <a href="/news.html">الأخبار</a>
        <a href="/events.html">الفعاليات</a>
        <a href="/calendar.html">التقويم</a>
      </div>
    </div>
  </nav>

  <header class="hero-about">
    <div class="container">
      <h1 data-lang="ar">من نحن</h1>
      <h1 data-lang="en" hidden>About Us</h1>
      <p class="muted">تعرف على فريق عمل مجلس طلاب خطوة - جامعة لا تروب، ملبورن</p>
    </div>
  </header>

  <main class="container">
    <div class="grid-about">
      <article class="card-about" data-section="vision">
        <h3 data-lang="ar">الرؤية</h3><h3 data-lang="en" hidden>Vision</h3>
        <p>جاري التحميل...</p>
      </article>
      
      <article class="card-about" data-section="mission">
        <h3 data-lang="ar">الرسالة</h3><h3 data-lang="en" hidden>Mission</h3>
        <p>جاري التحميل...</p>
      </article>

      <article class="card-about" data-section="organization">
        <h3 data-lang="ar">التنظيم</h3><h3 data-lang="en" hidden>Structure</h3>
        <p>جاري التحميل...</p>
      </article>
    </div>

    <section style="margin-bottom: 5rem;">
      <h2 style="text-align: center;" data-lang="ar">أعضاء المجلس والإدارة</h2>
      <h2 style="text-align: center;" data-lang="en" hidden>Council & Management</h2>
      
      <div class="members" id="council-members-container">
        <p style="text-align: center; grid-column: 1/-1;" class="muted">جاري تحميل أعضاء الفريق من السيرفر...</p>
      </div>
    </section>
  </main>

  <footer style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 2rem 0; text-align: center;">
    <div class="container">
      <p>© <span id="year"></span> Khotwa Council</p>
    </div>
  </footer>

  <script src="/js/config.js"></script>
  <script src="/js/language-toggle.js"></script>
  <script src="/js/menu-toggle.js"></script>
  
  <script src="/js/about-loader.js"></script> 
  
  <script>
    document.getElementById('year').textContent = new Date().getFullYear();
  </script>
</body>
</html>
