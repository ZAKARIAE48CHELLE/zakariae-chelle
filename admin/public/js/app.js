/* App shell: navigation, routing, load/save, unsaved-changes guard. */
(function () {
  'use strict';
  var ZC = window.ZC, h = ZC.h;
  var $ = function (id) { return document.getElementById(id); };

  var NAV = [
    { id: 'overview', icon: '◎', label: 'Overview' },
    { group: 'Content' },
    { id: 'profile', icon: '☺', label: 'Profile & site' },
    { id: 'featured', icon: '◆', label: 'Featured projects', count: function (d) { return (d.featuredProjects || []).length; } },
    { id: 'more', icon: '◇', label: 'More projects', count: function (d) { return (d.moreProjects || []).length; } },
    { id: 'skills', icon: '✦', label: 'Skills', count: function (d) { return (d.skills || []).length; } },
    { id: 'experience', icon: '▤', label: 'Experience & education' },
    { group: 'Site' },
    { id: 'i18n', icon: '文', label: 'Translations' },
    { id: 'preview', icon: '▣', label: 'Live preview' },
    { group: 'Ship' },
    { id: 'publish', icon: '↑', label: 'Publish' },
    { id: 'history', icon: '↺', label: 'History & restore' }
  ];

  var current = 'overview';

  function viewId() { var m = location.hash.match(/^#\/([a-z0-9]+)/); return m && ZC.views[m[1]] ? m[1] : 'overview'; }
  ZC.go = function (id) { if (location.hash === '#/' + id) ZC.rerender(); else location.hash = '#/' + id; };
  ZC.goPath = function (path) {
    var m = String(path || '').match(/^(featuredProjects|moreProjects|skills|experience|education)\[(\d+)\]/), map = { featuredProjects: ['featured', 'featured'], moreProjects: ['more', 'more'], skills: ['skills', 'skills'], experience: ['experience', 'exp'], education: ['experience', 'edu'] };
    if (m) { ZC.sel[map[m[1]][1]] = +m[2]; ZC.go(map[m[1]][0]); return; }
    ZC.go('profile');
  };

  /* ---------- rendering ---------- */
  ZC.rerender = function () {
    var view = $('view'), y = window.scrollY, active = document.activeElement && document.activeElement.getAttribute && document.activeElement.getAttribute('aria-label');
    current = viewId();
    ZC.fieldPainters.length = 0; ZC.livePainters.length = 0;
    var v = ZC.views[current];
    $('viewTitle').textContent = v.title;
    document.title = v.title + ' · Back office';
    ZC.clear(view).appendChild(v.render());
    window.scrollTo(0, y);
    paintNav(); paintState();
  };

  function paintNav() {
    var nav = ZC.clear($('nav')), d = ZC.state.data, errs = ZC.state.validation.errors.length;
    NAV.forEach(function (n) {
      if (n.group) return nav.appendChild(h('div', { class: 'nav-group', text: n.group }));
      var kids = [h('span', { class: 'ico', text: n.icon, 'aria-hidden': 'true' }), n.label];
      if (n.id === 'overview' && errs) kids.push(ZC.pill(String(errs), 'bad'));
      else if (n.id === 'i18n' && ZC.state.i18n) {
        var x = 0; Object.keys(ZC.state.i18n.langs).forEach(function (l) { x += ZC.state.i18n.langs[l].missing + ZC.state.i18n.langs[l].outdated; });
        if (x) kids.push(ZC.pill(String(x), 'warn'));
      } else if (n.count && d) kids.push(h('span', { class: 'count', text: String(n.count(d)) }));
      nav.appendChild(h('button', { type: 'button', class: 'nav-item' + (n.id === current ? ' on' : ''), 'aria-current': n.id === current ? 'page' : null, on: { click: function () { $('side').classList.remove('open'); ZC.go(n.id); } } }, kids));
    });
  }

  function paintState() {
    var s = ZC.state, errs = s.validation.errors.length;
    var el = ZC.clear($('saveState'));
    el.appendChild(h('span', { class: 'dot' + (s.dirty ? ' dirty' : '') + (errs ? ' bad' : '') }));
    el.appendChild(document.createTextNode(s.saving ? 'Saving…' : errs ? errs + ' problem(s) to fix' : s.dirty ? 'Unsaved changes' : 'All changes saved'));
    $('saveBtn').disabled = s.saving || !s.dirty;
    $('discardBtn').hidden = !s.dirty;
  }
  ZC.onChange(function () { paintState(); paintNav(); });

  /* ---------- banner ---------- */
  function banner(msg, kind, buttons) {
    var b = $('banner'); ZC.clear(b); b.className = 'banner' + (kind === 'err' ? ' err' : ''); b.hidden = false;
    b.appendChild(h('div', { class: 'grow', text: msg }));
    (buttons || []).forEach(function (x) { b.appendChild(h('button', { type: 'button', class: 'btn sm', text: x.label, on: { click: x.fn } })); });
    b.appendChild(h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Dismiss', text: '×', on: { click: function () { b.hidden = true; } } }));
  }

  /* ---------- load / save ---------- */
  function adopt(r) {
    var s = ZC.state;
    s.data = r.data; s.rev = r.rev; s.icons = r.icons || s.icons; s.english = r.english || s.english; s.i18n = r.i18n || s.i18n;
    s.validation = r.validation || s.validation; s.backups = r.backups || s.backups; s.touched = {};
  }
  ZC.load = function () {
    return ZC.api('GET', '/api/state').then(function (r) { adopt(r); ZC.state.dirty = false; $('banner').hidden = true; ZC.rerender(); });
  };
  ZC.save = function (op) {
    var s = ZC.state;
    if (s.saving) return Promise.resolve();
    s.saving = true; paintState();
    return ZC.api('POST', '/api/save', { data: s.data, rev: s.rev, op: op || undefined }).then(function (r) {
      adopt(r); s.dirty = false; s.saving = false; $('banner').hidden = true;
      var n = (r.built && r.built.updatedFiles || []).length;
      ZC.toast(n ? 'Saved. Site rebuilt (' + n + ' file' + (n > 1 ? 's' : '') + ' updated).' : 'Saved. Site already up to date.', 'ok');
      ZC.rerender();
      if (ZC.reloadPreview && current === 'preview') ZC.reloadPreview();
    }).catch(function (e) {
      s.saving = false;
      if (e.status === 422 && e.body && e.body.validation) {
        s.validation = e.body.validation; ZC.emit();
        var first = s.validation.errors[0];
        banner(e.message, 'err', first ? [{ label: 'Go to first problem', fn: function () { ZC.goPath(first.path); } }] : []);
        ZC.toast('Fix the highlighted problems, then save again.', 'err');
      } else if (e.status === 409) {
        banner(e.message, 'err', [
          { label: 'Reload latest (discard my edits)', fn: function () { ZC.load(); } },
          { label: 'Download my edits', fn: function () { var a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(s.data, null, 2)], { type: 'application/json' })), download: 'my-unsaved-edits.json' }); a.click(); } }
        ]);
      } else ZC.toast(e.message, 'err');
      paintState();
    });
  };

  /* ---------- wiring ---------- */
  $('saveBtn').addEventListener('click', function () { ZC.save(); });
  $('discardBtn').addEventListener('click', function () {
    ZC.confirm('Discard unsaved changes?', 'Everything you changed since the last save will be lost.', 'Discard', true).then(function (ok) { if (ok) ZC.load(); });
  });
  $('quitBtn').addEventListener('click', function () {
    ZC.confirm('Stop the back office?', 'The local server shuts down. Start it again from the launcher script when you need it.', 'Stop', true).then(function (ok) {
      if (!ok) return;
      ZC.state.dirty = false;
      ZC.api('POST', '/api/quit').catch(function () {}).then(function () { document.body.textContent = 'Back office stopped. You can close this tab.'; });
    });
  });
  $('menuBtn').addEventListener('click', function () { $('side').classList.toggle('open'); });
  window.addEventListener('hashchange', ZC.rerender);
  window.addEventListener('beforeunload', function (e) { if (ZC.state.dirty) { e.preventDefault(); e.returnValue = ''; } });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); if (ZC.state.dirty) ZC.save(); }
  });

  ZC.load().catch(function (e) {
    ZC.clear($('view')).appendChild(h('div', { class: 'card' }, h('h2', { text: 'Can’t reach the back office' }), h('p', { class: 'muted', text: e.status === 401 ? 'Not signed in. Open the link printed in the terminal (it contains a one-time token).' : e.message })));
  });
})();
