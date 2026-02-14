# Kali Saikiran - DevOps Engineer Portfolio

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Kali-25/portfolio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🌐 **Live Site:** [saikiran.cloud](https://saikiran.cloud)

A highly interactive, modern, and responsive portfolio website designed for a DevOps Engineer. Built with pure performance in mind using Vanilla JS and CSS3, featuring a terminal-style boot sequence and glassmorphism UI.

## 🚀 Tech Stack

- **Frontend Core:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS Variables, Glassmorphism, Flexbox/Grid
- **Animations:** CSS Keyframes, Vanilla JS for 3D Tilt & Particles
- **Hosting:** Cloudflare Workers (Edge Deployment)
- **Performance:** Zero external heavy dependencies (No jQuery/Bootstrap)

## ✨ Key Features

### 🖥️ Immersive UI/UX
- **Terminal Boot Loader:** A custom ASCII-style boot sequence animation on initial load.
- **Glassmorphism Design:** Modern, frosted-glass aesthetics with dynamic lighting effects.
- **Interactive Particle Background:** Custom canvas-based particle network that reacts to mouse movement.

### 🧩 Interactive Elements
- **Smart Skill Cards:** Click-to-expand skill tags that reveal detailed experience descriptions inline.
- **3D Tilt Effect:** Physics-based tilt animation on cards (optimized for readability).
- **Magnetic Buttons:** Call-to-action buttons that magnetically snap to cursor movement.
- **Staggered Scroll Reveals:** Elements animate elegantly into view as you scroll.

### 📱 Responsive & Performant
- **Mobile-First Architecture:** Fully adaptive layout for mobile, tablet, and desktop.
- **Optimized Animations:** Hardware-accelerated CSS transitions for 60fps performance.
- **SEO Friendly:** Semantic HTML5 structure and meta tags-ready.

## 📂 Project Structure

```bash
portfolio/
├── index.html        # Semantic HTML5 structure
├── styles.css        # Custom CSS with variables & animations
├── script.js         # Interactive logic (Tilt, Particles, Loader)
├── wrangler.jsonc    # Cloudflare Workers configuration
└── README.md         # Project documentation
```

## 🛠️ Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kali-25/portfolio.git
   cd portfolio
   ```

2. **Start a local server**
   You can use python, live-server, or any static server.
   ```bash
   # Using npx (Node.js)
   npx live-server .

   # Using Python
   python3 -m http.server 8080
   ```

3. **Open in browser**
   Visit `http://localhost:8080` to see your changes live.

## 🚀 Deployment

The project is configured for **Cloudflare Workers**.

```bash
# Install wrangler (if not installed)
npm install -g wrangler

# Deploy to Cloudflare
wrangler deploy
```

## 📝 License

© 2026 Kali Saikiran. All rights reserved. Licensed under the MIT License.

---
_Engineered with ☕ and Code by Kali Saikiran_
