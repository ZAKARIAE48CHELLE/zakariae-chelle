/* Reusable editors: master/detail list (reorder · hide · duplicate · delete) and small repeaters. */
(function () {
  'use strict';
  var ZC = window.ZC, h = ZC.h;
  ZC.sel = {};

  /**
   * listEditor({ key, noun, items(), title(it), sub(it), render(it), create(), duplicate(it), hideable })
   * Structural changes (add/move/delete) re-render the whole view; typing never does, so focus is kept.
   */
  ZC.listEditor = function (o) {
    var items = o.items();
    var sel = ZC.sel[o.key];
    if (sel == null || sel >= items.length) sel = ZC.sel[o.key] = 0;
    var current = items[sel];

    function pick(i) { ZC.sel[o.key] = i; ZC.rerender(); }
    function structural() { ZC.touch(); ZC.rerender(); }

    var list = h('div', { class: 'list', role: 'listbox', 'aria-label': o.noun + 's' });
    items.forEach(function (it, i) {
      var hidden = !!it.hidden;
      var row = h('div', { class: 'li' + (i === sel ? ' on' : '') + (hidden ? ' hid' : ''), role: 'option', tabindex: 0, 'aria-selected': i === sel ? 'true' : 'false',
        on: { click: function () { pick(i); }, keydown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(i); } } } },
        h('div', { class: 't' }, h('b', { text: o.title(it) || '(untitled)' }), h('small', { text: (hidden ? 'Hidden · ' : '') + (o.sub ? o.sub(it) : '') })),
        h('div', { class: 'acts' },
          ZC.iconBtn('↑', 'Move up', function () { if (ZC.move(items, i, -1)) { ZC.sel[o.key] = i - 1; structural(); } }),
          ZC.iconBtn('↓', 'Move down', function () { if (ZC.move(items, i, 1)) { ZC.sel[o.key] = i + 1; structural(); } })
        ));
      list.appendChild(row);
    });
    if (!items.length) list.appendChild(h('div', { class: 'empty', text: 'No ' + o.noun + 's yet.' }));
    list.appendChild(h('button', { type: 'button', class: 'btn', text: '+ Add ' + o.noun, on: { click: function () {
      Promise.resolve(o.create()).then(function (it) { if (!it) return; items.push(it); ZC.sel[o.key] = items.length - 1; structural(); });
    } } }));

    var detail;
    if (!current) detail = h('div', { class: 'empty', text: 'Add your first ' + o.noun + ' to start editing.' });
    else {
      var head = h('div', { class: 'form-head' },
        h('h2', { text: o.title(current) || '(untitled)' }),
        current.id ? h('span', { class: 'idchip', title: 'Internal id — used for translation keys. It never changes.', text: current.id }) : null,
        o.hideable === false ? null : h('button', { type: 'button', class: 'btn sm', text: current.hidden ? 'Show on site' : 'Hide from site', on: { click: function () { if (current.hidden) delete current.hidden; else current.hidden = true; structural(); } } }),
        o.duplicate ? h('button', { type: 'button', class: 'btn sm', text: 'Duplicate', on: { click: function () { var c = o.duplicate(current); items.splice(sel + 1, 0, c); ZC.sel[o.key] = sel + 1; structural(); ZC.toast('Duplicated. Translations are not copied.'); } } }) : null,
        h('button', { type: 'button', class: 'btn sm danger', text: 'Delete', on: { click: function () {
          ZC.confirm('Delete ' + o.noun + '?', '“' + (o.title(current) || 'this item') + '” will be removed from the site when you save. You can restore it from History.', 'Delete', true).then(function (ok) {
            if (!ok) return; items.splice(sel, 1); ZC.sel[o.key] = Math.max(0, sel - 1); structural();
          });
        } } })
      );
      detail = h('div', { class: 'card' }, head, o.render(current, sel));
    }
    return h('div', { class: 'split' }, list, detail);
  };

  /**
   * repeater({ label, list, columns, makeNew(promptText), prompt, noun, row(item) -> [fields], max })
   * Rows with reorder + delete. `prompt` asks for a name first (to derive a stable id).
   */
  ZC.repeater = function (o) {
    var list = o.list;
    var wrap = h('div', { class: 'rep' });
    list.forEach(function (it, i) {
      wrap.appendChild(h('div', { class: 'rep-row', style: { gridTemplateColumns: o.cols || '1fr' } },
        o.row(it, i),
        h('div', { class: 'acts' },
          ZC.iconBtn('↑', 'Move up', function () { if (ZC.move(list, i, -1)) { ZC.touch(); ZC.rerender(); } }),
          ZC.iconBtn('↓', 'Move down', function () { if (ZC.move(list, i, 1)) { ZC.touch(); ZC.rerender(); } }),
          ZC.iconBtn('✕', 'Remove', function () { list.splice(i, 1); ZC.touch(); ZC.rerender(); }, 'danger')
        )));
    });
    var add = h('button', { type: 'button', class: 'btn sm', text: '+ Add ' + o.noun, on: { click: function () {
      var p = o.prompt ? ZC.prompt('New ' + o.noun, o.prompt) : Promise.resolve('x');
      p.then(function (name) {
        if (!name) return;
        var item = o.makeNew(name, list);
        if (!item) return;
        list.push(item); ZC.touch(); ZC.rerender();
      });
    } } });
    return h('div', { class: 'stack' }, o.label ? h('div', { class: 'row spread' }, h('h3', { text: o.label }), o.hint ? h('span', { class: 'hint', text: o.hint }) : null) : null, wrap, add);
  };

  /** Edits an array of plain strings (e.g. experience bullets) or {text} objects. */
  ZC.textList = function (label, arr, noun, asObjects) {
    return ZC.repeater({
      label: label, list: arr, noun: noun, cols: '1fr',
      row: function (it) { return asObjects ? ZC.field('', it, 'text', { type: 'textarea', rows: 2 }) : null; },
      makeNew: function () { return asObjects ? { text: '' } : ''; }
    });
  };
})();
