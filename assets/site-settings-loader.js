/**
 * Site Settings Loader
 * يحمل إعدادات الموقع من Backend ويطبقها تلقائياً
 */

(function() {
  'use strict';
  
  const BACKEND_URL = 'https://khotwabknd-gj8oeubu.manus.space';
  const CACHE_KEY = 'khotwa_site_settings';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  // تحميل الإعدادات من Cache أو Backend
  async function loadSettings() {
    try {
      // محاولة تحميل من Cache
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
      
      // تحميل من Backend
      const response = await fetch(`${BACKEND_URL}/api/trpc/settings.list`);
      if (!response.ok) throw new Error('Failed to load settings');
      
      const result = await response.json();
      const settings = result.result.data;
      
      // حفظ في Cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: settings,
        timestamp: Date.now()
      }));
      
      return settings;
    } catch (error) {
      console.warn('Failed to load site settings:', error);
      return null;
    }
  }
  
  // تطبيق الإعدادات على الموقع
  function applySettings(settings) {
    if (!settings || !Array.isArray(settings)) return;
    
    // تحويل array إلى object
    const settingsMap = {};
    settings.forEach(setting => {
      settingsMap[setting.key] = setting.value;
    });
    
    // تطبيق الألوان
    applyColors(settingsMap);
    
    // تطبيق الشعار
    applyLogo(settingsMap);
    
    // تطبيق روابط التواصل
    applySocialLinks(settingsMap);
    
    // تطبيق معلومات الاتصال
    applyContactInfo(settingsMap);
  }
  
  // تطبيق الألوان
  function applyColors(settings) {
    const root = document.documentElement;
    
    if (settings.color_primary) {
      root.style.setProperty('--primary', settings.color_primary);
    }
    
    if (settings.color_background) {
      root.style.setProperty('--bg', settings.color_background);
    }
    
    if (settings.color_text) {
      root.style.setProperty('--text', settings.color_text);
    }
    
    if (settings.color_accent) {
      root.style.setProperty('--accent', settings.color_accent);
    }
  }
  
  // تطبيق الشعار
  function applyLogo(settings) {
    if (!settings.header_logo) return;
    
    const logoElements = document.querySelectorAll('.brand img, .logo');
    logoElements.forEach(img => {
      img.src = settings.header_logo;
    });
  }
  
  // تطبيق روابط التواصل
  function applySocialLinks(settings) {
    const socialMap = {
      'social_twitter': '🐦',
      'social_instagram': '📷',
      'social_facebook': '👥',
      'social_youtube': '📺',
      'social_linkedin': '💼'
    };
    
    Object.keys(socialMap).forEach(key => {
      if (settings[key]) {
        const links = document.querySelectorAll(`a[href*="${socialMap[key]}"]`);
        links.forEach(link => {
          link.href = settings[key];
        });
      }
    });
  }
  
  // تطبيق معلومات الاتصال
  function applyContactInfo(settings) {
    // البريد الإلكتروني
    if (settings.contact_email) {
      const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
      emailLinks.forEach(link => {
        link.href = `mailto:${settings.contact_email}`;
        if (link.textContent.includes('@')) {
          link.textContent = settings.contact_email;
        }
      });
    }
    
    // رقم الهاتف
    if (settings.contact_phone) {
      const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
      phoneLinks.forEach(link => {
        link.href = `tel:${settings.contact_phone}`;
        if (link.textContent.match(/\+?\d/)) {
          link.textContent = settings.contact_phone;
        }
      });
    }
    
    // العنوان
    if (settings.contact_address) {
      const addressElements = document.querySelectorAll('[data-contact="address"]');
      addressElements.forEach(el => {
        el.textContent = settings.contact_address;
      });
    }
  }
  
  // تهيئة عند تحميل الصفحة
  document.addEventListener('DOMContentLoaded', async function() {
    const settings = await loadSettings();
    if (settings) {
      applySettings(settings);
    }
  });
  
  // تحديث الإعدادات عند العودة للصفحة
  document.addEventListener('visibilitychange', async function() {
    if (!document.hidden) {
      const settings = await loadSettings();
      if (settings) {
        applySettings(settings);
      }
    }
  });
})();
