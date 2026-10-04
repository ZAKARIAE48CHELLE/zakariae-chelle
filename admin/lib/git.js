'use strict';
const { execFile } = require('child_process');
const path = require('path');

/* All git calls use execFile with an argument array: user input is never interpreted by a shell. */
function run(args, cwd, timeout = 60000) {
  return new Promise((resolve) => {
    execFile('git', args, { cwd, timeout, maxBuffer: 10 * 1024 * 1024, env: Object.assign({}, process.env, { GIT_TERMINAL_PROMPT: '0' }) }, (error, stdout, stderr) => {
      resolve({ ok: !error, stdout: String(stdout || ''), stderr: String(stderr || ''), error: error ? error.message : null });
    });
  });
}
const BRANCH_RE = /^[A-Za-z0-9][A-Za-z0-9._\/-]{0,100}$/;
const cleanMessage = (m) => String(m || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, 200) || 'Update portfolio via back office';

class GitManager {
  constructor(root) { this.root = root || path.resolve(__dirname, '..', '..'); }

  async status() {
    const r = await run(['status', '--porcelain=v1', '-b'], this.root);
    if (!r.ok) return { success: false, error: r.stderr || r.error };
    const lines = r.stdout.split('\n').filter(Boolean);
    const head = lines[0] || '';
    const m = head.match(/^##\s+(?:No commits yet on\s+)?([^\s.]+)(?:\.\.\.(\S+))?(?:\s+\[(.*)\])?/);
    const branch = m ? m[1] : 'main', upstream = m && m[2] ? m[2] : null, track = (m && m[3]) || '';
    const ahead = parseInt((track.match(/ahead (\d+)/) || [])[1] || '0', 10);
    const behind = parseInt((track.match(/behind (\d+)/) || [])[1] || '0', 10);
    const files = lines.slice(1).map((l) => ({ code: l.slice(0, 2).trim() || '?', path: l.slice(3).trim().replace(/^"|"$/g, '') }));
    const remote = (await run(['remote', 'get-url', 'origin'], this.root)).stdout.trim();
    return { success: true, branch, upstream, ahead, behind, clean: files.length === 0, files, remote: remote.replace(/\/\/[^@/]+@/, '//') };
  }

  async diff() {
    const r = await run(['diff', 'HEAD', '--stat', '--patch', '--no-color', '--', '.', ':(exclude)data/.backups'], this.root);
    let text = r.stdout || '';
    const untracked = (await run(['ls-files', '--others', '--exclude-standard'], this.root)).stdout.trim();
    if (untracked) text += (text ? '\n' : '') + 'New files (untracked):\n' + untracked.split('\n').map((f) => '  + ' + f).join('\n');
    const MAX = 200000;
    return { success: r.ok, diff: text.length > MAX ? text.slice(0, MAX) + '\n… (diff truncated)' : text };
  }

  async log(n = 10) {
    const r = await run(['log', '-n', String(Math.min(50, n | 0 || 10)), '--pretty=format:%h\x1f%an\x1f%ar\x1f%s'], this.root);
    if (!r.ok) return { success: false, commits: [] };
    return { success: true, commits: r.stdout.split('\n').filter(Boolean).map((l) => { const [hash, author, date, ...s] = l.split('\x1f'); return { hash, author, relativeDate: date, subject: s.join(' ') }; }) };
  }

  async fetch() { const r = await run(['fetch', '--prune', 'origin'], this.root, 45000); return { success: r.ok, output: (r.stdout + r.stderr).trim(), error: r.ok ? null : (r.stderr || r.error) }; }
  async pull() { const r = await run(['pull', '--ff-only', 'origin'], this.root, 60000); return { success: r.ok, output: (r.stdout + r.stderr).trim(), error: r.ok ? null : (r.stderr || r.error) }; }

  async commit(message) {
    const logs = [];
    const add = await run(['add', '-A'], this.root);
    logs.push('> git add -A\n' + (add.stdout + add.stderr).trim());
    if (!add.ok) return { success: false, step: 'add', output: logs.join('\n\n'), error: add.stderr };
    const dirty = (await run(['status', '--porcelain'], this.root)).stdout.trim();
    if (!dirty) return { success: true, nothing: true, message: 'Nothing to commit.', output: logs.join('\n\n') };
    const msg = cleanMessage(message);
    const c = await run(['commit', '-m', msg], this.root);
    logs.push(`> git commit -m ${JSON.stringify(msg)}\n` + (c.stdout + c.stderr).trim());
    return { success: c.ok, step: 'commit', output: logs.join('\n\n'), error: c.ok ? null : (c.stderr || c.error) };
  }

  async push() {
    const st = await this.status();
    if (!st.success) return { success: false, step: 'status', error: st.error, output: '' };
    if (!BRANCH_RE.test(st.branch)) return { success: false, step: 'push', error: 'Unsafe branch name', output: '' };
    if (st.behind > 0) return { success: false, step: 'push', error: `The remote has ${st.behind} newer commit(s). Pull first, then push.`, output: '' };
    const args = st.upstream ? ['push', 'origin', st.branch] : ['push', '-u', 'origin', st.branch];
    const r = await run(args, this.root, 90000);
    return { success: r.ok, step: 'push', output: `> git ${args.join(' ')}\n${(r.stdout + r.stderr).trim()}`, error: r.ok ? null : (r.stderr || r.error) };
  }

  async commitAndPush(message) {
    const c = await this.commit(message);
    if (!c.success) return c;
    const p = await this.push();
    return Object.assign({}, p, { output: [c.output, p.output].filter(Boolean).join('\n\n'), step: p.success ? 'pushed' : 'push' });
  }
}

module.exports = { GitManager };
