/*
  Architecture diagram renderer — shared by the public site and the back office preview.

  A diagram is either:
    { mode: 'spec', spec: { desktop: {w,h,nw,nh,nodes,edges}, mobile: {...} } }   hand-placed
    { mode: 'auto', nodes: [{id,label,sub,kind}], edges: [[from,to,type]] }       auto-layout

  node (spec):  [id, x, y, label, sub, kind]    kinds: ai | data | svc | watch
  edge:         [from, to, type]                types: f flow | c control (dashed) | b both ways
*/
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ZCDiagram = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var KINDS = ['ai', 'data', 'svc', 'watch'];

  /* ---------- auto layout ---------- */
  function rankNodes(nodes, edges) {
    var idx = {}, out = {}, rank = {}, state = {};
    nodes.forEach(function (n) { idx[n.id] = n; out[n.id] = []; rank[n.id] = 0; });
    edges.forEach(function (e) { if (idx[e[0]] && idx[e[1]] && e[0] !== e[1]) out[e[0]].push(e[1]); });
    var back = {};
    function dfs(u) {
      state[u] = 1;
      out[u].forEach(function (v) {
        if (state[v] === 1) back[u + '>' + v] = true;
        else if (!state[v]) dfs(v);
      });
      state[u] = 2;
    }
    nodes.forEach(function (n) { if (!state[n.id]) dfs(n.id); });
    // longest-path layering over the acyclic edge set
    var changed = true, guard = 0;
    while (changed && guard++ < nodes.length + 2) {
      changed = false;
      edges.forEach(function (e) {
        if (!idx[e[0]] || !idx[e[1]] || back[e[0] + '>' + e[1]] || e[0] === e[1]) return;
        if (rank[e[1]] < rank[e[0]] + 1) { rank[e[1]] = rank[e[0]] + 1; changed = true; }
      });
    }
    return rank;
  }

  function layout(auto) {
    var nodes = (auto.nodes || []).filter(function (n) { return n && n.id; });
    var edges = (auto.edges || []).filter(function (e) { return e && e.length >= 2; });
    if (!nodes.length) return { desktop: { w: 560, h: 120, nw: 112, nh: 46, nodes: [], edges: [] }, mobile: { w: 340, h: 120, nw: 146, nh: 46, nodes: [], edges: [] } };
    var rank = rankNodes(nodes, edges), cols = [];
    nodes.forEach(function (n) { (cols[rank[n.id]] = cols[rank[n.id]] || []).push(n); });
    cols = cols.filter(Boolean);

    // order inside each column by the average position of already-placed neighbours
    var pos = {};
    cols.forEach(function (col, ci) {
      if (ci > 0) {
        var score = function (n) {
          var xs = [];
          edges.forEach(function (e) {
            if (e[1] === n.id && pos[e[0]] != null) xs.push(pos[e[0]]);
            if (e[0] === n.id && pos[e[1]] != null) xs.push(pos[e[1]]);
          });
          return xs.length ? xs.reduce(function (a, b) { return a + b; }, 0) / xs.length : 999;
        };
        col.sort(function (a, b) { return score(a) - score(b); });
      }
      col.forEach(function (n, i) { pos[n.id] = i - (col.length - 1) / 2; });
    });

    var NH = 46, PITCH = 84;
    var nc = cols.length, NW = 112, GAP = 32;
    var W = Math.max(560, nc * NW + (nc - 1) * GAP + 16);
    var tallest = Math.max.apply(null, cols.map(function (c) { return c.length; }));
    var H = tallest * PITCH - (PITCH - NH) + 20;
    var span = nc * NW + (nc - 1) * GAP, x0 = Math.round((W - span) / 2);
    var dn = [];
    cols.forEach(function (col, ci) {
      var colH = col.length * PITCH - (PITCH - NH), y0 = (H - colH) / 2;
      col.forEach(function (n, i) { dn.push([n.id, x0 + ci * (NW + GAP), Math.round(y0 + i * PITCH), n.label || n.id, n.sub || '', KINDS.indexOf(n.kind) > -1 ? n.kind : 'svc']); });
    });

    var ordered = [];
    cols.forEach(function (c) { c.forEach(function (n) { ordered.push(n); }); });
    var mn = ordered.map(function (n, i) { return [n.id, i % 2 ? 186 : 8, 8 + Math.floor(i / 2) * 88, n.label || n.id, n.sub || '', KINDS.indexOf(n.kind) > -1 ? n.kind : 'svc']; });
    var MH = 8 + Math.ceil(ordered.length / 2) * 88 - 42 + 8;

    var ee = edges.map(function (e) { return [e[0], e[1], e[2] || 'f']; });
    return {
      desktop: { w: W, h: H, nw: NW, nh: NH, nodes: dn, edges: ee },
      mobile: { w: 340, h: Math.max(MH, 110), nw: 146, nh: NH, nodes: mn, edges: ee }
    };
  }

  function resolve(diagram) {
    if (!diagram) return null;
    if (diagram.mode === 'auto') return layout(diagram);
    return diagram.spec || null;
  }

  /* ---------- drawing ---------- */
  function pathFor(a, b) {
    var ox = a.x < b.x + b.w && b.x < a.x + a.w, oy = a.y < b.y + b.h && b.y < a.y + a.h;
    var acx = a.x + a.w / 2, acy = a.y + a.h / 2, bcx = b.x + b.w / 2, bcy = b.y + b.h / 2;
    var dx = bcx - acx, dy = bcy - acy, vertical;
    if (ox && !oy) vertical = true; else if (oy && !ox) vertical = false; else vertical = Math.abs(dy) > Math.abs(dx);
    var g = 4, x1, y1, x2, y2;
    if (vertical) {
      x1 = acx; x2 = bcx;
      if (dy > 0) { y1 = a.y + a.h + g; y2 = b.y - g; } else { y1 = a.y - g; y2 = b.y + b.h + g; }
      var my = (y1 + y2) / 2;
      return 'M' + x1 + ' ' + y1 + 'C' + x1 + ' ' + my + ' ' + x2 + ' ' + my + ' ' + x2 + ' ' + y2;
    }
    y1 = acy; y2 = bcy;
    if (dx > 0) { x1 = a.x + a.w + g; x2 = b.x - g; } else { x1 = a.x - g; x2 = b.x + b.w + g; }
    var mx = (x1 + x2) / 2;
    return 'M' + x1 + ' ' + y1 + 'C' + mx + ' ' + y1 + ' ' + mx + ' ' + y2 + ' ' + x2 + ' ' + y2;
  }
  function rev(d) {
    var n = d.match(/-?\d+\.?\d*/g).map(Number);
    return 'M' + n[6] + ' ' + n[7] + 'C' + n[4] + ' ' + n[5] + ' ' + n[2] + ' ' + n[3] + ' ' + n[0] + ' ' + n[1];
  }
  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  /**
   * render(host, diagram, opts)  opts: { key, mobile: boolean, reduce: boolean }
   */
  function render(host, diagram, opts) {
    opts = opts || {};
    host.innerHTML = '';
    var spec = resolve(diagram);
    if (!spec) { host.hidden = true; return; }
    host.hidden = false;
    var L = opts.mobile ? spec.mobile : spec.desktop;
    if (!L || !L.nodes || !L.nodes.length) { host.hidden = true; return; }
    var key = (opts.key || 'd') + (opts.mobile ? '-m' : '-d');
    var svg = el('svg', { viewBox: '0 0 ' + L.w + ' ' + L.h, role: 'presentation', focusable: 'false' }, host);
    var defs = el('defs', {}, svg), id = 'ah-' + key;
    var mk = el('marker', { id: id, viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '6', markerHeight: '6', orient: 'auto-start-reverse' }, defs);
    el('path', { d: 'M0 1.5 10 5 0 8.5z', 'class': 'arrowhead' }, mk);
    var rect = {};
    L.nodes.forEach(function (n) { rect[n[0]] = { x: n[1], y: n[2], w: L.nw, h: L.nh }; });
    var eg = el('g', {}, svg), ng = el('g', {}, svg), pg = el('g', {}, svg), i = 0;
    (L.edges || []).forEach(function (e) {
      if (!rect[e[0]] || !rect[e[1]]) return;
      var d = pathFor(rect[e[0]], rect[e[1]]);
      var p = el('path', { d: d, 'class': 'edge' + (e[2] === 'c' ? ' c' : ''), 'marker-end': 'url(#' + id + ')' }, eg);
      if (e[2] === 'b') p.setAttribute('marker-start', 'url(#' + id + ')');
      if (opts.reduce || e[2] === 'c') return;
      (e[2] === 'b' ? [d, rev(d)] : [d]).forEach(function (dd, j) {
        var c = el('circle', { r: '2.6', 'class': 'pkt', opacity: '0' }, pg);
        var dur = (2.6 + (i % 3) * 0.5) + 's', begin = (i * 0.45 + j * 1.3) + 's';
        var an = el('animateMotion', { dur: dur, begin: begin, repeatCount: 'indefinite', path: dd }, c);
        an.setAttribute('keyPoints', '0;1'); an.setAttribute('keyTimes', '0;1'); an.setAttribute('calcMode', 'linear');
        el('animate', { attributeName: 'opacity', values: '0;1;1;0', keyTimes: '0;.12;.88;1', dur: dur, begin: begin, repeatCount: 'indefinite' }, c);
      });
      i++;
    });
    L.nodes.forEach(function (n) {
      var g = el('g', { 'class': 'node ' + n[5], transform: 'translate(' + n[1] + ' ' + n[2] + ')' }, ng);
      el('rect', { width: L.nw, height: L.nh, rx: 11 }, g);
      el('circle', { cx: 14, cy: 16, r: 3, 'class': 'dotk' }, g);
      el('text', { x: 24, y: 20, 'class': 'l' }, g).textContent = n[3];
      el('text', { x: 14, y: 36, 'class': 's' }, g).textContent = n[4];
    });
  }

  return { render: render, layout: layout, resolve: resolve, KINDS: KINDS };
});
