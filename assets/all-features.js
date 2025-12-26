/**
 * All Additional Features - Connected to Backend API
 * جميع الميزات الإضافية - مربوطة بنظام Backend
 *
 * IMPORTANT:
 * - This file MUST NOT redeclare BACKEND_API
 * - Uses window.KhotwaAPI as the single source of truth
 */

(function () {
  "use strict";

  // ==================== Unified API Access ====================
  function getAPI() {
    if (window.KhotwaAPI) return window.KhotwaAPI;
    console.warn("KhotwaAPI not found. Features will be limited.");
    return null;
  }

  // ==================== Visitor ID (fallback-safe) ====================
  function getVisitorId() {
    let id = localStorage.getItem("khotwa_visitor_id");
    if (!id) {
      id =
        "v_" +
        Date.now() +
        "_" +
        Math.random().toString(36).substr(2, 9);
      localStorage.setItem("khotwa_visitor_id", id);
    }
    return id;
  }

  // ==================== Social Media ====================
  const socialLinks = {
    twitter: "https://twitter.com/khotwa_council",
    instagram: "https://instagram.com/khotwa_council",
    facebook: "https://facebook.com/khotwa.council",
    youtube: "https://youtube.com/@khotwacouncil",
    linkedin: "https://linkedin.com/company/khotwa-council",
  };

  function addSocialMediaWidget() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    footer.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="social-widget">
        <h3>تابعنا</h3>
        <div class="social-links">
          <a href="${socialLinks.twitter}" target="_blank">🐦</a>
          <a href="${socialLinks.instagram}" target="_blank">📷</a>
          <a href="${socialLinks.facebook}" target="_blank">👥</a>
          <a href="${socialLinks.youtube}" target="_blank">📺</a>
          <a href="${socialLinks.linkedin}" target="_blank">💼</a>
        </div>
      </div>
    `
    );
  }

  // ==================== News ====================
  async function loadNews() {
    const api = getAPI();
    if (!api?.getNews) return [];
    return await api.getNews();
  }

  async function getNewsById(id) {
    const api = getAPI();
    if (!api?.getNewsById) return null;
    return await api.getNewsById(id);
  }

  // ==================== Events ====================
  async function loadEvents() {
    const api = getAPI();
    if (!api?.getEvents) return [];
    return await api.getEvents();
  }

  async function getEventById(id) {
    const api = getAPI();
    if (!api?.getEventById) return null;
    return await api.getEventById(id);
  }

  async function registerForEvent(eventId, fullName, email, phone, university, notes) {
    const api = getAPI();
    if (!api?.registerForEvent) return null;

    return await api.registerForEvent(
      eventId,
      fullName,
      email,
      phone,
      university,
      notes
    );
  }

  // ==================== Comments ====================
  async function loadComments(contentType, contentId) {
    const api = getAPI();
    if (!api?.getComments) return [];
    return await api.getComments(contentType, contentId);
  }

  async function addComment(contentType, contentId, authorName, content, authorEmail) {
    const api = getAPI();
    if (!api?.addComment) return null;

    return await api.addComment(
      contentType,
      contentId,
      authorName,
      content,
      authorEmail
    );
  }

  // ==================== Polls ====================
  async function loadActivePolls() {
    const api = getAPI();
    if (!api?.getActivePolls) return [];
    return await api.getActivePolls();
  }

  async function votePoll(pollId, optionId) {
    const api = getAPI();
    if (!api?.vote) return null;

    return await api.vote(pollId, optionId);
  }

  async function getPollResults(pollId) {
    const api = getAPI();
    if (!api?.getPollResults) return [];
    return await api.getPollResults(pollId);
  }

  // ==================== Gamification ====================
  async function getMyPoints() {
    const api = getAPI();
    if (!api?.getMyPoints) return { totalPoints: 0, level: 1 };
    return await api.getMyPoints();
  }

  async function displayUserPoints() {
    const points = await getMyPoints();
    const el = document.getElementById("user-points-display");
    if (!el) return;

    el.innerHTML = `
      <span class="points">🏆 ${points.totalPoints}</span>
      <span class="level">المستوى ${points.level}</span>
    `;
  }

  // ==================== Complaints ====================
  async function submitComplaint(data) {
    const api = getAPI();
    if (!api?.submitComplaint) return null;

    return await api.submitComplaint(
      data.subject,
      data.content,
      data.name,
      data.email
    );
  }

  // ==================== Init ====================
  document.addEventListener("DOMContentLoaded", () => {
    addSocialMediaWidget();
    displayUserPoints();
  });

  // ==================== Export ====================
  window.KhotwaFeatures = {
    getVisitorId,
    socialLinks,

    loadNews,
    getNewsById,

    loadEvents,
    getEventById,
    registerForEvent,

    loadComments,
    addComment,

    loadActivePolls,
    votePoll,
    getPollResults,

    getMyPoints,
    displayUserPoints,

    submitComplaint,
  };
})();
