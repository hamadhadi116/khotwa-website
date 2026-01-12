/**
 * About Page Loader (FIXED & SAFE)
 * Loads "About Us" content and Council Members from Backend API
 * Compatible with language-toggle.js
 */

(function () {
  'use strict';

  // Backend URL (same as before)
  const BACKEND_URL =
    window.KHOTWA_CONFIG?.BACKEND_URL ||
    'https://khotwabknd-gj8oeubw.manus.space';

  // Get current language
  function getCurrentLanguage() {
    return localStorage.getItem('language') || 'ar';
  }

  /* ==============================
     Load About Content
  ============================== */
  async function loadAboutContent() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/trpc/about.get`);
      if (!response.ok) throw new Error('About API failed');

      const json = await response.json();
      const content = json?.result?.data;
      if (!content) return;

      const lang = getCurrentLanguage();

      const sections = {
        vision: ['visionAr', 'visionEn'],
        mission: ['missionAr', 'missionEn'],
        goals: ['goalsAr', 'goalsEn'],
        organization: ['organizationAr', 'organizationEn'],
      };

      Object.keys(sections).forEach((key) => {
        const p = document.querySelector(
          `[data-section="${key}"] p`
        );
        if (!p) return;

        p.textContent =
          lang === 'ar'
            ? content[sections[key][0]]
            : content[sections[key][1]];
      });
    } catch (error) {
      console.error('[About Loader] Failed to load content:', error);
    }
  }

  /* ==============================
     Load Council Members
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

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutPage);
  } else {
    initAboutPage();
  }

  // Re-run when language changes
  window.addEventListener('language:changed', initAboutPage);
})();
