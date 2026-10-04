# Zakariae Chelle — Portfolio

Personal portfolio website (HTML5 / Vanilla CSS / Modern Vanilla JavaScript).

```
index.html, styles.css, script.js   ← Main portfolio site
config.js, i18n.js, diagrams.js     ← Client configuration & translations
diagram.js                          ← Pure SVG architecture diagram renderer
assets/                             ← Fonts, icons, and social preview images
resources/CV/                       ← Curriculum Vitae PDFs (EN / FR)
```

## Features

- **Responsive & Lightweight:** Pure vanilla web stack (no frameworks, zero bundle overhead).
- **Interactive Architecture Diagrams:** Custom interactive SVG system diagrams.
- **Multilingual Support:** English, French (Français), Spanish (Español), and Arabic (العربية with full RTL support).
- **Accessible & Fast:** System font fallbacks with local self-hosted woff2 fonts.

## Deployment

Configured for automatic deployment to **GitHub Pages** via GitHub Actions workflow (`.github/workflows/pages.yml`). Any push to `main` automatically deploys the website.

## Local Development

To run locally using any static web server:

```bash
# Example with Python:
python -m http.server 8000

# Or with Node.js:
npx serve .
```

Then open `http://localhost:8000` in your browser.
