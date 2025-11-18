const CACHE_NAME = "fun-module-pwa-v1";
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
			// Return cached version or fetch from network
			return response || fetch(event.request);
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
