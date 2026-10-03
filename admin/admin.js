/* ==========================================================================
   Portfolio Back Office — Client Application Controller
   ========================================================================== */

(function () {
  'use strict';

  // Application State
  let state = {
    data: null,
    git: null,
    isDirty: false,
    activeTab: 'overview',
    tempTags: { fp: [], mp: [], exp: [] }
  };

  // DOM Helpers
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  // Toast Notifications
  const toastEl = $('#toast');
  let toastTimer;
  function showToast(message, type = 'normal') {
    toastEl.textContent = message;
    toastEl.className = 'toast show';
    if (type === 'success') toastEl.classList.add('toast-success');
    if (type === 'error') toastEl.classList.add('toast-error');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  }

  function setDirty(dirty = true) {
    state.isDirty = dirty;
    const statusEl = $('#save-status');
    if (dirty) {
      statusEl.textContent = 'Unsaved changes';
      statusEl.className = 'save-status unsaved';
    } else {
      statusEl.textContent = 'All changes saved';
      statusEl.className = 'save-status';
    }
  }

  // =========================================================================
  // API Calls
  // =========================================================================
  async function loadData() {
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      if (json.success) {
        state.data = json.data;
        renderAll();
        setDirty(false);
      } else {
        showToast('Failed to load portfolio data: ' + json.error, 'error');
      }
    } catch (err) {
      showToast('Error connecting to back office server: ' + err.message, 'error');
    }
  }

  async function saveData() {
    if (!state.data) return;
    try {
      showToast('Compiling changes to files...');
      collectProfileForm();

      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: state.data })
      });

      const json = await res.json();
      if (json.success) {
        showToast('✅ Saved & compiled to index.html, config.js, and i18n.js!', 'success');
        setDirty(false);
        await refreshGit();
      } else {
        showToast('Save failed: ' + json.error, 'error');
      }
    } catch (err) {
      showToast('Error saving: ' + err.message, 'error');
    }
  }

  async function refreshGit() {
    try {
      const [statusRes, diffRes] = await Promise.all([
        fetch('/api/git/status').then(r => r.json()),
        fetch('/api/git/diff').then(r => r.json())
      ]);

      if (statusRes.success) {
        state.git = statusRes;
        renderGitStatus(statusRes);
      }
      if (diffRes.success) {
        renderGitDiff(diffRes.diff);
      }
    } catch (err) {
      console.warn('Git refresh error:', err);
    }
  }

  async function executeGit(shouldPush = true) {
    const inputMsg = (shouldPush ? $('#git-commit-message').value : $('#quick-commit-msg').value) || 'Update portfolio content';
    const terminal = $('#git-terminal');
    terminal.textContent = `Executing git ${shouldPush ? 'commit & push' : 'commit'}...\nPlease wait...`;

    try {
      const res = await fetch(shouldPush ? '/api/git/push' : '/api/git/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMsg })
      });

      const json = await res.json();
      terminal.textContent = json.output || (json.success ? 'Success!' : json.error || 'Failed');

      if (json.success) {
        showToast(shouldPush ? '🚀 Successfully pushed to GitHub!' : 'Committed locally!', 'success');
        await refreshGit();
      } else {
        showToast('Git operation failed: ' + (json.error || 'Check terminal output'), 'error');
      }
    } catch (err) {
      terminal.textContent = 'Network or server error: ' + err.message;
      showToast('Error: ' + err.message, 'error');
    }
  }

  // =========================================================================
  // Rendering
  // =========================================================================
  function renderAll() {
    if (!state.data) return;
    renderOverview();
    renderFeaturedProjects();
    renderMoreProjects();
    renderSkills();
    renderMarquee();
    renderExperience();
    renderEducation();
    renderProfileForm();
    renderI18nTable();
  }

  function renderOverview() {
    const d = state.data;
    $('#dash-author-name').textContent = (d.profile && d.profile.name) ? d.profile.name.split(' ')[0] : 'Zakariae';
    $('#stat-featured-count').textContent = (d.featuredProjects || []).length;
    $('#stat-more-count').textContent = (d.moreProjects || []).length;
    $('#stat-skills-count').textContent = (d.skills || []).length;
    $('#stat-exp-count').textContent = (d.experience || []).length;
  }

  function renderGitStatus(git) {
    const ind = $('#git-indicator');
    const pill = $('#dash-git-pill');
    const branch = $('#dash-git-branch');
    const ahead = $('#dash-git-ahead');
    const filesSummary = $('#dash-git-files-summary');
    const gitFilesCount = $('#git-files-count');
    const gitFileList = $('#git-file-list');

    branch.textContent = git.branch || 'main';
    $('#git-meta-branch').textContent = git.branch || 'main';
    $('#git-meta-ahead').textContent = git.ahead || 0;
    $('#git-meta-behind').textContent = git.behind || 0;
    ahead.textContent = `${git.ahead || 0} ahead`;

    if (git.clean) {
      ind.textContent = 'Clean';
      ind.className = 'badge';
      pill.textContent = 'Clean';
      pill.className = 'pill pill-green';
      filesSummary.innerHTML = '<em>Working tree is clean & up-to-date with remote.</em>';
      gitFilesCount.textContent = '0';
      gitFileList.innerHTML = '<li><em>No modified files</em></li>';
    } else {
      ind.textContent = `${git.files.length} changed`;
      ind.className = 'badge dirty';
      pill.textContent = `${git.files.length} uncommitted changes`;
      pill.className = 'pill pill-yellow';

      filesSummary.innerHTML = git.files.map(f => `<div><span class="f-badge ${f.code}">${f.code}</span> ${f.path}</div>`).join('');
      gitFilesCount.textContent = git.files.length;
      gitFileList.innerHTML = git.files.map(f => `<li><span class="f-badge ${f.code}">${f.code}</span> ${f.path}</li>`).join('');
    }
  }

  function renderGitDiff(diffText) {
    const el = $('#git-diff-viewer');
    el.textContent = diffText || 'No uncommitted changes in working tree.';
  }

  // --- Featured Projects ---
  function renderFeaturedProjects() {
    const c = $('#featured-projects-container');
    const list = state.data.featuredProjects || [];
    c.innerHTML = '';

    if (!list.length) {
      c.innerHTML = '<p class="text-muted">No featured projects yet. Click "Add Featured Project" to create one.</p>';
      return;
    }

    list.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'project-admin-card';
      const num = p.number || String(idx + 1).padStart(2, '0');

      card.innerHTML = `
        <div class="pac-num">${num}</div>
        <div class="pac-body">
          <div class="pac-head">
            <span class="chip">${escapeHtml(p.category || 'AI')}</span>
            ${p.statusBadge ? `<span class="chip chip-solid">${escapeHtml(p.statusBadge)}</span>` : ''}
            <h3 class="pac-title">${escapeHtml(p.title)}</h3>
          </div>
          <p class="text-muted" style="font-weight: 500;">${escapeHtml(p.subtitle || '')}</p>
          <p class="pac-desc">${escapeHtml(p.description || '')}</p>
          <div class="pac-tags">
            ${(p.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}
          </div>
          <div class="text-muted mono" style="font-size: 0.75rem;">ID: ${escapeHtml(p.id)} | Diagram: ${escapeHtml(p.diagramKey || p.id)}</div>
        </div>
        <div class="pac-actions">
          <button class="btn btn-sm btn-secondary btn-fp-up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''} title="Move Up">↑</button>
          <button class="btn btn-sm btn-secondary btn-fp-down" data-idx="${idx}" ${idx === list.length - 1 ? 'disabled' : ''} title="Move Down">↓</button>
          <button class="btn btn-sm btn-secondary btn-fp-edit" data-idx="${idx}">Edit</button>
          <button class="btn btn-sm btn-danger btn-fp-del" data-idx="${idx}">Delete</button>
        </div>
      `;
      c.appendChild(card);
    });

    // Wire actions
    $$('.btn-fp-edit', c).forEach(b => b.addEventListener('click', () => openFeaturedModal(parseInt(b.dataset.idx, 10))));
    $$('.btn-fp-del', c).forEach(b => b.addEventListener('click', () => deleteFeaturedProject(parseInt(b.dataset.idx, 10))));
    $$('.btn-fp-up', c).forEach(b => b.addEventListener('click', () => moveFeaturedProject(parseInt(b.dataset.idx, 10), -1)));
    $$('.btn-fp-down', c).forEach(b => b.addEventListener('click', () => moveFeaturedProject(parseInt(b.dataset.idx, 10), 1)));
  }

  // --- More Projects ---
  function renderMoreProjects() {
    const c = $('#more-projects-container');
    const list = state.data.moreProjects || [];
    c.innerHTML = '';

    if (!list.length) {
      c.innerHTML = '<p class="text-muted">No additional projects. Click "Add Project" to add one.</p>';
      return;
    }

    list.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'mp-card';
      card.innerHTML = `
        <div class="mp-head">
          <span class="chip">${escapeHtml(p.category || 'Project')}</span>
          <div class="actions-row" style="margin: 0;">
            <button class="btn btn-sm btn-secondary btn-mp-edit" data-idx="${idx}">Edit</button>
            <button class="btn btn-sm btn-danger btn-mp-del" data-idx="${idx}">Delete</button>
          </div>
        </div>
        <h4 class="mp-title">${escapeHtml(p.title)}</h4>
        <p class="mp-desc">${escapeHtml(p.description || '')}</p>
        ${p.note ? `<p class="text-muted" style="font-size:0.75rem; margin-bottom: 0.5rem;">${escapeHtml(p.note)}</p>` : ''}
        <div class="pac-tags" style="margin-top: auto;">
          ${(p.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}
        </div>
      `;
      c.appendChild(card);
    });

    $$('.btn-mp-edit', c).forEach(b => b.addEventListener('click', () => openMoreModal(parseInt(b.dataset.idx, 10))));
    $$('.btn-mp-del', c).forEach(b => b.addEventListener('click', () => deleteMoreProject(parseInt(b.dataset.idx, 10))));
  }

  // --- Skills & Marquee ---
  function renderSkills() {
    const c = $('#skills-container');
    const list = state.data.skills || [];
    c.innerHTML = '';

    list.forEach((cat, catIdx) => {
      const card = document.createElement('div');
      card.className = 'skill-cat-card';
      card.innerHTML = `
        <div class="skill-cat-head">
          <h4>${escapeHtml(cat.title)}</h4>
          <button class="btn-sm btn-danger btn-skill-del" data-idx="${catIdx}">Delete Category</button>
        </div>
        <div class="chips-editor" id="cat-chips-${catIdx}"></div>
        <div class="chip-add-row">
          <input type="text" class="input input-cat-tag" data-idx="${catIdx}" placeholder="Add skill (press Enter)">
          <button class="btn btn-secondary btn-add-cat-tag" data-idx="${catIdx}">Add</button>
        </div>
      `;
      c.appendChild(card);

      const chipsBox = $(`#cat-chips-${catIdx}`);
      renderChips(chipsBox, cat.tags || [], (removedIdx) => {
        cat.tags.splice(removedIdx, 1);
        renderSkills();
        setDirty();
      });
    });

    $$('.btn-skill-del', c).forEach(b => b.addEventListener('click', () => {
      const idx = parseInt(b.dataset.idx, 10);
      if (confirm(`Delete skill category "${state.data.skills[idx].title}"?`)) {
        state.data.skills.splice(idx, 1);
        renderSkills();
        setDirty();
      }
    }));

    $$('.btn-add-cat-tag', c).forEach(b => b.addEventListener('click', () => {
      const idx = parseInt(b.dataset.idx, 10);
      const input = $(`.input-cat-tag[data-idx="${idx}"]`);
      addSkillTag(idx, input.value);
      input.value = '';
    }));

    $$('.input-cat-tag', c).forEach(inp => inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const idx = parseInt(inp.dataset.idx, 10);
        addSkillTag(idx, inp.value);
        inp.value = '';
      }
    }));
  }

  function addSkillTag(catIdx, val) {
    val = (val || '').trim();
    if (!val) return;
    const cat = state.data.skills[catIdx];
    if (!cat.tags) cat.tags = [];
    if (!cat.tags.includes(val)) {
      cat.tags.push(val);
      renderSkills();
      setDirty();
    }
  }

  function renderMarquee() {
    const box = $('#marquee-chips-container');
    const list = state.data.marquee || [];
    renderChips(box, list, (removedIdx) => {
      list.splice(removedIdx, 1);
      renderMarquee();
      setDirty();
    });
  }

  function renderChips(container, items, onRemove) {
    container.innerHTML = '';
    (items || []).forEach((item, idx) => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.innerHTML = `
        <span>${escapeHtml(item)}</span>
        <button type="button" class="remove-tag" data-idx="${idx}">&times;</button>
      `;
      container.appendChild(chip);
    });

    $$('.remove-tag', container).forEach(b => b.addEventListener('click', (e) => {
      e.stopPropagation();
      onRemove(parseInt(b.dataset.idx, 10));
    }));
  }

  // --- Experience & Education ---
  function renderExperience() {
    const c = $('#experience-container');
    const list = state.data.experience || [];
    c.innerHTML = '';

    list.forEach((e, idx) => {
      const item = document.createElement('div');
      item.className = 'admin-item-box';
      item.innerHTML = `
        <div style="flex: 1;">
          <span class="mono text-muted" style="font-size:0.75rem;">${escapeHtml(e.date)}</span>
          <h4>${escapeHtml(e.role)}</h4>
          <p>${escapeHtml(e.company)} · ${escapeHtml(e.location)}</p>
          <ul>
            ${(e.bullets || []).map(b => `<li>${escapeHtml(b.text)}</li>`).join('')}
          </ul>
        </div>
        <div class="actions-row" style="margin:0;">
          <button class="btn btn-sm btn-secondary btn-exp-edit" data-idx="${idx}">Edit</button>
          <button class="btn btn-sm btn-danger btn-exp-del" data-idx="${idx}">Delete</button>
        </div>
      `;
      c.appendChild(item);
    });

    $$('.btn-exp-edit', c).forEach(b => b.addEventListener('click', () => openExpModal(parseInt(b.dataset.idx, 10))));
    $$('.btn-exp-del', c).forEach(b => b.addEventListener('click', () => {
      const idx = parseInt(b.dataset.idx, 10);
      if (confirm('Delete this experience entry?')) {
        state.data.experience.splice(idx, 1);
        renderExperience();
        setDirty();
      }
    }));
  }

  function renderEducation() {
    const c = $('#education-container');
    const list = state.data.education || [];
    c.innerHTML = '';

    list.forEach((ed, idx) => {
      const item = document.createElement('div');
      item.className = 'admin-item-box';
      item.innerHTML = `
        <div style="flex: 1;">
          <span class="mono text-muted" style="font-size:0.75rem;">${escapeHtml(ed.date)}</span>
          <h4>${escapeHtml(ed.degree)}</h4>
          <p>${escapeHtml(ed.school)}</p>
        </div>
        <div class="actions-row" style="margin:0;">
          <button class="btn btn-sm btn-secondary btn-edu-edit" data-idx="${idx}">Edit</button>
          <button class="btn btn-sm btn-danger btn-edu-del" data-idx="${idx}">Delete</button>
        </div>
      `;
      c.appendChild(item);
    });

    $$('.btn-edu-edit', c).forEach(b => b.addEventListener('click', () => openEduModal(parseInt(b.dataset.idx, 10))));
    $$('.btn-edu-del', c).forEach(b => b.addEventListener('click', () => {
      const idx = parseInt(b.dataset.idx, 10);
      if (confirm('Delete this education entry?')) {
        state.data.education.splice(idx, 1);
        renderEducation();
        setDirty();
      }
    }));
  }

  // --- Profile Form ---
  function renderProfileForm() {
    const p = state.data.profile || {};
    $('#prof-name').value = p.name || '';
    $('#prof-title').value = p.title || '';
    $('#prof-status').value = p.status || '';
    $('#prof-location').value = p.location || '';
    $('#prof-lead').value = p.lead || '';
    $('#prof-about1').value = p.aboutP1 || '';
    $('#prof-about2').value = p.aboutP2 || '';
    $('#prof-email').value = p.email || '';
    $('#prof-academic-email').value = p.academicEmail || '';
    $('#prof-github').value = p.github || '';
    $('#prof-linkedin').value = p.linkedin || '';

    if (p.cv) {
      $('#cv-path-en').textContent = p.cv.en || 'None';
      $('#cv-path-fr').textContent = p.cv.fr || 'None';
    }
  }

  function collectProfileForm() {
    if (!state.data.profile) state.data.profile = {};
    const p = state.data.profile;
    p.name = $('#prof-name').value;
    p.title = $('#prof-title').value;
    p.status = $('#prof-status').value;
    p.location = $('#prof-location').value;
    p.lead = $('#prof-lead').value;
    p.aboutP1 = $('#prof-about1').value;
    p.aboutP2 = $('#prof-about2').value;
    p.email = $('#prof-email').value;
    p.academicEmail = $('#prof-academic-email').value;
    p.github = $('#prof-github').value;
    p.linkedin = $('#prof-linkedin').value;
  }

  // --- Multilingual Table ---
  function renderI18nTable(filterText = '') {
    const tbody = $('#i18n-table-body');
    const trs = state.data.translations || {};
    const fr = trs.fr || {};
    const es = trs.es || {};
    const ar = trs.ar || {};

    const allKeys = new Set([
      ...Object.keys(fr),
      ...Object.keys(es),
      ...Object.keys(ar)
    ]);

    tbody.innerHTML = '';
    const query = filterText.toLowerCase();

    Array.from(allKeys).sort().forEach(k => {
      const vFr = fr[k] || '';
      const vEs = es[k] || '';
      const vAr = ar[k] || '';

      if (query && !k.toLowerCase().includes(query) && !vFr.toLowerCase().includes(query) && !vEs.toLowerCase().includes(query) && !vAr.toLowerCase().includes(query)) {
        return;
      }

      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="i18n-key">${escapeHtml(k)}</td>
        <td class="text-muted" style="font-size:0.82rem;">${escapeHtml(vFr.length > 50 ? vFr.slice(0, 50) + '...' : vFr)}</td>
        <td><input type="text" class="i18n-input" data-lang="fr" data-key="${escapeHtml(k)}" value="${escapeHtml(vFr)}"></td>
        <td><input type="text" class="i18n-input" data-lang="es" data-key="${escapeHtml(k)}" value="${escapeHtml(vEs)}"></td>
        <td><input type="text" class="i18n-input" dir="rtl" data-lang="ar" data-key="${escapeHtml(k)}" value="${escapeHtml(vAr)}"></td>
      `;
      tbody.appendChild(row);
    });

    $$('.i18n-input', tbody).forEach(inp => {
      inp.addEventListener('input', () => {
        const lang = inp.dataset.lang;
        const key = inp.dataset.key;
        if (!state.data.translations[lang]) state.data.translations[lang] = {};
        state.data.translations[lang][key] = inp.value;
        setDirty();
      });
    });
  }

  // =========================================================================
  // Modals & Project Operations
  // =========================================================================
  function openFeaturedModal(idx = null) {
    const isNew = idx === null;
    $('#modal-featured-title').textContent = isNew ? 'Add Featured Project' : 'Edit Featured Project';
    $('#fp-edit-id').value = isNew ? '' : idx;

    const p = isNew ? {
      id: '', number: String((state.data.featuredProjects || []).length + 1).padStart(2, '0'),
      title: '', category: 'AI / LLMOps', statusBadge: '', subtitle: '', description: '',
      problem: '', core: '', system: '', value: '', tags: [],
      links: { github: '', demo: '', report: '' }
    } : state.data.featuredProjects[idx];

    $('#fp-id').value = p.id || '';
    $('#fp-number').value = p.number || '';
    $('#fp-title').value = p.title || '';
    $('#fp-category').value = p.category || '';
    $('#fp-status').value = p.statusBadge || '';
    $('#fp-sub').value = p.subtitle || '';
    $('#fp-desc').value = p.description || '';
    $('#fp-problem').value = p.problem || '';
    $('#fp-core').value = p.core || '';
    $('#fp-system').value = p.system || '';
    $('#fp-value').value = p.value || '';

    state.tempTags.fp = [...(p.tags || [])];
    renderFpTags();

    const links = p.links || {};
    $('#fp-lnk-github').value = links.github || '';
    $('#fp-lnk-demo').value = links.demo || '';
    $('#fp-lnk-report').value = links.report || '';

    $('#modal-featured').classList.add('open');
  }

  function renderFpTags() {
    renderChips($('#fp-tags-container'), state.tempTags.fp, (removedIdx) => {
      state.tempTags.fp.splice(removedIdx, 1);
      renderFpTags();
    });
  }

  function saveFeaturedModal() {
    const rawIdx = $('#fp-edit-id').value;
    const isNew = rawIdx === '';
    const id = ($('#fp-id').value || '').trim() || 'project-' + Date.now();

    const p = {
      id,
      number: $('#fp-number').value.trim() || '01',
      title: $('#fp-title').value.trim(),
      category: $('#fp-category').value.trim(),
      statusBadge: $('#fp-status').value.trim(),
      subtitle: $('#fp-sub').value.trim(),
      description: $('#fp-desc').value.trim(),
      problem: $('#fp-problem').value.trim(),
      core: $('#fp-core').value.trim(),
      system: $('#fp-system').value.trim(),
      value: $('#fp-value').value.trim(),
      tags: [...state.tempTags.fp],
      diagramKey: id,
      links: {
        github: $('#fp-lnk-github').value.trim(),
        demo: $('#fp-lnk-demo').value.trim(),
        report: $('#fp-lnk-report').value.trim()
      }
    };

    if (!p.title) {
      alert('Please enter a project title.');
      return;
    }

    if (!state.data.featuredProjects) state.data.featuredProjects = [];

    if (isNew) {
      state.data.featuredProjects.push(p);
    } else {
      state.data.featuredProjects[parseInt(rawIdx, 10)] = p;
    }

    $('#modal-featured').classList.remove('open');
    renderFeaturedProjects();
    setDirty();
  }

  function deleteFeaturedProject(idx) {
    const p = state.data.featuredProjects[idx];
    if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
      state.data.featuredProjects.splice(idx, 1);
      renderFeaturedProjects();
      setDirty();
    }
  }

  function moveFeaturedProject(idx, delta) {
    const list = state.data.featuredProjects;
    const target = idx + delta;
    if (target < 0 || target >= list.length) return;
    const temp = list[idx];
    list[idx] = list[target];
    list[target] = temp;
    // Update numbering
    list.forEach((p, i) => p.number = String(i + 1).padStart(2, '0'));
    renderFeaturedProjects();
    setDirty();
  }

  // --- More Projects Modal ---
  function openMoreModal(idx = null) {
    const isNew = idx === null;
    $('#modal-more-title').textContent = isNew ? 'Add Additional Project' : 'Edit Project';
    $('#mp-edit-id').value = isNew ? '' : idx;

    const p = isNew ? {
      id: '', icon: 'i-eye', title: '', category: '', description: '', note: '', tags: [],
      links: { github: '', demo: '', report: '' }
    } : state.data.moreProjects[idx];

    $('#mp-id').value = p.id || '';
    $('#mp-icon').value = p.icon || 'i-eye';
    $('#mp-title').value = p.title || '';
    $('#mp-category').value = p.category || '';
    $('#mp-desc').value = p.description || '';
    $('#mp-note').value = p.note || '';

    state.tempTags.mp = [...(p.tags || [])];
    renderMpTags();

    const links = p.links || {};
    $('#mp-lnk-github').value = links.github || '';
    $('#mp-lnk-demo').value = links.demo || '';
    $('#mp-lnk-report').value = links.report || '';

    $('#modal-more').classList.add('open');
  }

  function renderMpTags() {
    renderChips($('#mp-tags-container'), state.tempTags.mp, (removedIdx) => {
      state.tempTags.mp.splice(removedIdx, 1);
      renderMpTags();
    });
  }

  function saveMoreModal() {
    const rawIdx = $('#mp-edit-id').value;
    const isNew = rawIdx === '';
    const id = ($('#mp-id').value || '').trim() || 'project-' + Date.now();

    const p = {
      id,
      icon: $('#mp-icon').value,
      title: $('#mp-title').value.trim(),
      category: $('#mp-category').value.trim(),
      description: $('#mp-desc').value.trim(),
      note: $('#mp-note').value.trim(),
      tags: [...state.tempTags.mp],
      links: {
        github: $('#mp-lnk-github').value.trim(),
        demo: $('#mp-lnk-demo').value.trim(),
        report: $('#mp-lnk-report').value.trim()
      }
    };

    if (!p.title) {
      alert('Please enter a project title.');
      return;
    }

    if (!state.data.moreProjects) state.data.moreProjects = [];
    if (isNew) {
      state.data.moreProjects.push(p);
    } else {
      state.data.moreProjects[parseInt(rawIdx, 10)] = p;
    }

    $('#modal-more').classList.remove('open');
    renderMoreProjects();
    setDirty();
  }

  function deleteMoreProject(idx) {
    const p = state.data.moreProjects[idx];
    if (confirm(`Delete "${p.title}"?`)) {
      state.data.moreProjects.splice(idx, 1);
      renderMoreProjects();
      setDirty();
    }
  }

  // --- Experience Modal ---
  function openExpModal(idx = null) {
    const isNew = idx === null;
    $('#modal-exp-title').textContent = isNew ? 'Add Experience Entry' : 'Edit Experience Entry';
    $('#exp-edit-id').value = isNew ? '' : idx;

    const e = isNew ? { role: '', company: '', date: '', location: '', bullets: [], tags: [] } : state.data.experience[idx];

    $('#exp-role').value = e.role || '';
    $('#exp-company').value = e.company || '';
    $('#exp-date').value = e.date || '';
    $('#exp-location').value = e.location || '';
    $('#exp-bullets').value = (e.bullets || []).map(b => b.text).join('\n');

    state.tempTags.exp = [...(e.tags || [])];
    renderExpTags();

    $('#modal-exp').classList.add('open');
  }

  function renderExpTags() {
    renderChips($('#exp-tags-container'), state.tempTags.exp, (removedIdx) => {
      state.tempTags.exp.splice(removedIdx, 1);
      renderExpTags();
    });
  }

  function saveExpModal() {
    const rawIdx = $('#exp-edit-id').value;
    const isNew = rawIdx === '';
    const id = isNew ? 'e' + ((state.data.experience || []).length + 1) : state.data.experience[parseInt(rawIdx, 10)].id;

    const rawBullets = $('#exp-bullets').value.split('\n').map(l => l.trim()).filter(Boolean);
    const bullets = rawBullets.map((txt, bIdx) => ({ key: `${id}.b${bIdx + 1}`, text: txt }));

    const entry = {
      id,
      dateKey: `${id}.date`,
      date: $('#exp-date').value.trim(),
      roleKey: `${id}.role`,
      role: $('#exp-role').value.trim(),
      company: $('#exp-company').value.trim(),
      locationKey: 'hero.loc',
      location: $('#exp-location').value.trim(),
      bullets,
      tags: [...state.tempTags.exp]
    };

    if (!entry.role) {
      alert('Please enter a role.');
      return;
    }

    if (!state.data.experience) state.data.experience = [];
    if (isNew) {
      state.data.experience.push(entry);
    } else {
      state.data.experience[parseInt(rawIdx, 10)] = entry;
    }

    $('#modal-exp').classList.remove('open');
    renderExperience();
    setDirty();
  }

  // --- Education Modal ---
  function openEduModal(idx = null) {
    const isNew = idx === null;
    $('#modal-edu-title').textContent = isNew ? 'Add Education' : 'Edit Education';
    $('#edu-edit-id').value = isNew ? '' : idx;

    const ed = isNew ? { degree: '', school: '', date: '' } : state.data.education[idx];
    $('#edu-degree').value = ed.degree || '';
    $('#edu-school').value = ed.school || '';
    $('#edu-date').value = ed.date || '';

    $('#modal-edu').classList.add('open');
  }

  function saveEduModal() {
    const rawIdx = $('#edu-edit-id').value;
    const isNew = rawIdx === '';
    const id = isNew ? 'edu' + ((state.data.education || []).length + 1) : state.data.education[parseInt(rawIdx, 10)].id;

    const entry = {
      id,
      dateKey: `${id}.d`,
      date: $('#edu-date').value.trim(),
      degreeKey: `${id}.t`,
      degree: $('#edu-degree').value.trim(),
      schoolKey: `${id}.inst`,
      school: $('#edu-school').value.trim()
    };

    if (!entry.degree) {
      alert('Please enter a degree.');
      return;
    }

    if (!state.data.education) state.data.education = [];
    if (isNew) {
      state.data.education.push(entry);
    } else {
      state.data.education[parseInt(rawIdx, 10)] = entry;
    }

    $('#modal-edu').classList.remove('open');
    renderEducation();
    setDirty();
  }

  // =========================================================================
  // CV Upload Handler
  // =========================================================================
  function setupCvUpload(fileInputId, lang) {
    const input = $(fileInputId);
    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('Please upload a PDF file.');
        return;
      }

      showToast(`Uploading ${file.name}...`);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch('/api/upload-cv', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lang,
              fileName: file.name,
              base64: reader.result
            })
          });

          const json = await res.json();
          if (json.success) {
            showToast(`✅ ${file.name} uploaded successfully!`, 'success');
            $(`#cv-path-${lang}`).textContent = json.path;
            await loadData();
          } else {
            showToast('Upload failed: ' + json.error, 'error');
          }
        } catch (err) {
          showToast('Error uploading: ' + err.message, 'error');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // =========================================================================
  // Utilities
  // =========================================================================
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // Event Listeners Initialization
  // =========================================================================
  function initEvents() {
    // Tab switching
    $$('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        $$('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        $$('.tab-panel').forEach(p => p.classList.remove('active'));
        $(`#tab-${tab}`).classList.add('active');

        $('#crumb-title').textContent = btn.querySelector('span').textContent;
        state.activeTab = tab;

        if (tab === 'git') refreshGit();
      });
    });

    // Quick Action shortcuts
    $$('[data-nav]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.nav;
        const navBtn = $(`.nav-item[data-tab="${target}"]`);
        if (navBtn) navBtn.click();
      });
    });

    // Save All Button
    $('#btn-save-all').addEventListener('click', saveData);

    // Git Buttons
    $('#btn-header-push').addEventListener('click', () => {
      $(`.nav-item[data-tab="git"]`).click();
    });
    $('#btn-refresh-git').addEventListener('click', refreshGit);
    $('#btn-git-commit-push').addEventListener('click', () => executeGit(true));
    $('#btn-git-commit-only').addEventListener('click', () => executeGit(false));
    $('#dash-btn-push').addEventListener('click', () => executeGit(true));
    $('#dash-btn-commit').addEventListener('click', () => executeGit(false));
    $('#btn-clear-terminal').addEventListener('click', () => {
      $('#git-terminal').textContent = 'Ready.';
    });

    // Profile input change monitoring
    $$('#tab-profile input, #tab-profile textarea').forEach(inp => {
      inp.addEventListener('input', () => setDirty());
    });

    // Marquee tag add
    $('#btn-marquee-add').addEventListener('click', () => {
      const val = ($('#marquee-new-tag').value || '').trim();
      if (!val) return;
      if (!state.data.marquee) state.data.marquee = [];
      if (!state.data.marquee.includes(val)) {
        state.data.marquee.push(val);
        renderMarquee();
        setDirty();
      }
      $('#marquee-new-tag').value = '';
    });
    $('#marquee-new-tag').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        $('#btn-marquee-add').click();
      }
    });

    // Skill Category add
    $('#btn-add-skill-cat').addEventListener('click', () => {
      const title = prompt('Enter new skill category title (e.g. Cloud & DevOps):');
      if (!title || !title.trim()) return;
      if (!state.data.skills) state.data.skills = [];
      state.data.skills.push({
        id: 'sk_' + Date.now(),
        icon: 'i-cloud',
        title: title.trim(),
        tags: []
      });
      renderSkills();
      setDirty();
    });

    // Featured Project Modal events
    $('#btn-add-featured').addEventListener('click', () => openFeaturedModal(null));
    $('#modal-featured-close').addEventListener('click', () => $('#modal-featured').classList.remove('open'));
    $('#modal-featured-cancel').addEventListener('click', () => $('#modal-featured').classList.remove('open'));
    $('#modal-featured-save').addEventListener('click', saveFeaturedModal);
    $('#btn-fp-tag-add').addEventListener('click', () => {
      const val = ($('#fp-new-tag').value || '').trim();
      if (val && !state.tempTags.fp.includes(val)) {
        state.tempTags.fp.push(val);
        renderFpTags();
        $('#fp-new-tag').value = '';
      }
    });
    $('#fp-new-tag').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        $('#btn-fp-tag-add').click();
      }
    });

    // More Project Modal events
    $('#btn-add-more').addEventListener('click', () => openMoreModal(null));
    $('#modal-more-close').addEventListener('click', () => $('#modal-more').classList.remove('open'));
    $('#modal-more-cancel').addEventListener('click', () => $('#modal-more').classList.remove('open'));
    $('#modal-more-save').addEventListener('click', saveMoreModal);
    $('#btn-mp-tag-add').addEventListener('click', () => {
      const val = ($('#mp-new-tag').value || '').trim();
      if (val && !state.tempTags.mp.includes(val)) {
        state.tempTags.mp.push(val);
        renderMpTags();
        $('#mp-new-tag').value = '';
      }
    });
    $('#mp-new-tag').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        $('#btn-mp-tag-add').click();
      }
    });

    // Experience Modal events
    $('#btn-add-exp').addEventListener('click', () => openExpModal(null));
    $('#modal-exp-close').addEventListener('click', () => $('#modal-exp').classList.remove('open'));
    $('#modal-exp-cancel').addEventListener('click', () => $('#modal-exp').classList.remove('open'));
    $('#modal-exp-save').addEventListener('click', saveExpModal);
    $('#btn-exp-tag-add').addEventListener('click', () => {
      const val = ($('#exp-new-tag').value || '').trim();
      if (val && !state.tempTags.exp.includes(val)) {
        state.tempTags.exp.push(val);
        renderExpTags();
        $('#exp-new-tag').value = '';
      }
    });

    // Education Modal events
    $('#btn-add-edu').addEventListener('click', () => openEduModal(null));
    $('#modal-edu-close').addEventListener('click', () => $('#modal-edu').classList.remove('open'));
    $('#modal-edu-cancel').addEventListener('click', () => $('#modal-edu').classList.remove('open'));
    $('#modal-edu-save').addEventListener('click', saveEduModal);

    // CV Upload listeners
    setupCvUpload('#upload-cv-en', 'en');
    setupCvUpload('#upload-cv-fr', 'fr');

    // i18n search filter
    $('#i18n-search').addEventListener('input', (e) => {
      renderI18nTable(e.target.value);
    });

    // Theme toggle
    const themeBtn = $('#btn-theme-toggle');
    themeBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
    });

    // Keyboard shortcuts (Ctrl+S / Cmd+S to save)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveData();
      }
    });
  }

  // Startup
  document.addEventListener('DOMContentLoaded', () => {
    initEvents();
    loadData();
    refreshGit();
  });
})();
