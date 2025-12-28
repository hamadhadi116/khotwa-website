/**
 * Language Toggle System
 * Handles Arabic/English language switching using data-lang attributes
 */

// Get current language from localStorage or default to Arabic
function getCurrentLanguage() {
  return localStorage.getItem('language') || 'ar';
}

// Set language
function setLanguage(lang) {
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

// Show/hide elements based on language
function applyLanguage() {
  const currentLang = getCurrentLanguage();
  
  // Update lang toggle button
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.textContent = currentLang === 'ar' ? 'English' : 'العربية';
  }
  
  // Show/hide elements based on data-lang attribute
  document.querySelectorAll('[data-lang]').forEach(element => {
    const elementLang = element.getAttribute('data-lang');
    if (elementLang === currentLang) {
      element.style.display = '';
      element.removeAttribute('hidden');
    } else {
      element.style.display = 'none';
      element.setAttribute('hidden', '');
    }
  });
  
  // Update direction and lang attribute
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  
  // Update body class for styling
  document.body.classList.remove('lang-ar', 'lang-en');
  document.body.classList.add(`lang-${currentLang}`);
}

// Toggle language
function toggleLanguage() {
  const currentLang = getCurrentLanguage();
  const newLang = currentLang === 'ar' ? 'en' : 'ar';
  setLanguage(newLang);
  
  // Apply new language immediately
  applyLanguage();
}

// Initialize language system
function initLanguageToggle() {
  // Set initial language
  const currentLang = getCurrentLanguage();
  setLanguage(currentLang);
  
  // Apply language
  applyLanguage();
  
  // Add event listener to language toggle button
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguageToggle);
} else {
  initLanguageToggle();
}
