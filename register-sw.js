// Service Worker Registration
if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(error => {
			console.error("Service Worker registration failed:", error);
		});
	});
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener("beforeinstallprompt", e => {
	e.preventDefault();
	deferredPrompt = e;
});

// Expose notification functions globally for easy access
window.requestNotificationPermission = async () => {
	if (window.notificationManager) {
		return await window.notificationManager.requestPermission();
	}
	return false;
};

window.showNotification = async (title, options) => {
	if (window.notificationManager) {
		await window.notificationManager.showNotification(title, options);
	}
};

// Listen for messages from service worker (e.g., Discord reply action)
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.addEventListener("message", event => {
		if (event.data && event.data.type === "discord-reply") {
			// Focus on reply input or message input
			const messageInput = document.getElementById("messageInput");
			if (messageInput) {
				messageInput.focus();
				// Optionally pre-fill with @mention
				if (event.data.sender) {
					messageInput.value = `@${event.data.sender} `;
				}
			}
		}
	});
}
