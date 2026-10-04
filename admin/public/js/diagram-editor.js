/* Architecture diagram editor with live desktop + mobile preview (uses the same renderer as the public site). */
(function () {
  'use strict';
  var ZC = window.ZC, h = ZC.h;

  var KIND_OPTS = [['ai', 'AI'], ['data', 'Data'], ['svc', 'Service'], ['watch', 'Monitor']];
  var EDGE_OPTS = [['f', 'flows to  →'], ['c', 'controls  ┄>'], ['b', 'two-way  ↔']];

  function small(obj, key, placeholder, onInput, label) {
    var i = h('input', { type: 'text', value: obj[key] == null ? '' : obj[key], placeholder: placeholder, 'aria-label': label || placeholder });
    i.addEventListener('input', function () { obj[key] = i.value; onInput(); });
    return i;
  }
  function sel(options, value, onChange, label) {
    var s = h('select', { 'aria-label': label }, options.map(function (o) { return h('option', { value: o[0], text: o[1], selected: o[0] === value }); }));
    s.addEventListener('change', function () { onChange(s.value); });
    return s;
  }

  ZC.diagramEditor = function (project) {
    var root = h('div', { class: 'stack' });
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function previews() {
      var d = project.diagram;
      var dh = h('div', { class: 'dg-preview', 'data-testid': 'dg-desktop' }), mh = h('div', { class: 'dg-preview mobile', 'data-testid': 'dg-mobile' });
      function paint() {
        try { window.ZCDiagram.render(dh, d, { key: 'ed', mobile: false, reduce: reduce }); window.ZCDiagram.render(mh, d, { key: 'ed', mobile: true, reduce: reduce }); }
        catch (e) { dh.textContent = 'Preview error: ' + e.message; }
      }
      paint();
      var box = h('div', { class: 'stack' },
        h('div', null, h('p', { class: 'dg-label', text: 'Desktop' }), dh),
        h('div', null, h('p', { class: 'dg-label', text: 'Mobile' }), mh));
      box.paint = paint;
      return box;
    }

    function build() {
      ZC.clear(root);
      var d = project.diagram;

      if (!d || (!d.mode)) {
        root.appendChild(h('div', { class: 'empty' },
          h('p', { text: 'This project has no architecture diagram. It will be shown as a single-column card.' }),
          h('p', { style: { marginTop: '12px' } }, h('button', { type: 'button', class: 'btn primary', text: 'Add a diagram', on: { click: function () {
            project.diagram = { mode: 'auto', nodes: [{ id: 'input', label: 'Input', sub: '', kind: 'data' }, { id: 'core', label: 'Core', sub: '', kind: 'ai' }, { id: 'output', label: 'Output', sub: '', kind: 'svc' }], edges: [['input', 'core', 'f'], ['core', 'output', 'f']] };
            ZC.touch(); build();
          } } }))));
        return;
      }

      var pv = previews();
      var head = h('div', { class: 'row spread' },
        h('div', { class: 'row' }, ZC.pill(d.mode === 'auto' ? 'Auto layout' : 'Custom layout', d.mode === 'auto' ? 'acc' : ''), h('span', { class: 'hint', text: d.mode === 'auto' ? 'Nodes are placed automatically from the connections.' : 'Hand-placed coordinates. Convert to auto layout to edit nodes here.' })),
        h('button', { type: 'button', class: 'btn sm danger', text: 'Remove diagram', on: { click: function () {
          ZC.confirm('Remove diagram?', 'The project will be shown without a diagram.', 'Remove', true).then(function (ok) { if (ok) { delete project.diagram; ZC.touch(); build(); } });
        } } }));

      var editor;
      if (d.mode === 'spec') {
        editor = h('div', { class: 'stack' },
          h('p', { class: 'muted', text: 'This diagram uses a custom hand-placed layout, so it can’t be edited node by node. Converting keeps the nodes and connections but lets the layout engine place them (positions will change).' }),
          h('div', null, h('button', { type: 'button', class: 'btn', text: 'Convert to editable auto layout', on: { click: function () {
            var L = d.spec.desktop;
            project.diagram = { mode: 'auto',
              nodes: L.nodes.map(function (n) { return { id: n[0], label: n[3], sub: n[4], kind: n[5] }; }),
              edges: (L.edges || []).map(function (e) { return [e[0], e[1], e[2] || 'f']; }) };
            ZC.touch(); build();
          } } })));
      } else {
        d.nodes = d.nodes || []; d.edges = d.edges || [];
        var onEdit = function () { pv.paint(); ZC.touch(); };
        var nodesBox = h('div', { class: 'rep' });
        d.nodes.forEach(function (n, i) {
          nodesBox.appendChild(h('div', { class: 'node-row' },
            small(n, 'label', 'Label', onEdit, 'Node label'),
            small(n, 'sub', 'Subtitle', onEdit, 'Node subtitle'),
            sel(KIND_OPTS, n.kind || 'svc', function (v) { n.kind = v; onEdit(); }, 'Node kind'),
            ZC.iconBtn('✕', 'Remove node', function () {
              d.nodes.splice(i, 1);
              d.edges = d.edges.filter(function (e) { return e[0] !== n.id && e[1] !== n.id; });
              ZC.touch(); build();
            }, 'danger')));
        });
        var addLabel = h('input', { type: 'text', placeholder: 'New node label', 'aria-label': 'New node label' });
        var addNode = function () {
          var label = addLabel.value.trim(); if (!label) return;
          var id = ZC.uniqueId(label, d.nodes.map(function (n) { return n.id; }));
          d.nodes.push({ id: id, label: label, sub: '', kind: 'svc' }); ZC.touch(); build();
        };
        addLabel.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addNode(); } });

        var ids = d.nodes.map(function (n) { return [n.id, n.label || n.id]; });
        var edgesBox = h('div', { class: 'rep' });
        d.edges.forEach(function (e, i) {
          edgesBox.appendChild(h('div', { class: 'edge-row' },
            sel(ids, e[0], function (v) { e[0] = v; onEdit(); }, 'From'),
            sel(EDGE_OPTS, e[2] || 'f', function (v) { e[2] = v; onEdit(); }, 'Connection type'),
            sel(ids, e[1], function (v) { e[1] = v; onEdit(); }, 'To'),
            ZC.iconBtn('✕', 'Remove connection', function () { d.edges.splice(i, 1); ZC.touch(); build(); }, 'danger')));
        });

        editor = h('div', { class: 'stack' },
          h('div', { class: 'stack' }, h('h3', { text: 'Nodes' }), nodesBox,
            h('div', { class: 'row' }, addLabel, h('button', { type: 'button', class: 'btn sm', text: '+ Node', on: { click: addNode } }))),
          h('div', { class: 'stack' }, h('h3', { text: 'Connections' }), edgesBox,
            h('div', null, h('button', { type: 'button', class: 'btn sm', disabled: d.nodes.length < 2, text: '+ Connection', on: { click: function () {
              d.edges.push([d.nodes[0].id, d.nodes[1].id, 'f']); ZC.touch(); build();
            } } }))));
      }
      root.appendChild(head);
      root.appendChild(h('div', { class: 'dg-wrap' }, editor, pv));
    }
    build();
    return root;
  };
})();
