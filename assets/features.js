/**
 * Khotwa Student Council - Enhanced Features
 * الميزات المحسّنة لموقع مجلس طلاب خطوة
 */

(function() {
  'use strict';

  // ========== 1. نظام المشاركة على وسائل التواصل ==========
  
  /**
   * إنشاء أزرار المشاركة
   */
  function createShareButtons(title, url, description) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description || title);
    
    return `
      <div class="share-buttons" role="group" aria-label="مشاركة على وسائل التواصل">
        <button class="share-btn share-twitter" data-platform="twitter" 
                data-url="https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}"
                title="مشاركة على Twitter">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
          </svg>
          <span data-lang="ar">تويتر</span>
          <span data-lang="en" hidden>Twitter</span>
        </button>
        
        <button class="share-btn share-facebook" data-platform="facebook"
                data-url="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}"
                title="مشاركة على Facebook">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
          </svg>
          <span data-lang="ar">فيسبوك</span>
          <span data-lang="en" hidden>Facebook</span>
        </button>
        
        <button class="share-btn share-whatsapp" data-platform="whatsapp"
                data-url="https://wa.me/?text=${encodedTitle}%20${encodedUrl}"
                title="مشاركة على WhatsApp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span data-lang="ar">واتساب</span>
          <span data-lang="en" hidden>WhatsApp</span>
        </button>
        
        <button class="share-btn share-copy" data-platform="copy" title="نسخ الرابط">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          <span data-lang="ar">نسخ</span>
          <span data-lang="en" hidden>Copy</span>
        </button>
      </div>
    `;
  }

  /**
   * تفعيل أزرار المشاركة
   */
  function initShareButtons() {
    document.addEventListener('click', function(e) {
      const shareBtn = e.target.closest('.share-btn');
      if (!shareBtn) return;
      
      const platform = shareBtn.dataset.platform;
      const url = shareBtn.dataset.url;
      
      if (platform === 'copy') {
        // نسخ الرابط
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
          const originalText = shareBtn.innerHTML;
          shareBtn.innerHTML = '<span>✓ تم النسخ</span>';
          setTimeout(() => {
            shareBtn.innerHTML = originalText;
          }, 2000);
        });
      } else {
        // فتح نافذة المشاركة
        window.open(url, '_blank', 'width=600,height=400');
      }
    });
  }

  // ========== 2. نظام البحث المتقدم ==========
  
  /**
   * تفعيل نظام البحث
   */
  function initSearch() {
    const searchInput = document.getElementById('q');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function(e) {
      const query = e.target.value.toLowerCase().trim();
      const items = document.querySelectorAll('[data-searchable]');
      
      if (!query) {
        items.forEach(item => {
          item.style.display = '';
          item.classList.remove('search-highlight');
        });
        return;
      }
      
      let visibleCount = 0;
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const isMatch = text.includes(query);
        
        item.style.display = isMatch ? '' : 'none';
        if (isMatch) {
          item.classList.add('search-highlight');
          visibleCount++;
        } else {
          item.classList.remove('search-highlight');
        }
      });
      
      // عرض رسالة إذا لم يتم العثور على نتائج
      updateSearchResults(visibleCount);
    }, 300));
  }

  /**
   * تحديث نتائج البحث
   */
  function updateSearchResults(count) {
    let resultsMsg = document.getElementById('search-results-msg');
    if (!resultsMsg) {
      resultsMsg = document.createElement('div');
      resultsMsg.id = 'search-results-msg';
      resultsMsg.className = 'search-results-msg';
      const searchInput = document.getElementById('q');
      if (searchInput) {
        searchInput.parentNode.insertBefore(resultsMsg, searchInput.nextSibling);
      }
    }
    
    if (count === 0) {
      resultsMsg.innerHTML = '<p class="muted">لم يتم العثور على نتائج</p>';
      resultsMsg.style.display = 'block';
    } else {
      resultsMsg.style.display = 'none';
    }
  }

  // ========== 3. نظام الإشعارات للفعاليات ==========
  
  /**
   * التحقق من الفعاليات القادمة
   */
  async function checkUpcomingEvents() {
    try {
      const response = await fetch('/data/events.json');
      const data = await response.json();
      const now = new Date();
      const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
      
      const upcomingEvents = data.items.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate > now && eventDate <= threeDaysFromNow;
      });
      
      if (upcomingEvents.length > 0 && !localStorage.getItem('events_notified')) {
        showNotification(upcomingEvents);
      }
    } catch (error) {
      console.error('Error checking events:', error);
    }
  }

  /**
   * عرض إشعار الفعاليات
   */
  function showNotification(events) {
    const notification = document.createElement('div');
    notification.className = 'event-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <button class="notification-close" aria-label="إغلاق">×</button>
        <h3>🎉 فعاليات قادمة!</h3>
        <p>لديك ${events.length} فعالية قادمة في الأيام القادمة</p>
        <a href="/events.html" class="btn btn-primary btn-sm">عرض الفعاليات</a>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // إغلاق الإشعار
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
      localStorage.setItem('events_notified', Date.now());
    });
    
    // إغلاق تلقائي بعد 10 ثواني
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }

  // ========== 4. تكامل مع Google Calendar ==========
  
  /**
   * إضافة حدث إلى Google Calendar
   */
  function addToGoogleCalendar(event) {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // مدة ساعتين افتراضية
    
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title || event.title_ar,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: event.summary || event.body || '',
      location: event.location || event.location_ar || '',
      sf: 'true',
      output: 'xml'
    });
    
    const url = `https://calendar.google.com/calendar/render?${params.toString()}`;
    window.open(url, '_blank');
  }

  /**
   * إنشاء زر إضافة إلى التقويم
   */
  function createCalendarButton(event) {
    return `
      <button class="btn btn-outline btn-sm add-to-calendar" 
              data-event='${JSON.stringify(event)}'
              title="إضافة إلى Google Calendar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span data-lang="ar">إضافة للتقويم</span>
        <span data-lang="en" hidden>Add to Calendar</span>
      </button>
    `;
  }

  /**
   * تفعيل أزرار التقويم
   */
  function initCalendarButtons() {
    document.addEventListener('click', function(e) {
      const calendarBtn = e.target.closest('.add-to-calendar');
      if (!calendarBtn) return;
      
      try {
        const eventData = JSON.parse(calendarBtn.dataset.event);
        addToGoogleCalendar(eventData);
      } catch (error) {
        console.error('Error adding to calendar:', error);
      }
    });
  }

  // ========== Utility Functions ==========
  
  /**
   * Debounce function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ========== التهيئة ==========
  
  /**
   * تهيئة جميع الميزات عند تحميل الصفحة
   */
  function init() {
    initShareButtons();
    initSearch();
    initCalendarButtons();
    
    // التحقق من الفعاليات القادمة (مرة واحدة يومياً)
    const lastCheck = localStorage.getItem('events_notified');
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    if (!lastCheck || parseInt(lastCheck) < oneDayAgo) {
      checkUpcomingEvents();
    }
  }

  // تشغيل التهيئة عند تحميل الصفحة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // تصدير الدوال للاستخدام الخارجي
  window.KhotwaFeatures = {
    createShareButtons,
    createCalendarButton,
    addToGoogleCalendar,
    checkUpcomingEvents
  };

})();
