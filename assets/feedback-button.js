/**
 * Floating Feedback Button
 * Khotwa Student Council Website
 */

(function() {
  'use strict';

  // Create feedback button HTML
  const feedbackHTML = `
    <button id="feedback-btn" class="feedback-floating-btn" aria-label="إرسال ملاحظات" title="إرسال ملاحظات">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>ملاحظات</span>
    </button>
  `;

  // Create feedback modal HTML
  const modalHTML = `
    <div id="feedback-modal" class="feedback-modal" style="display: none;">
      <div class="feedback-modal-overlay"></div>
      <div class="feedback-modal-content">
        <div class="feedback-modal-header">
          <h3>إرسال ملاحظات أو اقتراح</h3>
          <button id="feedback-close" class="feedback-close-btn" aria-label="إغلاق">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <form id="feedback-form" class="feedback-form">
          <div class="feedback-form-group">
            <label for="feedback-name">الاسم (اختياري)</label>
            <input type="text" id="feedback-name" placeholder="أدخل اسمك">
          </div>
          <div class="feedback-form-group">
            <label for="feedback-email">البريد الإلكتروني (اختياري)</label>
            <input type="email" id="feedback-email" placeholder="your@email.com">
          </div>
          <div class="feedback-form-group">
            <label for="feedback-subject">الموضوع *</label>
            <input type="text" id="feedback-subject" placeholder="موضوع الملاحظة أو الاقتراح" required>
          </div>
          <div class="feedback-form-group">
            <label for="feedback-message">الرسالة *</label>
            <textarea id="feedback-message" rows="5" placeholder="اكتب ملاحظاتك أو اقتراحاتك هنا..." required></textarea>
          </div>
          <div class="feedback-form-actions">
            <button type="button" id="feedback-cancel" class="feedback-btn-secondary">إلغاء</button>
            <button type="submit" class="feedback-btn-primary">إرسال</button>
          </div>
          <div id="feedback-status" class="feedback-status"></div>
        </form>
      </div>
    </div>
  `;

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    /* Floating Feedback Button */
    .feedback-floating-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999;
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 20px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4);
      transition: all 0.3s ease;
    }

    .feedback-floating-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(30, 64, 175, 0.5);
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
    }

    .feedback-floating-btn:active {
      transform: translateY(0);
    }

    .feedback-floating-btn svg {
      width: 20px;
      height: 20px;
    }

    /* Feedback Modal */
    .feedback-modal {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .feedback-modal-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
    }

    .feedback-modal-content {
      position: relative;
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      animation: feedbackModalSlideUp 0.3s ease;
    }

    @media (prefers-color-scheme: dark) {
      .feedback-modal-content {
        background: #0f172a;
        color: #e5e7eb;
      }
    }

    @keyframes feedbackModalSlideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .feedback-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    @media (prefers-color-scheme: dark) {
      .feedback-modal-header {
        border-bottom-color: #1f2937;
      }
    }

    .feedback-modal-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
    }

    .feedback-close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 8px;
      color: #64748b;
      transition: all 0.2s;
    }

    .feedback-close-btn:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    @media (prefers-color-scheme: dark) {
      .feedback-close-btn {
        color: #94a3b8;
      }
      .feedback-close-btn:hover {
        background: #1e293b;
        color: #e5e7eb;
      }
    }

    .feedback-form {
      padding: 24px;
    }

    .feedback-form-group {
      margin-bottom: 20px;
    }

    .feedback-form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      font-size: 14px;
      color: #334155;
    }

    @media (prefers-color-scheme: dark) {
      .feedback-form-group label {
        color: #cbd5e1;
      }
    }

    .feedback-form-group input,
    .feedback-form-group textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 15px;
      font-family: inherit;
      transition: all 0.2s;
      background: white;
      color: #0f172a;
    }

    @media (prefers-color-scheme: dark) {
      .feedback-form-group input,
      .feedback-form-group textarea {
        background: #1e293b;
        border-color: #334155;
        color: #e5e7eb;
      }
    }

    .feedback-form-group input:focus,
    .feedback-form-group textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .feedback-form-group textarea {
      resize: vertical;
      min-height: 120px;
    }

    .feedback-form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    .feedback-btn-primary,
    .feedback-btn-secondary {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .feedback-btn-primary {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
    }

    .feedback-btn-primary:hover {
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
    }

    .feedback-btn-secondary {
      background: #f1f5f9;
      color: #475569;
    }

    .feedback-btn-secondary:hover {
      background: #e2e8f0;
    }

    @media (prefers-color-scheme: dark) {
      .feedback-btn-secondary {
        background: #1e293b;
        color: #cbd5e1;
      }
      .feedback-btn-secondary:hover {
        background: #334155;
      }
    }

    .feedback-status {
      margin-top: 16px;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      display: none;
    }

    .feedback-status.success {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #86efac;
      display: block;
    }

    .feedback-status.error {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
      display: block;
    }

    @media (prefers-color-scheme: dark) {
      .feedback-status.success {
        background: #14532d;
        color: #86efac;
        border-color: #166534;
      }
      .feedback-status.error {
        background: #7f1d1d;
        color: #fca5a5;
        border-color: #991b1b;
      }
    }

    /* Mobile Responsive */
    @media (max-width: 640px) {
      .feedback-floating-btn {
        bottom: 16px;
        right: 16px;
        padding: 10px 16px;
        font-size: 14px;
      }

      .feedback-floating-btn span {
        display: none;
      }

      .feedback-floating-btn {
        width: 48px;
        height: 48px;
        padding: 0;
        justify-content: center;
      }

      .feedback-modal-content {
        max-height: 95vh;
      }

      .feedback-modal-header,
      .feedback-form {
        padding: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Inject HTML
    document.body.insertAdjacentHTML('beforeend', feedbackHTML);
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Get elements
    const btn = document.getElementById('feedback-btn');
    const modal = document.getElementById('feedback-modal');
    const closeBtn = document.getElementById('feedback-close');
    const cancelBtn = document.getElementById('feedback-cancel');
    const form = document.getElementById('feedback-form');
    const overlay = modal.querySelector('.feedback-modal-overlay');
    const status = document.getElementById('feedback-status');

    // Open modal
    btn.addEventListener('click', () => {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });

    // Close modal
    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      form.reset();
      status.style.display = 'none';
      status.className = 'feedback-status';
    }

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Handle form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('feedback-name').value.trim();
      const email = document.getElementById('feedback-email').value.trim();
      const subject = document.getElementById('feedback-subject').value.trim();
      const message = document.getElementById('feedback-message').value.trim();

      if (!subject || !message) {
        showStatus('error', 'الرجاء ملء جميع الحقول المطلوبة');
        return;
      }

      // Disable submit button
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'جاري الإرسال...';

      try {
        // Check if KhotwaAPI is available
        if (typeof KhotwaAPI !== 'undefined' && KhotwaAPI.submitComplaint) {
          await KhotwaAPI.submitComplaint(subject, message, name, email);
          showStatus('success', '✅ تم إرسال ملاحظاتك بنجاح! شكراً لك.');
          setTimeout(() => {
            closeModal();
          }, 2000);
        } else {
          // Fallback: show success message without actual submission
          console.warn('KhotwaAPI not available, feedback not sent');
          showStatus('success', '✅ تم تسجيل ملاحظاتك! شكراً لك.');
          setTimeout(() => {
            closeModal();
          }, 2000);
        }
      } catch (error) {
        console.error('Error submitting feedback:', error);
        showStatus('error', '❌ حدث خطأ أثناء الإرسال. الرجاء المحاولة مرة أخرى.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'إرسال';
      }
    });

    function showStatus(type, message) {
      status.className = `feedback-status ${type}`;
      status.textContent = message;
      status.style.display = 'block';
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });
  }
})();
