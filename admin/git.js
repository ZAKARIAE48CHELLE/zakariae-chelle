const { exec } = require('child_process');
const path = require('path');

function runCmd(command, cwd) {
  return new Promise((resolve) => {
    exec(command, { cwd, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        code: error ? (error.code || 1) : 0,
        stdout: stdout ? stdout.toString() : '',
        stderr: stderr ? stderr.toString() : '',
        error: error ? error.message : null
      });
    });
  });
}

class GitManager {
  constructor(rootDir) {
    this.rootDir = rootDir || path.resolve(__dirname, '..');
  }

  async getStatus() {
    const res = await runCmd('git status --porcelain=v1 -b', this.rootDir);
    if (!res.success) {
      return {
        success: false,
        error: res.stderr || res.error || 'Failed to get git status'
      };
    }

    const lines = res.stdout.split('\n').map(l => l.trimEnd()).filter(Boolean);
    const branchLine = lines[0] || '';
    let branch = 'main';
    let ahead = 0;
    let behind = 0;

    const bMatch = branchLine.match(/^##\s+([^\s\.]+)(?:\.\.\.([^\s]+))?(?:\s+\[(?:ahead\s+(\d+))?(?:,\s*)?(?:behind\s+(\d+))?\])?/);
    if (bMatch) {
      branch = bMatch[1] || 'main';
      ahead = parseInt(bMatch[3] || '0', 10);
      behind = parseInt(bMatch[4] || '0', 10);
    }

    const files = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const code = line.slice(0, 2).trim();
      const filePath = line.slice(3).trim();
      files.push({ code, path: filePath });
    }

    return {
      success: true,
      branch,
      ahead,
      behind,
      clean: files.length === 0,
      files
    };
  }

  async getDiff() {
    const res = await runCmd('git diff HEAD', this.rootDir);
    return {
      success: res.success,
      diff: res.stdout || 'No unstaged or uncommitted changes.'
    };
  }

  async getLog(limit = 6) {
    const res = await runCmd(`git log -n ${limit} --pretty=format:"%h|%an|%ar|%s"`, this.rootDir);
    if (!res.success) {
      return { success: false, commits: [] };
    }
    const commits = res.stdout.split('\n').filter(Boolean).map(line => {
      const parts = line.split('|');
      return {
        hash: parts[0] || '',
        author: parts[1] || '',
        relativeDate: parts[2] || '',
        subject: parts.slice(3).join('|') || ''
      };
    });
    return { success: true, commits };
  }

  async commitAndPush(message, shouldPush = true) {
    if (!message || !message.trim()) {
      message = 'Update portfolio via back office';
    }

    const statusRes = await this.getStatus();
    const logs = [];

    // Stage all changes
    const addRes = await runCmd('git add -A', this.rootDir);
    logs.push(`> git add -A\n${addRes.stdout || ''}${addRes.stderr || ''}`.trim());
    if (!addRes.success) {
      return { success: false, step: 'git add', output: logs.join('\n\n'), error: addRes.stderr };
    }

    // Check if there is anything to commit
    const checkRes = await runCmd('git status --porcelain', this.rootDir);
    if (!checkRes.stdout.trim()) {
      if (statusRes.ahead > 0 && shouldPush) {
        // Push existing unpushed commits
        const pushRes = await runCmd(`git push origin ${statusRes.branch || 'main'}`, this.rootDir);
        logs.push(`> git push origin ${statusRes.branch || 'main'}\n${pushRes.stdout || ''}${pushRes.stderr || ''}`.trim());
        return {
          success: pushRes.success,
          step: 'git push',
          output: logs.join('\n\n'),
          error: pushRes.success ? null : pushRes.stderr
        };
      }
      return {
        success: true,
        message: 'No changes to commit.',
        output: logs.join('\n\n')
      };
    }

    // Commit
    const safeMsg = message.replace(/"/g, '\\"');
    const commitRes = await runCmd(`git commit -m "${safeMsg}"`, this.rootDir);
    logs.push(`> git commit -m "${safeMsg}"\n${commitRes.stdout || ''}${commitRes.stderr || ''}`.trim());
    if (!commitRes.success) {
      return { success: false, step: 'git commit', output: logs.join('\n\n'), error: commitRes.stderr };
    }

    // Push
    if (shouldPush) {
      const branch = statusRes.branch || 'main';
      const pushRes = await runCmd(`git push origin ${branch}`, this.rootDir);
      logs.push(`> git push origin ${branch}\n${pushRes.stdout || ''}${pushRes.stderr || ''}`.trim());
      if (!pushRes.success) {
        return { success: false, step: 'git push', output: logs.join('\n\n'), error: pushRes.stderr };
      }
    }

    return {
      success: true,
      step: shouldPush ? 'pushed' : 'committed',
      output: logs.join('\n\n')
    };
  }
}

module.exports = { GitManager };
