/**
 * Khotwa Backend API Integration
 * ==============================
 * هذا الملف يوفر جميع الدوال اللازمة للتواصل مع نظام Backend (REST API)
 *
 * IMPORTANT:
 * - هذا الملف هو المصدر الوحيد للـ API
 * - أي ملف آخر (مثل all-features.js) يجب أن يستخدم window.KhotwaAPI فقط
 */

const KhotwaAPI = (function () {
  // ==================== الإعدادات ====================
  const API_BASE = window.KHOTWA_CONFIG?.API_BASE || "https://khotwabknd-gj8oeubw.manus.space/api";

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

  // ==================== API Call (REST API) ====================
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

      // REST API: simple query params or body
      if (method === "GET" && input) {
        const params = new URLSearchParams();
        Object.keys(input).forEach(key => {
          if (input[key] !== null && input[key] !== undefined) {
            params.append(key, input[key]);
          }
        });
        url += `?${params.toString()}`;
      } else if (method === "POST" && input) {
        options.body = JSON.stringify(input);
      }

      const response = await fetch(url, options);
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn(`[Khotwa API] Non-JSON response from ${endpoint}:`, response.status);
        // Return empty data for non-critical endpoints
        if (method === "GET") {
          return null;
        }
        throw new Error("حدث خطأ في الاتصال بالخادم");
      }
      
      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(
          data.error?.message ||
            data.message ||
            "حدث خطأ في الاتصال"
        );
      }

      return data;
    } catch (err) {
      console.warn("[Khotwa API] Error calling", endpoint, ":", err.message);
      // Return null for GET requests (non-critical)
      if (method === "GET") {
        return null;
      }
      throw err;
    }
  }

  // ==================== Statistics ====================
  const getStatistics = async () => {
    try {
      const stats = await apiCall("statistics");
      return stats || {
        newsCount: 0,
        eventsCount: 0,
        commentsCount: 0,
        registrationsCount: 0
      };
    } catch (err) {
      console.warn("[Khotwa API] Failed to load statistics, using defaults");
      return {
        newsCount: 0,
        eventsCount: 0,
        commentsCount: 0,
        registrationsCount: 0
      };
    }
  };

  // ==================== News ====================
  const getNews = async () => {
    const res = await apiCall("news");
    return res || [];
  };

  const getNewsById = (id) => apiCall(`news/${id}`);

  const searchNews = (query = "", category = null, sortBy = "newest") =>
    apiCall("news", { query, category, sortBy });

  // ==================== Events ====================
  const getEvents = async () => {
    const res = await apiCall("events");
    return res || [];
  };

  const getEventById = (id) => apiCall(`events/${id}`);

  const searchEvents = (
    query = "",
    dateFrom = null,
    dateTo = null,
    sortBy = "date"
  ) =>
    apiCall("events", { query, dateFrom, dateTo, sortBy });

  const registerForEvent = (eventId, fullName, email, phone, university, notes) =>
    apiCall(
      "registrations",
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
    apiCall("comments", { contentType, contentId });

  const addComment = (
    contentType,
    contentId,
    authorName,
    content,
    authorEmail
  ) =>
    apiCall(
      "comments",
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
  const getActivePolls = () => apiCall("polls/active");

  const getPollResults = (pollId) =>
    apiCall(`polls/${pollId}/results`);

  const vote = (pollId, optionId) =>
    apiCall(
      `polls/${pollId}/vote`,
      {
        optionId,
        visitorId: getVisitorId(),
      },
      "POST"
    );

  // ==================== Complaints / Suggestions ====================
  const submitComplaint = (subject, content, name, email) =>
    apiCall(
      "complaints",
      { type: "complaint", subject, content, name, email },
      "POST"
    );

  const submitSuggestion = (subject, content, name, email) =>
    apiCall(
      "complaints",
      { type: "suggestion", subject, content, name, email },
      "POST"
    );

  // ==================== Gamification ====================
  const getMyPoints = () =>
    apiCall("gamification/points", {
      visitorId: getVisitorId(),
    });

  const getMyBadges = () =>
    apiCall("gamification/badges", {
      visitorId: getVisitorId(),
    });

  const getAllBadges = () => apiCall("gamification/badges/all");

  // ==================== Jobs ====================
  const getJobs = async () => {
    const res = await apiCall("jobs");
    return res || [];
  };

  const getJobById = (id) => apiCall(`jobs/${id}`);

  const applyForJob = (
    jobId,
    fullName,
    email,
    phone,
    university,
    coverLetter
  ) =>
    apiCall(
      "jobs/apply",
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

  // ==================== Courses ====================
  const getCourses = async () => {
    const res = await apiCall("courses");
    return res || [];
  };

  const getCourseById = (id) => apiCall(`courses/${id}`);

  // ==================== Volunteers ====================
  const getVolunteers = async () => {
    const res = await apiCall("volunteers");
    return res || [];
  };

  const getVolunteerById = (id) => apiCall(`volunteers/${id}`);

  // ==================== Gallery ====================
  const getGallery = (album = null) =>
    apiCall("gallery", album ? { album } : null);

  const getGalleryAlbums = () => apiCall("gallery/albums");

  // ==================== Attendance ====================
  const checkInAttendance = (eventId, name, email, phone) =>
    apiCall(
      "attendance/checkin",
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
  const getVapidPublicKey = () => apiCall("push/public-key");
  const subscribeToPush = (subscription) =>
    apiCall("push/subscribe", subscription, "POST");
  const unsubscribeFromPush = (data) =>
    apiCall("push/unsubscribe", data, "POST");

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

    // Courses
    getCourses,
    getCourseById,

    // Volunteers
    getVolunteers,
    getVolunteerById,

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
