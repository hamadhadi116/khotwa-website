/**
 * Menu Toggle - Mobile Navigation
 * Handles opening/closing the mobile menu
 */

(function() {
  'use strict';
  
  function init() {
    console.log('[Menu Toggle] Initializing...');
    
    // البحث عن المعرفات الصحيحة
    const btn = document.getElementById('menu-toggle');
    const nav = document.getElementById('primary-nav');
    
    if (!btn || !nav) {
      console.warn('[Menu Toggle] Elements not found. Check if IDs "menu-toggle" and "primary-nav" exist.');
      return;
    }
    
    // ضبط الحالة الابتدائية
    nav.setAttribute('data-open', 'false');
    btn.setAttribute('aria-expanded', 'false');
    
    // وظيفة التحكم في القائمة
    function setMenu(open) {
      if (open) {
        nav.setAttribute('data-open', 'true');
        nav.classList.add('active'); // إضافة كلاس لضمان عمل الـ CSS
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('is-active');
      } else {
        nav.setAttribute('data-open', 'false');
        nav.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('is-active');
      }
      console.log('[Menu Toggle] Menu state:', open ? 'OPEN' : 'CLOSED');
    }
    
    // مستمع حدث الضغط
    btn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation(); // منع انتشار الحدث لضمان عدم إغلاق القائمة فوراً
      const isOpen = nav.getAttribute('data-open') === 'true';
      setMenu(!isOpen);
    };
    
    // إغلاق القائمة عند الضغط في أي مكان خارجها
    document.addEventListener('click', function(e) {
      const isOpen = nav.getAttribute('data-open') === 'true';
      if (isOpen && !nav.contains(e.target) && !btn.contains(e.target)) {
        setMenu(false);
      }
    });
    
    // إغلاق القائمة عند ضغط زر Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        setMenu(false);
      }
    });
    
    console.log('[Menu Toggle] Initialized successfully');
  }

  // التأكد من تشغيل السكربت بعد تحميل الصفحة
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
