const CACHE_NAME = "fun-module-pwa-v2";
const urlsToCache = [
	"./",
	"./index.html",
	"./email.html",
	"./style/styles.css",
	"./scripts/app.js",
	"./register-sw.js",
	"./manifest.json",
	"./icons/icon-192.png",
	"./icons/icon-512.png",
	"./email_page/email.html",
	"./email_page/script.js",
	"./email_page/style.css",
	"./email_page/email_messages.json",
];

// Install event - cache resources
self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			console.log("Service Worker: Caching files");
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
						console.log("Service Worker: Deleting old cache", cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);

	return self.clients.claim();
});
