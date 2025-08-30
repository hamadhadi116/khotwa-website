(function() {
  const esc = s => String(s || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  }[m]));
  
  const lang = localStorage.getItem('khotwa_lang') === 'en' ? 'en' : 'ar';
  
  async function getJSON(path, fallback) {
    try {
      const r = await fetch(path, { cache: 'no-cache' });
      if (!r.ok) throw 0;
      return await r.json();
    } catch { 
      return fallback; 
    }
  }
  
  function applySettings(settings) {
    // عنوان الموقع (اختياري)
    if (settings?.siteName) { 
      document.title = document.title || settings.siteName; 
    }

    // تحديث الفوتر: © السنة + الاسم
    const footText = document.querySelector('footer .muted');
    if (footText) {
      const yearSpan = '<span id="year"></span>';
      const name = esc(settings?.footer?.copyright || 'Khotwa Student Council');
      footText.innerHTML = `© ${yearSpan} ${name}`;
      const yEl = footText.querySelector('#year');
      if (yEl) yEl.textContent = new Date().getFullYear();
    }

    // روابط السوشال (حالياً Instagram فقط إن وجد)
    const igA = document.querySelector('footer a[href*="instagram.com"]');
    if (igA && settings?.social?.instagram) {
      igA.href = settings.social.instagram;
    }
  }

  function applyNavigation(items) {
    if (!Array.isArray(items)) return;

    // ترتيب + تصفية العناصر الظاهرة
    const visible = items.filter(i => i.visible !== false)
                         .sort((a, b) => (a.order || 0) - (b.order || 0));

    // التقاط روابط النافبار الموجودة (بدون زر اللغة)
    const nav = document.querySelector('.nav-links');
    if (!nav) return;
    const links = Array.from(nav.querySelectorAll('a'))
                       .filter(a => !a.querySelector('#lang-toggle')); // احتياط

    // حدّث النصوص/الروابط واحد-مقابل-واحد
    for (let i = 0; i < links.length; i++) {
      const a = links[i];
      const cfg = visible[i];
      if (!cfg) { 
        a.style.display = 'none'; 
        continue; 
      } // لو أقل من الموجود: اخفِ الزائد
      a.style.display = '';
      a.href = cfg.href || a.getAttribute('href') || '#';

      // داخل كل رابط عندك span[data-lang="ar"] و span[data-lang="en"]
      let arSpan = a.querySelector('[data-lang="ar"]');
      let enSpan = a.querySelector('[data-lang="en"]');
      if (arSpan) arSpan.textContent = cfg.ar || arSpan.textContent || '';
      if (enSpan) enSpan.textContent = cfg.en || enSpan.textContent || '';

      // aria-current للصفحة الحالية
      try {
        const here = location.pathname.replace(/\/+$/, '');
        const hrefPath = new URL(a.href, location.origin).pathname.replace(/\/+$/, '');
        a.removeAttribute('aria-current');
        if (here === hrefPath) { 
          a.setAttribute('aria-current', 'page'); 
        }
      } catch {}
    }
  }

  (async function boot() {
    // 1) حمّل الإعدادات والقائمة
    const settings = await getJSON('data/settings.json', null);
    const navItems = await getJSON('data/navigation.json', null);

    // 2) طبّقهم
    if (settings) applySettings(settings);
    if (navItems) applyNavigation(navItems);

    // 3) احترم اللغة المحفوظة (سكربتك الأصلي أصلاً يبدّل؛ هنا فقط نضمن الاتساق)
    document.documentElement.lang = (lang === 'en' ? 'en' : 'ar');
    document.documentElement.dir = (lang === 'en' ? 'ltr' : 'rtl');
  })();
})();
