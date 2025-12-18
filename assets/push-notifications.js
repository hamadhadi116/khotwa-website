/**
 * Push Notifications Client
 * =========================
 * يدير اشتراكات الإشعارات في المتصفح
 */

const PushNotifications = (function() {
    let isSubscribed = false;
    let swRegistration = null;

    // تحويل VAPID key من base64 إلى Uint8Array
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // تسجيل Service Worker
    async function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.log('Service Worker not supported');
            return null;
        }

        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered');
            swRegistration = registration;
            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return null;
        }
    }

    // الحصول على VAPID public key من الخادم
    async function getVapidPublicKey() {
        try {
            const data = await KhotwaAPI.getVapidPublicKey();
            return data.publicKey;
        } catch (error) {
            console.error('Error getting VAPID key:', error);
            return null;
        }
    }

    // الاشتراك في الإشعارات
    async function subscribe() {
        if (!swRegistration) {
            console.error('Service Worker not registered');
            return false;
        }

        try {
            const publicKey = await getVapidPublicKey();
            if (!publicKey) {
                console.error('Could not get VAPID public key');
                return false;
            }

            const applicationServerKey = urlBase64ToUint8Array(publicKey);
            const subscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            });

            // إرسال الاشتراك إلى الخادم
            const subscriptionJson = subscription.toJSON();
            await KhotwaAPI.subscribeToPush({
                endpoint: subscriptionJson.endpoint,
                p256dh: subscriptionJson.keys.p256dh,
                auth: subscriptionJson.keys.auth,
                visitorId: KhotwaAPI.getVisitorId()
            });

            isSubscribed = true;
            console.log('Push subscription successful');
            return true;
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
            return false;
        }
    }

    // إلغاء الاشتراك
    async function unsubscribe() {
        if (!swRegistration) {
            return false;
        }

        try {
            const subscription = await swRegistration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                
                // إخبار الخادم بإلغاء الاشتراك
                const subscriptionJson = subscription.toJSON();
                await KhotwaAPI.unsubscribeFromPush({
                    endpoint: subscriptionJson.endpoint
                });

                isSubscribed = false;
                console.log('Push unsubscription successful');
                return true;
            }
        } catch (error) {
            console.error('Failed to unsubscribe from push notifications:', error);
            return false;
        }
    }

    // التحقق من حالة الاشتراك
    async function checkSubscription() {
        if (!swRegistration) {
            return false;
        }

        try {
            const subscription = await swRegistration.pushManager.getSubscription();
            isSubscribed = subscription !== null;
            return isSubscribed;
        } catch (error) {
            console.error('Error checking subscription:', error);
            return false;
        }
    }

    // طلب إذن الإشعارات
    async function requestPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    // التهيئة
    async function init() {
        const registration = await registerServiceWorker();
        if (!registration) {
            return false;
        }

        await checkSubscription();
        return true;
    }

    // تصدير الدوال
    return {
        init: init,
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        requestPermission: requestPermission,
        checkSubscription: checkSubscription,
        isSupported: () => 'serviceWorker' in navigator && 'PushManager' in window,
        isSubscribed: () => isSubscribed
    };
})();

// تهيئة تلقائية عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        PushNotifications.init();
    });
} else {
    PushNotifications.init();
}

// جعل الـ API متاحاً عالمياً
window.PushNotifications = PushNotifications;
