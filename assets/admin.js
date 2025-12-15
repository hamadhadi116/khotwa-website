/**
 * Admin Panel JavaScript
 * نظام إدارة المحتوى لموقع مجلس طلاب خطوة
 */

// Configuration
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'khotwa2025'
};

const STORAGE_KEYS = {
  NEWS: 'khotwa_news',
  EVENTS: 'khotwa_events',
  GALLERY: 'khotwa_gallery',
  AUTH: 'khotwa_admin_auth'
};

// State
let currentTab = 'news';
let editingItem = null;
let editingType = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initializeEventListeners();
  loadDataFromJSON();
});

// Authentication
function checkAuth() {
  const isAuthenticated = localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  
  if (isAuthenticated) {
    showAdminPanel();
  } else {
    showLoginScreen();
  }
}

function showLoginScreen() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-panel').style.display = 'none';
}

function showAdminPanel() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
  loadData();
}

function login(username, password) {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    showAdminPanel();
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
  showLoginScreen();
}

// Event Listeners
function initializeEventListeners() {
  // Login form
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (login(username, password)) {
      document.getElementById('login-error').textContent = '';
    } else {
      document.getElementById('login-error').textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
    }
  });
  
  // Logout button
  document.getElementById('logout-btn').addEventListener('click', logout);
  
  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });
  
  // Add buttons
  document.getElementById('add-news-btn').addEventListener('click', () => openModal('news', 'add'));
  document.getElementById('add-event-btn').addEventListener('click', () => openModal('event', 'add'));
  document.getElementById('add-image-btn').addEventListener('click', () => openModal('image', 'add'));
  
  // Export buttons
  document.getElementById('export-news-btn').addEventListener('click', () => exportData('news'));
  document.getElementById('export-events-btn').addEventListener('click', () => exportData('events'));
  document.getElementById('export-all-btn').addEventListener('click', exportAll);
  
  // Import button
  document.getElementById('import-btn').addEventListener('click', () => {
    document.getElementById('import-file').click();
  });
  
  document.getElementById('import-file').addEventListener('change', importData);
  
  // Reset button
  document.getElementById('reset-btn').addEventListener('click', resetData);
  
  // Modal
  document.querySelector('.close').addEventListener('click', closeModal);
  document.querySelector('.cancel-btn').addEventListener('click', closeModal);
  document.getElementById('modal-form').addEventListener('submit', handleFormSubmit);
  
  // Close modal on outside click
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Tab Switching
function switchTab(tab) {
  currentTab = tab;
  
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `tab-${tab}`);
  });
  
  loadData();
}

// Data Management
function loadDataFromJSON() {
  // Load from JSON files if localStorage is empty
  if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
    fetch('/data/news.json')
      .then(res => res.json())
      .then(data => {
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(data));
      })
      .catch(err => console.error('Error loading news:', err));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    fetch('/data/events.json')
      .then(res => res.json())
      .then(data => {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(data));
      })
      .catch(err => console.error('Error loading events:', err));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
    // Initialize with default gallery item
    const defaultGallery = [
      {
        id: 1,
        title: 'لقاء التعارف الأسبوعي',
        image: '/assets/img/khotwa-hero.jpg',
        date: '2025-12-01'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(defaultGallery));
  }
}

function loadData() {
  switch(currentTab) {
    case 'news':
      loadNews();
      break;
    case 'events':
      loadEvents();
      break;
    case 'gallery':
      loadGallery();
      break;
  }
}

function loadNews() {
  const news = JSON.parse(localStorage.getItem(STORAGE_KEYS.NEWS) || '[]');
  const container = document.getElementById('news-list');
  
  if (news.length === 0) {
    container.innerHTML = '<div class="empty-state"><h3>لا توجد أخبار</h3><p>ابدأ بإضافة خبر جديد</p></div>';
    return;
  }
  
  container.innerHTML = news.map(item => `
    <div class="item-card">
      <div class="item-info">
        <h3>${item.title}</h3>
        <p><strong>التاريخ:</strong> ${item.date}</p>
        <p><strong>الفئة:</strong> ${item.category}</p>
        <p>${item.summary}</p>
      </div>
      <div class="item-actions">
        <button class="btn-edit" onclick="editItem('news', ${item.id})">تعديل</button>
        <button class="btn-delete" onclick="deleteItem('news', ${item.id})">حذف</button>
      </div>
    </div>
  `).join('');
}

function loadEvents() {
  const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  const container = document.getElementById('events-list');
  
  if (events.length === 0) {
    container.innerHTML = '<div class="empty-state"><h3>لا توجد فعاليات</h3><p>ابدأ بإضافة فعالية جديدة</p></div>';
    return;
  }
  
  container.innerHTML = events.map(item => `
    <div class="item-card">
      <div class="item-info">
        <h3>${item.title}</h3>
        <p><strong>التاريخ:</strong> ${item.date}</p>
        <p><strong>المكان:</strong> ${item.location}</p>
        <p>${item.description}</p>
      </div>
      <div class="item-actions">
        <button class="btn-edit" onclick="editItem('event', ${item.id})">تعديل</button>
        <button class="btn-delete" onclick="deleteItem('event', ${item.id})">حذف</button>
      </div>
    </div>
  `).join('');
}

function loadGallery() {
  const gallery = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || '[]');
  const container = document.getElementById('gallery-list');
  
  if (gallery.length === 0) {
    container.innerHTML = '<div class="empty-state"><h3>لا توجد صور</h3><p>ابدأ بإضافة صورة جديدة</p></div>';
    return;
  }
  
  container.innerHTML = gallery.map(item => `
    <div class="item-card">
      <div class="item-info">
        <h3>${item.title}</h3>
        <p><strong>التاريخ:</strong> ${item.date}</p>
        <p><strong>الصورة:</strong> ${item.image}</p>
      </div>
      <div class="item-actions">
        <button class="btn-edit" onclick="editItem('image', ${item.id})">تعديل</button>
        <button class="btn-delete" onclick="deleteItem('image', ${item.id})">حذف</button>
      </div>
    </div>
  `).join('');
}

// Modal Management
function openModal(type, mode, item = null) {
  editingType = type;
  editingItem = item;
  
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const fields = document.getElementById('form-fields');
  
  title.textContent = mode === 'add' ? `إضافة ${getTypeName(type)}` : `تعديل ${getTypeName(type)}`;
  
  fields.innerHTML = getFormFields(type, item);
  
  modal.classList.add('show');
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('show');
  editingItem = null;
  editingType = null;
}

function getTypeName(type) {
  const names = {
    'news': 'خبر',
    'event': 'فعالية',
    'image': 'صورة'
  };
  return names[type] || type;
}

function getFormFields(type, item) {
  const fields = {
    news: `
      <div class="form-group">
        <label>العنوان</label>
        <input type="text" name="title" value="${item?.title || ''}" required/>
      </div>
      <div class="form-group">
        <label>الملخص</label>
        <textarea name="summary" rows="3" required>${item?.summary || ''}</textarea>
      </div>
      <div class="form-group">
        <label>المحتوى</label>
        <textarea name="content" rows="6" required>${item?.content || ''}</textarea>
      </div>
      <div class="form-group">
        <label>الفئة</label>
        <select name="category" required>
          <option value="إعلانات" ${item?.category === 'إعلانات' ? 'selected' : ''}>إعلانات</option>
          <option value="فعاليات" ${item?.category === 'فعاليات' ? 'selected' : ''}>فعاليات</option>
          <option value="تغطيات" ${item?.category === 'تغطيات' ? 'selected' : ''}>تغطيات</option>
        </select>
      </div>
      <div class="form-group">
        <label>التاريخ</label>
        <input type="date" name="date" value="${item?.date || new Date().toISOString().split('T')[0]}" required/>
      </div>
      <div class="form-group">
        <label>الصورة (URL)</label>
        <input type="url" name="image" value="${item?.image || '/assets/img/khotwa-hero.jpg'}" required/>
      </div>
    `,
    event: `
      <div class="form-group">
        <label>العنوان</label>
        <input type="text" name="title" value="${item?.title || ''}" required/>
      </div>
      <div class="form-group">
        <label>الوصف</label>
        <textarea name="description" rows="4" required>${item?.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label>التاريخ</label>
        <input type="date" name="date" value="${item?.date || new Date().toISOString().split('T')[0]}" required/>
      </div>
      <div class="form-group">
        <label>الوقت</label>
        <input type="time" name="time" value="${item?.time || '10:00'}" required/>
      </div>
      <div class="form-group">
        <label>المكان</label>
        <input type="text" name="location" value="${item?.location || ''}" required/>
      </div>
      <div class="form-group">
        <label>الصورة (URL)</label>
        <input type="url" name="image" value="${item?.image || '/assets/img/khotwa-hero.jpg'}" required/>
      </div>
      <div class="form-group">
        <label>الرابط (اختياري)</label>
        <input type="url" name="link" value="${item?.link || ''}"/>
      </div>
    `,
    image: `
      <div class="form-group">
        <label>العنوان</label>
        <input type="text" name="title" value="${item?.title || ''}" required/>
      </div>
      <div class="form-group">
        <label>الصورة (URL)</label>
        <input type="url" name="image" value="${item?.image || '/assets/img/khotwa-hero.jpg'}" required/>
      </div>
      <div class="form-group">
        <label>التاريخ</label>
        <input type="date" name="date" value="${item?.date || new Date().toISOString().split('T')[0]}" required/>
      </div>
    `
  };
  
  return fields[type] || '';
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  if (editingItem) {
    updateItem(editingType, editingItem.id, data);
  } else {
    addItem(editingType, data);
  }
  
  closeModal();
  loadData();
  showSuccessMessage('تم الحفظ بنجاح!');
}

function addItem(type, data) {
  const storageKey = getStorageKey(type);
  const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  const newItem = {
    id: Date.now(),
    ...data
  };
  
  items.unshift(newItem);
  localStorage.setItem(storageKey, JSON.stringify(items));
}

function updateItem(type, id, data) {
  const storageKey = getStorageKey(type);
  const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...data };
    localStorage.setItem(storageKey, JSON.stringify(items));
  }
}

function deleteItem(type, id) {
  if (!confirm('هل أنت متأكد من الحذف؟')) return;
  
  const storageKey = getStorageKey(type);
  const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  const filtered = items.filter(item => item.id !== id);
  localStorage.setItem(storageKey, JSON.stringify(filtered));
  
  loadData();
  showSuccessMessage('تم الحذف بنجاح!');
}

function editItem(type, id) {
  const storageKey = getStorageKey(type);
  const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const item = items.find(item => item.id === id);
  
  if (item) {
    openModal(type, 'edit', item);
  }
}

function getStorageKey(type) {
  const keys = {
    'news': STORAGE_KEYS.NEWS,
    'event': STORAGE_KEYS.EVENTS,
    'image': STORAGE_KEYS.GALLERY
  };
  return keys[type];
}

// Export/Import
function exportData(type) {
  const storageKey = type === 'news' ? STORAGE_KEYS.NEWS : STORAGE_KEYS.EVENTS;
  const data = localStorage.getItem(storageKey);
  
  if (!data) {
    alert('لا توجد بيانات للتصدير');
    return;
  }
  
  downloadJSON(data, `${type}.json`);
}

function exportAll() {
  const allData = {
    news: JSON.parse(localStorage.getItem(STORAGE_KEYS.NEWS) || '[]'),
    events: JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]'),
    gallery: JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || '[]')
  };
  
  downloadJSON(JSON.stringify(allData, null, 2), 'khotwa-all-data.json');
}

function downloadJSON(data, filename) {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      
      if (data.news) localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(data.news));
      if (data.events) localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(data.events));
      if (data.gallery) localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(data.gallery));
      
      loadData();
      showSuccessMessage('تم الاستيراد بنجاح!');
    } catch (err) {
      alert('خطأ في قراءة الملف: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function resetData() {
  if (!confirm('هل أنت متأكد من إعادة تعيين جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه!')) return;
  
  localStorage.removeItem(STORAGE_KEYS.NEWS);
  localStorage.removeItem(STORAGE_KEYS.EVENTS);
  localStorage.removeItem(STORAGE_KEYS.GALLERY);
  
  loadDataFromJSON();
  loadData();
  showSuccessMessage('تم إعادة التعيين بنجاح!');
}

// UI Helpers
function showSuccessMessage(message) {
  const existing = document.querySelector('.success-message');
  if (existing) existing.remove();
  
  const div = document.createElement('div');
  div.className = 'success-message';
  div.textContent = message;
  
  const content = document.querySelector('.admin-content');
  content.insertBefore(div, content.firstChild);
  
  setTimeout(() => div.remove(), 3000);
}

// Make functions globally accessible
window.editItem = editItem;
window.deleteItem = deleteItem;
