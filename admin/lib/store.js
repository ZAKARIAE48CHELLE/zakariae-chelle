'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MAX_BACKUPS = 50;

class Store {
  constructor(root) {
    this.root = root;
    this.file = path.join(root, 'data', 'portfolio-data.json');
    this.backupDir = path.join(root, 'data', '.backups');
  }
  _raw() { return fs.readFileSync(this.file, 'utf8'); }
  rev(raw) { return crypto.createHash('sha1').update(raw == null ? this._raw() : raw).digest('hex').slice(0, 12); }
  read() { const raw = this._raw(); return { data: JSON.parse(raw), rev: this.rev(raw) }; }

  _atomicWrite(file, text) {
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, text, 'utf8');
    fs.renameSync(tmp, file);
  }
  backup(label) {
    if (!fs.existsSync(this.file)) return null;
    fs.mkdirSync(this.backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const name = `${stamp}${label ? '__' + String(label).replace(/[^a-z0-9-]/gi, '').slice(0, 24) : ''}.json`;
    fs.copyFileSync(this.file, path.join(this.backupDir, name));
    const all = this.listBackups();
    all.slice(MAX_BACKUPS).forEach((b) => fs.unlinkSync(path.join(this.backupDir, b.name)));
    return name;
  }
  /** Save with optimistic locking: refuse if the file changed since the client loaded it. */
  save(data, expectedRev, label) {
    if (expectedRev && fs.existsSync(this.file) && this.rev() !== expectedRev) {
      const e = new Error('The data changed on disk since you opened this page (another tab or a manual edit). Reload to avoid overwriting it.');
      e.status = 409; throw e;
    }
    this.backup(label || 'save');
    const text = JSON.stringify(data, null, 2) + '\n';
    this._atomicWrite(this.file, text);
    return this.rev(text);
  }
  listBackups() {
    if (!fs.existsSync(this.backupDir)) return [];
    return fs.readdirSync(this.backupDir).filter((f) => f.endsWith('.json')).sort().reverse().map((name) => {
      const st = fs.statSync(path.join(this.backupDir, name));
      return { name, size: st.size, time: st.mtime.toISOString() };
    });
  }
  readBackup(name) {
    if (!/^[\w.-]+\.json$/.test(name) || name.includes('..')) throw Object.assign(new Error('Invalid backup name'), { status: 400 });
    const f = path.join(this.backupDir, name);
    if (!fs.existsSync(f)) throw Object.assign(new Error('Backup not found'), { status: 404 });
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  }
}

module.exports = { Store };
