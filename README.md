# Zakariae Chelle — Portfolio

Static site (HTML / CSS / vanilla JS). No build step. Deploys as-is on GitHub Pages.

## Back Office (Admin CMS & Git Sync)

You can manage all portfolio elements (projects, skills, experience, education, translations, and CVs) and push directly to GitHub using the built-in Back Office web UI.

### Launch Back Office:
- **Windows double-click**: Run `start-admin.bat`
- **Or via CLI**:
  ```bash
  npm run admin
  # Or: node admin/server.js
  ```
- **Web UI**: Open [http://localhost:3333/admin](http://localhost:3333/admin)
- **Live Preview**: Open [http://localhost:3333/](http://localhost:3333/)

When you save changes in the Back Office:
1. It updates the centralized `data/portfolio-data.json`.
2. It automatically compiles and writes to `index.html`, `config.js`, and `i18n.js`.
3. In the **Git & Deploy** tab, you can inspect modified files, view the live diff, and click **"Commit & Push to GitHub"** with a single click.

## Run locally without back office
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Files & Structure
| File / Directory | What it is |
|---|---|
| `admin/` | Back Office web interface, HTTP server, and sync builder |
| `data/` | Centralized structured content (`portfolio-data.json`) |
| `index.html` | Pre-rendered static portfolio page for GitHub Pages |
| `styles.css` | Design tokens, animations, dark & light themes |
| `script.js` | Interactive diagrams, canvas network, language & theme switch |
| `i18n.js` | Multi-language dictionaries (French, Spanish, Arabic) |
| `config.js` | Site metadata, social links, CV paths, project URLs |
| `assets/` | Web fonts, favicon, Open Graph preview image |
| `resources/CV/` | Resumes in PDF format |

## Deploy to GitHub Pages
Changes can be committed and pushed directly from the Back Office **Git & Deploy** tab, or manually:
```bash
git add . && git commit -m "Update portfolio" && git push origin main
```
GitHub Pages serves the static site automatically from `origin/main`.
