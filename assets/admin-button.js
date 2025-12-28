/**
 * Admin Panel Button
 * Adds admin panel access button to navbar
 * Khotwa Student Council Website
 */

(function() {
  'use strict';

  // Admin panel URL
  const ADMIN_URL = 'https://3000-ivtx8t5s8uaytpylv5zyf-b88825ad.manus-asia.computer/admin';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Find nav-links container
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) {
      console.warn('Nav links container not found');
      return;
    }

    // Find lang-toggle button (we'll insert before it)
    const langToggle = document.getElementById('lang-toggle');
    if (!langToggle) {
      console.warn('Lang toggle button not found');
      return;
    }

    // Create admin button
    const adminBtn = document.createElement('a');
    adminBtn.href = ADMIN_URL;
    adminBtn.target = '_blank';
    adminBtn.rel = 'noopener noreferrer';
    adminBtn.className = 'admin-panel-btn';
    adminBtn.setAttribute('aria-label', 'لوحة الإدارة');
    adminBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
      </svg>
      <span data-lang="ar">لوحة الإدارة</span>
      <span data-lang="en" hidden aria-hidden="true">Admin Panel</span>
    `;

    // Insert before lang-toggle
    navLinks.insertBefore(adminBtn, langToggle);

    // Add CSS
    const style = document.createElement('style');
    style.textContent = `
      .admin-panel-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        border-radius: 8px;
        background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
        color: white !important;
        font-weight: 600;
        font-size: 14px;
        text-decoration: none;
        transition: all 0.2s ease;
        border: none;
      }

      .admin-panel-btn:hover {
        background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
      }

      .admin-panel-btn:active {
        transform: translateY(0);
      }

      .admin-panel-btn svg {
        width: 18px;
        height: 18px;
      }

      @media (max-width: 960px) {
        .admin-panel-btn {
          width: 100%;
          justify-content: center;
          padding: 10px 14px;
        }
      }

      /* Adjust nav-links spacing */
      .nav-links {
        gap: 1rem;
      }

      @media (max-width: 960px) {
        .nav-links {
          gap: 0.5rem;
        }
      }
    `;
    document.head.appendChild(style);
  }
})();
