/**
 * Feedback System for Khotwa Website
 * نظام التعليقات وردود الفعل
 */

(function() {
  'use strict';

  class FeedbackSystem {
    constructor() {
      this.init();
    }

    init() {
      this.createFeedbackWidget();
      this.loadSavedFeedback();
    }

    createFeedbackWidget() {
      const widgetHTML = `
        <div class="feedback-widget" id="feedback-widget">
          <button class="feedback-toggle" id="feedback-toggle" aria-label="إرسال ملاحظات">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span data-lang="ar">ملاحظاتك</span>
            <span data-lang="en" hidden>Feedback</span>
          </button>

          <div class="feedback-panel" id="feedback-panel" hidden>
            <div class="feedback-header">
              <h3>
                <span data-lang="ar">شاركنا رأيك</span>
                <span data-lang="en" hidden>Share Your Feedback</span>
              </h3>
              <button class="feedback-close" id="feedback-close" aria-label="إغلاق">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="feedback-body">
              <!-- Quick Rating -->
              <div class="feedback-rating">
                <p class="feedback-question">
                  <span data-lang="ar">كيف تقيّم تجربتك مع الموقع؟</span>
                  <span data-lang="en" hidden>How would you rate your experience?</span>
                </p>
                <div class="rating-buttons">
                  <button class="rating-btn" data-rating="excellent" title="ممتاز">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                    <span data-lang="ar">ممتاز</span>
                    <span data-lang="en" hidden>Excellent</span>
                  </button>
                  <button class="rating-btn" data-rating="good" title="جيد">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><path d="M8 15h8"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                    <span data-lang="ar">جيد</span>
                    <span data-lang="en" hidden>Good</span>
                  </button>
                  <button class="rating-btn" data-rating="poor" title="يحتاج تحسين">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                    <span data-lang="ar">يحتاج تحسين</span>
                    <span data-lang="en" hidden>Needs Improvement</span>
                  </button>
                </div>
              </div>

              <!-- Feedback Form -->
              <form class="feedback-form" id="feedback-form">
                <div class="form-group">
                  <label for="feedback-category">
                    <span data-lang="ar">نوع الملاحظة</span>
                    <span data-lang="en" hidden>Category</span>
                  </label>
                  <select id="feedback-category" required>
                    <option value="">-- اختر --</option>
                    <option value="bug" data-lang-ar="مشكلة تقنية" data-lang-en="Bug Report">مشكلة تقنية</option>
                    <option value="suggestion" data-lang-ar="اقتراح" data-lang-en="Suggestion">اقتراح</option>
                    <option value="content" data-lang-ar="محتوى" data-lang-en="Content">محتوى</option>
                    <option value="other" data-lang-ar="أخرى" data-lang-en="Other">أخرى</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="feedback-message">
                    <span data-lang="ar">رسالتك</span>
                    <span data-lang="en" hidden>Your Message</span>
                  </label>
                  <textarea id="feedback-message" rows="4" required 
                            placeholder="شاركنا ملاحظاتك أو اقتراحاتك..."></textarea>
                </div>

                <div class="form-group">
                  <label for="feedback-email">
                    <span data-lang="ar">البريد الإلكتروني (اختياري)</span>
                    <span data-lang="en" hidden>Email (Optional)</span>
                  </label>
                  <input type="email" id="feedback-email" placeholder="email@example.com">
                </div>

                <div class="feedback-actions">
                  <button type="submit" class="btn-submit">
                    <span data-lang="ar">إرسال</span>
                    <span data-lang="en" hidden>Submit</span>
                  </button>
                  <button type="button" class="btn-cancel" id="feedback-cancel">
                    <span data-lang="ar">إلغاء</span>
                    <span data-lang="en" hidden>Cancel</span>
                  </button>
                </div>
              </form>

              <!-- Success Message -->
              <div class="feedback-success" id="feedback-success" hidden>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h4 data-lang="ar">شكراً لك!</h4>
                <h4 data-lang="en" hidden>Thank You!</h4>
                <p data-lang="ar">تم استلام ملاحظاتك بنجاح. نقدر وقتك واهتمامك.</p>
                <p data-lang="en" hidden>Your feedback has been received. We appreciate your time.</p>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', widgetHTML);
      this.attachEventListeners();
    }

    attachEventListeners() {
      const toggle = document.getElementById('feedback-toggle');
      const close = document.getElementById('feedback-close');
      const cancel = document.getElementById('feedback-cancel');
      const form = document.getElementById('feedback-form');
      const panel = document.getElementById('feedback-panel');
      const ratingButtons = document.querySelectorAll('.rating-btn');

      toggle?.addEventListener('click', () => this.togglePanel());
      close?.addEventListener('click', () => this.closePanel());
      cancel?.addEventListener('click', () => this.closePanel());
      form?.addEventListener('submit', (e) => this.handleSubmit(e));

      ratingButtons.forEach(btn => {
        btn.addEventListener('click', () => this.handleRating(btn.dataset.rating));
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.feedback-widget')) {
          if (!panel.hidden) {
            this.closePanel();
          }
        }
      });
    }

    togglePanel() {
      const panel = document.getElementById('feedback-panel');
      panel.hidden = !panel.hidden;
    }

    closePanel() {
      const panel = document.getElementById('feedback-panel');
      panel.hidden = true;
    }

    handleRating(rating) {
      const buttons = document.querySelectorAll('.rating-btn');
      buttons.forEach(btn => btn.classList.remove('active'));
      event.target.closest('.rating-btn').classList.add('active');

      // Save rating
      this.saveFeedback({ type: 'rating', value: rating, date: new Date().toISOString() });
    }

    async handleSubmit(e) {
      e.preventDefault();

      const category = document.getElementById('feedback-category').value;
      const message = document.getElementById('feedback-message').value;
      const email = document.getElementById('feedback-email').value;

      const feedback = {
        type: 'message',
        category,
        message,
        email,
        page: window.location.pathname,
        date: new Date().toISOString()
      };

      // Save feedback
      this.saveFeedback(feedback);

      // Show success message
      document.querySelector('.feedback-form').hidden = true;
      document.getElementById('feedback-success').hidden = false;

      // Reset form after 3 seconds
      setTimeout(() => {
        document.querySelector('.feedback-form').hidden = false;
        document.getElementById('feedback-success').hidden = true;
        document.getElementById('feedback-form').reset();
        this.closePanel();
      }, 3000);
    }

    async saveFeedback(feedback) {
      // Save to localStorage as backup
      const saved = JSON.parse(localStorage.getItem('khotwa_feedback') || '[]');
      saved.push(feedback);
      localStorage.setItem('khotwa_feedback', JSON.stringify(saved));
      
      // Send to Backend API
      try {
        const BACKEND_API = 'https://khotwa-backend.manus.space/api/trpc';
        const response = await fetch(`${BACKEND_API}/complaints.create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: feedback.category === 'suggestion' ? 'suggestion' : 'complaint',
            name: null,
            email: feedback.email || null,
            subject: feedback.category || 'ملاحظة',
            content: feedback.message || feedback.value || ''
          })
        });
        const data = await response.json();
        console.log('Feedback sent to backend:', data);
      } catch (error) {
        console.error('Error sending feedback to backend:', error);
      }
    }

    loadSavedFeedback() {
      const saved = JSON.parse(localStorage.getItem('khotwa_feedback') || '[]');
      console.log(`Loaded ${saved.length} feedback items`);
      return saved;
    }
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new FeedbackSystem());
  } else {
    new FeedbackSystem();
  }

})();
