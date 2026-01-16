/**
 * About Page Loader (UPDATED FOR NEW DESIGN)
 * - Ensures images are square and high quality
 * - Synchronizes language changes perfectly
 */

(function () {
  'use strict';

  // الرابط الخاص ببيانات الموقع
  const BACKEND_URL =
    window.KHOTWA_CONFIG?.BACKEND_URL ||
    'https://khotwabknd-gj8oeubw.manus.space';

  // جلب اللغة الحالية (مع ضمان التوافق مع khotwa_lang)
  function getCurrentLanguage() {
    return localStorage.getItem('khotwa_lang') || localStorage.getItem('language') || 'ar';
  }

  /* ==============================
      تحميل محتوى (الرؤية والرسالة)
  ============================== */
  async function loadAboutContent() {
    const lang = getCurrentLanguage();

    try {
      const response = await fetch(`${BACKEND_URL}/api/trpc/about.get`);
      if (!response.ok) throw new Error('About API not available');

      const json = await response.json();
      const content = json?.result?.data;
      if (!content) throw new Error('Empty about content');

      updateAboutSections(content, lang);
    } catch (error) {
      console.warn('[About Loader] Using static fallback');
      useStaticAboutFallback(lang);
    }
  }

  function updateAboutSections(content, lang) {
    const sections = {
      vision: ['visionAr', 'visionEn'],
      mission: ['missionAr', 'missionEn'],
      goals: ['goalsAr', 'goalsEn'],
      organization: ['organizationAr', 'organizationEn'],
    };

    Object.keys(sections).forEach((key) => {
      const p = document.querySelector(`[data-section="${key}"] p`);
      if (!p) return;

      p.textContent = lang === 'ar' ? content[sections[key][0]] : content[sections[key][1]];
    });
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
      },
      goals: {
        ar: 'التمثيل، تطوير القيادة، التفاعل المجتمعي.',
        en: 'Representation, leadership development, and community engagement.',
      },
      organization: {
        ar: 'مجلس طلابي تابع لبرنامج خطوة في جامعة لا تروب.',
        en: 'A student council affiliated with the Khotwa Program at La Trobe University.',
      },
    };

    Object.keys(fallback).forEach((key) => {
      const p = document.querySelector(`[data-section="${key}"] p`);
      if (!p) return;
      p.textContent = fallback[key][lang];
    });
  }

  /* ==============================
      تحميل أعضاء المجلس (التصميم المطور)
  ============================== */
  async function loadCouncilMembers() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/trpc/councilMembers.list`);
      if (!response.ok) throw new Error('Members API failed');

      const json = await response.json();
      const members = json?.result?.data?.json || json?.result?.data || [];

      if (!Array.isArray(members)) return;

      const container = document.getElementById('council-members-container');
      if (!container) return;

      const lang = getCurrentLanguage();

      // رسم البطاقات بالتنسيق الجديد لضمان عدم تمطيط الصور
      container.innerHTML = members
        .map((member) => {
          const name = lang === 'ar' ? member.nameAr : member.nameEn;
          const position = lang === 'ar' ? member.positionAr : member.positionEn;
          const photo = member.photoUrl || '/assets/apple-touch-icon.png';

          return `
          <div class="member-card">
            <div class="img-wrapper">
              <img src="${photo}" alt="${name}" loading="lazy">
            </div>
            <div class="member-details">
              <h3>${name}</h3>
              <p>${position}</p>
            </div>
          </div>
        `;
        })
        .join('');
    } catch (error) {
      console.error('[About Loader] Failed to load members:', error);
      const container = document.getElementById('council-members-container');
      if(container) container.innerHTML = '<p style="text-align:center; grid-column:1/-1;">عذراً، تعذر تحميل بيانات الأعضاء.</p>';
    }
  }

  /* ==============================
      تشغيل السكربت وتزامن اللغة
  ============================== */
  function initAboutPage() {
    loadAboutContent();
    loadCouncilMembers();
  }

  // التأكد من تشغيل الوظيفة عند جاهزية الصفحة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutPage);
  } else {
    initAboutPage();
  }

  // استجابة لتغيير اللغة بدون الحاجة لتحديث الصفحة بالكامل إذا كان النظام يدعم ذلك
  window.addEventListener('language:changed', initAboutPage);

  // جعل الوظيفة متاحة عالمياً ليتم استدعاؤها من زر تغيير اللغة في HTML
  window.initAboutPage = initAboutPage;

})();
