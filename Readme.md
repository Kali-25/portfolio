# Kali Saikiran - DevOps Engineer Portfolio

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Kali-25/portfolio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🌐 **Live Site:** [saikiran.cloud](https://saikiran.cloud)

An immersive 3D portfolio for a DevOps Engineer — the entire site floats over a living particle swarm
that morphs, reacts to the cursor, and re-shapes itself as you scroll. Built with vanilla JS + Three.js,
no frameworks, no build step.

## 🚀 Tech Stack

- **Frontend Core:** HTML5, CSS3, JavaScript (ES6+)
- **3D Engine:** Three.js (CDN) — WebGL particle system, additive blending
- **Styling:** Dark neon glassmorphism, CSS variables, Flexbox/Grid
- **Hosting:** Cloudflare Workers (Edge Deployment, static assets)
- **Performance:** Zero build step, one external dependency (Three.js via jsDelivr)

## ✨ Key Features

### 🌌 The Particle Swarm
- **Up to 14,000 GPU-rendered particles** in a cyan → violet → pink gradient (auto-scales down on mobile / low-end hardware).
- **6 morphing formations:** SPHERE, HELIX (DNA with base-pair rungs), KNOT (torus knot), GALAXY (3-arm spiral), GRID (infra lattice), WAVE (animated ocean).
- **Scroll-driven morphing:** each section triggers its own formation — skills = grid, experience = helix, projects = knot, contact = wave. A SWARM dock in the hero lets you override manually.
- **Fully interactive:** drag to rotate with inertia, mouse parallax, cursor force-field that physically bends the swarm, click anywhere for a shockwave pulse.
- **Corner HUD:** live particle count, current formation, and FPS.

### 🧩 Interactive UI
- **Glass cards** with mouse-tracking glow and physics-based 3D tilt.
- **Text scramble/decrypt** on section titles and the rotating role line.
- **Magnetic buttons**, custom glow cursor with press states, hero depth parallax.
- **"CALIBRATING PARTICLES" loader**, scroll progress bar, staggered blur-reveal animations.

### 📱 Responsive & Performant
- **Mobile-first:** adaptive layout; particle count and effects scale to the device; respects `prefers-reduced-motion`.
- **Graceful degradation:** if WebGL or the CDN is unavailable, the site renders cleanly without the swarm.
- **SEO Friendly:** semantic HTML5 structure and Open Graph meta tags.

## 📂 Project Structure

```bash
portfolio/
├── index.html        # Semantic HTML5 structure
├── styles.css        # Dark neon glass theme
├── script.js         # Particle engine (Three.js) + UI motion
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
