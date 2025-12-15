/**
 * Newsletter Subscription System
 * نظام الاشتراك في النشرة البريدية
 */

(function() {
  'use strict';

  class Newsletter {
    constructor() {
      this.init();
    }

    init() {
      this.attachEventListeners();
    }

    attachEventListeners() {
      const forms = document.querySelectorAll('.newsletter-form');
      forms.forEach(form => {
        form.addEventListener('submit', (e) => this.handleSubmit(e));
      });
    }

    async handleSubmit(e) {
      e.preventDefault();
      
      const form = e.target;
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput.value;
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Validate email
      if (!this.validateEmail(email)) {
        this.showMessage(form, 'error', 'البريد الإلكتروني غير صحيح');
        return;
      }

      // Show loading
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span data-lang="ar">جاري الإرسال...</span><span data-lang="en" hidden>Sending...</span>';

      // Save to localStorage (في حالة موقع static)
      this.saveSubscription(email);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success
      this.showMessage(form, 'success', 'تم الاشتراك بنجاح! شكراً لك.');
      form.reset();

      // Reset button
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 2000);
    }

    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    saveSubscription(email) {
      const subscriptions = JSON.parse(localStorage.getItem('khotwa_newsletter') || '[]');
      if (!subscriptions.includes(email)) {
        subscriptions.push({
          email,
          date: new Date().toISOString(),
          page: window.location.pathname
        });
        localStorage.setItem('khotwa_newsletter', JSON.stringify(subscriptions));
        console.log('Newsletter subscription saved:', email);
      }
    }

    showMessage(form, type, message) {
      let messageEl = form.querySelector('.newsletter-message');
      if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.className = 'newsletter-message';
        form.appendChild(messageEl);
      }

      messageEl.className = `newsletter-message newsletter-${type}`;
      messageEl.textContent = message;
      messageEl.hidden = false;

      setTimeout(() => {
        messageEl.hidden = true;
      }, 5000);
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Newsletter());
  } else {
    new Newsletter();
  }

})();
