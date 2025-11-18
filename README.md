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

1. Serve the files using a local web server (required for service worker):

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js (http-server)
   npx http-server

   # Using PHP
   php -S localhost:8000
   ```

2. Open `http://localhost:8000` in your browser

3. Install as PWA:
   - Chrome/Edge: Click the install icon in the address bar
   - Mobile: Use "Add to Home Screen" option

## File Structure

```
fun-module/
├── index.html          # Discord-like chat interface
├── email.html          # Email client interface
├── manifest.json       # PWA manifest
├── register-sw.js      # Service worker registration
├── sw.js               # Service worker for caching
├── icons/              # PWA icons
│   ├── icon-192.png
│   └── icon-512.png
├── style/              # Stylesheets
│   └── styles.css
├── scripts/            # JavaScript files
│   └── app.js
└── README.md           # This file
```

## PWA Features

- **Offline Support**: Service worker caches all app files for offline access
- **Installable**: Can be installed as a standalone app on desktop and mobile devices
- **Fast Loading**: Cached resources load instantly on subsequent visits
- **Auto Updates**: Service worker automatically updates cached files when new versions are available

## Usage

- Navigate between interfaces using the bottom navigation bar
- In the chat interface, type messages and press Enter to send
- In the email interface, click on emails to view (functionality can be extended)
- The app works offline after the first visit

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (iOS 11.3+)
- Opera
