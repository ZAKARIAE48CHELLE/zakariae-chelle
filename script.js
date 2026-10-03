(function () {
  'use strict';
  var SITE = window.SITE, I18N = window.I18N || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- project links (rendered only when a URL is set in config.js) ---------- */
  $$('[data-links]').forEach(function (box) {
    var cfg = (SITE.projects || {})[box.dataset.links] || {};
    [['github', 'lnk.github', 'GitHub', 'i-github'], ['demo', 'lnk.demo', 'Demo', 'i-arrow'], ['report', 'lnk.report', 'Report', 'i-arrow']].forEach(function (t) {
      if (!cfg[t[0]]) return;
      var a = document.createElement('a');
      a.href = cfg[t[0]]; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.innerHTML = '<svg class="i"><use href="#' + t[3] + '"/></svg><span data-i18n="' + t[1] + '">' + t[2] + '</span>';
      box.appendChild(a);
    });
  });

  /* ---------- socials / email from config ---------- */
  $$('[data-social="github"]').forEach(function (a) { a.href = SITE.github; });
  $$('[data-social="linkedin"]').forEach(function (a) { a.href = SITE.linkedin; });
  $$('[data-social="mail"], #email-link, #email-cta').forEach(function (a) { a.href = 'mailto:' + SITE.email; });
  $('#email-link').textContent = SITE.email;

  /* ---------- i18n ---------- */
  var I = { en: {} };
  $$('[data-i18n]').forEach(function (el) { I.en[el.dataset.i18n] = el.innerHTML; });
  Object.keys(I18N).forEach(function (l) { I[l] = I18N[l]; });
  var titles = {
    en: 'Zakariae Chelle — Data & AI Engineering Student',
    fr: 'Zakariae Chelle — Étudiant ingénieur Data & IA',
    es: 'Zakariae Chelle — Estudiante de Ingeniería de Datos e IA',
    ar: 'زكرياء الشلي — طالب هندسة البيانات والذكاء الاصطناعي'
  };
  var lang = 'en';
  function setLang(l) {
    if (!I[l]) l = 'en';
    lang = l;
    var dict = I[l];
    $$('[data-i18n]').forEach(function (el) {
      var k = el.dataset.i18n;
      el.innerHTML = dict[k] != null ? dict[k] : I.en[k];
    });
    var d = document.documentElement;
    d.lang = l; d.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.title = titles[l];
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === l ? 'true' : 'false'); });
    var cv = (SITE.cv && (SITE.cv[l] || SITE.cv.en)) || '#';
    $$('[data-cv]').forEach(function (a) { a.href = cv; });
    store.set('zc-lang', l);
    measurePipe();
  }
  $$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.lang); closeMenu(); }); });

  /* ---------- theme ---------- */
  var themeBtn = $('#theme');
  function paintTheme() {
    var t = document.documentElement.dataset.theme;
    themeBtn.innerHTML = '<svg class="i"><use href="#i-' + (t === 'dark' ? 'sun' : 'moon') + '"/></svg>';
    var m = $('meta[name="theme-color"]'); if (m) m.content = t === 'dark' ? '#0a0a0b' : '#f4f2ec';
  }
  themeBtn.addEventListener('click', function () {
    var t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = t; store.set('zc-theme', t); paintTheme();
  });
  paintTheme();

  /* ---------- mobile menu ---------- */
  var menu = $('#menu'), menuBtn = $('#menu-btn');
  function closeMenu() { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.innerHTML = '<svg class="i"><use href="#i-menu"/></svg>'; }
  menuBtn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.innerHTML = '<svg class="i"><use href="#i-' + (open ? 'close' : 'menu') + '"/></svg>';
  });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- nav state, progress, active link ---------- */
  var nav = $('.nav'), prog = $('#progress'), ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      prog.style.setProperty('--p', h > 0 ? Math.min(1, scrollY / h) : 0);
      nav.classList.toggle('scrolled', scrollY > 20);
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var links = $$('.links a[href^="#"]');
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'work', 'skills', 'experience', 'contact'].forEach(function (id) { var s = document.getElementById(id); if (s) secObs.observe(s); });
  }

  /* ---------- reveal + count-up ---------- */
  $$('.rv').forEach(function (el, i) {
    var sib = $$('.rv', el.parentElement).indexOf(el);
    el.style.setProperty('--d', (Math.min(sib, 5) * 0.07) + 's');
  });
  function countUp(el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = end + suf; return; }
    var t0 = performance.now(), dur = 1100;
    (function step(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  if ('IntersectionObserver' in window) {
    var rvObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in'); rvObs.unobserve(e.target);
        $$('[data-count]', e.target).forEach(countUp);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.rv').forEach(function (el) { rvObs.observe(el); });
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- spotlight ---------- */
  $$('.spot').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- clock (Tangier) ---------- */
  var clock = $('#clock');
  function tick() {
    try {
      clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Africa/Casablanca' }).format(new Date());
    } catch (e) { clock.textContent = ''; }
  }
  tick(); setInterval(tick, 20000);

  /* ---------- copy email ---------- */
  var toast = $('#toast'), toastT;
  function say(msg) { toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('show'); }, 2200); }
  $('#copy-email').addEventListener('click', function () {
    var done = function () { say((I[lang]['contact.copied'] || 'Email copied')); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(SITE.email).then(done, done);
    else done();
  });

  $('#year').textContent = new Date().getFullYear();

  /* ---------- marquee clone ---------- */
  var set = $('.set');
  if (set) { var c = set.cloneNode(true); c.setAttribute('aria-hidden', 'true'); set.parentNode.appendChild(c); }

  /* ---------- pipeline sweep width ---------- */
  function measurePipe() {
    var p = $('.pipe'); if (p) p.style.setProperty('--pw', (p.offsetWidth) + 'px');
  }
  addEventListener('resize', measurePipe);

  /* =====================================================================
     Architecture diagrams
     node: [id, x, y, label, sub, kind, (w)]   kinds: ai | data | svc | watch
     edge: [from, to, type]                      types: f flow | c control | b both ways
     ===================================================================== */
  var D = {
    localops: {
      desktop: { w: 560, h: 312, nw: 112, nh: 46,
        nodes: [['logs', 8, 142, 'Incident logs', 'alerts · traces', 'data'], ['slm', 152, 52, 'SLM · QLoRA', 'severity + RCA', 'ai'], ['rag', 152, 232, 'RAG', 'runbooks index', 'ai'], ['api', 296, 142, 'FastAPI', 'serving layer', 'svc'], ['dash', 440, 52, 'Dashboard', 'triage view', 'svc'], ['prom', 440, 232, 'Prometheus', 'metrics · alerts', 'watch']],
        edges: [['logs', 'slm', 'f'], ['logs', 'rag', 'f'], ['rag', 'slm', 'f'], ['slm', 'api', 'f'], ['api', 'dash', 'f'], ['api', 'prom', 'c']] },
      mobile: { w: 340, h: 326, nw: 146, nh: 46,
        nodes: [['logs', 8, 8, 'Incident logs', 'alerts · traces', 'data'], ['rag', 8, 96, 'RAG', 'runbooks index', 'ai'], ['slm', 186, 96, 'SLM · QLoRA', 'severity + RCA', 'ai'], ['api', 186, 184, 'FastAPI', 'serving layer', 'svc'], ['dash', 8, 272, 'Dashboard', 'triage view', 'svc'], ['prom', 186, 272, 'Prometheus', 'metrics · alerts', 'watch']],
        edges: [['logs', 'slm', 'f'], ['logs', 'rag', 'f'], ['rag', 'slm', 'f'], ['slm', 'api', 'f'], ['api', 'dash', 'f'], ['api', 'prom', 'c']] }
    },
    digitaltwin: {
      desktop: { w: 560, h: 312, nw: 112, nh: 46,
        nodes: [['pg', 8, 142, 'PostgreSQL', 'client data', 'data'], ['twin', 152, 142, 'Digital twin', 'client · prospect', 'ai'], ['rfm', 296, 30, 'RFM-ES · AHP', 'scoring', 'ai'], ['clv', 296, 142, 'CLV · Churn', 'conversion', 'ai'], ['seg', 296, 254, 'Segments', 'dynamic personas', 'ai'], ['ab', 440, 254, 'A/B tests', 'simulation', 'ai'], ['out', 440, 142, 'Streamlit', 'dashboards', 'svc'], ['sup', 152, 254, 'LangGraph', 'agents + LLM', 'watch']],
        edges: [['pg', 'twin', 'f'], ['twin', 'rfm', 'f'], ['twin', 'clv', 'f'], ['twin', 'seg', 'f'], ['rfm', 'out', 'f'], ['clv', 'out', 'f'], ['seg', 'ab', 'f'], ['ab', 'out', 'f'], ['sup', 'twin', 'c'], ['sup', 'seg', 'c']] },
      mobile: { w: 340, h: 326, nw: 146, nh: 46,
        nodes: [['pg', 8, 8, 'PostgreSQL', 'client data', 'data'], ['twin', 186, 8, 'Digital twin', 'client · prospect', 'ai'], ['rfm', 8, 96, 'RFM-ES · AHP', 'scoring', 'ai'], ['clv', 186, 96, 'CLV · Churn', 'conversion', 'ai'], ['seg', 8, 184, 'Segments', 'dynamic personas', 'ai'], ['sup', 186, 184, 'LangGraph', 'agents + LLM', 'watch'], ['ab', 8, 272, 'A/B tests', 'simulation', 'ai'], ['out', 186, 272, 'Streamlit', 'dashboards', 'svc']],
        edges: [['pg', 'twin', 'f'], ['twin', 'rfm', 'f'], ['twin', 'clv', 'f'], ['rfm', 'seg', 'f'], ['seg', 'ab', 'f'], ['ab', 'out', 'f'], ['sup', 'clv', 'c'], ['sup', 'seg', 'c'], ['sup', 'out', 'c']] }
    },
    auramarket: {
      desktop: { w: 560, h: 312, nw: 112, nh: 46,
        nodes: [['search', 8, 40, 'Smart search', 'discovery', 'svc'], ['assist', 8, 244, 'Assistant', 'guidance', 'svc'], ['hub', 224, 142, 'Marketplace', 'products · users', 'data'], ['offer', 440, 8, 'Offer agent', 'dynamic offers', 'ai'], ['buyer', 440, 94, 'Buyer agent', 'negotiation', 'ai'], ['seller', 440, 188, 'Seller agent', 'counter-offers', 'ai'], ['sec', 440, 276, 'Security', 'detection', 'watch']],
        edges: [['search', 'hub', 'f'], ['assist', 'hub', 'f'], ['hub', 'offer', 'f'], ['hub', 'buyer', 'f'], ['hub', 'seller', 'f'], ['hub', 'sec', 'c'], ['buyer', 'seller', 'b']] },
      mobile: { w: 340, h: 326, nw: 146, nh: 46,
        nodes: [['search', 8, 8, 'Smart search', 'discovery', 'svc'], ['assist', 186, 8, 'Assistant', 'guidance', 'svc'], ['hub', 97, 96, 'Marketplace', 'products · users', 'data'], ['buyer', 8, 184, 'Buyer agent', 'negotiation', 'ai'], ['offer', 186, 184, 'Offer agent', 'dynamic offers', 'ai'], ['seller', 8, 272, 'Seller agent', 'counter-offers', 'ai'], ['sec', 186, 272, 'Security', 'detection', 'watch']],
        edges: [['search', 'hub', 'f'], ['assist', 'hub', 'f'], ['hub', 'buyer', 'f'], ['hub', 'offer', 'f'], ['buyer', 'seller', 'b'], ['offer', 'sec', 'c']] }
    }
  };

  var NS = 'http://www.w3.org/2000/svg';
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
  function rev(d) { // reverse a 'M a C b c d' path
    var n = d.match(/-?\d+\.?\d*/g).map(Number);
    return 'M' + n[6] + ' ' + n[7] + 'C' + n[4] + ' ' + n[5] + ' ' + n[2] + ' ' + n[3] + ' ' + n[0] + ' ' + n[1];
  }
  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function renderDiagram(host) {
    var key = host.dataset.diagram, spec = D[key];
    if (!spec) return;
    var m = window.matchMedia('(max-width: 640px)').matches, L = m ? spec.mobile : spec.desktop;
    host.innerHTML = '';
    var svg = el('svg', { viewBox: '0 0 ' + L.w + ' ' + L.h, role: 'presentation', focusable: 'false' }, host);
    var defs = el('defs', {}, svg), id = 'ah-' + key;
    var mk = el('marker', { id: id, viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '6', markerHeight: '6', orient: 'auto-start-reverse' }, defs);
    el('path', { d: 'M0 1.5 10 5 0 8.5z', 'class': 'arrowhead' }, mk);
    var rect = {};
    L.nodes.forEach(function (n) { rect[n[0]] = { x: n[1], y: n[2], w: L.nw, h: L.nh }; });
    var eg = el('g', {}, svg), ng = el('g', {}, svg), pg = el('g', {}, svg), i = 0;
    L.edges.forEach(function (e) {
      var d = pathFor(rect[e[0]], rect[e[1]]);
      var p = el('path', { d: d, 'class': 'edge' + (e[2] === 'c' ? ' c' : ''), 'marker-end': 'url(#' + id + ')' }, eg);
      if (e[2] === 'b') p.setAttribute('marker-start', 'url(#' + id + ')');
      if (reduce || e[2] === 'c') return;
      var dirs = e[2] === 'b' ? [d, rev(d)] : [d];
      dirs.forEach(function (dd, j) {
        var c = el('circle', { r: '2.6', 'class': 'pkt' }, pg);
        var an = el('animateMotion', { dur: (2.6 + (i % 3) * 0.5) + 's', begin: (i * 0.45 + j * 1.3) + 's', repeatCount: 'indefinite', path: dd }, c);
        an.setAttribute('keyPoints', '0;1'); an.setAttribute('keyTimes', '0;1'); an.setAttribute('calcMode', 'linear');
        c.setAttribute('opacity', '0');
        el('animate', { attributeName: 'opacity', values: '0;1;1;0', keyTimes: '0;.12;.88;1', dur: an.getAttribute('dur'), begin: an.getAttribute('begin'), repeatCount: 'indefinite' }, c);
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
  var diagrams = $$('[data-diagram]');
  var mq = window.matchMedia('(max-width: 640px)'), lastM = mq.matches;
  diagrams.forEach(renderDiagram);
  function onMQ() { if (mq.matches !== lastM) { lastM = mq.matches; diagrams.forEach(renderDiagram); } }
  if (mq.addEventListener) mq.addEventListener('change', onMQ); else mq.addListener(onMQ);

  /* ---------- hero network canvas ---------- */
  (function () {
    var c = $('#net'); if (!c) return;
    var ctx = c.getContext('2d'), hero = c.parentElement, w = 0, h = 0, dpr = 1, nodes = [], mx = -9999, my = -9999, raf = 0, vis = true, rgb = '200,245,66';
    function color() { rgb = getComputedStyle(document.documentElement).getPropertyValue('--net').trim() || rgb; }
    function size() {
      var r = hero.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.max(26, Math.min(76, w * h / 20000)));
      nodes = []; for (var i = 0; i < n; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28, r: Math.random() * 1.3 + .7 });
      color(); draw(true);
    }
    function draw(still) {
      ctx.clearRect(0, 0, w, h);
      var L = 130, M = 190, i, j, a, b, d, al;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        if (!still) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < -10) a.x = w + 10; else if (a.x > w + 10) a.x = -10;
          if (a.y < -10) a.y = h + 10; else if (a.y > h + 10) a.y = -10;
          var ddx = a.x - mx, ddy = a.y - my, dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd < 150 && dd > 1) { a.x += ddx / dd * .35; a.y += ddy / dd * .35; }
        }
        for (j = i + 1; j < nodes.length; j++) {
          b = nodes[j]; d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < L) { al = (1 - d / L) * .28; ctx.strokeStyle = 'rgba(' + rgb + ',' + al + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        d = Math.hypot(a.x - mx, a.y - my);
        if (d < M) { al = (1 - d / M) * .7; ctx.strokeStyle = 'rgba(' + rgb + ',' + al + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke(); }
        ctx.fillStyle = 'rgba(' + rgb + ',' + (d < M ? .95 : .5) + ')'; ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
      }
    }
    function loop() { if (!vis || document.hidden) { raf = 0; return; } draw(false); raf = requestAnimationFrame(loop); }
    function start() { if (!raf && !reduce) raf = requestAnimationFrame(loop); }
    hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    hero.addEventListener('pointerleave', function () { mx = my = -9999; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) start(); }).observe(hero);
    document.addEventListener('visibilitychange', start);
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 150); });
    new MutationObserver(function () { color(); if (reduce) draw(true); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    size(); start();
  })();

  /* ---------- go ---------- */
  var saved = store.get('zc-lang');
  setLang(saved && I[saved] ? saved : 'en');
})();
