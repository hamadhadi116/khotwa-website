/**
 * About Page Loader – BACKEND VERSION
 * يستخدم KhotwaAPI فقط (بدون fetch مباشر)
 */

(function () {
  "use strict";

  function getLang() {
    return localStorage.getItem("khotwa_lang") || "ar";
  }

  /* =========================
     1. الرؤية + الرسالة
  ========================= */
  async function loadAboutContent() {
    const lang = getLang();

    try {
      const settings = await KhotwaAPI.loadSettings();
      if (!settings) throw new Error("No settings");

      const visionText =
        lang === "ar" ? settings.vision_ar : settings.vision_en;
      const missionText =
        lang === "ar" ? settings.mission_ar : settings.mission_en;

      const visionEl = document.querySelector('[data-section="vision"] p');
      const missionEl = document.querySelector('[data-section="mission"] p');

      if (visionEl) visionEl.textContent = visionText || "";
      if (missionEl) missionEl.textContent = missionText || "";

    } catch (e) {
      console.warn("[About] Failed to load vision/mission", e);
    }
  }

  /* =========================
     2. أعضاء المجلس
  ========================= */
  async function loadCouncilMembers() {
    const container = document.getElementById("council-members-container");
    if (!container) return;

    try {
      const members = await KhotwaAPI.getVolunteers();
      const lang = getLang();

      if (!Array.isArray(members) || members.length === 0) {
        container.innerHTML =
          '<p style="grid-column:1/-1;text-align:center;">لا يوجد أعضاء حالياً.</p>';
        return;
      }

      container.innerHTML = members
        .map((m) => {
          const name =
            lang === "ar"
              ? m.nameAr || m.name
              : m.nameEn || m.name;

          const role =
            lang === "ar"
              ? m.positionAr || m.roleAr
              : m.positionEn || m.roleEn;

          const photo =
            m.photoUrl || m.image || "/assets/apple-touch-icon.png";

          return `
            <div class="member-card">
              <div class="img-wrapper">
                <img src="${photo}" alt="${name}"
                     onerror="this.src='/assets/apple-touch-icon.png'">
              </div>
              <div class="member-details">
                <h3>${name}</h3>
                <p>${role || ""}</p>
              </div>
            </div>
          `;
        })
        .join("");

    } catch (e) {
      console.error("[About] Failed to load members", e);
      container.innerHTML =
        '<p style="grid-column:1/-1;text-align:center;">تعذر تحميل الأعضاء.</p>';
    }
  }

  /* =========================
     3. Init
  ========================= */
  function initAboutPage() {
    loadAboutContent();
    loadCouncilMembers();
  }

  document.addEventListener("DOMContentLoaded", initAboutPage);
  window.addEventListener("language:changed", initAboutPage);

})();
