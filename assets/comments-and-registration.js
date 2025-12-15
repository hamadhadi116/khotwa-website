/**
 * Comments and Event Registration System
 * نظام التعليقات والتسجيل في الفعاليات
 */

// Storage Keys
const COMMENTS_KEY = 'khotwa_comments';
const REGISTRATIONS_KEY = 'khotwa_event_registrations';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeCommentsSystem();
  initializeEventRegistration();
});

/**
 * Comments System
 * نظام التعليقات
 */
function initializeCommentsSystem() {
  // Check if we're on a news or event page
  const newsId = getNewsIdFromURL();
  const eventId = getEventIdFromURL();
  
  if (newsId || eventId) {
    renderCommentsSection(newsId || eventId, newsId ? 'news' : 'event');
  }
}

function getNewsIdFromURL() {
  // Extract news ID from URL or page
  const match = window.location.search.match(/news=(\d+)/);
  return match ? match[1] : null;
}

function getEventIdFromURL() {
  // Extract event ID from URL or page
  const match = window.location.search.match(/event=(\d+)/);
  return match ? match[1] : null;
}

function renderCommentsSection(itemId, type) {
  const container = document.querySelector('.main-content') || document.querySelector('main');
  if (!container) return;
  
  const commentsHTML = `
    <div class="comments-section" id="comments-section">
      <h2>💬 التعليقات</h2>
      
      <!-- Add Comment Form -->
      <div class="add-comment-form">
        <h3>أضف تعليقك</h3>
        <form id="comment-form">
          <div class="form-group">
            <input type="text" id="comment-name" placeholder="الاسم" required/>
          </div>
          <div class="form-group">
            <input type="email" id="comment-email" placeholder="البريد الإلكتروني (اختياري)"/>
          </div>
          <div class="form-group">
            <textarea id="comment-text" rows="4" placeholder="اكتب تعليقك هنا..." required></textarea>
          </div>
          <button type="submit" class="btn-primary">إرسال التعليق</button>
        </form>
      </div>
      
      <!-- Comments List -->
      <div class="comments-list" id="comments-list">
        <div class="loading">جاري تحميل التعليقات...</div>
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', commentsHTML);
  
  // Load and display comments
  loadComments(itemId, type);
  
  // Handle form submission
  document.getElementById('comment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addComment(itemId, type);
  });
}

function loadComments(itemId, type) {
  const allComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}');
  const key = `${type}_${itemId}`;
  const comments = allComments[key] || [];
  
  const container = document.getElementById('comments-list');
  
  if (comments.length === 0) {
    container.innerHTML = '<p class="no-comments">لا توجد تعليقات بعد. كن أول من يعلق!</p>';
    return;
  }
  
  container.innerHTML = comments.map(comment => `
    <div class="comment-item">
      <div class="comment-header">
        <strong class="comment-author">${comment.name}</strong>
        <span class="comment-date">${formatDate(comment.date)}</span>
      </div>
      <div class="comment-body">
        ${comment.text}
      </div>
    </div>
  `).join('');
}

function addComment(itemId, type) {
  const name = document.getElementById('comment-name').value.trim();
  const email = document.getElementById('comment-email').value.trim();
  const text = document.getElementById('comment-text').value.trim();
  
  if (!name || !text) {
    alert('الرجاء ملء جميع الحقول المطلوبة');
    return;
  }
  
  const comment = {
    id: Date.now(),
    name,
    email,
    text,
    date: new Date().toISOString()
  };
  
  const allComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}');
  const key = `${type}_${itemId}`;
  
  if (!allComments[key]) {
    allComments[key] = [];
  }
  
  allComments[key].unshift(comment);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
  
  // Clear form
  document.getElementById('comment-form').reset();
  
  // Reload comments
  loadComments(itemId, type);
  
  // Show success message
  showMessage('تم إضافة تعليقك بنجاح! شكراً لمشاركتك.', 'success');
}

/**
 * Event Registration System
 * نظام التسجيل في الفعاليات
 */
function initializeEventRegistration() {
  // Add registration buttons to event cards
  const eventCards = document.querySelectorAll('.event-card, .event-item');
  
  eventCards.forEach(card => {
    const eventId = card.dataset.eventId || extractEventId(card);
    if (!eventId) return;
    
    const registrationBtn = createRegistrationButton(eventId);
    
    const actionsDiv = card.querySelector('.event-actions') || card.querySelector('.card-footer');
    if (actionsDiv) {
      actionsDiv.appendChild(registrationBtn);
    } else {
      card.appendChild(registrationBtn);
    }
  });
}

function extractEventId(card) {
  // Try to extract ID from various sources
  const link = card.querySelector('a[href*="event"]');
  if (link) {
    const match = link.href.match(/event=(\d+)/);
    if (match) return match[1];
  }
  
  // Generate ID from title
  const title = card.querySelector('h3, h2, .event-title');
  if (title) {
    return btoa(title.textContent.trim()).substring(0, 10);
  }
  
  return null;
}

function createRegistrationButton(eventId) {
  const btn = document.createElement('button');
  btn.className = 'btn-register';
  btn.textContent = isRegistered(eventId) ? '✓ مسجل' : '📝 سجل الآن';
  btn.disabled = isRegistered(eventId);
  
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openRegistrationModal(eventId);
  });
  
  return btn;
}

function isRegistered(eventId) {
  const registrations = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '{}');
  return registrations[eventId] !== undefined;
}

function openRegistrationModal(eventId) {
  const modalHTML = `
    <div class="modal-overlay" id="registration-modal">
      <div class="modal-dialog">
        <div class="modal-header">
          <h2>📝 التسجيل في الفعالية</h2>
          <button class="modal-close" onclick="closeRegistrationModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="registration-form">
            <div class="form-group">
              <label>الاسم الكامل *</label>
              <input type="text" id="reg-name" required/>
            </div>
            <div class="form-group">
              <label>البريد الإلكتروني *</label>
              <input type="email" id="reg-email" required/>
            </div>
            <div class="form-group">
              <label>رقم الهاتف *</label>
              <input type="tel" id="reg-phone" required/>
            </div>
            <div class="form-group">
              <label>الجامعة/الكلية</label>
              <input type="text" id="reg-university"/>
            </div>
            <div class="form-group">
              <label>ملاحظات إضافية</label>
              <textarea id="reg-notes" rows="3"></textarea>
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn-primary">تأكيد التسجيل</button>
              <button type="button" class="btn-secondary" onclick="closeRegistrationModal()">إلغاء</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  document.getElementById('registration-form').addEventListener('submit', (e) => {
    e.preventDefault();
    submitRegistration(eventId);
  });
}

function closeRegistrationModal() {
  const modal = document.getElementById('registration-modal');
  if (modal) modal.remove();
}

function submitRegistration(eventId) {
  const registration = {
    eventId,
    name: document.getElementById('reg-name').value.trim(),
    email: document.getElementById('reg-email').value.trim(),
    phone: document.getElementById('reg-phone').value.trim(),
    university: document.getElementById('reg-university').value.trim(),
    notes: document.getElementById('reg-notes').value.trim(),
    date: new Date().toISOString()
  };
  
  const registrations = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '{}');
  registrations[eventId] = registration;
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
  
  closeRegistrationModal();
  
  // Update button
  const btn = document.querySelector(`.btn-register[data-event-id="${eventId}"]`);
  if (btn) {
    btn.textContent = '✓ مسجل';
    btn.disabled = true;
  }
  
  showMessage('✅ تم تسجيلك بنجاح! سنتواصل معك قريباً.', 'success');
}

/**
 * Utility Functions
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  if (days < 7) return `منذ ${days} يوم`;
  
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function showMessage(text, type = 'info') {
  const existing = document.querySelector('.toast-message');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = `toast-message toast-${type}`;
  toast.textContent = text;
  
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Make functions globally accessible
window.closeRegistrationModal = closeRegistrationModal;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadComments,
    addComment,
    isRegistered,
    submitRegistration
  };
}
