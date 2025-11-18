const CACHE_NAME = "fun-module-pwa-v2";
const urlsToCache = [
	"./",
	"./index.html",
	"./email.html",
	"./style/styles.css",
	"./scripts/app.js",
	"./scripts/notification-manager.js",
	"./scripts/notification-demo.js",
	"./register-sw.js",
	"./manifest.json",
	"./icons/icon-192.png",
	"./icons/icon-512.png",
	"./email_page/email.html",
	"./email_page/script.js",
	"./email_page/style.css",
	"./email_page/email_messages.json",
	"./discord/discord.html",
	"./discord/discord.js",
	"./assets/sounds/notification.mp3",
];

// Install event - cache resources
self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return Promise.allSettled(
				urlsToCache.map(url =>
					cache.add(url).catch(err => {
						console.warn(`Failed to cache ${url}:`, err);
						return null;
					})
				)
			);
		})
	);
	self.skipWaiting();
});

self.addEventListener("fetch", event => {
	event.respondWith(
		caches.match(event.request).then(response => {
			// Return cached version if available
			if (response) {
				return response;
			}
			// Fetch from network and cache for future use
			return fetch(event.request).then(response => {
				// Only cache GET requests with valid responses
				if (event.request.method === "GET" && response.status === 200) {
					const responseToCache = response.clone();
					caches.open(CACHE_NAME).then(cache => {
						cache.put(event.request, responseToCache);
					});
				}
				return response;
			});
		})
	);
});

self.addEventListener("activate", event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if (cacheName !== CACHE_NAME) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);

	return self.clients.claim();
});

// Play custom audio in service worker
function playNotificationSound(audioUrl, volume = 0.2) {
	if (audioUrl) {
		// In service worker, we need to use clients to play audio
		clients.matchAll().then(clientList => {
			for (let client of clientList) {
				client.postMessage({
					type: "play-sound",
					audioUrl: audioUrl,
					volume: volume,
				});
			}
		});
	}
}

// Push notification event handler
self.addEventListener("push", event => {
	let data = {};
	if (event.data) {
		try {
			data = event.data.json();
		} catch (e) {
			data = { title: event.data.text() || "New Notification" };
		}
	}

	// Play custom audio if provided
	if (data.sound) {
		const volume = data.soundVolume !== undefined ? data.soundVolume : 0.2;
		playNotificationSound(data.sound, volume);
	}

	const title = data.title || "New Notification";
	const options = {
		body: data.body || "You have a new notification",
		icon: data.icon || "./icons/icon-192.png",
		badge: "./icons/icon-192.png",
		tag: data.tag || `push-${Date.now()}`,
		data: data.data || {},
		requireInteraction: data.requireInteraction || false,
		silent: data.sound ? true : data.silent || false, // Silent if custom sound is playing
		vibrate: data.vibrate,
		actions: data.actions || [],
	};

	event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event handler
self.addEventListener("notificationclick", event => {
	event.notification.close();

	const notificationData = event.notification.data || {};
	const action = event.action;

	// Handle action buttons
	if (action === "view" && notificationData.url) {
		event.waitUntil(clients.openWindow(notificationData.url || "./"));
		return;
	}

	if (action === "dismiss") {
		// Just close the notification
		return;
	}

	// Discord-specific actions
	if (action === "reply") {
		// Open app and focus on reply input
		event.waitUntil(
			clients
				.matchAll({ type: "window", includeUncontrolled: true })
				.then(clientList => {
					for (let client of clientList) {
						if (client.url.includes(self.location.origin) && "focus" in client) {
							client.focus();
							// Post message to client to focus reply input
							client.postMessage({
								type: "discord-reply",
								channel: notificationData.channel,
								sender: notificationData.sender,
							});
							return;
						}
					}
					const urlToOpen = notificationData.url || "./";
					if (clients.openWindow) {
						return clients.openWindow(urlToOpen);
					}
				})
		);
		return;
	}

	if (action === "mark-read") {
		// Mark message as read (just close notification)
		// In a real app, you'd send a message to mark it as read
		return;
	}

	// Default click behavior - focus or open the app
	event.waitUntil(
		clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then(clientList => {
				// Check if app is already open
				for (let client of clientList) {
					if (client.url.includes(self.location.origin) && "focus" in client) {
						return client.focus();
					}
				}

				// Open new window/tab
				const urlToOpen = notificationData.url || "./";
				if (clients.openWindow) {
					return clients.openWindow(urlToOpen);
				}
			})
	);
});

// Notification close event handler
self.addEventListener("notificationclose", event => {
	// Optional: Track notification dismissals
});
