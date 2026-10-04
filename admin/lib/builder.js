'use strict';
/*
  Compiles data/portfolio-data.json into the public site:
    site/index.html   (from tools/admin/template/index.template.html)
    site/config.js    site/i18n.js    site/diagrams.js
  Every build regenerates these files from scratch, so they are always consistent with the data.
*/
const fs = require('fs');
const path = require('path');
const ZCDiagram = require('../../front/diagram.js');

const LANGS = ['fr', 'es', 'ar'];
const EXTRA_UI_STRINGS = { 'lnk.github': 'GitHub', 'lnk.demo': 'Demo', 'lnk.report': 'Report', 'contact.copied': 'Email copied' };

const paths = (root) => ({
  data: path.join(root, 'data', 'portfolio-data.json'),
  template: path.join(root, 'admin', 'template', 'index.template.html'),
  front: path.join(root, 'front')
});

/* ---------- helpers ---------- */
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
// headline may contain <em>…</em> for the accent word; everything else is escaped
const escEm = (s) => esc(s).replace(/&lt;em&gt;/g, '<em>').replace(/&lt;\/em&gt;/g, '</em>');
const unesc = (s) => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&amp;/g, '&');
const visible = (list) => (list || []).filter((x) => x && !x.hidden);
const pad = (n) => String(n).padStart(2, '0');
const digits = (v) => String(parseInt(v, 10) || 0);
const httpUrl = (u) => (/^https?:\/\//i.test(u || '') ? u : '');
const hasDiagram = (d) => {
  const spec = ZCDiagram.resolve(d);
  return !!(spec && spec.desktop && spec.desktop.nodes && spec.desktop.nodes.length);
};

function splitName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { first: parts[0] || '', last: '', initials: (parts[0] || '?').slice(0, 2).toUpperCase() };
  const last = parts[parts.length - 1], first = parts.slice(0, -1).join(' ');
  return { first, last, initials: (parts[0][0] + last[0]).toUpperCase() };
}

function listIcons(root) {
  try {
    const t = fs.readFileSync(paths(root).template, 'utf8');
    return [...t.matchAll(/<symbol id="(i-[a-z0-9-]+)"/g)].map((m) => m[1])
      .filter((i) => !['i-arrow', 'i-down', 'i-download', 'i-mail', 'i-sun', 'i-moon', 'i-copy', 'i-check', 'i-menu', 'i-close', 'i-github', 'i-linkedin'].includes(i));
  } catch (e) { return []; }
}

/* ---------- rendering ---------- */
function render(data, root) {
  const profile = data.profile || {};
  const english = {};           // i18n key -> English text (content-driven keys)
  const T = (key, text, html) => { english[key] = html ? String(text == null ? '' : text) : String(text == null ? '' : text); return `data-i18n="${key}"`; };

  const featured = visible(data.featuredProjects);
  const more = visible(data.moreProjects);
  const skills = visible(data.skills);
  const experience = visible(data.experience);
  const education = visible(data.education);
  const nm = splitName(profile.name);

  const pipeline = (profile.pipeline || []).length
    ? `    <div class="pipeline rv">
      <p class="pipe-label mono" data-i18n="hero.pipe">A typical system I build</p>
      <ol class="pipe">
${profile.pipeline.map((p) => `        <li><b ${T('pipe.' + p.id, p.title)}>${esc(p.title)}</b><small>${esc(p.sub)}</small></li>`).join('\n')}
      </ol>
    </div>` : '';

  const marquee = (data.marquee || []).length
    ? `<div class="marquee" aria-hidden="true">
  <div class="track"><ul class="set">
    ${data.marquee.map((m) => `<li>${esc(m)}</li>`).join('')}
  </ul></div>
</div>` : '';

  const facts = (profile.facts || []).length
    ? `    <dl class="facts rv">
${profile.facts.map((f) => `      <div><dt ${T('fact.' + f.id + '.l', f.label)}>${esc(f.label)}</dt><dd ${T('fact.' + f.id + '.v', f.value)}>${esc(f.value)}</dd></div>`).join('\n')}
    </dl>` : '';

  const autoCount = { projects: featured.length + more.length, roles: experience.length };
  const stats = (profile.stats || []).length
    ? `  <div class="stats rv">
${profile.stats.map((s) => {
    const n = s.auto && autoCount[s.auto] != null ? autoCount[s.auto] : digits(s.count);
    return `    <div><strong data-count="${n}"${s.suffix ? ` data-suffix="${esc(s.suffix)}"` : ''}>${n}${esc(s.suffix || '')}</strong><span ${T('stat.' + s.id, s.label)}>${esc(s.label)}</span></div>`;
  }).join('\n')}
  </div>` : '';

  const feat = featured.map((p, idx) => {
    const k = (f) => `proj.${p.id}.${f}`;
    const fig = hasDiagram(p.diagram) ? `
    <figure class="p-fig">
      <div class="diagram" data-diagram="${esc(p.id)}" aria-hidden="true"></div>
      <figcaption><ul class="legend"><li class="k-ai" data-i18n="leg.ai">AI core</li><li class="k-data" data-i18n="leg.data">Data</li><li class="k-svc" data-i18n="leg.svc">Service</li><li class="k-watch" data-i18n="leg.watch">Monitoring</li></ul><span data-i18n="diag.note">Simplified architecture, for illustration.</span></figcaption>
    </figure>` : '';
    return `  <!-- ${pad(idx + 1)} ${esc(p.title)} -->
  <article class="project spot rv${idx % 2 ? ' flip' : ''}${fig ? '' : ' solo'}" id="${esc(p.id)}">
    <div class="p-copy">
      <div class="p-meta"><span class="num mono">${pad(idx + 1)}</span><span class="chip" ${T(k('cat'), p.category)}>${esc(p.category)}</span>${p.statusBadge ? `<span class="chip chip-solid" ${T(k('status'), p.statusBadge)}>${esc(p.statusBadge)}</span>` : ''}</div>
      <h3>${esc(p.title)}</h3>
      <p class="p-sub" ${T(k('sub'), p.subtitle)}>${esc(p.subtitle)}</p>
      <p class="p-desc" ${T(k('desc'), p.description)}>${esc(p.description)}</p>
      <dl class="rows">
        <div><dt data-i18n="lbl.problem">Problem</dt><dd ${T(k('problem'), p.problem)}>${esc(p.problem)}</dd></div>
        <div><dt data-i18n="lbl.core">AI core</dt><dd ${T(k('core'), p.core)}>${esc(p.core)}</dd></div>
        <div><dt data-i18n="lbl.system">System</dt><dd ${T(k('system'), p.system)}>${esc(p.system)}</dd></div>
        <div><dt data-i18n="lbl.value">Value</dt><dd ${T(k('value'), p.value)}>${esc(p.value)}</dd></div>
      </dl>
      <ul class="tags">${(p.tags || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="p-links" data-links="${esc(p.id)}"></div>
    </div>${fig}
  </article>`;
  }).join('\n\n');

  const moreHtml = more.length
    ? `  <h3 class="sub-head rv"><span data-i18n="more.title">More <em>work</em></span></h3>
  <div class="more">
${more.map((p) => {
    const k = (f) => `proj.${p.id}.${f}`;
    return `    <article class="card spot rv" id="${esc(p.id)}">
      <div class="card-top"><span class="ico"><svg class="i"><use href="#${esc(p.icon || 'i-eye')}"/></svg></span><span class="chip" ${T(k('cat'), p.category)}>${esc(p.category)}</span></div>
      <h4 ${T(k('title'), p.title)}>${esc(p.title)}</h4>
      <p ${T(k('desc'), p.description)}>${esc(p.description)}</p>${p.note ? `
      <p class="note" ${T(k('note'), p.note)}>${esc(p.note)}</p>` : ''}
      <ul class="tags">${(p.tags || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="p-links" data-links="${esc(p.id)}"></div>
    </article>`;
  }).join('\n')}
  </div>` : '';

  const skillsHtml = skills.length
    ? `  <div class="skills">
${skills.map((s) => `    <article class="card spot rv"><span class="ico"><svg class="i"><use href="#${esc(s.icon || 'i-cpu')}"/></svg></span><h4 ${T('skill.' + s.id, s.title)}>${esc(s.title)}</h4><ul class="tags">${(s.tags || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul></article>`).join('\n')}
  </div>` : '';

  const timeline = experience.length
    ? `  <ol class="timeline">
${experience.map((e) => {
    const k = (f) => `exp.${e.id}.${f}`;
    return `    <li class="rv">
      <time class="mono" ${T(k('date'), e.date)}>${esc(e.date)}</time>
      <div>
        <h3 ${T(k('role'), e.role)}>${esc(e.role)}</h3>
        <p class="org">${esc(e.company)} · <span ${T(k('loc'), e.location)}>${esc(e.location)}</span></p>
        <ul class="bul">
${(e.bullets || []).map((b, i) => `          <li ${T(k('b' + (i + 1)), b.text)}>${esc(b.text)}</li>`).join('\n')}
        </ul>${e.tags && e.tags.length ? `
        <ul class="tags">${e.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      </div>
    </li>`;
  }).join('\n')}
  </ol>` : '';

  const edu = education.length
    ? `  <div class="edu">
${education.map((e) => `    <article class="card spot rv"><time class="mono" ${T(`edu.${e.id}.date`, e.date)}>${esc(e.date)}</time><h4 ${T(`edu.${e.id}.degree`, e.degree)}>${esc(e.degree)}</h4><p ${T(`edu.${e.id}.school`, e.school)}>${esc(e.school)}</p></article>`).join('\n')}
  </div>` : '';

  const siteUrl = (httpUrl(profile.siteUrl) || '').replace(/\/?$/, '/');
  const metaTitle = profile.metaTitle || `${profile.name || ''} — ${profile.title || ''}`;
  english['meta.title'] = metaTitle;
  const desc = profile.seoDescription || profile.lead || '';
  const headMeta = [
    `<title data-i18n="meta.title">${esc(metaTitle)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    profile.keywords ? `<meta name="keywords" content="${esc(profile.keywords)}">` : '',
    `<meta name="author" content="${esc(profile.name)}">`,
    siteUrl ? `<link rel="canonical" href="${esc(siteUrl)}">` : '',
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${esc(metaTitle)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    siteUrl ? `<meta property="og:url" content="${esc(siteUrl)}">` : '',
    siteUrl ? `<meta property="og:image" content="${esc(siteUrl)}assets/og-image.png">` : '',
    `<meta name="twitter:card" content="summary_large_image">`
  ].filter(Boolean).join('\n');

  const jsonld = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Person', name: profile.name, jobTitle: profile.title,
    url: siteUrl || undefined, address: { '@type': 'PostalAddress', addressLocality: String(profile.location || '').split(',')[0].trim() },
    sameAs: [httpUrl(profile.github), httpUrl(profile.linkedin)].filter(Boolean)
  }).replace(/</g, '\\u003c');

  const cv = (profile.cv && profile.cv.en) || '#';
  const subs = {
    HEAD_META: headMeta, JSONLD: jsonld, NAME: esc(profile.name), INITIALS: esc(nm.initials), FIRST: esc(nm.first), LAST: esc(nm.last),
    STATUS: esc(profile.status), LOCATION: esc(profile.location), TITLE: esc(profile.title), LEAD: esc(profile.lead),
    HEADLINE: escEm(profile.headline), ABOUT_P1: esc(profile.aboutP1), ABOUT_P2: esc(profile.aboutP2),
    GITHUB: esc(httpUrl(profile.github) || '#'), LINKEDIN: esc(httpUrl(profile.linkedin) || '#'), EMAIL: esc(profile.email), ACADEMIC_EMAIL: esc(profile.academicEmail),
    CV_EN: esc(cv), YEAR: String(new Date().getFullYear()),
    PIPELINE: pipeline, MARQUEE: marquee, FACTS: facts, STATS: stats, FEATURED: feat, MORE: moreHtml, SKILLS: skillsHtml, TIMELINE: timeline, EDUCATION: edu
  };
  // keys that hold plain text but are bound to profile fields
  english['hero.status'] = profile.status || ''; english['hero.loc'] = profile.location || ''; english['hero.role'] = profile.title || '';
  english['hero.lead'] = profile.lead || ''; english['about.title'] = profile.headline || ''; english['about.p1'] = profile.aboutP1 || ''; english['about.p2'] = profile.aboutP2 || '';

  let html = fs.readFileSync(paths(root).template, 'utf8');
  html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in subs ? subs[k] : m));

  // English text of the fixed interface strings that live in the template itself
  const statics = {};
  for (const m of html.matchAll(/<(\w+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g)) {
    if (!(m[2] in english)) statics[m[2]] = unesc(m[3]);
  }
  const allEnglish = Object.assign({}, EXTRA_UI_STRINGS, statics, Object.fromEntries(Object.entries(english).map(([k, v]) => [k, v])));
  return { html, english: allEnglish, featured, more };
}

/* ---------- public API ---------- */
function englishMap(data, root) { return render(data, root).english; }

function buildPortfolio(root, dataIn) {
  const P = paths(root);
  const data = dataIn || JSON.parse(fs.readFileSync(P.data, 'utf8'));
  const profile = data.profile || {};
  const out = render(data, root);

  const configObj = {
    name: profile.name, email: profile.email, academicEmail: profile.academicEmail,
    github: profile.github, linkedin: profile.linkedin, cv: profile.cv || {}, projects: {}
  };
  [...out.featured, ...out.more].forEach((p) => {
    const l = p.links || {};
    configObj.projects[p.id] = { github: httpUrl(l.github), demo: httpUrl(l.demo), report: httpUrl(l.report) };
  });

  const translations = {};
  for (const lang of LANGS) {
    translations[lang] = {};
    const src = (data.translations || {})[lang] || {};
    for (const key of Object.keys(out.english)) if (src[key] != null && src[key] !== '') translations[lang][key] = src[key];
    if (src['meta.title']) translations[lang]['meta.title'] = src['meta.title'];
  }
  const diagrams = {};
  out.featured.forEach((p) => { if (hasDiagram(p.diagram)) diagrams[p.id] = p.diagram; });

  const banner = '/* GENERATED by the back office — edit data/portfolio-data.json (or use the back office), not this file. */\n';
  const files = {
    'index.html': out.html,
    'config.js': `${banner}window.SITE = ${JSON.stringify(configObj, null, 2)};\n`,
    'i18n.js': `${banner}window.I18N = ${JSON.stringify(translations, null, 2)};\n`,
    'diagrams.js': `${banner}window.DIAGRAMS = ${JSON.stringify(diagrams)};\n`
  };
  const updated = [];
  for (const [name, content] of Object.entries(files)) {
    const target = path.join(P.front, name);
    const prev = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
    if (prev !== content) { fs.writeFileSync(target, content, 'utf8'); updated.push('front/' + name); }
  }
  return { success: true, updatedFiles: updated, english: out.english };
}

module.exports = { buildPortfolio, englishMap, listIcons, LANGS, esc, splitName };

if (require.main === module) {
  try {
    const r = buildPortfolio(path.resolve(__dirname, '..', '..'));
    console.log('Build OK.', r.updatedFiles.length ? 'Updated: ' + r.updatedFiles.join(', ') : 'No changes.');
  } catch (e) { console.error('Build failed:', e.message); process.exit(1); }
}
