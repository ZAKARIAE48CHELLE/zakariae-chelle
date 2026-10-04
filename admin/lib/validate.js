'use strict';
const fs = require('fs');
const path = require('path');
const ZCDiagram = require('../../front/diagram.js');

const ID_RE = /^[a-z0-9][a-z0-9-]{0,40}$/;
const URL_RE = /^https?:\/\/[^\s]+$/i;
const MAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const slug = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

/** Returns { errors: [{path,msg}], warnings: [{path,msg}] }. Errors block saving. */
function validate(data, root) {
  const errors = [], warnings = [];
  const err = (p, msg) => errors.push({ path: p, msg });
  const warn = (p, msg) => warnings.push({ path: p, msg });
  if (!data || typeof data !== 'object') return { errors: [{ path: '', msg: 'Data must be an object' }], warnings };

  const p = data.profile || {};
  if (!String(p.name || '').trim()) err('profile.name', 'Name is required');
  if (!String(p.title || '').trim()) err('profile.title', 'Title is required');
  if (p.email && !MAIL_RE.test(p.email)) err('profile.email', 'Email is not valid');
  if (p.academicEmail && !MAIL_RE.test(p.academicEmail)) err('profile.academicEmail', 'Academic email is not valid');
  ['github', 'linkedin', 'siteUrl'].forEach((k) => { if (p[k] && !URL_RE.test(p[k])) err('profile.' + k, 'Must be a full http(s) URL'); });
  if (!p.email) warn('profile.email', 'No email set: the contact section will be empty');
  if (p.seoDescription && p.seoDescription.length > 160) warn('profile.seoDescription', 'Over 160 characters: search engines will cut it');

  const ids = new Map();
  const claim = (id, where) => {
    if (!ID_RE.test(String(id || ''))) return err(where, `Invalid id "${id}" (use lowercase letters, digits and dashes)`);
    const key = where.split('[')[0] + ':' + id;
    if (ids.has(key)) err(where, `Duplicate id "${id}"`); else ids.set(key, true);
  };
  const urls = (obj, where) => ['github', 'demo', 'report'].forEach((k) => { if (obj && obj[k] && !URL_RE.test(obj[k])) err(`${where}.links.${k}`, 'Must be a full http(s) URL'); });

  // featured and more projects share the id namespace (both become keys + config entries)
  const projIds = new Set();
  const projClaim = (id, where) => { if (projIds.has(id)) err(where, `Duplicate project id "${id}"`); projIds.add(id); if (!ID_RE.test(String(id || ''))) err(where, `Invalid id "${id}"`); };
  (data.featuredProjects || []).forEach((x, i) => {
    const w = `featuredProjects[${i}]`;
    projClaim(x.id, w);
    if (!String(x.title || '').trim()) err(w + '.title', 'Title is required');
    if (!String(x.category || '').trim()) err(w + '.category', 'Category is required');
    if (!String(x.description || '').trim()) warn(w + '.description', 'No description');
    urls(x.links, w);
    const dg = x.diagram;
    if (dg) {
      if (dg.mode === 'auto') {
        const nodes = dg.nodes || [], seen = new Set();
        nodes.forEach((n, j) => {
          if (!ID_RE.test(String(n.id || ''))) err(`${w}.diagram.nodes[${j}]`, `Invalid node id "${n.id}"`);
          if (seen.has(n.id)) err(`${w}.diagram.nodes[${j}]`, `Duplicate node id "${n.id}"`); seen.add(n.id);
          if (n.kind && !ZCDiagram.KINDS.includes(n.kind)) err(`${w}.diagram.nodes[${j}]`, `Unknown kind "${n.kind}"`);
          if (!String(n.label || '').trim()) err(`${w}.diagram.nodes[${j}]`, 'Node needs a label');
        });
        (dg.edges || []).forEach((e, j) => { if (!seen.has(e[0]) || !seen.has(e[1])) err(`${w}.diagram.edges[${j}]`, `Edge ${e[0]} → ${e[1]} points to a missing node`); });
        if (nodes.length > 12) warn(w + '.diagram', 'More than 12 nodes makes the diagram hard to read');
      } else if (dg.mode === 'spec') {
        if (!dg.spec || !dg.spec.desktop || !dg.spec.mobile) err(w + '.diagram', 'Custom layout needs desktop and mobile');
      } else err(w + '.diagram.mode', 'Unknown diagram mode');
    } else warn(w + '.diagram', 'No diagram: this project will be shown without one');
  });
  (data.moreProjects || []).forEach((x, i) => {
    const w = `moreProjects[${i}]`;
    projClaim(x.id, w);
    if (!String(x.title || '').trim()) err(w + '.title', 'Title is required');
    urls(x.links, w);
  });
  (data.skills || []).forEach((x, i) => { claim(x.id, `skills[${i}]`); if (!String(x.title || '').trim()) err(`skills[${i}].title`, 'Title is required'); });
  (data.experience || []).forEach((x, i) => { claim(x.id, `experience[${i}]`); if (!String(x.role || '').trim()) err(`experience[${i}].role`, 'Role is required'); if (!String(x.company || '').trim()) warn(`experience[${i}].company`, 'No company'); });
  (data.education || []).forEach((x, i) => { claim(x.id, `education[${i}]`); if (!String(x.degree || '').trim()) err(`education[${i}].degree`, 'Degree is required'); });
  (p.facts || []).forEach((x, i) => claim(x.id, `profile.facts[${i}]`));
  (p.stats || []).forEach((x, i) => { claim(x.id, `profile.stats[${i}]`); if (!x.auto && !/^\d+$/.test(String(x.count))) err(`profile.stats[${i}].count`, 'Count must be a whole number'); });
  (p.pipeline || []).forEach((x, i) => claim(x.id, `profile.pipeline[${i}]`));

  if (root && p.cv) {
    for (const [lang, rel] of Object.entries(p.cv)) {
      if (rel && !fs.existsSync(path.join(root, 'front', rel))) warn(`profile.cv.${lang}`, `File not found: ${rel}`);
    }
  }
  return { errors, warnings };
}

module.exports = { validate, slug, ID_RE };
