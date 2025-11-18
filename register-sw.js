// Service Worker Registration
if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		// Determine the correct path to sw.js based on current location
		const swPath = window.location.pathname.includes("/discord/")
			? "../sw.js"
			: "./sw.js";
		const swScope = window.location.pathname.includes("/discord/") ? "../" : "./";

		navigator.serviceWorker.register(swPath, { scope: swScope }).catch(error => {
			console.error("Service Worker registration failed:", error);
		});
	});
}

// PWA Install Prompt
let deferredPrompt;

// Check if app is already installed
if (window.matchMedia("(display-mode: standalone)").matches) {
	// App is already installed, hide install button
	const installButton = document.getElementById("install-button");
	if (installButton) {
		installButton.style.display = "none";
	}
}

window.addEventListener("beforeinstallprompt", e => {
	e.preventDefault();
	deferredPrompt = e;
	// Show install button if it exists
	const installButton = document.getElementById("install-button");
	if (installButton) {
		installButton.style.display = "block";
	}
});

// Install function
window.installPWA = async () => {
	if (!deferredPrompt) {
		return;
	}
	deferredPrompt.prompt();
	const { outcome } = await deferredPrompt.userChoice;
	if (outcome === "accepted") {
		deferredPrompt = null;
		const installButton = document.getElementById("install-button");
		if (installButton) {
			installButton.style.display = "none";
		}
	}
};

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

// Listen for messages from service worker (e.g., Discord reply action, play sound)
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
		} else if (event.data && event.data.type === "play-sound") {
			// Play custom audio from service worker
			if (event.data.audioUrl) {
				try {
					const audio = new Audio(event.data.audioUrl);
					const volume = event.data.volume !== undefined ? event.data.volume : 0.2;
					audio.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0.0 and 1.0
					audio.play().catch(error => {
						console.warn("Could not play notification sound:", error);
					});
				} catch (error) {
					console.warn("Error playing notification sound:", error);
				}
			}
		}
	});
}
