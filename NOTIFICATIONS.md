# PWA Notifications Guide

## Overview

This PWA includes a complete notification system that supports:

1. **Local Notifications** - Triggered by the app itself
2. **Push Notifications** - Sent from a server (requires backend)

The notification system is implemented via the `NotificationManager` class and exposed through global functions for easy use.

## Quick Start: Creating a Notification

### Basic Notification

The simplest way to create a notification:

```javascript
// Request permission (if not already granted)
await window.requestNotificationPermission();

// Show a notification
await window.showNotification("New Message", {
	body: "You have a new message from Alice",
	icon: "./icons/icon-192.png",
	tag: "new-message",
	data: { url: "./index.html" },
});
```

### Using the NotificationManager Directly

For more control, use the `NotificationManager` instance:

```javascript
// Access the global instance
const manager = window.notificationManager;

// Request permission
const granted = await manager.requestPermission();

if (granted) {
	// Show notification
	await manager.showNotification("Title", {
		body: "Notification body text",
		icon: "./icons/icon-192.png",
		tag: "unique-tag",
	});
}
```

## Notification Options

When creating a notification, you can customize it with these options:

```javascript
await window.showNotification("Notification Title", {
	// Required/Common Options
	body: "The notification message text",
	icon: "./icons/icon-192.png", // Icon shown in notification
	badge: "./icons/icon-192.png", // Small icon shown in system tray

	// Behavior Options
	tag: "unique-tag", // Replaces previous notification with same tag
	requireInteraction: false, // If true, user must interact to dismiss
	silent: false, // If true, no sound/vibration

	// Custom Data
	data: {
		// Custom data attached to notification
		url: "./email.html", // URL to navigate when clicked
		userId: 123,
		customField: "value",
	},

	// Action Buttons (max 2)
	actions: [
		{
			action: "view", // Action identifier
			title: "View", // Button label
			icon: "./icons/view-icon.png", // Optional button icon
		},
		{
			action: "dismiss",
			title: "Dismiss",
		},
	],

	// Mobile Options
	vibrate: [200, 100, 200], // Vibration pattern (mobile)
	image: "./images/large-image.png", // Large image (if supported)
});
```

## Examples

### Example 1: Simple Message Notification

```javascript
async function notifyNewMessage(sender, message) {
	await window.showNotification(`New Message from ${sender}`, {
		body: message,
		icon: "./icons/icon-192.png",
		tag: `message-${sender}`,
		data: { url: "./index.html", sender: sender },
	});
}

// Usage
notifyNewMessage("Alice", "Hey, how are you?");
```

### Example 2: Email Notification with Actions

```javascript
async function notifyNewEmail(from, subject) {
	await window.showNotification("New Email", {
		body: `From: ${from}\nSubject: ${subject}`,
		icon: "./icons/icon-192.png",
		tag: "email-notification",
		requireInteraction: true,
		data: { url: "./email.html" },
		actions: [
			{ action: "view", title: "View Email" },
			{ action: "dismiss", title: "Dismiss" },
		],
	});
}

// Usage
notifyNewEmail("John Doe", "Project Update");
```

### Example 3: Reminder Notification

```javascript
async function showReminder(text) {
	await window.showNotification("Reminder", {
		body: text,
		icon: "./icons/icon-192.png",
		tag: "reminder",
		requireInteraction: false,
	});
}

// Usage
showReminder("Don't forget to check your emails!");
```

### Example 4: Notification with Custom Data

```javascript
await window.showNotification("Task Completed", {
	body: "Your task has been completed",
	icon: "./icons/icon-192.png",
	tag: "task-completed",
	data: {
		url: "./tasks.html",
		taskId: 456,
		userId: 123,
		timestamp: Date.now(),
	},
});
```

### Example 5: Discord-like Notification with Actions

```javascript
// Regular Discord message notification
async function showDiscordNotification(sender, message, channel, avatar) {
	await window.showNotification(`${sender} - ${channel}`, {
		body: message,
		icon: avatar || "./icons/icon-192.png",
		badge: "./icons/icon-192.png",
		tag: `discord-${channel}-${sender}`,
		requireInteraction: false,
		data: {
			url: "./index.html",
			sender: sender,
			channel: channel,
			type: "discord-message",
		},
		actions: [
			{ action: "reply", title: "Reply" },
			{ action: "mark-read", title: "Mark as Read" },
		],
	});
}

// Discord mention notification (more prominent)
async function showDiscordMentionNotification(sender, message, channel) {
	await window.showNotification(`@${sender} mentioned you in #${channel}`, {
		body: message,
		icon: "./icons/icon-192.png",
		badge: "./icons/icon-192.png",
		tag: `discord-mention-${channel}`,
		requireInteraction: true, // Requires user interaction
		data: {
			url: "./index.html",
			sender: sender,
			channel: channel,
			type: "discord-mention",
		},
		actions: [
			{ action: "view", title: "View Message" },
			{ action: "dismiss", title: "Dismiss" },
		],
	});
}

// Usage
showDiscordNotification(
	"Alice",
	"Hey everyone! How are you?",
	"general",
	"./icons/icon-192.png"
);
showDiscordMentionNotification("Bob", "Can you check this out?", "general");
```

## Requesting Permission

Before showing notifications, you need user permission:

```javascript
// Check current permission status
const status = Notification.permission;
// Returns: 'granted', 'denied', or 'default'

// Request permission
const granted = await window.requestNotificationPermission();

if (granted) {
	// Permission granted, you can show notifications
	await window.showNotification("Welcome!", {
		body: "Notifications are now enabled",
	});
} else {
	// Permission denied
	alert("Please enable notifications in your browser settings");
}
```

**Note:** The `showNotification()` function automatically requests permission if not already granted, so you don't always need to call `requestNotificationPermission()` separately.

## How Notifications Work

### Service Worker Integration

Notifications are automatically shown through the service worker, which means they work even when the app is closed. The `NotificationManager` handles this automatically - you don't need to worry about it.

When you call `window.showNotification()`, it:

1. Checks if permission is granted (requests if needed)
2. Uses the service worker to show the notification (if available)
3. Falls back to browser notifications if service worker isn't available

### Notification Click Handling

When a user clicks a notification, the service worker automatically:

- Closes the notification
- Focuses the app if it's already open
- Opens the app in a new window/tab if it's closed
- Navigates to the URL specified in `data.url` (if provided)

Action buttons are also handled automatically - see the examples above.

## Push Notifications (Advanced)

For server-sent push notifications, you need to subscribe to the push service:

### Subscribe to Push Notifications

```javascript
// Get the NotificationManager instance
const manager = window.notificationManager;

// Subscribe to push notifications (requires VAPID public key from your backend)
const subscription = await manager.subscribeToPush("YOUR_VAPID_PUBLIC_KEY");

if (subscription) {
	// Send subscription to your server
	await fetch("/api/subscribe", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(subscription),
	});
}
```

### Unsubscribe from Push Notifications

```javascript
const manager = window.notificationManager;
const unsubscribed = await manager.unsubscribeFromPush();
```

**Note:** Push notifications require:

- A backend server with VAPID keys
- The push event handler is already implemented in `sw.js`
- Your server needs to send push messages to the subscription endpoint

## NotificationManager API Reference

### Methods

#### `requestPermission()`

Requests notification permission from the user.

```javascript
const granted = await window.notificationManager.requestPermission();
// Returns: true if granted, false otherwise
```

#### `showNotification(title, options)`

Shows a notification with the given title and options.

```javascript
await window.notificationManager.showNotification("Title", {
	body: "Message",
	// ... other options
});
```

#### `subscribeToPush(vapidPublicKey)`

Subscribes to push notifications.

```javascript
const subscription = await window.notificationManager.subscribeToPush(
	publicKey
);
```

#### `unsubscribeFromPush()`

Unsubscribes from push notifications.

```javascript
const success = await window.notificationManager.unsubscribeFromPush();
```

#### `isEnabled()`

Checks if notifications are currently enabled.

```javascript
const enabled = window.notificationManager.isEnabled();
// Returns: true if permission is 'granted'
```

#### `getPermissionStatus()`

Gets the current permission status.

```javascript
const status = window.notificationManager.getPermissionStatus();
// Returns: 'granted', 'denied', or 'default'
```

## Best Practices

1. **Request permission at the right time** - Don't ask immediately on page load
2. **Provide value** - Only send relevant, useful notifications
3. **Allow users to opt-out** - Provide settings to disable notifications
4. **Use tags** - Prevent notification spam by using unique tags
5. **Handle clicks** - Always provide a meaningful URL in `data.url`
6. **Test on different devices** - Notification behavior varies by platform
7. **Respect user preferences** - Check permission before showing
8. **Use requireInteraction sparingly** - Only for important notifications

## Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Limited support (iOS 16.4+)
- **Opera**: Full support

## Security Notes

- Notifications require HTTPS (or localhost)
- Push notifications require VAPID keys for security
- Always validate notification data from push events
- Never send sensitive data in notifications
