const fs = require('fs');
const path = require('path');

function replaceBlock(content, startMarker, endMarker, newBlock) {
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1) {
    console.warn(`Marker pair not found: ${startMarker} ... ${endMarker}`);
    return content;
  }
  return content.slice(0, startIdx + startMarker.length) + '\n' + newBlock + '\n    ' + content.slice(endIdx);
}

function buildPortfolio(rootDir) {
  rootDir = rootDir || path.resolve(__dirname, '..');
  const dataPath = path.join(rootDir, 'data', 'portfolio-data.json');
  if (!fs.existsSync(dataPath)) {
    throw new Error('Data file not found at: ' + dataPath);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const profile = data.profile || {};
  const featured = data.featuredProjects || [];
  const more = data.moreProjects || [];
  const skills = data.skills || [];
  const marquee = data.marquee || [];
  const experience = data.experience || [];
  const education = data.education || [];
  const translations = data.translations || {};

  // 1. Generate config.js
  const configObj = {
    name: profile.name || 'Zakariae Chelle',
    email: profile.email || 'zakariaechelle2001@gmail.com',
    academicEmail: profile.academicEmail || 'Zakariae.Chelle@emsi-edu.ma',
    github: profile.github || 'https://github.com/ZAKARIAE48CHELLE',
    linkedin: profile.linkedin || 'https://www.linkedin.com/in/zakariae-chelle',
    cv: profile.cv || {
      en: 'resources/CV/CHELLE_ZAKARIAE_ENG.pdf',
      fr: 'resources/CV/CHELLE_ZAKARIAE_FR.pdf'
    },
    projects: {}
  };

  featured.forEach(p => {
    configObj.projects[p.id] = p.links || { github: '', demo: '', report: '' };
  });
  more.forEach(p => {
    configObj.projects[p.id] = p.links || { github: '', demo: '', report: '' };
  });

  const configJs = `/*
  Central place for everything you may want to edit.
  Project links: paste a URL and the button appears automatically. Leave '' and nothing is shown.
*/
window.SITE = ${JSON.stringify(configObj, null, 2)};
`;
  fs.writeFileSync(path.join(rootDir, 'config.js'), configJs, 'utf8');

  // 2. Generate i18n.js
  const i18nJs = `/* English lives in index.html. This file holds the other languages, keyed by data-i18n. */
window.I18N = ${JSON.stringify(translations, null, 2)};
`;
  fs.writeFileSync(path.join(rootDir, 'i18n.js'), i18nJs, 'utf8');

  // 3. Update index.html
  const indexPath = path.join(rootDir, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  // Render Pipeline
  if (profile.pipeline && profile.pipeline.length) {
    const pipelineHtml = `    <div class="pipeline rv">
      <p class="pipe-label mono" data-i18n="hero.pipe">A typical system I build</p>
      <ol class="pipe">
${profile.pipeline.map(p => `        <li><b data-i18n="${p.key}">${p.title}</b><small>${p.sub}</small></li>`).join('\n')}
      </ol>
    </div>`;
    html = replaceBlock(html, '<!-- DYNAMIC:PIPELINE:START -->', '<!-- DYNAMIC:PIPELINE:END -->', pipelineHtml);
  }

  // Render Marquee
  if (marquee.length) {
    const marqueeHtml = `<div class="marquee" aria-hidden="true">
  <div class="track"><ul class="set">
    ${marquee.map(m => `<li>${m}</li>`).join('')}
  </ul></div>
</div>`;
    html = replaceBlock(html, '<!-- DYNAMIC:MARQUEE:START -->', '<!-- DYNAMIC:MARQUEE:END -->', marqueeHtml);
  }

  // Render Facts
  if (profile.facts && profile.facts.length) {
    const factsHtml = `    <dl class="facts rv">
${profile.facts.map(f => `      <div><dt data-i18n="${f.labelKey}">${f.label}</dt><dd data-i18n="${f.valueKey}">${f.value}</dd></div>`).join('\n')}
    </dl>`;
    html = replaceBlock(html, '<!-- DYNAMIC:FACTS:START -->', '<!-- DYNAMIC:FACTS:END -->', factsHtml);
  }

  // Render Stats
  if (profile.stats && profile.stats.length) {
    const statsHtml = `  <div class="stats rv">
${profile.stats.map(s => `    <div><strong data-count="${s.count}"${s.suffix ? ` data-suffix="${s.suffix}"` : ''}>${s.count}${s.suffix || ''}</strong><span data-i18n="${s.labelKey}">${s.label}</span></div>`).join('\n')}
  </div>`;
    html = replaceBlock(html, '<!-- DYNAMIC:STATS:START -->', '<!-- DYNAMIC:STATS:END -->', statsHtml);
  }

  // Render Featured Projects
  if (featured.length) {
    const featuredHtml = featured.map((p, idx) => {
      const isFlip = idx % 2 === 1;
      const num = p.number || String(idx + 1).padStart(2, '0');
      const catKey = p.categoryKey || `p${idx + 1}.cat`;
      const statusKey = p.statusBadgeKey || `p${idx + 1}.status`;
      const subKey = p.subtitleKey || `p${idx + 1}.sub`;
      const descKey = p.descKey || `p${idx + 1}.desc`;
      const probKey = p.problemKey || `p${idx + 1}.problem`;
      const coreKey = p.coreKey || `p${idx + 1}.core`;
      const sysKey = p.systemKey || `p${idx + 1}.system`;
      const valKey = p.valueKey || `p${idx + 1}.value`;

      return `  <!-- ${num} ${p.title} -->
  <article class="project spot rv${isFlip ? ' flip' : ''}" id="${p.id}">
    <div class="p-copy">
      <div class="p-meta"><span class="num mono">${num}</span><span class="chip" data-i18n="${catKey}">${p.category}</span>${p.statusBadge ? `<span class="chip chip-solid" data-i18n="${statusKey}">${p.statusBadge}</span>` : ''}</div>
      <h3>${p.title}</h3>
      <p class="p-sub" data-i18n="${subKey}">${p.subtitle}</p>
      <p class="p-desc" data-i18n="${descKey}">${p.description}</p>
      <dl class="rows">
        <div><dt data-i18n="lbl.problem">Problem</dt><dd data-i18n="${probKey}">${p.problem}</dd></div>
        <div><dt data-i18n="lbl.core">AI core</dt><dd data-i18n="${coreKey}">${p.core}</dd></div>
        <div><dt data-i18n="lbl.system">System</dt><dd data-i18n="${sysKey}">${p.system}</dd></div>
        <div><dt data-i18n="lbl.value">Value</dt><dd data-i18n="${valKey}">${p.value}</dd></div>
      </dl>
      <ul class="tags">${(p.tags || []).map(t => `<li>${t}</li>`).join('')}</ul>
      <div class="p-links" data-links="${p.id}"></div>
    </div>
    <figure class="p-fig">
      <div class="diagram" data-diagram="${p.diagramKey || p.id}" aria-hidden="true"></div>
      <figcaption><ul class="legend"><li class="k-ai" data-i18n="leg.ai">AI core</li><li class="k-data" data-i18n="leg.data">Data</li><li class="k-svc" data-i18n="leg.svc">Service</li><li class="k-watch" data-i18n="leg.watch">Monitoring</li></ul><span data-i18n="diag.note">Simplified architecture, for illustration.</span></figcaption>
    </figure>
  </article>`;
    }).join('\n\n');
    html = replaceBlock(html, '<!-- DYNAMIC:FEATURED_PROJECTS:START -->', '<!-- DYNAMIC:FEATURED_PROJECTS:END -->', featuredHtml);
  }

  // Render More Projects
  if (more.length) {
    const moreHtml = `  <div class="more">
${more.map((p, idx) => {
  const pNum = idx + 4;
  const catKey = p.categoryKey || `p${pNum}.cat`;
  const titleKey = p.titleKey || `p${pNum}.title`;
  const descKey = p.descKey || `p${pNum}.desc`;
  const noteKey = p.noteKey || `p${pNum}.note`;

  return `    <article class="card spot rv">
      <div class="card-top"><span class="ico"><svg class="i"><use href="#${p.icon || 'i-eye'}"/></svg></span><span class="chip" data-i18n="${catKey}">${p.category}</span></div>
      <h4 data-i18n="${titleKey}">${p.title}</h4>
      <p data-i18n="${descKey}">${p.description}</p>
      ${p.note ? `<p class="note" data-i18n="${noteKey}">${p.note}</p>` : ''}
      <ul class="tags">${(p.tags || []).map(t => `<li>${t}</li>`).join('')}</ul>
      <div class="p-links" data-links="${p.id}"></div>
    </article>`;
}).join('\n')}
  </div>`;
    html = replaceBlock(html, '<!-- DYNAMIC:MORE_PROJECTS:START -->', '<!-- DYNAMIC:MORE_PROJECTS:END -->', moreHtml);
  }

  // Render Skills
  if (skills.length) {
    const skillsHtml = `  <div class="skills">
${skills.map((s, idx) => `    <article class="card spot rv"><span class="ico"><svg class="i"><use href="#${s.icon || 'i-cpu'}"/></svg></span><h4 data-i18n="${s.titleKey || `sk.${idx + 1}`}">${s.title}</h4><ul class="tags">${(s.tags || []).map(t => `<li>${t}</li>`).join('')}</ul></article>`).join('\n')}
  </div>`;
    html = replaceBlock(html, '<!-- DYNAMIC:SKILLS:START -->', '<!-- DYNAMIC:SKILLS:END -->', skillsHtml);
  }

  // Render Timeline (Experience)
  if (experience.length) {
    const timelineHtml = `  <ol class="timeline">
${experience.map((e, idx) => {
  const eKey = e.id || `e${idx + 1}`;
  const dateKey = e.dateKey || `${eKey}.date`;
  const roleKey = e.roleKey || `${eKey}.role`;
  const locKey = e.locationKey || 'hero.loc';

  return `    <li class="rv">
      <time class="mono" data-i18n="${dateKey}">${e.date}</time>
      <div>
        <h3 data-i18n="${roleKey}">${e.role}</h3>
        <p class="org">${e.company} · <span data-i18n="${locKey}">${e.location}</span></p>
        <ul class="bul">
${(e.bullets || []).map((b, bIdx) => `          <li data-i18n="${b.key || `${eKey}.b${bIdx + 1}`}">${b.text}</li>`).join('\n')}
        </ul>
        ${e.tags && e.tags.length ? `<ul class="tags">${e.tags.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
      </div>
    </li>`;
}).join('\n')}
  </ol>`;
    html = replaceBlock(html, '<!-- DYNAMIC:TIMELINE:START -->', '<!-- DYNAMIC:TIMELINE:END -->', timelineHtml);
  }

  // Render Education
  if (education.length) {
    const educationHtml = `  <div class="edu">
${education.map((ed, idx) => {
  const eduKey = ed.id || `edu${idx + 1}`;
  const dateKey = ed.dateKey || `${eduKey}.d`;
  const degreeKey = ed.degreeKey || `${eduKey}.t`;
  const schoolKey = ed.schoolKey || `${eduKey}.inst`;

  return `    <article class="card spot rv"><time class="mono" data-i18n="${dateKey}">${ed.date}</time><h4 data-i18n="${degreeKey}">${ed.degree}</h4><p data-i18n="${schoolKey}">${ed.school}</p></article>`;
}).join('\n')}
  </div>`;
    html = replaceBlock(html, '<!-- DYNAMIC:EDUCATION:START -->', '<!-- DYNAMIC:EDUCATION:END -->', educationHtml);
  }

  // Update profile text in Hero and About if present
  if (profile.title) {
    html = html.replace(/(<p class="role mono rv" data-i18n="hero.role">)[^<]*(<\/p>)/, `$1${profile.title}$2`);
  }
  if (profile.lead) {
    html = html.replace(/(<p class="lead" data-i18n="hero.lead">)[^<]*(<\/p>)/, `$1${profile.lead}$2`);
  }
  if (profile.aboutP1) {
    html = html.replace(/(<p class="big" data-i18n="about.p1">)[^<]*(<\/p>)/, `$1${profile.aboutP1}$2`);
  }
  if (profile.aboutP2) {
    html = html.replace(/(<p data-i18n="about.p2">)[^<]*(<\/p>)/, `$1${profile.aboutP2}$2`);
  }

  fs.writeFileSync(indexPath, html, 'utf8');

  return {
    success: true,
    updatedFiles: ['data/portfolio-data.json', 'config.js', 'i18n.js', 'index.html']
  };
}

module.exports = { buildPortfolio };

if (require.main === module) {
  try {
    const res = buildPortfolio(path.resolve(__dirname, '..'));
    console.log('Build successful:', res);
  } catch (err) {
    console.error('Build error:', err);
    process.exit(1);
  }
}
