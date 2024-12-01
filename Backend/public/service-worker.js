self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: 'https://api.snanalyzer.app/images/check_new_logo.png',
    actions: [
      {
        action: 'open_url',
        title: 'Open Website',
        icon: 'https://api.snanalyzer.app/images/check_new_logo.png',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: 'https://api.snanalyzer.app/images/check_new_logo.png',
      }
    ],
    requireInteraction: false // Ensures the notification will auto-close after a certain period
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            self.registration.getNotifications({ tag: data.tag }).then(notifications => {
              notifications.forEach(notification => notification.close());
              resolve();
            });
          }, 10000); // Fermer la notification après 10 secondes
        });
      })
  );
});

self.addEventListener('notificationclick', event => {
  const action = event.action;
  if (action === 'open_url') {
    clients.openWindow('https://example.com');
  } else if (action === 'dismiss') {
    event.notification.close();
  } else {
    // Default action (when the notification body itself is clicked)
    clients.openWindow('https://example.com');
  }
});
