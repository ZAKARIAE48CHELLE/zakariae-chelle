# Zakariae Chelle — Portfolio

Static site (HTML / CSS / vanilla JS). No build step. Deploys as-is on GitHub Pages.

## Run locally
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
(Opening index.html directly with file:// also works, except fonts are blocked by the browser — use the server.)

## Files
| File | What it is |
|---|---|
| `index.html` | All content (English). Sections: hero, about, 3 featured projects, more projects, skills, experience, education, contact |
| `styles.css` | Design tokens (colors, fonts) at the top, dark + light themes |
| `script.js` | Architecture diagrams, hero network animation, language/theme switch, interactions |
| `i18n.js` | French, Spanish, Arabic translations (keys match `data-i18n` in the HTML) |
| `config.js` | **Edit this**: email, GitHub, LinkedIn, CV paths, project links |
| `assets/` | Self-hosted fonts, favicon, social-share image |
| `resources/CV/` | CV PDFs (English + French) |

## Add project links
Open `config.js` and paste URLs. A button (GitHub / Demo / Report) appears on that project only when a URL is set.

## Change text
English: edit it directly in `index.html`. Other languages: edit the same key in `i18n.js`.

## Deploy
```bash
git add . && git commit -m "Redesign portfolio" && git push
```
GitHub Pages serves from the repo root.
