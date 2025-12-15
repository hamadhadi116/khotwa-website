/**
 * All Additional Features
 * جميع الميزات الإضافية
 */

// 3. Social Media Integration
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

// 4. Advanced Search
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

// 5. Achievements Page Data
const achievements = [
  { year: 2025, title: 'جائزة أفضل مجلس طلابي', icon: '🏆' },
  { year: 2024, title: 'المركز الأول في المسابقة الوطنية', icon: '🥇' },
  { year: 2024, title: 'شهادة تقدير من الجامعة', icon: '📜' }
];

// 6. Polls System
let polls = [];

function createPoll(question, options) {
  const poll = {
    id: Date.now(),
    question,
    options: options.map(opt => ({ text: opt, votes: 0 })),
    voters: []
  };
  polls.push(poll);
  savePollsToStorage();
  return poll;
}

function votePoll(pollId, optionIndex) {
  const poll = polls.find(p => p.id === pollId);
  if (!poll) return;
  
  const voterId = localStorage.getItem('voter_id') || generateVoterId();
  
  if (poll.voters.includes(voterId)) {
    alert('لقد صوّت مسبقاً!');
    return;
  }
  
  poll.options[optionIndex].votes++;
  poll.voters.push(voterId);
  savePollsToStorage();
}

function generateVoterId() {
  const id = 'voter_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('voter_id', id);
  return id;
}

function savePollsToStorage() {
  localStorage.setItem('khotwa_polls', JSON.stringify(polls));
}

// 7. Jobs Section Data
const jobs = [
  {
    id: 1,
    title: 'منسق فعاليات',
    type: 'تطوعي',
    description: 'نبحث عن منسق فعاليات متحمس',
    requirements: ['مهارات تنظيمية', 'عمل جماعي'],
    deadline: '2026-01-31'
  }
];

// 8. Push Notifications (Browser Notifications)
function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notifications enabled');
      }
    });
  }
}

function sendNotification(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/assets/img/apple-touch-icon.png' });
  }
}

// 9. Interactive FAQ
function makeF AQInteractive() {
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

// 10. Points/Badges System
const userPoints = {
  points: 0,
  badges: [],
  level: 1
};

function addPoints(amount, reason) {
  userPoints.points += amount;
  checkLevelUp();
  checkBadges(reason);
  saveUserPoints();
}

function checkLevelUp() {
  const newLevel = Math.floor(userPoints.points / 100) + 1;
  if (newLevel > userPoints.level) {
    userPoints.level = newLevel;
    sendNotification('مستوى جديد!', `وصلت إلى المستوى ${newLevel}`);
  }
}

function checkBadges(reason) {
  const badges = {
    'first_comment': { name: 'المعلق الأول', icon: '💬' },
    'event_attendee': { name: 'حضور فعال', icon: '🎉' },
    'top_voter': { name: 'صوت نشط', icon: '🗳️' }
  };
  
  if (badges[reason] && !userPoints.badges.includes(reason)) {
    userPoints.badges.push(reason);
    sendNotification('شارة جديدة!', `حصلت على شارة "${badges[reason].name}"`);
  }
}

function saveUserPoints() {
  localStorage.setItem('khotwa_user_points', JSON.stringify(userPoints));
}

// 11. Statistics Page Data
const statistics = {
  totalEvents: 45,
  totalNews: 120,
  totalMembers: 250,
  totalRegistrations: 890
};

function renderStatistics() {
  return `
    <div class="stats-grid">
      <div class="stat-card">
        <h3>${statistics.totalEvents}</h3>
        <p>فعالية منظمة</p>
      </div>
      <div class="stat-card">
        <h3>${statistics.totalNews}</h3>
        <p>خبر منشور</p>
      </div>
      <div class="stat-card">
        <h3>${statistics.totalMembers}</h3>
        <p>عضو نشط</p>
      </div>
      <div class="stat-card">
        <h3>${statistics.totalRegistrations}</h3>
        <p>تسجيل في الفعاليات</p>
      </div>
    </div>
  `;
}

// 12. Complaints System
function submitComplaint(data) {
  const complaints = JSON.parse(localStorage.getItem('khotwa_complaints') || '[]');
  complaints.push({
    id: Date.now(),
    ...data,
    date: new Date().toISOString(),
    status: 'pending'
  });
  localStorage.setItem('khotwa_complaints', JSON.stringify(complaints));
  return true;
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
  addSocialMediaWidget();
  requestNotificationPermission();
  makeFAQInteractive();
  
  // Load user points
  const saved = localStorage.getItem('khotwa_user_points');
  if (saved) {
    Object.assign(userPoints, JSON.parse(saved));
  }
});

// Export functions
window.KhotwaFeatures = {
  socialLinks,
  createPoll,
  votePoll,
  jobs,
  sendNotification,
  addPoints,
  statistics,
  renderStatistics,
  submitComplaint
};
