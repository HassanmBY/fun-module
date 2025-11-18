// Notification Manager for PWA
class NotificationManager {
	constructor() {
		this.permission = Notification.permission;
		this.isSupported = "Notification" in window;
		this.pushSupported = "serviceWorker" in navigator && "PushManager" in window;
	}

	// Request notification permission
	async requestPermission() {
		if (!this.isSupported) {
			console.warn("Notifications not supported in this browser");
			return false;
		}

		if (this.permission === "granted") {
			return true;
		}

		if (this.permission === "denied") {
			console.warn("Notification permission was previously denied");
			return false;
		}

		this.permission = await Notification.requestPermission();
		return this.permission === "granted";
	}

	// Show local notification (from main app or service worker)
	async showNotification(title, options = {}) {
		if (!this.isSupported) {
			console.warn("Notifications not supported");
			return;
		}

		// Request permission if not granted
		if (this.permission !== "granted") {
			const granted = await this.requestPermission();
			if (!granted) {
				console.warn("Notification permission not granted");
				return;
			}
		}

		const defaultOptions = {
			icon: "./icons/icon-192.png",
			badge: "./icons/icon-192.png",
			tag: options.tag || `notification-${Date.now()}`,
			...options,
		};

		// Use service worker if available (works in background)
		if ("serviceWorker" in navigator) {
			try {
				const registration = await navigator.serviceWorker.ready;
				await registration.showNotification(title, defaultOptions);
			} catch (error) {
				console.error("Error showing notification via service worker:", error);
				// Fallback to regular notification
				this.showBrowserNotification(title, defaultOptions);
			}
		} else {
			this.showBrowserNotification(title, defaultOptions);
		}
	}

	// Fallback to browser notification API
	showBrowserNotification(title, options) {
		const notification = new Notification(title, options);

		// Handle click
		notification.onclick = event => {
			event.preventDefault();
			window.focus();
			notification.close();

			// Navigate if URL provided
			if (options.url) {
				window.location.href = options.url;
			}
		};

		// Auto-close after 5 seconds (unless requireInteraction is true)
		if (!options.requireInteraction) {
			setTimeout(() => notification.close(), 5000);
		}
	}

	// Subscribe to push notifications
	async subscribeToPush(vapidPublicKey) {
		if (!this.pushSupported) {
			console.warn("Push notifications not supported");
			return null;
		}

		try {
			const registration = await navigator.serviceWorker.ready;
			let subscription = await registration.pushManager.getSubscription();

			if (!subscription) {
				subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey),
				});
			}

			return subscription;
		} catch (error) {
			console.error("Error subscribing to push:", error);
			return null;
		}
	}

	// Unsubscribe from push notifications
	async unsubscribeFromPush() {
		if (!this.pushSupported) {
			return false;
		}

		try {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();

			if (subscription) {
				await subscription.unsubscribe();
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error unsubscribing from push:", error);
			return false;
		}
	}

	// Convert VAPID public key to Uint8Array
	urlBase64ToUint8Array(base64String) {
		const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding)
			.replace(/\-/g, "+")
			.replace(/_/g, "/");

		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	}

	// Check if notifications are enabled
	isEnabled() {
		return this.permission === "granted";
	}

	// Get current permission status
	getPermissionStatus() {
		return this.permission;
	}
}

// Create global instance and expose to window
const notificationManager = new NotificationManager();
window.notificationManager = notificationManager;

// Export for use in modules
if (typeof module !== "undefined" && module.exports) {
	module.exports = NotificationManager;
}
