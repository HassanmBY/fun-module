// Notification Demo - Example usage
// This file demonstrates how to use the notification system

// Example: Request permission and show a test notification
async function testNotification() {
	try {
		const granted = await window.requestNotificationPermission();
		if (granted) {
			await window.showNotification("Test Notification", {
				body: "This is a test notification from your PWA!",
				icon: "./icons/icon-192.png",
				tag: "test-notification",
				data: { url: "./index.html" },
			});
		} else {
			alert(
				"Notification permission was denied. Please enable it in your browser settings."
			);
		}
	} catch (error) {
		console.error("Error showing notification:", error);
		alert("Error showing notification: " + error.message);
	}
}

// Example: Show notification with action buttons
async function showNotificationWithActions() {
	try {
		await window.showNotification("New Email", {
			body: "You have a new email from John Doe",
			icon: "./icons/icon-192.png",
			tag: "email-notification",
			requireInteraction: true,
			data: { url: "./email.html" },
			actions: [
				{
					action: "view",
					title: "View Email",
				},
				{
					action: "dismiss",
					title: "Dismiss",
				},
			],
		});
	} catch (error) {
		console.error("Error showing notification:", error);
		alert("Error showing notification: " + error.message);
	}
}

// Example: Show notification for new message
async function showNewMessageNotification(sender, message) {
	try {
		await window.showNotification(`New Message from ${sender}`, {
			body: message,
			icon: "./icons/icon-192.png",
			tag: `message-${sender}`,
			data: { url: "./index.html", sender: sender },
		});
	} catch (error) {
		console.error("Error showing message notification:", error);
	}
}

// Example: Periodic notification (e.g., reminder)
async function showReminderNotification() {
	try {
		await window.showNotification("Reminder", {
			body: "Don't forget to check your emails!",
			icon: "./icons/icon-192.png",
			tag: "reminder",
			requireInteraction: false,
		});
	} catch (error) {
		console.error("Error showing reminder notification:", error);
	}
}

// Discord-like notification with actions
async function showDiscordNotification(
	sender,
	message,
	channel,
	avatar,
	sound
) {
	try {
		await window.showNotification(`${sender} - ${channel}`, {
			body: message,
			icon: avatar || "./icons/icon-192.png",
			badge: "./icons/icon-192.png",
			tag: `discord-${channel}-${sender}`,
			requireInteraction: false,
			sound: sound || "./assets/sounds/notification.mp3", // Custom audio file
			data: {
				url: "./index.html",
				sender: sender,
				channel: channel,
				type: "discord-message",
			},
			actions: [
				{
					action: "reply",
					title: "Reply",
				},
				{
					action: "mark-read",
					title: "Mark as Read",
				},
			],
		});
	} catch (error) {
		console.error("Error showing Discord notification:", error);
	}
}

// Discord notification for mentions
async function showDiscordMentionNotification(sender, message, channel, sound) {
	try {
		await window.showNotification(`@${sender} mentioned you in #${channel}`, {
			body: message,
			icon: "./icons/icon-192.png",
			badge: "./icons/icon-192.png",
			tag: `discord-mention-${channel}`,
			requireInteraction: true,
			sound: sound || "./assets/sounds/mention.mp3", // Custom audio for mentions
			data: {
				url: "./index.html",
				sender: sender,
				channel: channel,
				type: "discord-mention",
			},
			actions: [
				{
					action: "view",
					title: "View Message",
				},
				{
					action: "dismiss",
					title: "Dismiss",
				},
			],
		});
	} catch (error) {
		console.error("Error showing Discord mention notification:", error);
	}
}

// Example: Notification with custom audio
async function showNotificationWithSound(
	title,
	body,
	soundUrl = "./assets/sounds/notification.mp3",
	volume = 0.2
) {
	try {
		await window.showNotification(title, {
			body: body,
			icon: "./icons/icon-192.png",
			sound: soundUrl, // Path to your custom audio file
			soundVolume: volume, // Volume level (0.0 to 1.0), default is 0.2 (20%)
			tag: `sound-notification-${Date.now()}`,
		});
	} catch (error) {
		console.error("Error showing notification with sound:", error);
	}
}

// Make functions available globally
window.testNotification = testNotification;
window.showNotificationWithActions = showNotificationWithActions;
window.showNewMessageNotification = showNewMessageNotification;
window.showReminderNotification = showReminderNotification;
window.showDiscordNotification = showDiscordNotification;
window.showDiscordMentionNotification = showDiscordMentionNotification;
window.showNotificationWithSound = showNotificationWithSound;
