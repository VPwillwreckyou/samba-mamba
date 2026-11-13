# Samba & Mamba — 3D Interactive Site

An immersive, dark-luxury 3D landing experience built with Three.js (ES modules, no bundler).

## Run on Replit
1. Create a new Replit using the **Node.js** template and upload these files (or import this repo).
2. Click **Run** — it starts `node server.js` and serves the site on port 3000.
3. Open the webview. That's it — zero npm installs required.

## Run locally
```bash
node server.js
# then open http://localhost:3000
```
Any static server works too (`npx serve .`, Python's `http.server`, etc.) since everything is plain HTML/CSS/JS loaded via an import map from a CDN.

## Structure
- `index.html` — markup: age gate, hero, glass info panel, canvas
- `style.css` — dark purple/pink luxury theme, glassmorphism, responsive layout
- `main.js` — Three.js scene: floating product ring, particles, bloom post-processing, OrbitControls, raycasting/click interactions
- `server.js` — zero-dependency static file server (Node's built-in `http`/`fs`)

## Notes
- Three.js is loaded via an **import map** pointing at the `three@0.169.0` ES module build on jsDelivr — no build step, no `npm install`.
- Product copy and category structure are drawn from the real sambabrand.com catalog (Five/Four Of A Kind pre-rolls, Samba MIT tablets, Samba7/Mamba7, Double Stack Hummy, THC Disposables).
- The age gate uses `sessionStorage` so a verified visitor isn't re-prompted on reload within the same tab session.
