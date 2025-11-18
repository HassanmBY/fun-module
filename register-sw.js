// Service Worker Registration
if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("./sw.js", { scope: "./" })
			.then(registration => {
				console.log("Service Worker registered:", registration.scope);
			})
			.catch(error => {
				console.error("Service Worker registration failed:", error);
			});
	});
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener("beforeinstallprompt", e => {
	e.preventDefault();
	deferredPrompt = e;
	console.log("PWA install prompt available");
});
