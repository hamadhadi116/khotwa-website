(function () {
  'use strict';

  class FeedbackSystem {
    constructor() {
      this.currentRating = null;
      this.init();
    }

    init() {
      this.attachEvents();
    }

    attachEvents() {
      const toggle = document.getElementById('feedback-toggle');
      const close = document.getElementById('feedback-close');
      const cancel = document.getElementById('feedback-cancel');
      const form = document.getElementById('feedback-form');
      const panel = document.getElementById('feedback-panel');

      toggle?.addEventListener('click', () => panel.hidden = !panel.hidden);
      close?.addEventListener('click', () => panel.hidden = true);
      cancel?.addEventListener('click', () => panel.hidden = true);

      document.querySelectorAll('.rating-btn').forEach(btn => {
        btn.addEventListener('click', (e) =>
          this.handleRating(btn.dataset.rating, e)
        );
      });

      form?.addEventListener('submit', (e) => this.handleSubmit(e));

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.feedback-widget') && !panel.hidden) {
          panel.hidden = true;
        }
      });
    }

    handleRating(rating, event) {
      document.querySelectorAll('.rating-btn')
        .forEach(btn => btn.classList.remove('active'));

      event.target.closest('.rating-btn').classList.add('active');
      this.currentRating = rating;
    }

    async handleSubmit(e) {
      e.preventDefault();

      const category = document.getElementById('feedback-category').value;
      const message = document.getElementById('feedback-message').value;
      const email = document.getElementById('feedback-email').value;

      const form = document.querySelector('.feedback-form');
      const success = document.getElementById('feedback-success');

      try {
        await this.sendToBackend({
          category,
          message,
          email,
          rating: this.currentRating,
          page: window.location.pathname
        });

        form.classList.add('hidden');
        success.classList.add('active');
        success.hidden = false;

        setTimeout(() => {
          form.reset();
          form.classList.remove('hidden');
          success.classList.remove('active');
          success.hidden = true;
          document.getElementById('feedback-panel').hidden = true;
        }, 3000);

      } catch (err) {
        alert('فشل إرسال الملاحظة، حاول مرة أخرى');
        console.error(err);
      }
    }

    async sendToBackend(data) {
      const subject = data.category || 'Feedback';
      const content = `${data.message}\n\nRating: ${data.rating || 'N/A'}\nPage: ${data.page}`;

      if (data.category === 'suggestion') {
        await KhotwaAPI.submitSuggestion(subject, content, null, data.email);
      } else {
        await KhotwaAPI.submitComplaint(subject, content, null, data.email);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new FeedbackSystem());
  } else {
    new FeedbackSystem();
  }
})();
