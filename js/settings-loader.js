/**
 * Khotwa Settings Loader
 * Dynamically loads and applies site settings from Backend API
 * Version: 1.0.0
 */

(function() {
  'use strict';

  const BACKEND_URL = window.KHOTWA_CONFIG?.BACKEND_URL || 'https://3000-ivtx8t5s8uaytpylv5zyf-b88825ad.manus-asia.computer';
  const CACHE_KEY = 'khotwa_settings';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Settings cache
  let settingsCache = null;
  let cacheTimestamp = null;

  /**
   * Fetch settings from Backend API
   */
  async function fetchSettings() {
    try {
      // Check cache first
      if (settingsCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
        return settingsCache;
      }

      // Try localStorage cache
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          settingsCache = data;
          cacheTimestamp = timestamp;
          return data;
        }
      }

      // Fetch from API
      const response = await fetch(`${BACKEND_URL}/api/trpc/settings.list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const settings = result.result?.data || [];

      // Convert array to object for easier access
      const settingsObj = {};
      
      // Handle both array and object responses
      if (Array.isArray(settings)) {
        settings.forEach(setting => {
          settingsObj[setting.key] = setting.value;
        });
      } else if (typeof settings === 'object' && settings !== null) {
        // If already an object, use it directly
        Object.assign(settingsObj, settings);
      }

      // Update cache
      settingsCache = settingsObj;
      cacheTimestamp = Date.now();
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: settingsObj,
        timestamp: cacheTimestamp
      }));

      return settingsObj;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Return default settings on error
      return getDefaultSettings();
    }
  }

  /**
   * Get default settings (fallback)
   */
  function getDefaultSettings() {
    return {
      // Header
      site_logo: '/images/logo.png',
      site_title_ar: 'مجلس طلاب خطوة',
      site_title_en: 'Khotwa Student Council',
      navbar_bg_color: '#ffffff',
      navbar_text_color: '#1a1a1a',
      navbar_height: '80',
      
      // Footer
      footer_text_ar: '© 2025 مجلس طلاب خطوة. جميع الحقوق محفوظة.',
      footer_text_en: '© 2025 Khotwa Student Council. All rights reserved.',
      footer_bg_color: '#1a1a1a',
      footer_text_color: '#ffffff',
      social_instagram: 'https://instagram.com/khotwa',
      social_twitter: 'https://twitter.com/khotwa',
      social_facebook: 'https://facebook.com/khotwa',
      social_youtube: 'https://youtube.com/@khotwa',
      
      // Colors
      color_primary: '#5B4FFF',
      color_secondary: '#FF0066',
      color_success: '#10B981',
      color_warning: '#F59E0B',
      color_danger: '#EF4444',
      color_info: '#3B82F6',
      
      // Typography
      font_family: 'Segoe UI, system-ui, -apple-system, Tahoma, Arial, sans-serif',
      font_size_h1: '48',
      font_size_h2: '34',
      font_size_h3: '24',
      font_size_body: '16',
      font_weight_heading: '700',
      
      // Layout
      container_max_width: '1200',
      section_spacing_desktop: '120',
      section_spacing_mobile: '80',
      border_radius_sm: '8',
      border_radius_md: '12',
      border_radius_lg: '16',
      button_padding: '16px 32px',
      card_padding: '32px',
    };
  }

  /**
   * Apply settings to the page
   */
  function applySettings(settings) {
    // Create or update style element
    let styleEl = document.getElementById('khotwa-dynamic-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'khotwa-dynamic-styles';
      document.head.appendChild(styleEl);
    }

    // Generate CSS
    const css = `
      :root {
        /* Colors */
        --color-primary: ${settings.color_primary};
        --color-secondary: ${settings.color_secondary};
        --color-success: ${settings.color_success};
        --color-warning: ${settings.color_warning};
        --color-danger: ${settings.color_danger};
        --color-info: ${settings.color_info};
        
        /* Typography */
        --font-family: ${settings.font_family};
        --font-size-h1: ${settings.font_size_h1}px;
        --font-size-h2: ${settings.font_size_h2}px;
        --font-size-h3: ${settings.font_size_h3}px;
        --font-size-body: ${settings.font_size_body}px;
        --font-weight-heading: ${settings.font_weight_heading};
        
        /* Layout */
        --container-max-width: ${settings.container_max_width}px;
        --section-spacing-desktop: ${settings.section_spacing_desktop}px;
        --section-spacing-mobile: ${settings.section_spacing_mobile}px;
        --border-radius-sm: ${settings.border_radius_sm}px;
        --border-radius-md: ${settings.border_radius_md}px;
        --border-radius-lg: ${settings.border_radius_lg}px;
        --button-padding: ${settings.button_padding};
        --card-padding: ${settings.card_padding};
        
        /* Header */
        --navbar-bg-color: ${settings.navbar_bg_color};
        --navbar-text-color: ${settings.navbar_text_color};
        --navbar-height: ${settings.navbar_height}px;
        
        /* Footer */
        --footer-bg-color: ${settings.footer_bg_color};
        --footer-text-color: ${settings.footer_text_color};
      }
      
      /* Apply typography */
      body {
        font-family: var(--font-family);
        font-size: var(--font-size-body);
      }
      
      h1 {
        font-size: var(--font-size-h1);
        font-weight: var(--font-weight-heading);
      }
      
      h2 {
        font-size: var(--font-size-h2);
        font-weight: var(--font-weight-heading);
      }
      
      h3 {
        font-size: var(--font-size-h3);
        font-weight: var(--font-weight-heading);
      }
      
      /* Apply layout */
      .container {
        max-width: var(--container-max-width);
      }
      
      section {
        padding-top: var(--section-spacing-desktop);
        padding-bottom: var(--section-spacing-desktop);
      }
      
      @media (max-width: 768px) {
        section {
          padding-top: var(--section-spacing-mobile);
          padding-bottom: var(--section-spacing-mobile);
        }
        
        h1 {
          font-size: calc(var(--font-size-h1) * 0.75);
        }
        
        h2 {
          font-size: calc(var(--font-size-h2) * 0.75);
        }
      }
      
      /* Apply colors */
      .btn-primary {
        background-color: var(--color-primary);
        padding: var(--button-padding);
        border-radius: var(--border-radius-sm);
      }
      
      .btn-secondary {
        background-color: var(--color-secondary);
        padding: var(--button-padding);
        border-radius: var(--border-radius-sm);
      }
      
      .card {
        padding: var(--card-padding);
        border-radius: var(--border-radius-lg);
      }
      
      /* Apply header styles */
      header, .navbar {
        background-color: var(--navbar-bg-color) !important;
        color: var(--navbar-text-color) !important;
        height: var(--navbar-height);
      }
      
      header a, .navbar a {
        color: var(--navbar-text-color) !important;
      }
      
      /* Apply footer styles */
      footer {
        background-color: var(--footer-bg-color) !important;
        color: var(--footer-text-color) !important;
      }
      
      footer a {
        color: var(--footer-text-color) !important;
      }
    `;

    styleEl.textContent = css;

    // Update site title
    const lang = document.documentElement.lang || 'ar';
    const titleKey = lang === 'ar' ? 'site_title_ar' : 'site_title_en';
    if (settings[titleKey]) {
      document.title = settings[titleKey];
    }

    // Update footer text
    const footerTextKey = lang === 'ar' ? 'footer_text_ar' : 'footer_text_en';
    const footerEl = document.querySelector('footer .copyright, footer p');
    if (footerEl && settings[footerTextKey]) {
      footerEl.textContent = settings[footerTextKey];
    }

    // Update social media links
    updateSocialLinks(settings);
  }

  /**
   * Update social media links
   */
  function updateSocialLinks(settings) {
    const socialLinks = {
      instagram: settings.social_instagram,
      twitter: settings.social_twitter,
      facebook: settings.social_facebook,
      youtube: settings.social_youtube,
    };

    Object.entries(socialLinks).forEach(([platform, url]) => {
      if (url) {
        const link = document.querySelector(`a[href*="${platform}"]`);
        if (link) {
          link.href = url;
        }
      }
    });
  }

  /**
   * Initialize settings loader
   */
  async function init() {
    try {
      const settings = await fetchSettings();
      applySettings(settings);
      
      // Expose settings globally
      window.KhotwaSettings = settings;
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('khotwa:settings-loaded', {
        detail: settings
      }));
    } catch (error) {
      console.error('Failed to initialize settings:', error);
    }
  }

  /**
   * Public API
   */
  window.KhotwaSettingsLoader = {
    init,
    fetchSettings,
    applySettings,
    clearCache: function() {
      settingsCache = null;
      cacheTimestamp = null;
      localStorage.removeItem(CACHE_KEY);
    },
    get: function(key) {
      return settingsCache ? settingsCache[key] : null;
    },
  };

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
