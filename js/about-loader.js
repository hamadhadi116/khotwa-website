/**
 * About Page Loader
 * Uses KhotwaAPI (single source of truth)
 */

(function () {
  'use strict';

  function getLang() {
    return localStorage.getItem('khotwa_lang') || 'ar';
  }

  /* ==============================
      1. تحميل الرؤية والرسالة
  ============================== */
  async function loadAboutContent() {
    if (!window.KhotwaAPI) {
      console.error('[About] KhotwaAPI not found');
      return;
    }

    const lang = getLang();
    const settings = await KhotwaAPI.loadSettings();

    if (!settings) return;

    const visionText =
      lang === 'ar' ? settings.vision_ar : settings.vision_en;
    const missionText =
      lang === 'ar' ? settings.mission_ar : settings.mission_en;

    const visionEl = document.querySelector('[data-section="vision"] p');
    const missionEl = document.querySelector('[data-section="mission"] p');

    if (visionEl) {
      const fallbackVision =
        lang === 'ar'
          ? visionEl.dataset.defaultAr
          : visionEl.dataset.defaultEn;
      visionEl.textContent = visionText || fallbackVision || '';
    }

    if (missionEl) {
      const fallbackMission =
        lang === 'ar'
          ? missionEl.dataset.defaultAr
          : missionEl.dataset.defaultEn;
      missionEl.textContent = missionText || fallbackMission || '';
    }
  }

  /* ==============================
      2. تحميل أعضاء المجلس
  ============================== */
  async function loadCouncilMembers() {
    if (!window.KhotwaAPI) {
      console.error('[About] KhotwaAPI not found');
      return;
    }

    const container = document.getElementById('council-members-container');
    if (!container) return;

    const lang = getLang();
    const members = await KhotwaAPI.getVolunteers();

    if (!Array.isArray(members) || members.length === 0) {
      container.innerHTML =
        '<p style="grid-column:1/-1;text-align:center;">لا يوجد أعضاء حالياً.</p>';
      return;
    }

    container.innerHTML = members
      .map((m) => {
        const name =
          lang === 'ar' ? (m.nameAr || m.name) : (m.nameEn || m.name);
        const role =
          lang === 'ar' ? m.positionAr : m.positionEn;
        const img = m.photoUrl || '/assets/apple-touch-icon.png';

        return `
          <div class="member-card">
            <div class="img-wrapper">
              <img src="${img}" alt="${name}" onerror="this.src='/assets/apple-touch-icon.png'">
            </div>
            <div class="member-details">
              <h3>${name}</h3>
              <p>${role || ''}</p>
            </div>
          </div>
        `;
      })
      .join('');
  }

  /* ==============================
      3. التشغيل
  ============================== */
  async function init() {
    await loadAboutContent();
    await loadCouncilMembers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('language:changed', init);
})();
