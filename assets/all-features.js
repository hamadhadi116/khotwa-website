/**
 * All Additional Features - Connected to Backend API
 * جميع الميزات الإضافية - مربوطة بنظام Backend
 */

// ==================== Backend API Configuration ====================
// سيتم تحديث هذا الرابط بعد نشر Backend
const BACKEND_API = 'https://khotwabknd-gj8oeubw.manus.space/api/trpc';

// ==================== Helper Functions ====================
function getVisitorId() {
  let id = localStorage.getItem('khotwa_visitor_id');
  if (!id) {
    id = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('khotwa_visitor_id', id);
  }
  return id;
}

async function apiCall(endpoint, input = null, method = 'GET') {
  try {
    let url = `${BACKEND_API}/${endpoint}`;
    const options = {
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (method === 'GET' && input) {
      url += `?input=${encodeURIComponent(JSON.stringify(input))}`;
    } else if (method === 'POST' && input) {
      options.body = JSON.stringify(input);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (data.error) throw new Error(data.error.message || 'حدث خطأ');
    return data.result?.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ==================== Social Media Integration ====================
const socialLinks = {
  twitter: 'https://twitter.com/khotwa_council',
  instagram: 'https://instagram.com/khotwa_council',
  facebook: 'https://facebook.com/khotwa.council',
  youtube: 'https://youtube.com/@khotwacouncil',
  linkedin: 'https://linkedin.com/company/khotwa-council'
};

function addSocialMediaWidget() {
  const widget = `
    <div class="social-widget">
      <h3>تابعنا</h3>
      <div class="social-links">
        <a href="${socialLinks.twitter}" target="_blank" title="Twitter">🐦</a>
        <a href="${socialLinks.instagram}" target="_blank" title="Instagram">📷</a>
        <a href="${socialLinks.facebook}" target="_blank" title="Facebook">👥</a>
        <a href="${socialLinks.youtube}" target="_blank" title="YouTube">📺</a>
        <a href="${socialLinks.linkedin}" target="_blank" title="LinkedIn">💼</a>
      </div>
    </div>
  `;
  
  const footer = document.querySelector('footer');
  if (footer) {
    footer.insertAdjacentHTML('afterbegin', widget);
  }
}

// ==================== Advanced Search ====================
function initAdvancedSearch() {
  const searchHTML = `
    <div class="advanced-search-panel" id="advanced-search">
      <h3>🔍 بحث متقدم</h3>
      <input type="text" id="search-query" placeholder="ابحث في الأخبار والفعاليات..."/>
      <div class="search-filters">
        <select id="search-type">
          <option value="all">الكل</option>
          <option value="news">الأخبار</option>
          <option value="events">الفعاليات</option>
        </select>
        <select id="search-date">
          <option value="all">كل الأوقات</option>
          <option value="week">آخر أسبوع</option>
          <option value="month">آخر شهر</option>
          <option value="year">آخر سنة</option>
        </select>
      </div>
      <button onclick="performAdvancedSearch()">بحث</button>
      <div id="search-results"></div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', searchHTML);
}

// ==================== Achievements - From Backend ====================
async function loadAchievements() {
  try {
    const achievements = await apiCall('achievements.list');
    return achievements;
  } catch (error) {
    console.error('Error loading achievements:', error);
    // Fallback to static data
    return [
      { year: 2025, titleAr: 'جائزة أفضل مجلس طلابي', icon: '🏆' },
      { year: 2024, titleAr: 'المركز الأول في المسابقة الوطنية', icon: '🥇' }
    ];
  }
}

// ==================== Polls System - From Backend ====================
async function loadActivePolls() {
  try {
    return await apiCall('polls.listActive');
  } catch (error) {
    console.error('Error loading polls:', error);
    return [];
  }
}

async function votePoll(pollId, optionId) {
  try {
    const result = await apiCall('polls.vote', {
      pollId: pollId,
      optionId: optionId,
      visitorId: getVisitorId()
    }, 'POST');
    
    // Show success message
    if (result.points) {
      showNotification('تم التصويت!', `حصلت على ${result.points.pointsEarned} نقطة`);
    }
    
    return result;
  } catch (error) {
    if (error.message.includes('Already voted')) {
      alert('لقد صوّت مسبقاً في هذا الاستطلاع!');
    } else {
      alert('حدث خطأ: ' + error.message);
    }
    throw error;
  }
}

async function getPollResults(pollId) {
  try {
    return await apiCall('polls.results', { pollId: pollId });
  } catch (error) {
    console.error('Error getting poll results:', error);
    return [];
  }
}

// ==================== Jobs - From Backend ====================
async function loadJobs() {
  try {
    return await apiCall('jobs.list');
  } catch (error) {
    console.error('Error loading jobs:', error);
    return [];
  }
}

async function applyForJob(jobId, fullName, email, phone, university, coverLetter) {
  try {
    const result = await apiCall('jobs.submitApplication', {
      jobId: jobId,
      fullName: fullName,
      email: email,
      phone: phone,
      university: university,
      coverLetter: coverLetter
    }, 'POST');
    
    alert('تم إرسال طلبك بنجاح!');
    return result;
  } catch (error) {
    alert('حدث خطأ: ' + error.message);
    throw error;
  }
}

// ==================== Push Notifications ====================
function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notifications enabled');
      }
    });
  }
}

function showNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/assets/img/apple-touch-icon.png' });
  }
}

// ==================== Interactive FAQ ====================
function makeFAQInteractive() {
  const faqs = document.querySelectorAll('.faq-item');
  faqs.forEach(faq => {
    const question = faq.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        faq.classList.toggle('active');
      });
    }
  });
}

// ==================== Points/Badges System - From Backend ====================
async function getMyPoints() {
  try {
    const result = await apiCall('gamification.getPoints', { visitorId: getVisitorId() });
    return result || { totalPoints: 0, level: 1 };
  } catch (error) {
    console.error('Error getting points:', error);
    return { totalPoints: 0, level: 1 };
  }
}

async function getMyBadges() {
  try {
    return await apiCall('gamification.getBadges', { visitorId: getVisitorId() });
  } catch (error) {
    console.error('Error getting badges:', error);
    return [];
  }
}

async function getAllBadges() {
  try {
    return await apiCall('gamification.getAllBadges');
  } catch (error) {
    console.error('Error getting all badges:', error);
    return [];
  }
}

// Display user points in UI
async function displayUserPoints() {
  const points = await getMyPoints();
  const pointsDisplay = document.getElementById('user-points-display');
  if (pointsDisplay) {
    pointsDisplay.innerHTML = `
      <span class="points">🏆 ${points.totalPoints} نقطة</span>
      <span class="level">المستوى ${points.level}</span>
    `;
  }
}

// ==================== Statistics - From Backend ====================
async function loadStatistics() {
  try {
    return await apiCall('statistics.get');
  } catch (error) {
    console.error('Error loading statistics:', error);
    return { news: 0, events: 0, comments: 0, registrations: 0, users: 0, complaints: 0 };
  }
}

async function renderStatistics() {
  const stats = await loadStatistics();
  return `
    <div class="stats-grid">
      <div class="stat-card">
        <h3>${stats.events}</h3>
        <p>فعالية منظمة</p>
      </div>
      <div class="stat-card">
        <h3>${stats.news}</h3>
        <p>خبر منشور</p>
      </div>
      <div class="stat-card">
        <h3>${stats.users}</h3>
        <p>مستخدم نشط</p>
      </div>
      <div class="stat-card">
        <h3>${stats.registrations}</h3>
        <p>تسجيل في الفعاليات</p>
      </div>
    </div>
  `;
}

// ==================== Complaints System - To Backend ====================
async function submitComplaint(data) {
  try {
    const result = await apiCall('complaints.create', {
      type: data.type || 'complaint',
      name: data.name,
      email: data.email,
      subject: data.subject,
      content: data.content
    }, 'POST');
    
    alert('تم إرسال ' + (data.type === 'suggestion' ? 'اقتراحك' : 'شكواك') + ' بنجاح!');
    return result;
  } catch (error) {
    alert('حدث خطأ: ' + error.message);
    throw error;
  }
}

// ==================== News - From Backend ====================
async function loadNews() {
  try {
    return await apiCall('news.list');
  } catch (error) {
    console.error('Error loading news:', error);
    return [];
  }
}

async function getNewsById(id) {
  try {
    return await apiCall('news.getById', { id: id });
  } catch (error) {
    console.error('Error getting news:', error);
    return null;
  }
}

// ==================== Events - From Backend ====================
async function loadEvents() {
  try {
    return await apiCall('events.list');
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
}

async function getEventById(id) {
  try {
    return await apiCall('events.getById', { id: id });
  } catch (error) {
    console.error('Error getting event:', error);
    return null;
  }
}

// ==================== Comments - From Backend ====================
async function loadComments(contentType, contentId) {
  try {
    return await apiCall('comments.list', {
      contentType: contentType,
      contentId: contentId
    });
  } catch (error) {
    console.error('Error loading comments:', error);
    return [];
  }
}

async function addComment(contentType, contentId, authorName, content, authorEmail = null) {
  try {
    const result = await apiCall('comments.create', {
      contentType: contentType,
      contentId: contentId,
      authorName: authorName,
      authorEmail: authorEmail,
      content: content,
      visitorId: getVisitorId()
    }, 'POST');
    
    if (result.points) {
      showNotification('تم إضافة التعليق!', `حصلت على ${result.points.pointsEarned} نقطة`);
    }
    
    return result;
  } catch (error) {
    alert('حدث خطأ: ' + error.message);
    throw error;
  }
}

// ==================== Event Registration - To Backend ====================
async function registerForEvent(eventId, fullName, email, phone, university, notes) {
  try {
    const result = await apiCall('registrations.create', {
      eventId: eventId,
      fullName: fullName,
      email: email,
      phone: phone,
      university: university,
      notes: notes,
      visitorId: getVisitorId()
    }, 'POST');
    
    if (result.points) {
      showNotification('تم التسجيل!', `حصلت على ${result.points.pointsEarned} نقطة`);
    }
    
    alert('تم تسجيلك بنجاح في الفعالية!');
    return result;
  } catch (error) {
    if (error.message.includes('Already registered')) {
      alert('أنت مسجل مسبقاً في هذه الفعالية');
    } else {
      alert('حدث خطأ: ' + error.message);
    }
    throw error;
  }
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
  addSocialMediaWidget();
  requestNotificationPermission();
  makeFAQInteractive();
  displayUserPoints();
});

// ==================== Export Functions ====================
window.KhotwaFeatures = {
  // Config
  getVisitorId,
  
  // Social
  socialLinks,
  
  // News
  loadNews,
  getNewsById,
  
  // Events
  loadEvents,
  getEventById,
  registerForEvent,
  
  // Comments
  loadComments,
  addComment,
  
  // Polls
  loadActivePolls,
  votePoll,
  getPollResults,
  
  // Jobs
  loadJobs,
  applyForJob,
  
  // Achievements
  loadAchievements,
  
  // Gamification
  getMyPoints,
  getMyBadges,
  getAllBadges,
  displayUserPoints,
  
  // Statistics
  loadStatistics,
  renderStatistics,
  
  // Complaints
  submitComplaint,
  
  // Notifications
  showNotification
};
