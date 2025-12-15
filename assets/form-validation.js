/**
 * Enhanced Form Validation
 * تحسين التحقق من صحة النماذج
 */

(function() {
  'use strict';

  class FormValidation {
    constructor() {
      this.init();
    }

    init() {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        if (!form.classList.contains('newsletter-form') && !form.classList.contains('feedback-form')) {
          this.enhanceForm(form);
        }
      });
    }

    enhanceForm(form) {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) {
            this.validateField(input);
          }
        });
      });

      // Form submission
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
          this.showFormError(form);
        }
      });
    }

    validateField(field) {
      const value = field.value.trim();
      let isValid = true;
      let errorMessage = '';

      // Required check
      if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'هذا الحقل مطلوب';
      }

      // Email validation
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'البريد الإلكتروني غير صحيح';
        }
      }

      // Phone validation
      if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 8) {
          isValid = false;
          errorMessage = 'رقم الهاتف غير صحيح';
        }
      }

      // Min length
      if (field.hasAttribute('minlength')) {
        const minLength = parseInt(field.getAttribute('minlength'));
        if (value.length < minLength) {
          isValid = false;
          errorMessage = `يجب أن يكون ${minLength} أحرف على الأقل`;
        }
      }

      this.showFieldError(field, isValid, errorMessage);
      return isValid;
    }

    validateForm(form) {
      const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
      let isValid = true;

      fields.forEach(field => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });

      return isValid;
    }

    showFieldError(field, isValid, message) {
      // Remove existing error
      const existingError = field.parentElement.querySelector('.field-error');
      if (existingError) {
        existingError.remove();
      }

      if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
      } else {
        field.classList.remove('valid');
        field.classList.add('error');
        
        // Add error message
        const errorEl = document.createElement('div');
        errorEl.className = 'field-error';
        errorEl.textContent = message;
        field.parentElement.appendChild(errorEl);
      }
    }

    showFormError(form) {
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new FormValidation());
  } else {
    new FormValidation();
  }

})();
