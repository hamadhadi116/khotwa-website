/**
 * Language Toggle System
 * Handles Arabic/English language switching
 */

// Language translations for all pages
const translations = {
  // Navigation
  'من نحن': 'About Us',
  'الأخبار': 'News',
  'الفعاليات': 'Events',
  'التقويم': 'Calendar',
  'معرض الصور': 'Gallery',
  'الأسئلة الشائعة': 'FAQ',
  'الموارد': 'Resources',
  'تواصل': 'Contact',
  'قدّم للعضوية': 'Apply for Membership',
  'شاهد أقرب الفعاليات': 'View Upcoming Events',
  'المزيد': 'Read More',
  'جميع الإنجازات': 'All Achievements',
  'جميع الأخبار': 'All News',
  'تقويم الفعاليات': 'Events Calendar',
  
  // Homepage sections
  'مجلس طلاب خطوة': 'Khotwa Student Council',
  'الرؤية': 'Vision',
  'الرسالة': 'Mission',
  'الأهداف': 'Goals',
  'التنظيم': 'Organization',
  'دعم العملية التعليمية وخدمة المجتمع الجامعي.': 'Supporting the educational process and serving the university community.',
  'تمكين الطلاب وتعزيز علاقتهم بالإدارة الجامعية.': 'Empowering students and strengthening their relationship with university administration.',
  'التمثيل، القيادة، التفاعل المجتمعي، والدعوة.': 'Representation, leadership, community engagement, and advocacy.',
  'رئيس ونائب وقادة فرق ومنسقو الأنشطة والإعلام.': 'President, vice president, team leaders, and activity and media coordinators.',
  
  // Statistics
  '🏆 إنجازات وإحصائيات المجلس': '🏆 Council Achievements & Statistics',
  'خبر منشور': 'Published News',
  'فعالية منظمة': 'Organized Events',
  'تسجيل في الفعاليات': 'Event Registrations',
  'تعليق ومشاركة': 'Comments & Interactions',
  
  // Sections
  'آخر الأخبار': 'Latest News',
  'الفعاليات القادمة': 'Upcoming Events',
  
  // Footer
  'ملاحظات': 'Feedback',
  'تخطَّ إلى المحتوى': 'Skip to content',
  
  // Buttons
  'English': 'العربية',
  'العربية': 'English'
};

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

// Translate text
function translateText(text) {
  const currentLang = getCurrentLanguage();
  if (currentLang === 'en') {
    return translations[text] || text;
  }
  return text;
}

// Translate all elements with data-translate attribute
function translatePage() {
  const currentLang = getCurrentLanguage();
  
  // Update lang toggle button
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.textContent = currentLang === 'ar' ? 'English' : 'العربية';
  }
  
  // Translate all elements
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (currentLang === 'en' && translations[key]) {
      element.textContent = translations[key];
    }
  });
  
  // Update direction and lang attribute
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
}

// Toggle language
function toggleLanguage() {
  const currentLang = getCurrentLanguage();
  const newLang = currentLang === 'ar' ? 'en' : 'ar';
  setLanguage(newLang);
  
  // Reload page to apply new language
  window.location.reload();
}

// Initialize language system
function initLanguageToggle() {
  // Set initial language
  const currentLang = getCurrentLanguage();
  setLanguage(currentLang);
  
  // Translate page
  translatePage();
  
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
