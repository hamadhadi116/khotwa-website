/**
 * Khotwa Backend API Integration
 * ==============================
 * هذا الملف يوفر جميع الدوال اللازمة للتواصل مع نظام Backend (tRPC)
 *
 * IMPORTANT:
 * - هذا الملف هو المصدر الوحيد للـ API
 * - أي ملف آخر (مثل all-features.js) يجب أن يستخدم window.KhotwaAPI فقط
 */

const KhotwaAPI = (function () {
  // ==================== الإعدادات ====================
  const API_BASE = "https://khotwabknd-gj8oeubw.manus.space/api/trpc";

  // ==================== Visitor ID ====================
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

  // ==================== API Call (tRPC compatible) ====================
  async function apiCall(endpoint, input = null, method = "GET") {
    try {
      let url = `${API_BASE}/${endpoint}`;

      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      };

      // ✅ tRPC expects input wrapped in { json: ... }
      if (method === "GET" && input) {
        url += `?input=${encodeURIComponent(
          JSON.stringify({ json: input })
        )}`;
      } else if (method === "POST" && input) {
        options.body = JSON.stringify({ json: input });
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (data?.error) {
        throw new Error(
          data.error?.json?.message ||
            data.error?.message ||
            "حدث خطأ في الاتصال"
        );
      }

      return data?.result?.data?.json ?? data?.result?.data ?? null;
    } catch (err) {
      console.error("Khotwa API Error:", err);
      throw err;
    }
  }

  // ==================== Statistics ====================
  const getStatistics = () => apiCall("statistics.get");

  // ==================== News ====================
  const getNews = async () => {
    const res = await apiCall("news.list");
    return res?.json || res || [];
  };

  const getNewsById = (id) => apiCall("news.getById", { id });

  const searchNews = (query = "", category = null, sortBy = "newest") =>
    apiCall("news.search", { query, category, sortBy });

  // ==================== Events ====================
  const getEvents = async () => {
    const res = await apiCall("events.list");
    return res?.json || res || [];
  };

  const getEventById = (id) => apiCall("events.getById", { id });

  const searchEvents = (
    query = "",
    dateFrom = null,
    dateTo = null,
    sortBy = "date"
  ) =>
    apiCall("events.search", { query, dateFrom, dateTo, sortBy });

  const registerForEvent = (eventId, fullName, email, phone, university, notes) =>
    apiCall(
      "registrations.create",
      {
        eventId,
        fullName,
        email,
        phone,
        university,
        notes,
        visitorId: getVisitorId(),
      },
      "POST"
    );

  // ==================== Comments ====================
  const getComments = (contentType, contentId) =>
    apiCall("comments.list", { contentType, contentId });

  const addComment = (
    contentType,
    contentId,
    authorName,
    content,
    authorEmail
  ) =>
    apiCall(
      "comments.create",
      {
        contentType,
        contentId,
        authorName,
        authorEmail,
        content,
        visitorId: getVisitorId(),
      },
      "POST"
    );

  // ==================== Polls ====================
  const getActivePolls = () => apiCall("polls.listActive");

  const getPollResults = (pollId) =>
    apiCall("polls.results", { pollId });

  const vote = (pollId, optionId) =>
    apiCall(
      "polls.vote",
      {
        pollId,
        optionId,
        visitorId: getVisitorId(),
      },
      "POST"
    );

  // ==================== Complaints / Suggestions ====================
  const submitComplaint = (subject, content, name, email) =>
    apiCall(
      "complaints.create",
      { type: "complaint", subject, content, name, email },
      "POST"
    );

  const submitSuggestion = (subject, content, name, email) =>
    apiCall(
      "complaints.create",
      { type: "suggestion", subject, content, name, email },
      "POST"
    );

  // ==================== Gamification ====================
  const getMyPoints = () =>
    apiCall("gamification.getPoints", {
      visitorId: getVisitorId(),
    });

  const getMyBadges = () =>
    apiCall("gamification.getBadges", {
      visitorId: getVisitorId(),
    });

  const getAllBadges = () => apiCall("gamification.getAllBadges");

  // ==================== Jobs ====================
  const getJobs = async () => {
    const res = await apiCall("jobs.list");
    return res?.json || res || [];
  };

  const getJobById = (id) => apiCall("jobs.getById", { id });

  const applyForJob = (
    jobId,
    fullName,
    email,
    phone,
    university,
    coverLetter
  ) =>
    apiCall(
      "jobs.submitApplication",
      {
        jobId,
        fullName,
        email,
        phone,
        university,
        coverLetter,
      },
      "POST"
    );

  // ==================== Gallery ====================
  const getGallery = (album = null) =>
    apiCall("gallery.list", album ? { album } : null);

  const getGalleryAlbums = () => apiCall("gallery.albums");

  // ==================== Attendance ====================
  const checkInAttendance = (eventId, name, email, phone) =>
    apiCall(
      "attendance.checkIn",
      {
        eventId,
        name,
        email,
        phone,
        visitorId: getVisitorId(),
      },
      "POST"
    );

  // ==================== Push Notifications ====================
  const getVapidPublicKey = () => apiCall("push.getPublicKey");
  const subscribeToPush = (subscription) =>
    apiCall("push.subscribe", subscription, "POST");
  const unsubscribeFromPush = (data) =>
    apiCall("push.unsubscribe", data, "POST");

  // ==================== Export ====================
  return {
    getVisitorId,

    // Statistics
    getStatistics,

    // News
    getNews,
    getNewsById,
    searchNews,

    // Events
    getEvents,
    getEventById,
    searchEvents,
    registerForEvent,

    // Comments
    getComments,
    addComment,

    // Polls
    getActivePolls,
    getPollResults,
    vote,

    // Complaints
    submitComplaint,
    submitSuggestion,

    // Gamification
    getMyPoints,
    getMyBadges,
    getAllBadges,

    // Jobs
    getJobs,
    getJobById,
    applyForJob,

    // Gallery
    getGallery,
    getGalleryAlbums,

    // Attendance
    checkInAttendance,

    // Push
    getVapidPublicKey,
    subscribeToPush,
    unsubscribeFromPush,
  };
})();

// 🌍 Make API globally available
window.KhotwaAPI = KhotwaAPI;
