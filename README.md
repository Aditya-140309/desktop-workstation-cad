# Desktop Computer Workstation: CAD/CAM Project Showcase

**Branch:** Robotics and AI · COEP Technological University, Pune

A static academic showcase website for a desktop computer workstation. The site uses HTML, CSS and JavaScript, with Three.js loaded from a public CDN for the illustrative 3D viewer.

## Files
- `index.html` — website content
- `style.css` — styling and responsive layout
- `script.js` — navigation, component highlighting and conceptual 3D viewer
- `assets/ref-desktop-setup.png` — desktop setup reference image
- `assets/ref-technical-drawing.png` — orthographic reference drawing

## Important notes
- The two images in `assets/` are reference visuals, not original CAD screenshots. The technical drawing includes a third-party watermark; check the source's reuse terms before publishing it publicly, or replace it with an image you have permission to use.
- The interactive 3D viewer is an illustrative conceptual model, not CAD output and not to scale.
- No physical model, measurements, test results, or specific CAD/CAM software usage are claimed.

## Publish with GitHub Pages
1. Create a public GitHub repository named `desktop-workstation-cad`.
2. Upload the contents of this folder to the repository root. Keep the `assets` folder and its two image files together. `index.html` must be at the root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select branch `main` and folder `/ (root)`, then save.
5. After GitHub Pages publishes the site, its address will look like `https://YOUR-USERNAME.github.io/desktop-workstation-cad/`.
6. Use that exact live address to generate the final QR code and update the brochure. Do not use a placeholder URL.

The 3D viewer needs an internet connection to load Three.js from the CDN. The rest of the page remains readable if the CDN is unavailable.
