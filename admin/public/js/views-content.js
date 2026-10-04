/* Content views: profile, featured projects, more projects, skills, experience & education. */
(function () {
  'use strict';
  var ZC = window.ZC, h = ZC.h;
  var V = (ZC.views = ZC.views || {});
  var D = function () { return ZC.state.data; };
  var g2 = function () { return h('div', { class: 'grid g2' }, Array.prototype.slice.call(arguments)); };
  var stack = function () { return h('div', { class: 'stack' }, Array.prototype.slice.call(arguments)); };

  function links(obj) {
    obj.links = obj.links || { github: '', demo: '', report: '' };
    var i = ZC.state.data.featuredProjects.indexOf(obj), base = i > -1 ? 'featuredProjects[' + i + ']' : 'moreProjects[' + ZC.state.data.moreProjects.indexOf(obj) + ']';
    return h('div', { class: 'grid g3' },
      ZC.field('GitHub URL', obj.links, 'github', { type: 'url', path: base + '.links.github', placeholder: 'https://github.com/…', spellcheck: false }),
      ZC.field('Live demo URL', obj.links, 'demo', { type: 'url', path: base + '.links.demo', placeholder: 'https://…', spellcheck: false }),
      ZC.field('Report URL', obj.links, 'report', { type: 'url', path: base + '.links.report', placeholder: 'https://…', spellcheck: false }));
  }

  /* ---------- Profile ---------- */
  V.profile = {
    title: 'Profile & site',
    render: function () {
      var p = D().profile;
      p.cv = p.cv || {};
      var cvRow = function (lang, label) {
        var input = h('input', { type: 'file', accept: 'application/pdf', hidden: true, 'data-testid': 'cv-' + lang });
        input.addEventListener('change', function () {
          var f = input.files[0]; if (!f) return;
          if (f.size > 12 * 1024 * 1024) return ZC.toast('PDF is over 12 MB.', 'err');
          f.arrayBuffer().then(function (buf) { return ZC.api('POST', '/api/cv?lang=' + lang, buf, { raw: true, type: 'application/pdf' }); })
            .then(function (r) {
              // the server saved only profile.cv; keep any unsaved draft edits and just adopt the new revision + path
              ZC.state.rev = r.rev; p.cv[lang] = r.data.profile.cv[lang]; ZC.state.backups = r.backups;
              ZC.toast(label + ' CV uploaded and the site rebuilt.', 'ok'); ZC.rerender();
            }).catch(function (e) { ZC.toast(e.message, 'err'); });
        });
        return h('div', { class: 'row spread' },
          h('div', null, h('b', { text: label + ' CV' }), h('div', { class: 'hint mono', text: p.cv[lang] || 'No file uploaded' })),
          h('div', { class: 'row' },
            p.cv[lang] ? h('a', { class: 'btn sm', href: '/preview/' + p.cv[lang], target: '_blank', rel: 'noopener', text: 'View' }) : null,
            h('button', { type: 'button', class: 'btn sm', text: p.cv[lang] ? 'Replace PDF' : 'Upload PDF', on: { click: function () { input.click(); } } }), input));
      };

      return stack(
        ZC.card('Identity & hero', stack(
          g2(ZC.field('Full name', p, 'name', { path: 'profile.name' }), ZC.field('Title', p, 'title', { path: 'profile.title' })),
          ZC.field('Hero headline', p, 'headline', { hint: 'Wrap one word in <em>…</em> to highlight it, e.g. Practical <em>AI</em>, built end to end.' }),
          ZC.field('Hero lead paragraph', p, 'lead', { type: 'textarea', rows: 3 }),
          g2(ZC.field('Availability status', p, 'status', { hint: 'Small pill in the hero.' }), ZC.field('Location', p, 'location'))
        )),
        ZC.card('About', stack(ZC.field('Paragraph 1', p, 'aboutP1', { type: 'textarea', rows: 3 }), ZC.field('Paragraph 2', p, 'aboutP2', { type: 'textarea', rows: 3 }))),
        ZC.card('Contact & links', stack(
          g2(ZC.field('Email', p, 'email', { type: 'email', path: 'profile.email' }), ZC.field('Academic email', p, 'academicEmail', { type: 'email', path: 'profile.academicEmail' })),
          g2(ZC.field('GitHub', p, 'github', { type: 'url', path: 'profile.github', spellcheck: false }), ZC.field('LinkedIn', p, 'linkedin', { type: 'url', path: 'profile.linkedin', spellcheck: false }))
        )),
        ZC.card('CV files', stack(cvRow('en', 'English'), cvRow('fr', 'French'),
          h('p', { class: 'hint', text: 'Heads up: the PDF is published on a public site. Remove your home address and phone number from it first if you don’t want them online.' }))),
        ZC.card('Quick facts', ZC.repeater({
          list: p.facts = p.facts || [], noun: 'fact', prompt: 'Fact label (e.g. Based in)', cols: '1fr 2fr',
          row: function (f) { return [ZC.field('Label', f, 'label'), ZC.field('Value', f, 'value')]; },
          makeNew: function (name, list) { return { id: ZC.uniqueId(name, list.map(function (x) { return x.id; })), label: name, value: '' }; }
        })),
        ZC.card('Numbers', ZC.repeater({
          list: p.stats = p.stats || [], noun: 'number', prompt: 'Label (e.g. Projects)', cols: '2fr 1fr 80px 1.4fr',
          hint: 'Animated counters in the About section.',
          row: function (s, i) {
            return [ZC.field('Label', s, 'label'), ZC.field('Number', s, 'count', { path: 'profile.stats[' + i + '].count' }), ZC.field('Suffix', s, 'suffix', { placeholder: '+' }),
              ZC.field('Source', s, 'auto', { type: 'select', options: [['', 'Type it manually'], ['projects', 'Count my projects'], ['roles', 'Count my roles']], hint: 'Auto counters update themselves.' })];
          },
          makeNew: function (name, list) { return { id: ZC.uniqueId(name, list.map(function (x) { return x.id; })), label: name, count: '0', suffix: '' }; }
        })),
        ZC.card('System pipeline (hero)', stack(ZC.pipelinePreview(p), ZC.repeater({
          list: p.pipeline = p.pipeline || [], noun: 'step', prompt: 'Step title (e.g. Ingest)', cols: '1fr 2fr',
          row: function (s) { return [ZC.field('Title', s, 'title'), ZC.field('Subtitle', s, 'sub')]; },
          makeNew: function (name, list) { return { id: ZC.uniqueId(name, list.map(function (x) { return x.id; })), title: name, sub: '' }; }
        }))),
        ZC.card('Technology marquee', ZC.tags('Scrolling technology strip', D(), 'marquee', 'Order matters: it scrolls left to right.')),
        ZC.card('Search & sharing (SEO)', stack(
          ZC.field('Browser tab title', p, 'metaTitle', { max: 70, hint: 'Shown in the tab and in Google results.' }),
          ZC.field('Meta description', p, 'seoDescription', { type: 'textarea', rows: 3, max: 160, hint: 'Shown under the title in search results and link previews.' }),
          ZC.field('Public site URL', p, 'siteUrl', { type: 'url', path: 'profile.siteUrl', placeholder: 'https://username.github.io/repo/', spellcheck: false, hint: 'Used for the share image and canonical link.' })
        ))
      );
    }
  };
  /* ---------- Featured projects ---------- */
  V.featured = {
    title: 'Featured projects',
    render: function () {
      var list = D().featuredProjects = D().featuredProjects || [];
      return ZC.listEditor({
        key: 'featured', noun: 'project', items: function () { return list; },
        title: function (p) { return p.title; }, sub: function (p) { return p.category || ''; },
        create: function () {
          return ZC.prompt('New featured project', 'Project title').then(function (t) {
            if (!t) return null;
            return { id: ZC.uniqueId(t, ZC.projectIds()), category: 'Category', statusBadge: '', title: t, subtitle: '', description: '', problem: '', core: '', system: '', value: '', tags: [], links: { github: '', demo: '', report: '' }, diagram: { mode: 'auto', nodes: [{ id: 'input', label: 'Input', sub: '', kind: 'data' }, { id: 'core', label: 'Core', sub: '', kind: 'ai' }, { id: 'output', label: 'Output', sub: '', kind: 'svc' }], edges: [['input', 'core', 'f'], ['core', 'output', 'f']] } };
          });
        },
        duplicate: function (p) { var c = ZC.clone(p); c.title += ' (copy)'; c.id = ZC.uniqueId(p.id + '-copy', ZC.projectIds()); return c; },
        render: function (p) {
          var i = list.indexOf(p), w = 'featuredProjects[' + i + ']';
          return stack(
            g2(ZC.field('Title', p, 'title', { path: w + '.title' }), ZC.field('Category', p, 'category', { path: w + '.category', hint: 'Small label above the title, e.g. AI / LLMOps' })),
            g2(ZC.field('Subtitle', p, 'subtitle'), ZC.field('Status badge', p, 'statusBadge', { hint: 'Optional, e.g. “In progress”' })),
            ZC.field('Description', p, 'description', { type: 'textarea', rows: 4, path: w + '.description' }),
            g2(ZC.field('Problem', p, 'problem', { type: 'textarea', rows: 3 }), ZC.field('Core', p, 'core', { type: 'textarea', rows: 3 })),
            g2(ZC.field('System', p, 'system', { type: 'textarea', rows: 3 }), ZC.field('Value', p, 'value', { type: 'textarea', rows: 3 })),
            ZC.tags('Technologies', p, 'tags'),
            links(p),
            h('div', { class: 'card', style: { background: 'var(--bg2)' } }, h('div', { class: 'card-head' }, h('h3', { text: 'Architecture diagram' })), ZC.diagramEditor(p))
          );
        }
      });
    }
  };

  /* ---------- More projects ---------- */
  V.more = {
    title: 'More projects',
    render: function () {
      var list = D().moreProjects = D().moreProjects || [];
      return ZC.listEditor({
        key: 'more', noun: 'project', items: function () { return list; },
        title: function (p) { return p.title; }, sub: function (p) { return p.category || ''; },
        create: function () {
          return ZC.prompt('New project', 'Project title').then(function (t) {
            if (!t) return null;
            return { id: ZC.uniqueId(t, ZC.projectIds()), icon: (ZC.state.icons[0] || 'i-cpu'), category: 'Category', title: t, description: '', note: '', tags: [], links: { github: '', demo: '', report: '' } };
          });
        },
        duplicate: function (p) { var c = ZC.clone(p); c.title += ' (copy)'; c.id = ZC.uniqueId(p.id + '-copy', ZC.projectIds()); return c; },
        render: function (p) {
          var w = 'moreProjects[' + list.indexOf(p) + ']';
          return stack(
            g2(ZC.field('Title', p, 'title', { path: w + '.title' }), ZC.field('Category', p, 'category')),
            ZC.field('Icon', p, 'icon', { type: 'select', options: ZC.state.icons.map(function (i) { return [i, i.replace(/^i-/, '')]; }) }),
            ZC.field('Description', p, 'description', { type: 'textarea', rows: 3 }),
            ZC.field('Note (small print)', p, 'note', { type: 'textarea', rows: 2, hint: 'Optional disclaimer shown under the description.' }),
            ZC.tags('Technologies', p, 'tags'),
            links(p)
          );
        }
      });
    }
  };

  /* ---------- Skills ---------- */
  V.skills = {
    title: 'Skills',
    render: function () {
      var list = D().skills = D().skills || [];
      return ZC.listEditor({
        key: 'skills', noun: 'skill group', items: function () { return list; },
        title: function (s) { return s.title; }, sub: function (s) { return (s.tags || []).length + ' skills'; },
        create: function () { return ZC.prompt('New skill group', 'Group title').then(function (t) { return t ? { id: ZC.uniqueId(t, list.map(function (x) { return x.id; })), icon: ZC.state.icons[0] || 'i-cpu', title: t, tags: [] } : null; }); },
        duplicate: function (s) { var c = ZC.clone(s); c.title += ' (copy)'; c.id = ZC.uniqueId(s.id + '-copy', list.map(function (x) { return x.id; })); return c; },
        render: function (s) {
          return stack(
            g2(ZC.field('Title', s, 'title', { path: 'skills[' + list.indexOf(s) + '].title' }), ZC.field('Icon', s, 'icon', { type: 'select', options: ZC.state.icons.map(function (i) { return [i, i.replace(/^i-/, '')]; }) })),
            ZC.tags('Skills', s, 'tags', 'Press Enter or comma after each one.')
          );
        }
      });
    }
  };

  /* ---------- Experience & education ---------- */
  var expTab = 'exp';
  V.experience = {
    title: 'Experience & education',
    render: function () {
      var tabs = h('div', { class: 'tabs' }, [['exp', 'Experience'], ['edu', 'Education']].map(function (t) {
        return h('button', { type: 'button', class: 'tab' + (expTab === t[0] ? ' on' : ''), text: t[1], on: { click: function () { expTab = t[0]; ZC.rerender(); } } });
      }));
      var body;
      if (expTab === 'exp') {
        var list = D().experience = D().experience || [];
        body = ZC.listEditor({
          key: 'exp', noun: 'role', items: function () { return list; },
          title: function (x) { return x.role; }, sub: function (x) { return [x.company, x.date].filter(Boolean).join(' · '); },
          create: function () { return ZC.prompt('New role', 'Role title').then(function (t) { return t ? { id: ZC.uniqueId('role-' + t, list.map(function (x) { return x.id; })), date: '', role: t, company: '', location: '', bullets: [{ text: '' }], tags: [] } : null; }); },
          duplicate: function (x) { var c = ZC.clone(x); c.role += ' (copy)'; c.id = ZC.uniqueId(x.id + '-copy', list.map(function (y) { return y.id; })); return c; },
          render: function (x) {
            x.bullets = x.bullets || [];
            return stack(
              ZC.field('Role', x, 'role', { path: 'experience[' + list.indexOf(x) + '].role' }),
              g2(ZC.field('Company', x, 'company'), ZC.field('Location', x, 'location')),
              ZC.field('Dates', x, 'date', { placeholder: 'Jun 2026 — Aug 2026' }),
              ZC.textList('What you did', x.bullets, 'bullet', true),
              ZC.tags('Technologies', x, 'tags')
            );
          }
        });
      } else {
        var el = D().education = D().education || [];
        body = ZC.listEditor({
          key: 'edu', noun: 'entry', items: function () { return el; },
          title: function (x) { return x.degree; }, sub: function (x) { return [x.school, x.date].filter(Boolean).join(' · '); },
          create: function () { return ZC.prompt('New education entry', 'Degree / programme').then(function (t) { return t ? { id: ZC.uniqueId('edu-' + t, el.map(function (x) { return x.id; })), date: '', degree: t, school: '' } : null; }); },
          duplicate: function (x) { var c = ZC.clone(x); c.degree += ' (copy)'; c.id = ZC.uniqueId(x.id + '-copy', el.map(function (y) { return y.id; })); return c; },
          render: function (x) {
            return stack(ZC.field('Degree / programme', x, 'degree', { path: 'education[' + el.indexOf(x) + '].degree' }), g2(ZC.field('School', x, 'school'), ZC.field('Dates', x, 'date')));
          }
        });
      }
      return h('div', null, tabs, body);
    }
  };
})();
