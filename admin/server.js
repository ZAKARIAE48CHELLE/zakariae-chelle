'use strict';
/*
  Back office — LOCAL ONLY.

  This server is never deployed. It binds to 127.0.0.1, and every request must carry a secret
  token that is generated at start-up and printed in the terminal (one-time link → HttpOnly cookie).
  Even so, it defends against the attacks that work against localhost services:
    - DNS rebinding         → Host header must be 127.0.0.1:<port> or localhost:<port>
    - Cross-site requests   → state-changing calls need same-origin (Origin / Sec-Fetch-Site) + a JSON/PDF content type
    - Cookie theft/CSRF     → HttpOnly + SameSite=Strict cookie, no CORS headers at all
    - Path traversal        → static files resolved and checked against their root
    - Shell injection       → git is always called with an argument array (see lib/git.js)
*/
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFile } = require('child_process');

const { buildPortfolio, listIcons } = require('./lib/builder');
const { validate, slug } = require('./lib/validate');
const i18n = require('./lib/i18n');
const { Store } = require('./lib/store');
const { GitManager } = require('./lib/git');

const ROOT = path.resolve(__dirname, '..');
const FRONT = path.join(ROOT, 'front');
const PUBLIC = path.join(__dirname, 'public');
const HOST = '127.0.0.1';
const BASE_PORT = parseInt(process.env.PORT || '3333', 10);
const TOKEN = process.env.ADMIN_TOKEN || crypto.randomBytes(24).toString('hex');
const COOKIE = 'zc_admin';
const MAX_JSON = 5 * 1024 * 1024;
const MAX_PDF = 12 * 1024 * 1024;

const store = new Store(ROOT);
const git = new GitManager(ROOT);
let PORT = BASE_PORT;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8'
};

const CSP_ADMIN = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'";
const CSP_PREVIEW = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'";

function baseHeaders(extra) {
  return Object.assign({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-store' }, extra);
}
function send(res, status, body, headers) {
  res.writeHead(status, baseHeaders(headers));
  res.end(body);
}
function json(res, status, obj) {
  send(res, status, JSON.stringify(obj), { 'Content-Type': 'application/json; charset=utf-8', 'Content-Security-Policy': "default-src 'none'" });
}
const fail = (status, message, extra) => Object.assign(new Error(message), { status }, extra || {});

/* ---------- auth & request checks ---------- */
function safeEq(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function cookieToken(req) {
  const m = String(req.headers.cookie || '').match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([A-Za-z0-9]+)'));
  return m ? m[1] : '';
}
function hostOk(req) {
  const h = String(req.headers.host || '').toLowerCase();
  return h === `${HOST}:${PORT}` || h === `localhost:${PORT}`;
}
function sameOrigin(req) {
  const site = req.headers['sec-fetch-site'];
  if (site && site !== 'same-origin' && site !== 'none') return false;
  const origin = req.headers.origin;
  if (origin) {
    try { const u = new URL(origin); if (!(u.hostname === HOST || u.hostname === 'localhost') || String(u.port) !== String(PORT)) return false; }
    catch (e) { return false; }
  }
  return true;
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(fail(413, 'Payload too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
async function readJson(req) {
  if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) throw fail(415, 'Expected application/json');
  const buf = await readBody(req, MAX_JSON);
  try { return buf.length ? JSON.parse(buf.toString('utf8')) : {}; } catch (e) { throw fail(400, 'Invalid JSON'); }
}

/* ---------- static serving (traversal-safe) ---------- */
function serveFile(res, root, rel, csp) {
  let decoded;
  try { decoded = decodeURIComponent(rel); } catch (e) { return send(res, 400, 'Bad request'); }
  if (decoded.includes('\0')) return send(res, 400, 'Bad request');
  let file = path.resolve(root, '.' + path.sep + decoded.replace(/^\/+/, ''));
  if (file !== root && !file.startsWith(root + path.sep)) return send(res, 403, 'Forbidden');
  fs.stat(file, (err, st) => {
    if (!err && st.isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (e2, buf) => {
      if (e2) return send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
      const ext = path.extname(file).toLowerCase();
      send(res, 200, buf, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Content-Security-Policy': csp });
    });
  });
}

/* ---------- domain helpers ---------- */
function buildState(extra) {
  const { data, rev } = store.read();
  const english = require('./lib/builder').englishMap(data, ROOT);
  return Object.assign({
    data, rev, icons: listIcons(ROOT),
    i18n: i18n.status(data, english), english,
    validation: validate(data, ROOT),
    backups: store.listBackups().slice(0, 30)
  }, extra || {});
}

/** Validate → apply optional i18n op → track translation freshness → back up + atomic save → rebuild site. */
function saveAndBuild(body, label) {
  const next = body.data;
  if (!next || typeof next !== 'object') throw fail(400, 'Missing data');
  const { data: current } = store.read();
  const v = validate(next, ROOT);
  if (v.errors.length) throw fail(422, `${v.errors.length} problem(s) must be fixed before saving.`, { validation: v });
  const english = require('./lib/builder').englishMap(next, ROOT);
  next.schemaVersion = 2;
  i18n.trackChanges(current, next, english, require('./lib/builder').englishMap(current, ROOT));
  const op = body.op;
  if (op && op.type === 'review' && /^(fr|es|ar)$/.test(op.lang) && Array.isArray(op.keys)) i18n.markReviewed(next, english, op.lang, op.keys.map(String));
  if (op && op.type === 'prune') i18n.prune(next, english);
  const rev = store.save(next, body.rev, op ? op.type : label || 'save');
  const built = buildPortfolio(ROOT, next);
  return { rev, built, validation: v };
}

function saveCv(lang, buf) {
  if (!/^[a-z]{2}$/.test(lang)) throw fail(400, 'Language must be a two-letter code');
  if (buf.length < 100 || buf.slice(0, 5).toString('latin1') !== '%PDF-') throw fail(400, 'That file is not a PDF.');
  const { data, rev } = store.read();
  data.profile = data.profile || {};
  data.profile.cv = data.profile.cv || {};
  const existing = data.profile.cv[lang];
  let rel = existing && /^resources\/CV\/[\w.-]+\.pdf$/.test(existing) ? existing : `resources/CV/${(slug(data.profile.name) || 'cv').toUpperCase().replace(/-/g, '_')}_${lang.toUpperCase()}.pdf`;
  const dir = path.join(SITE, 'resources', 'CV');
  fs.mkdirSync(dir, { recursive: true });
  const target = path.resolve(SITE, rel);
  if (!target.startsWith(dir + path.sep)) throw fail(400, 'Bad file name');
  const tmp = target + '.tmp';
  fs.writeFileSync(tmp, buf); fs.renameSync(tmp, target);
  data.profile.cv[lang] = rel;
  const newRev = store.save(data, rev, 'cv-' + lang);
  const built = buildPortfolio(ROOT, data);
  return { rev: newRev, path: rel, built };
}

/* ---------- API ---------- */
async function api(req, res, pathname, query) {
  const m = req.method;
  const route = m + ' ' + pathname;

  if (route === 'GET /api/state') return json(res, 200, buildState());

  if (route === 'POST /api/validate') {
    const b = await readJson(req);
    return json(res, 200, validate(b.data, ROOT));
  }
  if (route === 'POST /api/english') {
    // translation status for an unsaved draft
    const b = await readJson(req);
    if (!b.data || typeof b.data !== 'object') throw fail(400, 'Missing data');
    const english = require('./lib/builder').englishMap(b.data, ROOT);
    return json(res, 200, { english, i18n: i18n.status(b.data, english) });
  }
  if (route === 'POST /api/save') {
    const b = await readJson(req);
    const r = saveAndBuild(b);
    return json(res, 200, Object.assign({ success: true }, buildState({ built: r.built })));
  }
  if (route === 'POST /api/build') {
    const r = buildPortfolio(ROOT);
    return json(res, 200, { success: true, built: r });
  }
  if (route === 'POST /api/cv') {
    if (!/^application\/pdf\b/i.test(req.headers['content-type'] || '')) throw fail(415, 'Expected application/pdf');
    const buf = await readBody(req, MAX_PDF);
    const r = saveCv(String(query.get('lang') || ''), buf);
    return json(res, 200, Object.assign({ success: true }, buildState({ built: r.built, cvPath: r.path })));
  }
  if (route === 'GET /api/backups') return json(res, 200, { backups: store.listBackups() });
  if (m === 'GET' && pathname.startsWith('/api/backups/')) {
    return json(res, 200, { data: store.readBackup(decodeURIComponent(pathname.slice('/api/backups/'.length))) });
  }

  if (route === 'GET /api/git/status') return json(res, 200, await git.status());
  if (route === 'GET /api/git/diff') return json(res, 200, await git.diff());
  if (route === 'GET /api/git/log') return json(res, 200, await git.log(15));
  if (route === 'POST /api/git/fetch') return json(res, 200, await git.fetch());
  if (route === 'POST /api/git/pull') return json(res, 200, await git.pull());
  if (route === 'POST /api/git/commit') { const b = await readJson(req); return json(res, 200, await git.commit(b.message)); }
  if (route === 'POST /api/git/push') return json(res, 200, await git.push());
  if (route === 'POST /api/git/publish') { const b = await readJson(req); return json(res, 200, await git.commitAndPush(b.message)); }

  if (route === 'POST /api/quit') {
    json(res, 200, { success: true });
    setTimeout(() => process.exit(0), 150);
    return;
  }
  throw fail(404, 'Unknown API route');
}

/* ---------- request handler ---------- */
async function handler(req, res) {
  try {
    if (!hostOk(req)) return send(res, 421, 'Misdirected request');
    const u = new URL(req.url, `http://${HOST}:${PORT}`);
    const pathname = u.pathname;

    // one-time login link: /?t=<token>  → sets cookie, redirects to a clean URL
    if (req.method === 'GET' && u.searchParams.has('t')) {
      if (!safeEq(u.searchParams.get('t'), TOKEN)) return send(res, 401, 'Invalid token', { 'Content-Type': 'text/plain; charset=utf-8' });
      return send(res, 302, '', { 'Set-Cookie': `${COOKIE}=${TOKEN}; HttpOnly; SameSite=Strict; Path=/`, Location: '/' });
    }
    if (!safeEq(cookieToken(req), TOKEN)) {
      return send(res, 401, 'Not signed in. Open the link printed in the terminal where you started the back office.', { 'Content-Type': 'text/plain; charset=utf-8' });
    }

    if (pathname.startsWith('/api/')) {
      if (req.method !== 'GET') {
        if (!sameOrigin(req)) throw fail(403, 'Cross-origin request blocked');
      }
      return await api(req, res, pathname, u.searchParams);
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');

    if (pathname === '/preview' ) return send(res, 302, '', { Location: '/preview/' });
    if (pathname.startsWith('/preview/')) return serveFile(res, FRONT, pathname.slice('/preview/'.length) || 'index.html', CSP_PREVIEW);
    // admin shared renderer: reuse the public site's diagram.js so previews match the real site exactly
    if (pathname === '/shared/diagram.js') return serveFile(res, FRONT, 'diagram.js', CSP_ADMIN);
    return serveFile(res, PUBLIC, pathname === '/' ? 'index.html' : pathname, CSP_ADMIN);
  } catch (e) {
    const status = e.status || 500;
    if (!e.status) console.error(e);
    const out = { success: false, error: e.message || 'Server error' };
    if (e.validation) out.validation = e.validation;
    if (status === 409) out.conflict = true;
    return json(res, status, out);
  }
}

function openBrowser(url) {
  if (process.env.NO_OPEN || process.env.CI) return;
  const cmd = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]] : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
  try { execFile(cmd[0], cmd[1], () => {}); } catch (e) { /* the link is printed anyway */ }
}

function listen(port, tries) {
  const server = http.createServer(handler);
  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE' && tries > 0) return listen(port + 1, tries - 1);
    console.error('Could not start the back office:', e.message); process.exit(1);
  });
  server.listen(port, HOST, () => {
    PORT = port;
    const link = `http://${HOST}:${PORT}/?t=${TOKEN}`;
    console.log('\n  Back office running (local only — never deploy this).\n');
    console.log('  Open: ' + link + '\n');
    console.log('  Press Ctrl+C to stop.\n');
    openBrowser(link);
  });
  return server;
}

if (require.main === module) listen(BASE_PORT, 20);
module.exports = { listen, TOKEN };
