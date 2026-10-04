/* Core: DOM helper, API client, state, toasts, modals, form fields. Everything hangs off window.ZC. */
(function () {
  'use strict';
  var ZC = (window.ZC = {});

  /* ---------- DOM builder (never uses innerHTML → no XSS from content) ---------- */
  ZC.h = function h(tag, attrs) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'on') Object.keys(v).forEach(function (ev) { el.addEventListener(ev, v[ev]); });
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k in el && k !== 'list' && k !== 'form') { try { el[k] = v; } catch (e) { el.setAttribute(k, v); } }
      else el.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  };
  function append(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) return c.forEach(function (x) { append(el, x); });
    el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }
  var h = ZC.h;
  ZC.clear = function (el) { while (el.firstChild) el.removeChild(el.firstChild); return el; };

  /* ---------- state ---------- */
  ZC.state = { data: null, rev: null, english: {}, i18n: null, validation: { errors: [], warnings: [] }, icons: [], backups: [], dirty: false, saving: false, touched: {} };
  ZC.listeners = [];
  ZC.onChange = function (fn) { ZC.listeners.push(fn); };
  ZC.emit = function () { ZC.listeners.forEach(function (f) { f(); }); };

  var vt = null;
  ZC.livePainters = [];
  ZC.touch = function () {
    ZC.state.dirty = true;
    ZC.livePainters.forEach(function (f) { try { f(); } catch (e) {} });
    ZC.emit();
    clearTimeout(vt);
    vt = setTimeout(ZC.revalidate, 350);
  };
  ZC.revalidate = function () {
    ZC.api('POST', '/api/validate', { data: ZC.state.data }).then(function (v) { ZC.state.validation = v; ZC.emit(); ZC.afterValidate && ZC.afterValidate(); }).catch(function () {});
  };

  /* ---------- API ---------- */
  ZC.api = function (method, url, body, opts) {
    opts = opts || {};
    var init = { method: method, headers: {}, credentials: 'same-origin' };
    if (body !== undefined && !opts.raw) { init.headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(body); }
    if (opts.raw) { init.headers['Content-Type'] = opts.type; init.body = body; }
    return fetch(url, init).then(function (r) {
      return r.json().catch(function () { return { success: false, error: 'Bad response (' + r.status + ')' }; }).then(function (j) {
        if (!r.ok) { var e = new Error(j.error || ('Request failed (' + r.status + ')')); e.status = r.status; e.body = j; throw e; }
        return j;
      });
    });
  };

  /* ---------- paths / ids ---------- */
  ZC.slug = function (s) {
    return String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'item';
  };
  ZC.uniqueId = function (base, used) {
    var id = ZC.slug(base), n = 2, b = id;
    while (used.indexOf(id) > -1) id = (b.slice(0, 36) + '-' + n++);
    return id;
  };
  ZC.projectIds = function () {
    var d = ZC.state.data;
    return (d.featuredProjects || []).concat(d.moreProjects || []).map(function (p) { return p.id; });
  };
  ZC.clone = function (o) { return JSON.parse(JSON.stringify(o)); };

  /* ---------- toasts ---------- */
  ZC.toast = function (msg, kind) {
    var t = h('div', { class: 'toast ' + (kind || ''), text: msg });
    document.getElementById('toasts').appendChild(t);
    setTimeout(function () { t.remove(); }, kind === 'err' ? 7000 : 3200);
  };

  /* ---------- modal ---------- */
  ZC.modal = function (title, bodyNodes, buttons) {
    var root = document.getElementById('modalRoot');
    return new Promise(function (resolve) {
      var prevFocus = document.activeElement;
      function close(v) { ZC.clear(root); document.removeEventListener('keydown', onKey); if (prevFocus && prevFocus.focus) prevFocus.focus(); resolve(v); }
      function onKey(e) { if (e.key === 'Escape') close(null); }
      var acts = h('div', { class: 'actions' }, buttons.map(function (b) {
        return h('button', { type: 'button', class: 'btn ' + (b.cls || ''), text: b.label, on: { click: function () { close(b.value === undefined ? b.label : (typeof b.value === 'function' ? b.value() : b.value)); } } });
      }));
      var box = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': title }, h('h3', { text: title }), bodyNodes, acts);
      var bg = h('div', { class: 'modal-bg', on: { mousedown: function (e) { if (e.target === bg) close(null); } } }, box);
      ZC.clear(root).appendChild(bg);
      document.addEventListener('keydown', onKey);
      var f = box.querySelector('input,textarea,select') || acts.lastChild;
      if (f) f.focus();
    });
  };
  ZC.confirm = function (title, text, okLabel, danger) {
    return ZC.modal(title, h('p', { class: 'muted', text: text }), [
      { label: 'Cancel', value: false },
      { label: okLabel || 'Confirm', cls: danger ? 'danger' : 'primary', value: true }
    ]).then(function (v) { return v === true; });
  };
  ZC.prompt = function (title, label, initial) {
    var inp = h('input', { type: 'text', value: initial || '', 'aria-label': label });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); inp.closest('.modal').querySelector('.btn.primary').click(); } });
    return ZC.modal(title, h('div', { class: 'field' }, h('label', { text: label }), inp), [
      { label: 'Cancel', value: null },
      { label: 'Create', cls: 'primary', value: function () { return inp.value.trim() || null; } }
    ]);
  };

  /* ---------- form fields: they write straight into the object they edit ---------- */
  ZC.errorFor = function (path) {
    var v = ZC.state.validation, hit = null;
    (v.errors || []).forEach(function (e) { if (e.path === path) hit = e; });
    return hit;
  };

  /**
   * field(label, obj, key, opts)
   * opts: type text|textarea|select|number|url|email, options [[value,label]], rows, hint, path (for validation), readonly, placeholder, max, dir, onInput
   */
  ZC.field = function (label, obj, key, opts) {
    opts = opts || {};
    var id = 'f' + Math.random().toString(36).slice(2, 9);
    var val = obj[key] == null ? '' : obj[key];
    var input;
    if (opts.type === 'textarea') input = h('textarea', { id: id, rows: opts.rows || 3, readOnly: !!opts.readonly, placeholder: opts.placeholder || '' });
    else if (opts.type === 'select') {
      input = h('select', { id: id }, (opts.options || []).map(function (o) { return h('option', { value: o[0], text: o[1] }); }));
    } else input = h('input', { id: id, type: opts.type || 'text', readOnly: !!opts.readonly, placeholder: opts.placeholder || '', autocomplete: 'off', spellcheck: opts.spellcheck === false ? 'false' : 'true' });
    input.value = val;
    if (opts.dir) input.dir = opts.dir;
    var wrap = h('div', { class: 'field' }, h('label', { for: id, text: label }), input);
    var counter = null;
    if (opts.max) { counter = h('span', { class: 'counter' }); wrap.appendChild(counter); }
    var errEl = h('span', { class: 'err', hidden: true });
    wrap.appendChild(errEl);
    function paint() {
      if (counter) { var n = String(input.value).length; counter.textContent = n + ' / ' + opts.max; counter.classList.toggle('over', n > opts.max); }
      if (opts.path) { var e = ZC.errorFor(opts.path); wrap.classList.toggle('invalid', !!e); errEl.hidden = !e; errEl.textContent = e ? e.msg : ''; }
    }
    input.addEventListener('input', function () {
      var v = input.value;
      obj[key] = v;
      paint(); ZC.touch();
      if (opts.onInput) opts.onInput(v);
    });
    if (opts.hint) wrap.insertBefore(h('span', { class: 'hint', text: opts.hint }), counter || errEl);
    paint();
    ZC.fieldPainters.push(paint);
    return wrap;
  };
  ZC.fieldPainters = [];
  ZC.afterValidate = function () { ZC.fieldPainters.forEach(function (p) { try { p(); } catch (e) {} }); };

  /** Tag chips editor for an array of strings at obj[key]. */
  ZC.tags = function (label, obj, key, hint) {
    if (!Array.isArray(obj[key])) obj[key] = [];
    var list = obj[key];
    var box = h('div', { class: 'tags' });
    var inp = h('input', { type: 'text', placeholder: 'Type and press Enter', 'aria-label': label });
    function paint() {
      ZC.clear(box);
      list.forEach(function (t, i) {
        box.appendChild(h('span', { class: 'tag' }, t, h('button', { type: 'button', 'aria-label': 'Remove ' + t, text: '×', on: { click: function () { list.splice(i, 1); paint(); ZC.touch(); } } })));
      });
      box.appendChild(inp);
    }
    function commit() {
      inp.value.split(',').map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (s) { if (list.indexOf(s) < 0) list.push(s); });
      inp.value = ''; paint(); ZC.touch(); inp.focus();
    }
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commit(); }
      else if (e.key === 'Backspace' && !inp.value && list.length) { list.pop(); paint(); ZC.touch(); inp.focus(); }
    });
    inp.addEventListener('blur', function () { if (inp.value.trim()) commit(); });
    paint();
    return h('div', { class: 'field' }, h('label', { text: label }), box, hint ? h('span', { class: 'hint', text: hint }) : null);
  };

  ZC.iconBtn = function (txt, title, fn, extra) {
    return h('button', { type: 'button', class: 'icon-btn ' + (extra || ''), title: title, 'aria-label': title, text: txt, on: { click: function (e) { e.stopPropagation(); fn(e); } } });
  };
  ZC.pill = function (text, kind) { return h('span', { class: 'pill ' + (kind || ''), text: text }); };
  ZC.card = function (title, content, actions) {
    return h('section', { class: 'card' }, title ? h('div', { class: 'card-head' }, h('h2', { text: title }), actions || null) : null, content);
  };

  /* move an element inside an array */
  ZC.move = function (arr, i, d) { var j = i + d; if (j < 0 || j >= arr.length) return false; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; return true; };
})();
