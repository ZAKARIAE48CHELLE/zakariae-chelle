'use strict';
const crypto = require('crypto');
const { LANGS } = require('./builder');

const h = (s) => crypto.createHash('sha1').update(String(s == null ? '' : s)).digest('hex').slice(0, 8);

/**
 * data.i18nSources[lang][key] remembers a hash of the English text a translation was written against.
 * When English changes later, the translation is reported as "outdated" instead of silently going stale.
 */
function trackChanges(oldData, newData, english, oldEnglish) {
  newData.i18nSources = newData.i18nSources || {};
  for (const lang of LANGS) {
    const before = ((oldData || {}).translations || {})[lang] || {};
    const after = (newData.translations || {})[lang] || {};
    const src = (newData.i18nSources[lang] = newData.i18nSources[lang] || {});
    for (const k of Object.keys(after)) {
      if (after[k] !== before[k]) src[k] = h(english[k]);
      if (!after[k]) delete src[k];
      // baseline: a translation with no recorded source was written against the English text as it was before this save
      else if (!src[k] && oldEnglish && oldEnglish[k] != null) src[k] = h(oldEnglish[k]);
    }
    for (const k of Object.keys(src)) if (!(k in after)) delete src[k];
  }
}

function status(data, english) {
  const out = { langs: {}, orphans: [] };
  const tr = data.translations || {}, srcs = data.i18nSources || {};
  const keys = Object.keys(english);
  for (const lang of LANGS) {
    const t = tr[lang] || {}, s = srcs[lang] || {};
    const per = {}; let missing = 0, outdated = 0;
    for (const k of keys) {
      if (!t[k]) { per[k] = 'missing'; missing++; }
      else if (s[k] && s[k] !== h(english[k])) { per[k] = 'outdated'; outdated++; }
      else per[k] = 'ok';
    }
    out.langs[lang] = { missing, outdated, ok: keys.length - missing - outdated, keys: per };
    for (const k of Object.keys(t)) if (!(k in english) && !out.orphans.includes(k)) out.orphans.push(k);
  }
  out.total = keys.length;
  return out;
}

function markReviewed(data, english, lang, keys) {
  data.i18nSources = data.i18nSources || {};
  const src = (data.i18nSources[lang] = data.i18nSources[lang] || {});
  keys.forEach((k) => { if (english[k] != null) src[k] = h(english[k]); });
}

function prune(data, english) {
  let removed = 0;
  for (const lang of LANGS) {
    const t = (data.translations || {})[lang] || {};
    for (const k of Object.keys(t)) if (!(k in english)) { delete t[k]; removed++; }
  }
  return removed;
}

module.exports = { trackChanges, status, markReviewed, prune };
