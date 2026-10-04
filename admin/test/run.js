'use strict';
/* Zero-dependency checks: node tools/admin/test/run.js  (works on a temp copy; never touches your data). */
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const SRC = path.resolve(__dirname, '..', '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'zc-test-'));
const ROOT = path.join(TMP, 'repo');
fs.cpSync(SRC, ROOT, { recursive: true, filter: (p) => !/[\\/](\.git|node_modules|\.backups)([\\/]|$)/.test(p) });

const PORT = 3900 + Math.floor(Math.random() * 90), TOKEN = 'testtoken0123';
let pass = 0;
const ok = (name) => { pass++; console.log('  ✓ ' + name); };

function req(method, p, { body, headers = {}, cookie = true, host } = {}) {
  return new Promise((resolve, reject) => {
    const h = Object.assign({}, headers);
    if (cookie) h.Cookie = 'zc_admin=' + TOKEN;
    if (host) h.Host = host;
    let payload = body;
    if (body && typeof body === 'object' && !Buffer.isBuffer(body)) { payload = JSON.stringify(body); h['Content-Type'] = h['Content-Type'] || 'application/json'; }
    const r = http.request({ host: '127.0.0.1', port: PORT, method, path: p, headers: h }, (res) => {
      const c = []; res.on('data', (d) => c.push(d));
      res.on('end', () => { const t = Buffer.concat(c).toString('utf8'); let j = null; try { j = JSON.parse(t); } catch (e) {} resolve({ status: res.statusCode, text: t, json: j, headers: res.headers }); });
    });
    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

(async () => {
  console.log('Builder');
  const { buildPortfolio } = require(path.join(ROOT, 'admin/lib/builder'));
  const before = fs.readFileSync(path.join(ROOT, 'front/index.html'), 'utf8');
  const r1 = buildPortfolio(ROOT);
  assert.strictEqual(fs.readFileSync(path.join(ROOT, 'front/index.html'), 'utf8'), before); ok('build is deterministic (front/index.html unchanged)');
  assert.deepStrictEqual(r1.updatedFiles, []); ok('second build writes nothing');

  console.log('Server security');
  const srv = spawn(process.execPath, [path.join(ROOT, 'admin/server.js')], { env: Object.assign({}, process.env, { PORT: String(PORT), ADMIN_TOKEN: TOKEN, NO_OPEN: '1' }), stdio: 'ignore' });
  for (let i = 0; i < 40; i++) { try { await req('GET', '/', { cookie: false }); break; } catch (e) { await new Promise((r) => setTimeout(r, 100)); } }
  try {
    assert.strictEqual((await req('GET', '/api/state', { cookie: false })).status, 401); ok('API refuses requests without the token');
    assert.strictEqual((await req('GET', '/?t=wrong', { cookie: false })).status, 401); ok('wrong token rejected');
    const login = await req('GET', '/?t=' + TOKEN, { cookie: false });
    assert.strictEqual(login.status, 302); assert.ok(/HttpOnly/.test(login.headers['set-cookie'][0]) && /SameSite=Strict/.test(login.headers['set-cookie'][0])); ok('login sets HttpOnly + SameSite=Strict cookie');
    assert.strictEqual((await req('GET', '/api/state', { host: 'evil.example:' + PORT })).status, 421); ok('foreign Host header blocked (DNS rebinding)');
    assert.strictEqual((await req('POST', '/api/git/commit', { body: {}, headers: { Origin: 'http://evil.example' } })).status, 403); ok('cross-origin POST blocked');
    assert.strictEqual((await req('POST', '/api/validate', { body: '{}', headers: { 'Content-Type': 'text/plain' } })).status, 415); ok('non-JSON POST blocked');
    assert.ok(!('access-control-allow-origin' in (await req('GET', '/api/state')).headers)); ok('no CORS headers');
    assert.strictEqual((await req('GET', '/preview/%2e%2e/%2e%2e/package.json')).status, 404); ok('path traversal blocked');
    assert.strictEqual((await req('POST', '/api/cv?lang=en', { body: Buffer.from('x'.repeat(300)), headers: { 'Content-Type': 'application/pdf' } })).status, 400); ok('non-PDF upload rejected');

    console.log('Data');
    const st = (await req('GET', '/api/state')).json;
    assert.deepStrictEqual(st.validation.errors, []); ok('shipped data validates');
    const stale = await req('POST', '/api/save', { body: { data: st.data, rev: 'stale' } });
    assert.strictEqual(stale.status, 409); ok('stale save → 409 (optimistic lock)');
    const bad = JSON.parse(JSON.stringify(st.data)); bad.profile.email = 'nope';
    assert.strictEqual((await req('POST', '/api/save', { body: { data: bad, rev: st.rev } })).status, 422); ok('invalid data cannot be saved');
    const edit = JSON.parse(JSON.stringify(st.data)); edit.profile.headline = 'Hello <script>alert(1)</script>';
    const saved = await req('POST', '/api/save', { body: { data: edit, rev: st.rev } });
    assert.strictEqual(saved.status, 200);
    const html = fs.readFileSync(path.join(ROOT, 'front/index.html'), 'utf8');
    assert.ok(!html.includes('<script>alert(1)</script>')); ok('HTML in content is escaped in the built page');
    assert.ok(fs.readdirSync(path.join(ROOT, 'data/.backups')).length >= 1); ok('save creates a backup');
    const msg = (await req('POST', '/api/git/commit', { body: { message: '"; touch /tmp/pwned; "' } })).json;
    assert.ok(!fs.existsSync('/tmp/pwned')); ok('commit message cannot inject shell commands');
  } finally { srv.kill(); fs.rmSync(TMP, { recursive: true, force: true }); }
  console.log(`\n${pass} checks passed.`);
})().catch((e) => { console.error('\nFAILED:', e.message); process.exitCode = 1; });
