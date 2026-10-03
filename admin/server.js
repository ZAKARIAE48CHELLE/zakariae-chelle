const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { buildPortfolio } = require('./builder');
const { GitManager } = require('./git');

const PORT = parseInt(process.env.PORT || '3333', 10);
const ROOT_DIR = path.resolve(__dirname, '..');
const git = new GitManager(ROOT_DIR);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 50 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON: ' + err.message));
      }
    });
    req.on('error', reject);
  });
}

function serveStatic(req, res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // --- API Endpoints ---
  if (pathname.startsWith('/api/')) {
    try {
      if (req.method === 'GET' && pathname === '/api/data') {
        const dataPath = path.join(ROOT_DIR, 'data', 'portfolio-data.json');
        if (!fs.existsSync(dataPath)) {
          buildPortfolio(ROOT_DIR);
        }
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        return sendJson(res, 200, { success: true, data });
      }

      if (req.method === 'POST' && pathname === '/api/save') {
        const payload = await parseJsonBody(req);
        if (!payload.data) {
          return sendJson(res, 400, { success: false, error: 'Missing data in request body' });
        }

        const dataPath = path.join(ROOT_DIR, 'data', 'portfolio-data.json');
        fs.writeFileSync(dataPath, JSON.stringify(payload.data, null, 2), 'utf8');

        // Compile to config.js, i18n.js, and index.html
        const buildRes = buildPortfolio(ROOT_DIR);

        return sendJson(res, 200, {
          success: true,
          message: 'Saved changes and compiled portfolio files successfully!',
          updatedFiles: buildRes.updatedFiles
        });
      }

      if (req.method === 'GET' && pathname === '/api/git/status') {
        const status = await git.getStatus();
        return sendJson(res, 200, status);
      }

      if (req.method === 'GET' && pathname === '/api/git/diff') {
        const diff = await git.getDiff();
        return sendJson(res, 200, diff);
      }

      if (req.method === 'GET' && pathname === '/api/git/log') {
        const log = await git.getLog(10);
        return sendJson(res, 200, log);
      }

      if (req.method === 'POST' && pathname === '/api/git/push') {
        const payload = await parseJsonBody(req);
        const result = await git.commitAndPush(payload.message || '', true);
        return sendJson(res, result.success ? 200 : 500, result);
      }

      if (req.method === 'POST' && pathname === '/api/git/commit') {
        const payload = await parseJsonBody(req);
        const result = await git.commitAndPush(payload.message || '', false);
        return sendJson(res, result.success ? 200 : 500, result);
      }

      if (req.method === 'POST' && pathname === '/api/upload-cv') {
        const payload = await parseJsonBody(req);
        const { lang, fileName, base64 } = payload;
        if (!lang || !base64) {
          return sendJson(res, 400, { success: false, error: 'lang and base64 data required' });
        }

        const cvDir = path.join(ROOT_DIR, 'resources', 'CV');
        if (!fs.existsSync(cvDir)) fs.mkdirSync(cvDir, { recursive: true });

        const safeFileName = fileName ? path.basename(fileName).replace(/[^a-zA-Z0-9_\-\.]/g, '_') : `CV_${lang.toUpperCase()}.pdf`;
        const targetPath = path.join(cvDir, safeFileName);
        const buffer = Buffer.from(base64.replace(/^data:[^;]+;base64,/, ''), 'base64');
        fs.writeFileSync(targetPath, buffer);

        const relPath = `resources/CV/${safeFileName}`;
        // Update portfolio-data.json
        const dataPath = path.join(ROOT_DIR, 'data', 'portfolio-data.json');
        const pData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        if (!pData.profile.cv) pData.profile.cv = {};
        pData.profile.cv[lang] = relPath;
        fs.writeFileSync(dataPath, JSON.stringify(pData, null, 2), 'utf8');

        buildPortfolio(ROOT_DIR);

        return sendJson(res, 200, { success: true, path: relPath, message: `Uploaded CV for ${lang}` });
      }

      return sendJson(res, 404, { success: false, error: 'API route not found' });
    } catch (err) {
      console.error('API Error:', err);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // --- Admin Routes ---
  if (pathname === '/admin' || pathname === '/admin/') {
    return serveStatic(req, res, path.join(__dirname, 'admin.html'));
  }
  if (pathname === '/admin/admin.css') {
    return serveStatic(req, res, path.join(__dirname, 'admin.css'));
  }
  if (pathname === '/admin/admin.js') {
    return serveStatic(req, res, path.join(__dirname, 'admin.js'));
  }

  // --- Static Portfolio Serving ---
  let filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);
  // Security check to avoid directory traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden');
  }

  serveStatic(req, res, filePath);
});

server.listen(PORT, () => {
  console.log('----------------------------------------------------');
  console.log(`Portfolio Admin Server running!`);
  console.log(`> Back Office: http://localhost:${PORT}/admin`);
  console.log(`> Live Portfolio: http://localhost:${PORT}/`);
  console.log('----------------------------------------------------');
});
