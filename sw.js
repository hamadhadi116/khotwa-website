// Service Worker for Push Notifications

self.addEventListener('push', function(event) {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const title = data.title || 'مجلس طلاب خطوة';
  const options = {
    body: data.body,
    icon: data.icon || '/assets/apple-touch-icon.png',
    badge: '/assets/favicon-32.png',
    data: {
      url: data.url || '/'
    },
    vibrate: [200, 100, 200],
    tag: 'khotwa-notification',
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const url = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Check if there's already a window open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Install event
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});
