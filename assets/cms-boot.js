(function(){
  const esc = s => String(s||'').replace(/[&<>"']/g, m => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]
  ));
  const lang = localStorage.getItem('khotwa_lang') === 'en' ? 'en' : 'ar';

  // نجرب أكثر من مصدر للبيانات: Route على نفس الدومين ثم باك-أب محلي
  const BASES = [
    'https://khotwastudentcouncil.com/data/', // Cloudflare Workers Route
    '/assets/data/'                            // باك-أب محلي داخل المستودع
  ];

  async function getJSON(path, fallback){
    for (const base of BASES){
      try{
        const r = await fetch(base + path, { cache: 'no-cache' });
        if(!r.ok) throw 0;
        return await r.json();
      }catch(e){}
    }
    return fallback;
  }

  function applySettings(settings){
    if(settings?.siteName){
      document.title = document.title || settings.siteName;
    }

    const footText = document.querySelector('footer .muted');
    if(footText){
      const yearSpan = '<span id="year"></span>';
      const name = esc(settings?.footer?.copyright || 'Khotwa Student Council');
      footText.innerHTML = `© ${yearSpan} ${name}`;
      const yEl = footText.querySelector('#year');
      if(yEl) yEl.textContent = new Date().getFullYear();
    }

    const igA = document.querySelector('footer a[href*="instagram.com"]');
    if(igA && settings?.social?.instagram){
      igA.href = settings.social.instagram;
    }
  }

  function applyNavigation(items){
    if(!Array.isArray(items)) return;
    const visible = items
      .filter(i => i.visible !== false)
      .sort((a,b) => (a.order||0) - (b.order||0));

    const nav = document.querySelector('.nav-links');
    if(!nav) return;

    // نلتزم بهيكل الروابط الموجود — نعبّي النصوص والروابط فقط
    const links = Array.from(nav.querySelectorAll('a[href]'));
    for (let i = 0; i < links.length; i++){
      const a = links[i];
      const cfg = visible[i];
      if(!cfg){ a.style.display = 'none'; continue; }
      a.style.display = '';
      a.href = cfg.href || a.getAttribute('href') || '#';

      const arSpan = a.querySelector('[data-lang="ar"]');
      const enSpan = a.querySelector('[data-lang="en"]');
      if(arSpan) arSpan.textContent = cfg.ar || arSpan.textContent || '';
      if(enSpan) enSpan.textContent = cfg.en || enSpan.textContent || '';

      try{
        const here = location.pathname.replace(/\/+$/,'');
        const hrefPath = new URL(a.href, location.origin).pathname.replace(/\/+$/,'');
        a.removeAttribute('aria-current');
        if(here === hrefPath){ a.setAttribute('aria-current', 'page'); }
      }catch{}
    }
  }

  (async function boot(){
    const settings  = await getJSON('settings.json',   null);
    const navItems  = await getJSON('navigation.json', null);

    if(settings) applySettings(settings);
    if(navItems) applyNavigation(navItems);

    document.documentElement.lang = (lang === 'en' ? 'en' : 'ar');
    document.documentElement.dir  = (lang === 'en' ? 'ltr' : 'rtl');
  })();
})();
