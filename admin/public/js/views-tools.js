/* Tool views: overview, translations, live preview, publish (git), history (backups). */
(function () {
  'use strict';
  var ZC = window.ZC, h = ZC.h;
  var V = (ZC.views = ZC.views || {});
  var S = function () { return ZC.state; };
  var LANG_NAMES = { fr: 'French', es: 'Spanish', ar: 'Arabic' };

  function bar(st) {
    var t = st.ok + st.missing + st.outdated || 1;
    return h('div', { class: 'bar', role: 'img', 'aria-label': st.ok + ' translated, ' + st.outdated + ' outdated, ' + st.missing + ' missing' },
      h('i', { class: 'ok', style: { width: (st.ok / t * 100) + '%' } }), h('i', { class: 'outdated', style: { width: (st.outdated / t * 100) + '%' } }), h('i', { class: 'missing', style: { width: (st.missing / t * 100) + '%' } }));
  }

  /* ---------- graphs (same renderer as the site's architecture diagrams) ---------- */
  ZC.pipelinePreview = function (p) {
    var ol = h('ol', { class: 'pipe-prev', 'data-testid': 'pipe-preview' });
    function paint() {
      ZC.clear(ol);
      (p.pipeline || []).forEach(function (s, i, a) {
        ol.appendChild(h('li', null, h('i', { class: 'pdot' }), i < a.length - 1 ? h('i', { class: 'pline' }) : null, h('b', { text: s.title || '…' }), h('small', { text: s.sub || '' })));
      });
      if (!(p.pipeline || []).length) ol.appendChild(h('li', { class: 'hint', text: 'No steps yet — the pipeline strip is hidden on the site.' }));
    }
    paint(); ZC.livePainters.push(paint);
    return h('div', { class: 'pipe-wrap' }, h('p', { class: 'dg-label', text: 'Live preview' }), ol);
  };
  ZC.flowGraph = function () {
    var host = h('div', { class: 'dg-preview', 'data-testid': 'flow-graph' });
    var spec = { mode: 'auto', nodes: [
      { id: 'edit', label: 'Back office', sub: 'local · token', kind: 'svc' },
      { id: 'data', label: 'portfolio-data', sub: 'JSON + backups', kind: 'data' },
      { id: 'build', label: 'Builder', sub: 'validate · i18n', kind: 'ai' },
      { id: 'site', label: 'front/', sub: 'html · js · pdf', kind: 'data' },
      { id: 'git', label: 'Git push', sub: 'origin/main', kind: 'svc' },
      { id: 'pages', label: 'GitHub Pages', sub: 'public site', kind: 'watch' }
    ], edges: [['edit', 'data', 'f'], ['data', 'build', 'f'], ['build', 'site', 'f'], ['site', 'git', 'f'], ['git', 'pages', 'f']] };
    var mq = window.matchMedia('(max-width: 640px)');
    var draw = function () { window.ZCDiagram.render(host, spec, { key: 'flow', mobile: mq.matches, reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches }); };
    draw();
    return host;
  };

  /* ---------- Overview ---------- */
  V.overview = {
    title: 'Overview',
    render: function () {
      var d = S().data, v = S().validation, root = h('div', { class: 'stack' });
      var count = function (a) { return (a || []).filter(function (x) { return !x.hidden; }).length; };
      var hidden = [].concat(d.featuredProjects, d.moreProjects, d.skills, d.experience, d.education).filter(function (x) { return x && x.hidden; }).length;
      var tile = function (n, label, view) { return h('button', { type: 'button', class: 'stat', on: { click: function () { ZC.go(view); } } }, h('b', { text: String(n) }), h('span', { text: label })); };
      root.appendChild(h('div', { class: 'stats' },
        tile(count(d.featuredProjects), 'Featured projects', 'featured'), tile(count(d.moreProjects), 'More projects', 'more'),
        tile(count(d.skills), 'Skill groups', 'skills'), tile(count(d.experience), 'Roles', 'experience'), tile(hidden, 'Hidden items', hidden ? 'featured' : 'overview')));

      root.appendChild(ZC.card('How your content reaches the web', h('div', null, ZC.flowGraph()), null));

      var issues = [];
      v.errors.forEach(function (e) { issues.push(['bad', 'Error', e]); });
      v.warnings.forEach(function (e) { issues.push(['warn', 'Tip', e]); });
      root.appendChild(ZC.card('Checks', issues.length ? h('div', { class: 'stack', style: { gap: '4px' } }, issues.map(function (i) {
        return h('button', { type: 'button', class: 'issue', on: { click: function () { ZC.goPath(i[2].path); } } }, ZC.pill(i[1], i[0]), h('span', null, i[2].msg, ' ', h('span', { class: 'hint mono', text: i[2].path })));
      })) : h('p', { class: 'muted', text: 'Everything checks out. Nothing blocks saving.' })));

      var i18n = S().i18n;
      var tr = h('div', { class: 'stack' });
      if (i18n) Object.keys(i18n.langs).forEach(function (l) {
        var st = i18n.langs[l];
        tr.appendChild(h('div', { class: 'stack', style: { gap: '6px' } },
          h('div', { class: 'row spread' }, h('b', { text: LANG_NAMES[l] || l }), h('span', { class: 'hint', text: st.ok + '/' + i18n.total + ' translated' + (st.outdated ? ' · ' + st.outdated + ' outdated' : '') + (st.missing ? ' · ' + st.missing + ' missing' : '') })), bar(st)));
      });
      root.appendChild(ZC.card('Translations', tr, h('button', { type: 'button', class: 'btn sm', text: 'Open translations', on: { click: function () { ZC.go('i18n'); } } })));

      root.appendChild(ZC.card('How this works', h('div', { class: 'stack' },
        h('p', { class: 'muted', text: '1. Edit anything on the left. 2. Save & rebuild regenerates the public site in the front/ folder (and keeps a backup). 3. Check it in Live preview. 4. Publish commits and pushes; GitHub Pages deploys only the front/ folder.' }),
        h('p', { class: 'hint', text: 'This back office runs only on your computer. It is not part of the deployed site.' }))));
      return root;
    }
  };

  /* ---------- Translations ---------- */
  var trLang = 'fr', trFilter = 'all', trQuery = '';
  V.i18n = {
    title: 'Translations',
    render: function () {
      var root = h('div', null, h('p', { class: 'muted', text: 'Loading…' }));
      ZC.api('POST', '/api/english', { data: S().data }).then(function (r) {
        S().english = r.english; S().i18n = r.i18n; paint(root);
      }).catch(function (e) { ZC.clear(root).appendChild(h('p', { text: e.message })); });
      return root;
    }
  };
  function paint(root) {
    var d = S().data, en = S().english, st = S().i18n, langSt = st.langs[trLang];
    d.translations = d.translations || {}; d.translations[trLang] = d.translations[trLang] || {};
    var tr = d.translations[trLang];
    var dir = trLang === 'ar' ? 'rtl' : 'ltr';
    function status(k) { return S().touched[trLang + '|' + k] ? (tr[k] ? 'ok' : 'missing') : langSt.keys[k]; }

    var tabs = h('div', { class: 'tabs' }, Object.keys(st.langs).map(function (l) {
      var x = st.langs[l], n = x.missing + x.outdated;
      return h('button', { type: 'button', class: 'tab' + (l === trLang ? ' on' : ''), on: { click: function () { trLang = l; paint(root); } } }, LANG_NAMES[l] || l, n ? h('span', { class: 'pill ' + (x.missing ? 'bad' : 'warn'), style: { marginLeft: '8px' }, text: String(n) }) : null);
    }));
    function review(keys, msg) {
      ZC.confirm('Mark as reviewed?', msg + ' This saves your current changes too.', 'Save & mark reviewed').then(function (ok) { if (ok) ZC.save({ type: 'review', lang: trLang, keys: keys }); });
    }
    var outdatedKeys = Object.keys(en).filter(function (k) { return status(k) === 'outdated'; });
    var tools = h('div', { class: 'row spread', style: { marginBottom: '12px' } },
      h('div', { class: 'row' },
        ['all', 'missing', 'outdated'].map(function (f) { return h('button', { type: 'button', class: 'btn sm' + (trFilter === f ? ' primary' : ''), text: f[0].toUpperCase() + f.slice(1), on: { click: function () { trFilter = f; paint(root); } } }); }),
        (function () { var i = h('input', { type: 'search', placeholder: 'Search…', value: trQuery, 'aria-label': 'Search translations', style: { width: '180px' } }); i.addEventListener('input', function () { trQuery = i.value; paintRows(); }); return i; })()),
      h('div', { class: 'row' },
        outdatedKeys.length ? h('button', { type: 'button', class: 'btn sm', text: 'Mark ' + outdatedKeys.length + ' outdated as reviewed', on: { click: function () { review(outdatedKeys, 'These translations stay as they are and stop being flagged.'); } } }) : null,
        st.orphans.length ? h('button', { type: 'button', class: 'btn sm danger', text: 'Remove ' + st.orphans.length + ' unused', title: st.orphans.join('\n'), on: { click: function () {
          ZC.confirm('Remove unused translations?', st.orphans.length + ' translation(s) belong to content that no longer exists. This saves your current changes too.', 'Remove', true).then(function (ok) { if (ok) ZC.save({ type: 'prune' }); });
        } } }) : null));

    var tbody = h('tbody');
    function paintRows() {
      ZC.clear(tbody);
      var q = trQuery.toLowerCase(), shown = 0;
      Object.keys(en).forEach(function (k) {
        var s = status(k);
        if (trFilter !== 'all' && s !== trFilter) return;
        if (q && (k + ' ' + en[k] + ' ' + (tr[k] || '')).toLowerCase().indexOf(q) < 0) return;
        shown++;
        var long = (en[k] || '').length > 80 || /\n/.test(en[k]);
        var ta = h('textarea', { rows: long ? 3 : 1, dir: dir, 'aria-label': 'Translation of ' + k, spellcheck: 'true' }); ta.value = tr[k] || '';
        var pillEl = ZC.pill(s, s === 'ok' ? 'ok' : s === 'missing' ? 'bad' : 'warn');
        ta.addEventListener('input', function () {
          tr[k] = ta.value; S().touched[trLang + '|' + k] = true;
          var ns = tr[k] ? 'ok' : 'missing'; pillEl.className = 'pill ' + (ns === 'ok' ? 'ok' : 'bad'); pillEl.textContent = ns;
          ZC.touch();
        });
        tbody.appendChild(h('tr', { class: 'tr-' + s },
          h('td', { style: { width: '20%' } }, h('div', { class: 'key', text: k })),
          h('td', { style: { width: '36%' } }, h('div', { class: 'en', text: en[k] })),
          h('td', null, ta),
          h('td', { style: { width: '110px' } }, pillEl, s === 'outdated' ? h('div', { style: { marginTop: '6px' } }, h('button', { type: 'button', class: 'btn sm', text: 'Still correct', on: { click: function () { review([k], 'Keeps this translation and clears the flag.'); } } })) : null)));
      });
      if (!shown) tbody.appendChild(h('tr', null, h('td', { colSpan: 4 }, h('div', { class: 'empty', text: 'Nothing to show for this filter.' }))));
    }
    paintRows();
    ZC.clear(root).appendChild(h('div', null,
      h('p', { class: 'muted', style: { marginBottom: '12px' }, text: 'English comes from your content. “Outdated” means the English text changed after the translation was written.' }),
      tabs, h('div', { class: 'card' }, tools, h('table', { class: 'table' }, h('thead', null, h('tr', null, ['Key', 'English', LANG_NAMES[trLang] || trLang, 'Status'].map(function (t) { return h('th', { text: t }); }))), tbody))));
  }

  /* ---------- Live preview ---------- */
  var device = 'desktop';
  V.preview = {
    title: 'Live preview',
    render: function () {
      var widths = { desktop: '100%', tablet: '820px', mobile: '390px' };
      var frame = h('iframe', { src: '/preview/', title: 'Site preview', style: { width: widths[device] } });
      ZC.reloadPreview = function () { try { frame.contentWindow.location.reload(); } catch (e) { frame.src = '/preview/?r=' + Date.now(); } };
      return h('div', null,
        h('div', { class: 'preview-bar' },
          ['desktop', 'tablet', 'mobile'].map(function (dv) { return h('button', { type: 'button', class: 'btn sm' + (device === dv ? ' primary' : ''), text: dv[0].toUpperCase() + dv.slice(1), on: { click: function () { device = dv; frame.style.width = widths[dv]; ZC.rerender(); } } }); }),
          h('button', { type: 'button', class: 'btn sm', text: 'Reload', on: { click: function () { ZC.reloadPreview(); } } }),
          h('a', { class: 'btn sm', href: '/preview/', target: '_blank', rel: 'noopener', text: 'Open in new tab' }),
          h('span', { class: 'hint', text: S().dirty ? 'You have unsaved edits — the preview shows the last saved build.' : 'Showing the last saved build.' })),
        h('div', { class: 'frame-wrap' }, frame));
    }
  };

  /* ---------- Publish (git) ---------- */
  var gitMsg = 'Update portfolio content';
  function diffNode(text) {
    var pre = h('pre', { class: 'out diff' });
    String(text).split('\n').forEach(function (l) {
      var c = /^\+\+\+|^---|^diff |^index /.test(l) ? 'meta' : /^\+/.test(l) ? 'add' : /^-/.test(l) ? 'del' : /^@@/.test(l) ? 'hunk' : '';
      pre.appendChild(h('div', { class: c, text: l || ' ' }));
    });
    return pre;
  }
  V.publish = {
    title: 'Publish',
    render: function () {
      var root = h('div', { class: 'stack' }), out = h('pre', { class: 'out', hidden: true });
      var statusBox = h('div', null, h('p', { class: 'muted', text: 'Reading git status…' }));
      var logBox = h('div'), diffBox = h('div');

      function run(label, call) {
        ZC.toast(label + '…');
        out.hidden = false; out.textContent = label + '…';
        call.then(function (r) {
          out.textContent = [r.output, r.error, r.message].filter(Boolean).join('\n\n') || (r.success ? 'Done.' : 'Failed.');
          ZC.toast(r.success ? (r.nothing ? 'Nothing to commit.' : label + ' done.') : label + ' failed — see output.', r.success ? 'ok' : 'err');
          load();
        }).catch(function (e) { out.textContent = e.message; ZC.toast(e.message, 'err'); });
      }
      function load() {
        ZC.api('GET', '/api/git/status').then(function (st) {
          ZC.clear(statusBox);
          if (!st.success) return statusBox.appendChild(h('div', { class: 'banner err' }, 'Git is not available here: ' + (st.error || 'unknown error')));
          var blocked = S().dirty;
          statusBox.appendChild(h('div', { class: 'stack' },
            h('div', { class: 'row' }, ZC.pill('branch ' + st.branch, 'acc'), st.upstream ? ZC.pill('tracks ' + st.upstream) : ZC.pill('no upstream yet', 'warn'),
              st.ahead ? ZC.pill(st.ahead + ' to push', 'warn') : null, st.behind ? ZC.pill(st.behind + ' behind', 'bad') : null, st.clean ? ZC.pill('clean', 'ok') : ZC.pill(st.files.length + ' changed', 'warn')),
            h('p', { class: 'hint mono', text: st.remote ? 'origin → ' + st.remote : 'No remote named “origin”. Add one with: git remote add origin <url>' }),
            blocked ? h('div', { class: 'banner' }, h('div', { class: 'grow', text: 'You have unsaved edits. Save & rebuild first, otherwise they will not be part of the commit.' }), h('button', { type: 'button', class: 'btn sm primary', text: 'Save now', on: { click: function () { ZC.save().then(load); } } })) : null,
            st.files.length ? h('div', { class: 'filelist' }, st.files.slice(0, 40).map(function (f) { return h('div', null, h('b', { text: f.code }), h('span', { text: f.path })); }), st.files.length > 40 ? h('div', { class: 'hint', text: '… and ' + (st.files.length - 40) + ' more' }) : null) : null));
        }).catch(function (e) { ZC.clear(statusBox).appendChild(h('p', { text: e.message })); });
        ZC.api('GET', '/api/git/log').then(function (l) {
          ZC.clear(logBox).appendChild(h('div', { class: 'filelist' }, (l.commits || []).map(function (c) { return h('div', null, h('b', { text: c.hash }), h('span', { text: c.subject + '  ·  ' + c.relativeDate })); })));
        }).catch(function () {});
      }
      var msg = h('input', { type: 'text', value: gitMsg, 'aria-label': 'Commit message', maxLength: 200 });
      msg.addEventListener('input', function () { gitMsg = msg.value; });
      var getMsg = function () { return { message: msg.value }; };

      root.appendChild(ZC.card('Repository', statusBox, h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn sm', text: 'Fetch', on: { click: function () { run('Fetch', ZC.api('POST', '/api/git/fetch')); } } }),
        h('button', { type: 'button', class: 'btn sm', text: 'Pull', title: 'Fast-forward only', on: { click: function () { run('Pull', ZC.api('POST', '/api/git/pull')); } } }))));
      root.appendChild(ZC.card('Publish changes', h('div', { class: 'stack' },
        h('div', { class: 'field' }, h('label', { text: 'Commit message' }), msg),
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn primary', 'data-testid': 'publish', text: 'Commit & push', on: { click: function () {
            ZC.confirm('Publish to GitHub?', 'This commits every change in the repository and pushes it. GitHub Pages then deploys the front/ folder.', 'Commit & push').then(function (ok) { if (ok) run('Commit & push', ZC.api('POST', '/api/git/publish', getMsg())); });
          } } }),
          h('button', { type: 'button', class: 'btn', text: 'Commit only', on: { click: function () { run('Commit', ZC.api('POST', '/api/git/commit', getMsg())); } } }),
          h('button', { type: 'button', class: 'btn', text: 'Push', on: { click: function () { run('Push', ZC.api('POST', '/api/git/push')); } } }),
          h('button', { type: 'button', class: 'btn ghost', text: 'Show changes', on: { click: function () {
            ZC.clear(diffBox).appendChild(h('p', { class: 'muted', text: 'Loading diff…' }));
            ZC.api('GET', '/api/git/diff').then(function (r) { ZC.clear(diffBox).appendChild(r.diff ? diffNode(r.diff) : h('p', { class: 'muted', text: 'No changes.' })); });
          } } })),
        out, diffBox)));
      root.appendChild(ZC.card('Recent commits', logBox));
      load();
      return root;
    }
  };

  /* ---------- History / backups ---------- */
  V.history = {
    title: 'History & restore',
    render: function () {
      var list = S().backups || [];
      function fmt(b) {
        var m = b.name.match(/^(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-(\d{2})[^_]*(?:__(.*))?\.json$/);
        return m ? { when: m[1] + ' ' + m[2] + ':' + m[3] + ':' + m[4] + ' UTC', label: m[5] || 'save' } : { when: b.name, label: '' };
      }
      return ZC.card('Automatic backups', h('div', { class: 'stack' },
        h('p', { class: 'muted', text: 'Every save keeps a copy of the previous data (last 50). Loading one puts it in the editor as unsaved changes, so nothing is overwritten until you save.' }),
        list.length ? h('table', { class: 'table' }, h('thead', null, h('tr', null, ['When', 'Reason', 'Size', ''].map(function (t) { return h('th', { text: t }); }))), h('tbody', null, list.map(function (b) {
          var f = fmt(b);
          return h('tr', null, h('td', { class: 'mono', text: f.when }), h('td', null, ZC.pill(f.label)), h('td', { class: 'hint', text: Math.round(b.size / 1024) + ' KB' }), h('td', null, h('button', { type: 'button', class: 'btn sm', text: 'Load as draft', on: { click: function () {
            var go = function () {
              ZC.api('GET', '/api/backups/' + encodeURIComponent(b.name)).then(function (r) { S().data = r.data; S().touched = {}; ZC.sel = {}; ZC.touch(); ZC.revalidate(); ZC.toast('Backup loaded as draft. Review it, then Save.', 'ok'); ZC.go('overview'); }).catch(function (e) { ZC.toast(e.message, 'err'); });
            };
            if (S().dirty) ZC.confirm('Replace unsaved edits?', 'Your current unsaved changes will be replaced by this backup.', 'Load backup', true).then(function (ok) { if (ok) go(); }); else go();
          } } })));
        }))) : h('div', { class: 'empty', text: 'No backups yet. The first save creates one.' })));
    }
  };
})();
