/**
 * Khotwa Backend API Integration
 * ==============================
 * هذا الملف يوفر جميع الدوال اللازمة للتواصل مع نظام Backend
 * 
 * الاستخدام:
 * 1. أضف هذا الملف إلى موقعك: <script src="khotwa-api.js"></script>
 * 2. استخدم الدوال المتاحة في KhotwaAPI
 */

const KhotwaAPI = (function() {
    // ==================== الإعدادات ====================
    // غيّر هذا الرابط بعد نشر Backend
    const API_BASE = 'https://khotwabknd-gj8oeubw.manus.space/api/trpc';
    
    // ==================== دوال مساعدة ====================
    
    // الحصول على معرف الزائر الفريد
    function getVisitorId() {
        let id = localStorage.getItem('khotwa_visitor_id');
        if (!id) {
            id = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('khotwa_visitor_id', id);
        }
        return id;
    }
    
    // دالة الاتصال بـ API
    async function apiCall(endpoint, input = null, method = 'GET') {
        try {
            let url = `${API_BASE}/${endpoint}`;
            
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // للحفاظ على الجلسة
            };
            
            if (method === 'GET' && input) {
                url += `?input=${encodeURIComponent(JSON.stringify(input))}`;
            } else if (method === 'POST' && input) {
                options.body = JSON.stringify(input);
            }
            
            const response = await fetch(url, options);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message || 'حدث خطأ');
            }
            
            return data.result?.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // ==================== الإحصائيات ====================
    
    async function getStatistics() {
        return await apiCall('statistics.get');
    }
    
    // ==================== البحث ====================
    
    /**
     * البحث في الأخبار
     * @param {string} query - نص البحث
     * @param {string} category - الفئة (اختياري)
     * @param {string} sortBy - الترتيب: 'newest', 'oldest' (افتراضي: 'newest')
     * @returns {Promise<Array>} قائمة الأخبار
     */
    async function searchNews(query = '', category = null, sortBy = 'newest') {
        const input = { query, category, sortBy };
        const result = await apiCall('news.search', input, 'GET');
        return result.map(transformNews);
    }
    
    /**
     * البحث في الفعاليات
     * @param {string} query - نص البحث
     * @param {string} dateFrom - من تاريخ (YYYY-MM-DD)
     * @param {string} dateTo - إلى تاريخ (YYYY-MM-DD)
     * @param {string} sortBy - الترتيب: 'newest', 'oldest', 'date' (افتراضي: 'date')
     * @returns {Promise<Array>} قائمة الفعاليات
     */
    async function searchEvents(query = '', dateFrom = null, dateTo = null, sortBy = 'date') {
        const input = { query, dateFrom, dateTo, sortBy };
        const result = await apiCall('events.search', input, 'GET');
        return result.map(transformEvent);
    }
    
    // ==================== الأخبار ====================
    
    async function getNews() {
        const response = await apiCall('news.list');
        // تحويل البيانات من هيكل Backend إلى هيكل الواجهة
        if (response && response.json) {
            return response.json.map(item => ({
                id: item.id,
                title: item.titleAr || item.titleEn,
                image: item.imageUrl,
                createdAt: item.createdAt,
                tags: item.category ? [item.category] : [],
                content: item.contentAr || item.contentEn
            }));
        }
        return [];
    }
    
    async function getNewsById(id) {
        return await apiCall('news.getById', { id: id });
    }
    
    // ==================== الفعاليات ====================
    
    async function getEvents() {
        const response = await apiCall('events.list');
        // تحويل البيانات من هيكل Backend إلى هيكل الواجهة
        if (response && response.json) {
            return response.json.map(item => ({
                id: item.id,
                title: item.titleAr || item.titleEn,
                image: item.imageUrl,
                date: item.eventDate,
                location: item.location,
                description: item.descriptionAr || item.descriptionEn,
                createdAt: item.createdAt
            }));
        }
        return [];
    }
    
    async function getEventById(id) {
        return await apiCall('events.getById', { id: id });
    }
    
    // ==================== التعليقات ====================
    
    async function getComments(contentType, contentId) {
        return await apiCall('comments.list', {
            contentType: contentType, // 'news' أو 'event'
            contentId: contentId
        });
    }
    
    async function addComment(contentType, contentId, authorName, content, authorEmail = null) {
        return await apiCall('comments.create', {
            contentType: contentType,
            contentId: contentId,
            authorName: authorName,
            authorEmail: authorEmail,
            content: content,
            visitorId: getVisitorId()
        }, 'POST');
    }
    
    // ==================== التسجيل في الفعاليات ====================
    
    async function registerForEvent(eventId, fullName, email, phone = null, university = null, notes = null) {
        return await apiCall('registrations.create', {
            eventId: eventId,
            fullName: fullName,
            email: email,
            phone: phone,
            university: university,
            notes: notes,
            visitorId: getVisitorId()
        }, 'POST');
    }
    
    // ==================== الاستطلاعات ====================
    
    async function getActivePolls() {
        return await apiCall('polls.listActive');
    }
    
    async function getPollResults(pollId) {
        return await apiCall('polls.results', { pollId: pollId });
    }
    
    async function vote(pollId, optionId) {
        return await apiCall('polls.vote', {
            pollId: pollId,
            optionId: optionId,
            visitorId: getVisitorId()
        }, 'POST');
    }
    
    // ==================== الشكاوى والاقتراحات ====================
    
    async function submitComplaint(subject, content, name = null, email = null) {
        return await apiCall('complaints.create', {
            type: 'complaint',
            name: name,
            email: email,
            subject: subject,
            content: content
        }, 'POST');
    }
    
    async function submitSuggestion(subject, content, name = null, email = null) {
        return await apiCall('complaints.create', {
            type: 'suggestion',
            name: name,
            email: email,
            subject: subject,
            content: content
        }, 'POST');
    }
    
    // ==================== النقاط والشارات ====================
    
    async function getMyPoints() {
        return await apiCall('gamification.getPoints', { visitorId: getVisitorId() });
    }
    
    async function getMyBadges() {
        return await apiCall('gamification.getBadges', { visitorId: getVisitorId() });
    }
    
    async function getAllBadges() {
        return await apiCall('gamification.getAllBadges');
    }
    
    // ==================== الإنجازات ====================
    
    async function getAchievements() {
        const response = await apiCall('achievements.list');
        // تحويل البيانات من هيكل Backend إلى هيكل الواجهة
        if (response && response.json) {
            return response.json.map(item => ({
                id: item.id,
                title: item.titleAr || item.titleEn,
                description: item.descriptionAr || item.descriptionEn,
                image: item.imageUrl,
                date: item.achievementDate,
                createdAt: item.createdAt
            }));
        }
        return [];
    }
    
    // ==================== الوظائف ====================
    
    async function getJobs() {
        const response = await apiCall('jobs.list');
        // تحويل البيانات من هيكل Backend إلى هيكل الواجهة
        if (response && response.json) {
            return response.json.map(item => ({
                id: item.id,
                title: item.titleAr || item.titleEn,
                description: item.descriptionAr || item.descriptionEn,
                department: item.department,
                requirements: item.requirementsAr || item.requirementsEn,
                deadline: item.applicationDeadline,
                isOpen: item.isOpen,
                createdAt: item.createdAt
            }));
        }
        return [];
    }
    
    async function getJobById(id) {
        return await apiCall('jobs.getById', { id: id });
    }
    
    async function applyForJob(jobId, fullName, email, phone = null, university = null, coverLetter = null) {
        return await apiCall('jobs.submitApplication', {
            jobId: jobId,
            fullName: fullName,
            email: email,
            phone: phone,
            university: university,
            coverLetter: coverLetter
        }, 'POST');
    }
    
    // ==================== تصدير الدوال ====================
    
    return {
        // الإعدادات
        setApiBase: function(url) {
            // يمكنك تغيير الرابط ديناميكياً
            console.log('API Base updated to:', url);
        },
        getVisitorId: getVisitorId,
        
        // الإحصائيات
        getStatistics: getStatistics,
        
        // البحث
        searchNews: searchNews,
        searchEvents: searchEvents,
        
        // الأخبار
        getNews: getNews,
        getNewsById: getNewsById,
        
        // الفعاليات
        getEvents: getEvents,
        getEventById: getEventById,
        
        // التعليقات
        getComments: getComments,
        addComment: addComment,
        
        // التسجيل
        registerForEvent: registerForEvent,
        
        // الاستطلاعات
        getActivePolls: getActivePolls,
        getPollResults: getPollResults,
        vote: vote,
        
        // الشكاوى
        submitComplaint: submitComplaint,
        submitSuggestion: submitSuggestion,
        
        // النقاط والشارات
        getMyPoints: getMyPoints,
        getMyBadges: getMyBadges,
        getAllBadges: getAllBadges,
        
        // الإنجازات
        getAchievements: getAchievements,
        
        // الوظائف
        getJobs: getJobs,
        getJobById: getJobById,
        applyForJob: applyForJob
    };
})();

// جعل الـ API متاحاً عالمياً
window.KhotwaAPI = KhotwaAPI;
