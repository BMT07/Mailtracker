const publicVapidKey = 'BLS-1DEFdKalsJneqnQQWTxOj42g42d1FoC_dUCtgjDmmIhtQq3eyWKdIp36LNIANc4PvLyLVU0vtmO6NltXD2E';

// Fonction pour convertir une clé VAPID au format Base64 en Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

document.getElementById('notification-btn').addEventListener('click', async (event) => {
    const button = event.target;

    if (button.textContent === 'Enable Notifications') {
        if (!('serviceWorker' in navigator)) {
            console.error('Service workers are not supported in this browser.');
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.error('Notification permission denied.');
                return;
            }

            const registration = await navigator.serviceWorker.register('/service-worker.js', {
                scope: '/'
            });

            console.log('Service Worker registered...');

            await navigator.serviceWorker.ready;

            console.log('Service Worker ready...');

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });

            await fetch('/notifications/subscribe', {
                method: 'POST',
                body: JSON.stringify({ subscription }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const responseNotification = await fetch('/notifications/update-user-notification', {
                method: 'POST',
                body: JSON.stringify({ notification: true }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!responseNotification.ok) {
                throw new Error('Failed to update the notification setting');
            }

            // Change the button to "Disable Notifications"
            button.textContent = 'Disable Notifications';

        } catch (error) {
            console.error(error);
            console.error('Service worker registration or subscription failed:', error);
            if (error instanceof DOMException && error.name === 'NotAllowedError') {
                console.error('Push notifications are not allowed by the user.');
            } else if (error instanceof DOMException && error.name === 'NotSupportedError') {
                console.error('Push notifications are not supported by the browser.');
            } else {
                console.error('An unknown error occurred during subscription.');
            }
        }
    } else if (button.textContent === 'Disable Notifications') {
        if (!('serviceWorker' in navigator)) {
            console.error('Service workers are not supported in this browser.');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                console.error('Not subscribed to push notifications');
                return;
            }

            const response = await fetch('/notifications/unsubscribe', {
                method: 'POST',
                body: JSON.stringify({ endpoint: subscription.endpoint }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to unsubscribe from push notifications');
            }

            await subscription.unsubscribe();
            console.log('Unsubscribed from push notifications');

            const responseNotification = await fetch('/notifications/update-user-notification', {
                method: 'POST',
                body: JSON.stringify({ notification: false }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!responseNotification.ok) {
                throw new Error('Failed to update the notification setting');
            }

            // Change the button to "Enable Notifications"
            button.textContent = 'Enable Notifications';

        } catch (error) {
            console.error('Failed to unsubscribe from push notifications:', error);
        }
    }
});

