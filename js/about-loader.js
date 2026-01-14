/**
 * About Page Loader (STABLE & SAFE)
 * - Loads Council Members from API
 * - Uses static fallback for About content if API fails
 */

(function () {
  'use strict';

  const BACKEND_URL =
    window.KHOTWA_CONFIG?.BACKEND_URL ||
    'https://khotwabknd-gj8oeubw.manus.space';

  function getCurrentLanguage() {
    return localStorage.getItem('language') || 'ar';
  }

  /* ==============================
     Load About Content (SAFE)
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

      p.textContent =
        lang === 'ar'
          ? content[sections[key][0]]
          : content[sections[key][1]];
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
     Load Council Members (WORKING)
  ============================== */
  async function loadCouncilMembers() {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/trpc/councilMembers.list`
      );
      if (!response.ok) throw new Error('Members API failed');

      const json = await response.json();
      const members =
        json?.result?.data?.json || json?.result?.data || [];

      if (!Array.isArray(members)) return;

      const container = document.getElementById(
        'council-members-container'
      );
      if (!container) return;

      const lang = getCurrentLanguage();

      container.innerHTML = members
        .map(
          (member) => `
          <div class="member-card">
            <img
              src="${member.photoUrl || '/assets/apple-touch-icon.png'}"
              alt="${lang === 'ar' ? member.nameAr : member.nameEn}"
              loading="lazy"
              decoding="async"
            />
            <h3>${lang === 'ar' ? member.nameAr : member.nameEn}</h3>
            <p class="muted">
              ${lang === 'ar' ? member.positionAr : member.positionEn}
            </p>
          </div>
        `
        )
        .join('');
    } catch (error) {
      console.error('[About Loader] Failed to load members:', error);
    }
  }

  /* ==============================
     Init + Language Sync
  ============================== */
  function initAboutPage() {
    loadAboutContent();
    loadCouncilMembers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutPage);
  } else {
    initAboutPage();
  }

  window.addEventListener('language:changed', initAboutPage);
})();
