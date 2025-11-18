# Fun Module PWA

A Progressive Web App with two interfaces:

- **Discord-like Chat Interface** (`index.html`)
- **Email Client Interface** (`email.html`)

## Features

- ✅ Progressive Web App (PWA) support
- ✅ Service Worker for offline functionality
- ✅ Responsive design
- ✅ Modern UI with Discord and Gmail-inspired designs
- ✅ Mobile-friendly bottom navigation

## Setup

1. Add icon files:

   - `icon-192.png` (192x192 pixels)
   - `icon-512.png` (512x512 pixels)

   You can generate these using any image editor or online tool. The icons should represent your app.

2. Serve the files using a local web server (required for service worker):

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js (http-server)
   npx http-server

   # Using PHP
   php -S localhost:8000
   ```

3. Open `http://localhost:8000` in your browser

4. Install as PWA:
   - Chrome/Edge: Click the install icon in the address bar
   - Mobile: Use "Add to Home Screen" option

## File Structure

```
fun-module/
├── index.html          # Discord-like chat interface
├── email.html          # Email client interface
├── styles.css          # Shared styles for both interfaces
├── app.js              # JavaScript functionality
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
└── README.md          # This file
```

## Usage

- Navigate between interfaces using the bottom navigation bar
- In the chat interface, type messages and press Enter to send
- In the email interface, click on emails to view (functionality can be extended)

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (iOS 11.3+)
- Opera
