/**
 * About Page Loader (REPAIRED & STABLE)
 * - Fixed 404 errors by using correct API endpoints
 * - Synchronized with KhotwaAPI structure
 */

(function () {
  'use strict';

  // الرابط الأساسي للباك اند
  const BACKEND_URL = 'https://khotwabknd-gj8oeubw.manus.space';

  // جلب اللغة الحالية من التخزين المحلي
  function getCurrentLanguage() {
    return localStorage.getItem('khotwa_lang') || localStorage.getItem('language') || 'ar';
  }

  /* ==============================
      1. تحميل نصوص الرؤية والرسالة
  ============================== */
  async function loadAboutContent() {
    const lang = getCurrentLanguage();

    try {
      // استخدام endpoint الإعدادات لجلب الرؤية والرسالة
      const response = await fetch(`${BACKEND_URL}/api/settings`);
      if (!response.ok) throw new Error('Settings API not reachable');

      const settings = await response.json();
      
      // تحديث العناصر في الصفحة بناءً على لغة المستخدم
      const sections = {
        vision: lang === 'ar' ? settings.vision_ar : settings.vision_en,
        mission: lang === 'ar' ? settings.mission_ar : settings.mission_en
      };

      Object.keys(sections).forEach((key) => {
        const p = document.querySelector(`[data-section="${key}"] p`);
        if (p && sections[key]) {
          p.textContent = sections[key];
        }
      });

    } catch (error) {
      console.warn('[About Loader] Using static fallback due to API error');
      useStaticAboutFallback(lang);
    }
  }

  function useStaticAboutFallback(lang) {
    const fallback = {
      vision: {
        ar: 'أن يكون مجلس طلاب خطوة نموذجًا رائدًا في التمثيل الطلابي والدعم الأكاديمي.',
        en: 'To be a leading student council in representation and academic support.',
      },
      mission: {
        ar: 'دعم طلاب خطوة أكاديميًا واجتماعيًا وتعزيز التواصل مع إدارة الجامعة.',
        en: 'Supporting Khotwa students academically and socially while strengthening ties with the university.',
      }
    };

    Object.keys(fallback).forEach((key) => {
      const p = document.querySelector(`[data-section="${key}"] p`);
      if (p) p.textContent = fallback[key][lang];
    });
  }

  /* ==============================
      2. تحميل أعضاء المجلس (الترتيب الصحيح)
  ============================== */
  async function loadCouncilMembers() {
    const container = document.getElementById('council-members-container');
    if (!container) return;

    try {
      // استخدام رابط المتطوعين/الأعضاء الصحيح
      const response = await fetch(`${BACKEND_URL}/api/volunteers`);
      if (!response.ok) throw new Error('Members API failed');

      const members = await response.json();
      const lang = getCurrentLanguage();

      if (!Array.isArray(members) || members.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column:1/-1;">لا يوجد أعضاء لعرضهم حالياً.</p>';
        return;
      }

      // رسم البطاقات (الترتيب يعتمد على رد السيرفر)
      container.innerHTML = members
        .map((member) => {
          const name = lang === 'ar' ? (member.nameAr || member.name) : (member.nameEn || member.name);
          const position = lang === 'ar' ? member.positionAr : member.positionEn;
          const photo = member.photoUrl || '/assets/apple-touch-icon.png';

          return `
          <div class="member-card">
            <div class="img-wrapper">
              <img src="${photo}" alt="${name}" onerror="this.src='/assets/apple-touch-icon.png'">
            </div>
            <div class="member-details">
              <h3>${name}</h3>
              <p>${position || ''}</p>
            </div>
          </div>
        `;
        })
        .join('');

    } catch (error) {
      console.error('[About Loader] Failed to load members:', error);
      container.innerHTML = '<p style="text-align:center; grid-column:1/-1;">عذراً، حدث خطأ أثناء تحميل الأعضاء.</p>';
    }
  }

  /* ==============================
      3. التشغيل والمزامنة
  ============================== */
  function initAboutPage() {
    loadAboutContent();
    loadCouncilMembers();
  }

  // التنفيذ عند تحميل الصفحة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutPage);
  } else {
    initAboutPage();
  }

  // الاستماع لتغيير اللغة من ملف language-toggle.js
  window.addEventListener('language:changed', initAboutPage);
  
  // إتاحة الوظيفة عالمياً
  window.initAboutPage = initAboutPage;

})();
