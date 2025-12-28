/**
 * Comments and Event Registration System - Connected to Backend
 * نظام التعليقات والتسجيل في الفعاليات - مربوط بـ Backend
 */

// Backend API Configuration
const BACKEND_API = 'https://3000-ivtx8t5s8uaytpylv5zyf-b88825ad.manus-asia.computer/api/trpc';

// Helper Functions
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
      // tRPC expects input wrapped in json object
      url += `?input=${encodeURIComponent(JSON.stringify({ json: input }))}`;
    } else if (method === 'POST' && input) {
      // tRPC expects input wrapped in json object
      options.body = JSON.stringify({ json: input });
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (data.error) throw new Error(data.error.json?.message || data.error.message || 'حدث خطأ');
    return data.result?.data?.json || data.result?.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeCommentsSystem();
  initializeEventRegistration();
});

/**
 * Comments System - Connected to Backend
 * نظام التعليقات - مربوط بـ Backend
 */
function initializeCommentsSystem() {
  const newsId = getNewsIdFromURL();
  const eventId = getEventIdFromURL();
  
  if (newsId || eventId) {
    renderCommentsSection(newsId || eventId, newsId ? 'news' : 'event');
  }
}

function getNewsIdFromURL() {
  const match = window.location.search.match(/news=(\d+)/);
  return match ? parseInt(match[1]) : null;
}

function getEventIdFromURL() {
  const match = window.location.search.match(/event=(\d+)/);
  return match ? parseInt(match[1]) : null;
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
        <form id="comment-form" data-content-type="${type}" data-content-id="${itemId}">
          <div class="form-group">
            <input type="text" id="comment-name" placeholder="الاسم *" required/>
          </div>
          <div class="form-group">
            <input type="email" id="comment-email" placeholder="البريد الإلكتروني (اختياري)"/>
          </div>
          <div class="form-group">
            <textarea id="comment-text" rows="4" placeholder="اكتب تعليقك هنا... *" required></textarea>
          </div>
          <button type="submit" class="btn-primary" id="submit-comment-btn">إرسال التعليق</button>
        </form>
      </div>
      
      <!-- Comments List -->
      <div class="comments-list" id="comments-list">
        <div class="loading">جاري تحميل التعليقات...</div>
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', commentsHTML);
  
  // Load comments from Backend
  loadCommentsFromBackend(itemId, type);
  
  // Handle form submission
  document.getElementById('comment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addCommentToBackend(itemId, type);
  });
}

async function loadCommentsFromBackend(itemId, type) {
  const container = document.getElementById('comments-list');
  
  try {
    const comments = await apiCall('comments.list', {
      contentType: type,
      contentId: itemId
    });
    
    if (!comments || comments.length === 0) {
      container.innerHTML = '<p class="no-comments">لا توجد تعليقات بعد. كن أول من يعلق!</p>';
      return;
    }
    
    container.innerHTML = comments.map(comment => `
      <div class="comment-item">
        <div class="comment-header">
          <strong class="comment-author">${escapeHtml(comment.authorName)}</strong>
          <span class="comment-date">${formatDate(comment.createdAt)}</span>
        </div>
        <div class="comment-body">
          ${escapeHtml(comment.content)}
        </div>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = '<p class="error">حدث خطأ في تحميل التعليقات. حاول مرة أخرى.</p>';
    console.error('Error loading comments:', error);
  }
}

async function addCommentToBackend(itemId, type) {
  const name = document.getElementById('comment-name').value.trim();
  const email = document.getElementById('comment-email').value.trim();
  const text = document.getElementById('comment-text').value.trim();
  const submitBtn = document.getElementById('submit-comment-btn');
  
  if (!name || !text) {
    alert('الرجاء ملء جميع الحقول المطلوبة');
    return;
  }
  
  // Disable button during submission
  submitBtn.disabled = true;
  submitBtn.textContent = 'جاري الإرسال...';
  
  try {
    const result = await apiCall('comments.create', {
      contentType: type,
      contentId: itemId,
      authorName: name,
      authorEmail: email || null,
      content: text,
      visitorId: getVisitorId()
    }, 'POST');
    
    // Clear form
    document.getElementById('comment-form').reset();
    
    // Reload comments
    await loadCommentsFromBackend(itemId, type);
    
    // Show success message with points
    let message = 'تم إضافة تعليقك بنجاح!';
    if (result.points && result.points.pointsEarned > 0) {
      message += ` حصلت على ${result.points.pointsEarned} نقطة! 🎉`;
    }
    showMessage(message, 'success');
    
  } catch (error) {
    showMessage('حدث خطأ: ' + error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'إرسال التعليق';
  }
}

/**
 * Event Registration System - Connected to Backend
 * نظام التسجيل في الفعاليات - مربوط بـ Backend
 */
function initializeEventRegistration() {
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
  const link = card.querySelector('a[href*="event"]');
  if (link) {
    const match = link.href.match(/event=(\d+)/);
    if (match) return parseInt(match[1]);
  }
  return null;
}

function createRegistrationButton(eventId) {
  const btn = document.createElement('button');
  btn.className = 'btn-register';
  btn.dataset.eventId = eventId;
  btn.textContent = '📝 سجل الآن';
  
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openRegistrationModal(eventId);
  });
  
  return btn;
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
          <form id="registration-form" data-event-id="${eventId}">
            <div class="form-group">
              <label>الاسم الكامل *</label>
              <input type="text" id="reg-name" required/>
            </div>
            <div class="form-group">
              <label>البريد الإلكتروني *</label>
              <input type="email" id="reg-email" required/>
            </div>
            <div class="form-group">
              <label>رقم الهاتف</label>
              <input type="tel" id="reg-phone"/>
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
              <button type="submit" class="btn-primary" id="submit-reg-btn">تأكيد التسجيل</button>
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
    submitRegistrationToBackend(eventId);
  });
}

function closeRegistrationModal() {
  const modal = document.getElementById('registration-modal');
  if (modal) modal.remove();
}

async function submitRegistrationToBackend(eventId) {
  const submitBtn = document.getElementById('submit-reg-btn');
  
  const registration = {
    eventId: parseInt(eventId),
    fullName: document.getElementById('reg-name').value.trim(),
    email: document.getElementById('reg-email').value.trim(),
    phone: document.getElementById('reg-phone').value.trim() || null,
    university: document.getElementById('reg-university').value.trim() || null,
    notes: document.getElementById('reg-notes').value.trim() || null,
    visitorId: getVisitorId()
  };
  
  if (!registration.fullName || !registration.email) {
    alert('الرجاء ملء الحقول المطلوبة');
    return;
  }
  
  // Disable button during submission
  submitBtn.disabled = true;
  submitBtn.textContent = 'جاري التسجيل...';
  
  try {
    const result = await apiCall('registrations.create', registration, 'POST');
    
    closeRegistrationModal();
    
    // Update button
    const btn = document.querySelector(`.btn-register[data-event-id="${eventId}"]`);
    if (btn) {
      btn.textContent = '✓ مسجل';
      btn.disabled = true;
      btn.classList.add('registered');
    }
    
    // Show success message with points
    let message = '✅ تم تسجيلك بنجاح! سنتواصل معك قريباً.';
    if (result.points && result.points.pointsEarned > 0) {
      message += ` حصلت على ${result.points.pointsEarned} نقطة! 🎉`;
    }
    showMessage(message, 'success');
    
  } catch (error) {
    if (error.message.includes('Already registered')) {
      showMessage('أنت مسجل مسبقاً في هذه الفعالية', 'warning');
      closeRegistrationModal();
      
      // Update button
      const btn = document.querySelector(`.btn-register[data-event-id="${eventId}"]`);
      if (btn) {
        btn.textContent = '✓ مسجل مسبقاً';
        btn.disabled = true;
      }
    } else {
      showMessage('حدث خطأ: ' + error.message, 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'تأكيد التسجيل';
    }
  }
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

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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
  }, 4000);
}

// Make functions globally accessible
window.closeRegistrationModal = closeRegistrationModal;
window.loadCommentsFromBackend = loadCommentsFromBackend;
window.submitRegistrationToBackend = submitRegistrationToBackend;
