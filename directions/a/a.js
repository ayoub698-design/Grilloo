/* Direction A — « Fiche technique ». Renders chrome + the three page templates. */
(function () {
  'use strict';
  var $ = GC.$, $$ = GC.$$, esc = GC.esc, fmt = GC.fmt, G = GC.G;

  /* ---------- chrome ---------- */
  function chrome(current) {
    var nav = [['Nos produits', 'produits.html', 'prod'], ['Catalogue', 'gamme.html', 'cat'], ['Guide de choix', 'index.html#guide', 'guide'], ['Secteurs', 'index.html#secteurs', 'sect'], ['À propos de nous', 'apropos.html', 'about'], ['Contact', null, 'contact']];
    var links = nav.map(function (n) { return n[1] ? '<a href="' + n[1] + '"' + (n[2] === current ? ' aria-current="page"' : '') + '>' + n[0] + '</a>' : '<a href="#" data-todo="' + n[0] + '">' + n[0] + '</a>'; }).join('');
    $('#hd').innerHTML = '<header class="hd" data-header><div class="wrap hd__in">' +
      '<a class="hd__logo" href="index.html" aria-label="GRILLOO — accueil"><img src="' + GC.brand('logo-mark-cyan') + '" alt="GRILLOO" width="116" height="34"></a>' +
      '<nav class="hd__nav" data-menu aria-label="Navigation principale">' + links + '</nav>' +
      '<a class="btn hd__cta" href="#" data-quote>Demander un devis <span class="arr">→</span></a>' +
      '<button class="hd__burger" data-menu-btn aria-expanded="false" aria-label="Menu"><span></span><span></span><span></span></button></div></header>';
    var fams = G.families.map(function (f) { return '<li><a href="gamme.html?f=' + f.slug + '">' + esc(f.plural || f.name) + '</a></li>'; }).join('');
    $('#ft').innerHTML = '<footer class="ft"><div class="wrap"><div class="ft__grid">' +
      '<div><img class="ft__logo" src="' + GC.brand('logo-lockup-white') + '" alt="GRILLOO — Leader des solutions de nettoyage"><p style="max-width:28em;margin-top:20px">' + esc((G.brand && G.brand.summary) || '') + '</p><div class="ft__soc">' + GC.social() + '</div></div>' +
      '<div><h4>Gammes</h4><ul>' + fams + '</ul></div>' +
      '<div><h4>Le site</h4><ul><li><a href="gamme.html">Catalogue complet</a></li><li><a href="index.html#guide">Guide de choix</a></li><li><a href="index.html#secteurs">Secteurs</a></li><li><a href="apropos.html">À propos de nous</a></li><li><a href="produits.html">Nos produits</a></li><li><a href="heros.html">Scènes Hero</a></li><li><a href="#" data-todo="Garantie & SAV">Garantie & SAV</a></li><li><a href="#" data-todo="Conseils & guides">Conseils & guides</a></li></ul></div>' +
      '<div><h4>Contact</h4><ul><li>' + esc((G.brand && G.brand.site) || 'www.grilloo.net') + '</li><li><a href="#" data-quote>Demander un devis</a></li><li><a href="../Catalogue-GRILLOO-2024.pdf">Catalogue 2024 (PDF)</a></li><li style="opacity:.6">Adresse, téléphone : à fournir par GRILLOO</li></ul></div>' +
      '</div><div class="ft__base"><span>© GRILLOO — Catalogue de matériels de nettoyage</span><span>Maquette · Direction A « Fiche technique »</span></div></div></footer>';
    GC.header();
  }

  /* ---------- stage with dimension call-outs ---------- */
  function stageHTML(id) {
    return '<div class="stage" id="' + id + '"><div class="stage__plate" data-ref=""></div><div class="stage__img"><img alt=""></div>' +
      '<svg class="dims" viewBox="0 0 100 86" preserveAspectRatio="none" aria-hidden="true">' +
      '<path class="ln ln--c" d="M54 7 V20"/><circle class="dot" cx="54" cy="20" r=".7"/>' +
      '<path class="ln ln--c" d="M14 37 H22 L30 43"/><circle class="dot" cx="30" cy="43" r=".7"/>' +
      '<path class="ln ln--c" d="M86 49 H80 L72 55"/><circle class="dot" cx="72" cy="55" r=".7"/>' +
      '<path class="ln" d="M22 76 V80 M22 78 H82 M82 76 V80"/></svg>' +
      '<div class="callout c-top"><b></b><small></small></div><div class="callout c-left"><b></b><small></small></div><div class="callout c-right"><b></b><small></small></div><div class="callout c-bottom"><b></b><small></small></div></div>';
  }
  function setStage(el, p, imgSlug) {
    var kf = GC.keyFigures(p);
    var order = ['prod', 'tank', 'auto', 'width'];
    var byId = {}; kf.forEach(function (k) { byId[k.id] = k; });
    var picks = order.map(function (id) { return byId[id]; });
    var rest = kf.filter(function (k) { return picks.indexOf(k) < 0; });
    picks = picks.map(function (k) { return k || rest.shift() || null; });
    var im = $('.stage__img img', el);
    el.classList.remove('is-drawn');
    im.classList.add('is-out');
    setTimeout(function () {
      im.onload = function () { im.classList.remove('is-out'); requestAnimationFrame(function () { el.classList.add('is-drawn'); }); };
      im.src = GC.img(imgSlug || p.img || p.slug); im.alt = (p.kind || '') + ' GRILLOO ' + p.name;
      $('.stage__plate', el).setAttribute('data-ref', 'GRILLOO ' + p.name + ' · CATALOGUE P.' + (p.page || '—'));
      $$('.callout', el).forEach(function (c, i) { var k = picks[i]; c.style.visibility = k ? '' : 'hidden'; if (k) { $('b', c).textContent = k.v + (k.u ? ' ' + k.u : ''); $('small', c).textContent = k.l; } });
    }, el._init ? 320 : 0);
    el._init = true;
  }

  /* ---------- HOME ---------- */
  function home() {
    chrome('home');
    var st = GC.stats();
    var heroSet = ['g9', 'roboclean-g-plus', 'g7', 'gbe1200', 'g54'].map(GC.product).filter(Boolean);
    if ($('#hero-stage')) {
    $('#hero-stage').innerHTML = stageHTML('stage') + '<div class="switch" role="group" aria-label="Machine affichée">' + heroSet.map(function (p, i) { return '<button aria-pressed="' + (i === 0) + '" data-p="' + p.slug + '">' + esc(p.name) + '</button>'; }).join('') + '</div>';
    var stage = $('#stage'), idx = 0, timer;
    function show(i) { idx = i; setStage(stage, heroSet[i]); $$('.switch button').forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === i)); }); }
    $$('.switch button').forEach(function (b, i) { b.addEventListener('click', function () { clearInterval(timer); show(i); }); });
    if (heroSet.length) show(0);
    if (!GC.reduce) timer = setInterval(function () { show((idx + 1) % heroSet.length); }, 6500);
    }

    $('#ruler').innerHTML = '<div class="ruler__ticks"></div><div class="wrap ruler__row">' +
      '<div class="ruler__cell"><b>' + st.products + '</b><span>machines au catalogue 2024</span></div>' +
      '<div class="ruler__cell"><b>' + st.families + '</b><span>familles de matériels</span></div>' +
      '<div class="ruler__cell"><b>' + fmt(st.minProd, 0) + '–' + fmt(st.maxProd, 0) + '</b><span>m²/h de rendement théorique</span></div>' +
      '<div class="ruler__cell"><b>79</b><span>pages de fiches techniques</span></div></div>';
    var ticks = $('.ruler__ticks');
    GC.onScroll(function () { ticks.style.setProperty('--rx', (-scrollY * 0.25 % 100) + 'px'); });

    /* family index */
    $('#fidx').innerHTML = G.families.map(function (f, i) {
      var s = GC.familyStats(f.slug), meta = s.prod ? GC.rng(s.prod) + ' m²/h' : s.tank ? GC.rng(s.tank) + ' L' : '';
      return '<a class="fidx__row" href="gamme.html?f=' + f.slug + '" data-thumb="' + GC.img(GC.heroOf(f.slug)) + '"><span class="fidx__n">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="fidx__name">' + GC.icon(f.slug) + esc(f.plural || f.name) + '</span><span class="fidx__meta">' + s.count + ' modèle' + (s.count > 1 ? 's' : '') + '</span><span class="fidx__meta">' + meta + '</span><span class="fidx__arr">→</span></a>';
    }).join('') + '<div class="fidx__thumb" aria-hidden="true"><img alt=""></div>';
    var th = $('.fidx__thumb'), thImg = $('img', th);
    $$('.fidx__row').forEach(function (r) {
      r.addEventListener('mouseenter', function () { thImg.src = r.getAttribute('data-thumb'); th.classList.add('is-on'); });
      r.addEventListener('mouseleave', function () { th.classList.remove('is-on'); });
      r.addEventListener('mousemove', function (e) { th.style.left = (e.clientX + 170) + 'px'; th.style.top = e.clientY + 'px'; });
    });

    selector();
    robot();

    /* sectors */
    $('#sectors').innerHTML = GC.SECTORS.map(function (s) {
      var l = GC.sectorProducts(s); if (!l.length) return '';
      return '<a class="sector" href="#" data-todo="Secteur — ' + esc(s.short) + '" data-reveal><div class="sector__img"><img loading="lazy" src="' + GC.amb(s.img) + '" alt=""></div><div class="sector__body"><h3>' + esc(s.name) + '</h3>' +
        '<div class="sector__models">' + l.slice(0, 8).map(function (p) { return '<span>' + esc(p.name) + '</span>'; }).join('') + (l.length > 8 ? '<span>+' + (l.length - 8) + '</span>' : '') + '</div>' +
        '<span class="sector__src">Machines dont la fiche catalogue cite ce secteur</span></div></a>';
    }).join('');

    /* values */
    var vals = (G.brand && G.brand.values) || [];
    $('#vals').innerHTML = vals.map(function (v, i) { return '<div class="val" data-reveal><code>SPEC-' + String(i + 1).padStart(2, '0') + '</code><h3>' + esc(v.title) + '</h3><p>' + esc(v.text) + '</p></div>'; }).join('');

    compareTable('#cmp-autoportees', GC.byFamily('autoportees'));
    GC.reveal();
  }

  function selector() {
    var root = $('#guide-ui'); if (!root) return;
    var ops = [{ id: 'laver', label: 'Laver un sol dur', fam: ['autolaveuses', 'autoportees'] }, { id: 'balayer', label: 'Balayer', fam: ['balayeuses'] }, { id: 'moquette', label: 'Moquette & textile', fam: ['injecteurs'] }];
    var hours = [1, 2, 3, 4, 6, 8];
    var state = { v: 520, h: 2, op: 'laver' };
    root.innerHTML = '<div class="sel"><div class="sel__ctrl">' +
      '<div class="sel__field"><label for="surf">Surface à traiter</label><div class="sel__val"><span id="surf-v"></span><small>m²</small></div><input class="range" id="surf" type="range" min="0" max="1000" value="' + state.v + '" aria-describedby="surf-v"></div>' +
      '<fieldset class="sel__field"><legend>Temps disponible par passage</legend><div class="seg" id="hrs">' + hours.map(function (h) { return '<button type="button" aria-pressed="' + (h === state.h) + '" data-h="' + h + '">' + h + ' h</button>'; }).join('') + '</div></fieldset>' +
      '<fieldset class="sel__field"><legend>Opération</legend><div class="seg" id="ops">' + ops.map(function (o) { return '<button type="button" aria-pressed="' + (o.id === state.op) + '" data-op="' + o.id + '">' + o.label + '</button>'; }).join('') + '</div></fieldset>' +
      '<div class="sel__need"><span class="eyebrow">Rendement minimal requis</span><br><b id="need"></b><p>Surface ÷ temps. Comparé aux rendements théoriques publiés dans le catalogue.</p></div></div>' +
      '<div><div class="chart"><div class="chart__axis" id="axis"></div><div class="chart__need" id="need-line"></div><div class="chart__rows" id="rows"></div></div><div class="picks" id="picks"></div>' +
      '<p class="sel__note">Le rendement réel dépend de l’encombrement, du type de sol et du nombre de passages. Pour un dimensionnement précis, demandez un devis.</p></div></div>';
    var all = G.products.filter(function (p) { return typeof p.key.productivity === 'number'; });
    var mn = Math.min.apply(null, all.map(function (p) { return p.key.productivity; })) / 1.4, mx = Math.max.apply(null, all.map(function (p) { return p.key.productivity; })) * 1.15;
    var L = function (x) { return (Math.log(x) - Math.log(mn)) / (Math.log(mx) - Math.log(mn)); };
    $('#axis').innerHTML = [200, 500, 1000, 2000, 5000, 10000, 20000].filter(function (t) { return t > mn && t < mx; }).map(function (t) { return '<span style="left:' + (L(t) * 100) + '%">' + fmt(t, 0) + '</span>'; }).join('');
    function surf() { var s = 100 * Math.pow(10, state.v / 1000 * Math.log10(600)); var m = s < 1000 ? 10 : s < 10000 ? 100 : 500; return Math.round(s / m) * m; }
    function render() {
      var s = surf(), need = s / state.h, op = ops.filter(function (o) { return o.id === state.op; })[0];
      $('#surf-v').textContent = fmt(s, 0); $('#surf').style.setProperty('--p', (state.v / 10) + '%');
      $('#need').textContent = fmt(Math.ceil(need), 0) + ' m²/h';
      var list = all.filter(function (p) { return op.fam.indexOf(p.family) > -1; }).sort(function (a, b) { return a.key.productivity - b.key.productivity; });
      var ok = list.filter(function (p) { return p.key.productivity >= need; });
      var best = ok.slice(0, 3);
      $('#rows').innerHTML = list.map(function (p) {
        var cls = p.key.productivity >= need ? (best.indexOf(p) > -1 ? 'is-ok is-best' : 'is-ok') : '';
        return '<a class="bar ' + cls + '" href="produit.html?p=' + p.slug + '" title="' + esc(p.name + ' — ' + fmt(p.key.productivity, 0) + ' m²/h') + '"><span>' + esc(p.name) + '</span><span class="bar__track"><span class="bar__fill" style="--w:' + (L(p.key.productivity) * 100).toFixed(2) + '%"></span></span></a>';
      }).join('');
      var nl = $('#need-line'); nl.style.setProperty('--x', Math.min(1, Math.max(0, L(need))).toFixed(3)); nl.setAttribute('data-label', fmt(Math.ceil(need), 0) + ' m²/h');
      $('#picks').innerHTML = best.length ? best.map(function (p, i) { return '<a class="pick" href="produit.html?p=' + p.slug + '"><img src="' + GC.img(p) + '" alt=""><div><span>' + (i === 0 ? 'La plus juste' : 'Alternative') + '</span><b>' + esc(p.name) + '</b><span>' + fmt(p.key.productivity, 0) + ' m²/h · ' + esc((GC.family(p.family) || {}).name || '') + '</span></div></a>'; }).join('')
        : '<p style="grid-column:1/-1;color:#A9BBBF">Aucune machine de cette gamme n’atteint seule ce rendement : augmentez le temps disponible, ou prévoyez plusieurs machines.</p>';
    }
    $('#surf').addEventListener('input', function (e) { state.v = +e.target.value; render(); });
    $$('#hrs button').forEach(function (b) { b.addEventListener('click', function () { state.h = +b.dataset.h; $$('#hrs button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); render(); }); });
    $$('#ops button').forEach(function (b) { b.addEventListener('click', function () { state.op = b.dataset.op; $$('#ops button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); render(); }); });
    render();
  }

  function robot() {
    var p = GC.product('roboclean-g-plus'); var el = $('#robo'); if (!p || !el) return;
    var v = function (re) { return GC.spec(p, re) || '—'; };
    var facts = [
      ['auto', 'Mode autonome — vitesse ' + v(/vitesse.*autonome/i) + ', rendement théorique ' + v(/rendement.*autonome/i) + '.'],
      ['auto', 'Capteurs de dernière génération, caméras 3D et systèmes anti-collision ; conforme à la norme EN IEC 63327.'],
      ['auto', 'Ralentit ou s’arrête à l’approche d’un obstacle ou d’une personne, puis reprend sa vitesse de travail.'],
      ['auto', 'Itinéraires et données de nettoyage stockés sur des serveurs européens.'],
      ['man', 'Utilisable comme autolaveuse autotractée manuelle, avec poignée extensible.'],
      ['man', 'Éjection et ramassage automatiques des brosses, sans outil.'],
      ['both', 'Batterie lithium-ion ' + v(/tension.*batterie/i) + ' — autonomie ' + v(/autonomie/i) + '.'],
      ['both', 'Réservoirs eau propre / sale ' + v(/r[ée]servoir d.eau/i) + ', réservoir de détergent ' + v(/d[ée]tergent/i) + '.']
    ];
    el.innerHTML = '<div class="robo__img"><span class="zone z1" data-l="Zone de ralentissement"></span><span class="zone z2" data-l="Arrêt"></span><img src="' + GC.img(p) + '" alt="Autolaveuse autonome GRILLOO RoboClean G+"></div>' +
      '<div><span class="tab">Autolaveuse autonome</span><h2 class="h-l" style="margin-top:18px">RoboClean G+</h2><p class="lead">' + esc(p.lead || '') + '</p>' +
      '<div class="robo__modes" role="group" aria-label="Mode"><button aria-pressed="true" data-m="auto">Mode autonome</button><button aria-pressed="false" data-m="man">Mode manuel</button></div>' +
      '<ol class="facts">' + facts.map(function (f, i) { return '<li data-m="' + f[0] + '"><span>' + String(i + 1).padStart(2, '0') + '</span><p>' + esc(f[1]) + '</p></li>'; }).join('') + '</ol>' +
      '<p style="margin-top:24px"><a class="btn" href="produit.html?p=' + p.slug + '">Voir la fiche technique <span class="arr">→</span></a></p></div>';
    function mode(m) { $$('.robo__modes button', el).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.m === m)); }); $$('.facts li', el).forEach(function (li) { li.classList.toggle('is-dim', li.dataset.m !== m && li.dataset.m !== 'both'); }); $$('.zone', el).forEach(function (z) { z.style.opacity = m === 'auto' ? 1 : .15; }); }
    $$('.robo__modes button', el).forEach(function (b) { b.addEventListener('click', function () { mode(b.dataset.m); }); });
    mode('auto');
  }

  function compareTable(sel, list) {
    var el = $(sel); if (!el || !list.length) return;
    var cols = [['Largeur', 'width', 'mm'], ['Réservoir', 'tank', 'L'], ['Rendement', 'productivity', 'm²/h'], ['Autonomie', 'autonomy', 'h'], ['Poids', 'weight', 'kg']];
    var max = {}; cols.forEach(function (c) { max[c[1]] = Math.max.apply(null, list.map(function (p) { return p.key[c[1]] || 0; })); });
    var sort = { k: 'productivity', d: -1 };
    function draw() {
      var rows = list.slice().sort(function (a, b) { return ((a.key[sort.k] || 0) - (b.key[sort.k] || 0)) * sort.d; });
      el.innerHTML = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Modèle</th>' + cols.map(function (c) { return '<th scope="col" aria-sort="' + (sort.k === c[1] ? (sort.d < 0 ? 'descending' : 'ascending') : 'none') + '"><button data-k="' + c[1] + '">' + c[0] + ' (' + c[2] + ')</button></th>'; }).join('') + '</tr></thead><tbody>' +
        rows.map(function (p) { return '<tr><td><a href="produit.html?p=' + p.slug + '"><img src="' + GC.img(p) + '" alt="" loading="lazy">' + esc(p.name) + '</a></td>' + cols.map(function (c) { var v = p.key[c[1]]; return '<td><span class="cell">' + (v ? fmt(v, 1) : '—') + '<i style="--w:' + (v && max[c[1]] ? (v / max[c[1]] * 100).toFixed(1) : 0) + '%"></i></span></td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
      $$('th button', el).forEach(function (b) { b.addEventListener('click', function () { var k = b.dataset.k; sort = { k: k, d: sort.k === k ? -sort.d : -1 }; draw(); }); });
    }
    draw();
  }

  /* ---------- GAMME ---------- */
  function gamme() {
    chrome('cat');
    var fs = GC.param('f'), f = GC.family(fs), list = f ? GC.byFamily(f.slug) : G.products.slice();
    document.title = (f ? (f.plural || f.name) + ' professionnel(le)s' : 'Catalogue des machines de nettoyage') + ' — GRILLOO';
    var s = f ? GC.familyStats(f.slug) : { count: list.length, prod: GC.range(list, 'productivity'), tank: GC.range(list, 'tank') };
    $('#crumb').innerHTML = '<a href="index.html">Accueil</a><span>/</span><a href="gamme.html">Catalogue</a>' + (f ? '<span>/</span><span>' + esc(f.plural || f.name) + '</span>' : '');
    $('#ghead').innerHTML = '<div><span class="tab">' + esc(f ? f.label || f.name : 'Catalogue 2024') + '</span><h1 class="h-xl" style="margin-top:20px">' + esc(f ? f.plural || f.name : 'Toutes les machines') + '</h1>' +
      '<p class="lead" style="margin-top:18px">' + esc(f ? f.intro || '' : 'Les ' + list.length + ' machines du catalogue GRILLOO 2024, filtrables par famille et par source d’énergie.') + '</p></div>' +
      '<div class="ghead__stats"><div><b>' + s.count + '</b><span>modèles</span></div><div><b>' + (s.prod ? GC.rng(s.prod) : '—') + '</b><span>m²/h</span></div><div><b>' + (s.tank ? GC.rng(s.tank) : '—') + '</b><span>litres</span></div></div>';
    $('#ftabs').innerHTML = '<a href="gamme.html"' + (!f ? ' aria-current="page"' : '') + '>Tout</a>' + G.families.map(function (x) { return '<a href="gamme.html?f=' + x.slug + '"' + (f && x.slug === f.slug ? ' aria-current="page"' : '') + '>' + GC.icon(x.slug) + esc(x.plural || x.name) + '</a>'; }).join('');
    var energies = list.map(function (p) { return p.key.energy; }).filter(function (e, i, a) { return e && a.indexOf(e) === i; });
    var metrics = [['productivity', 'Rendement', 'm²/h'], ['tank', 'Capacité', 'L'], ['width', 'Largeur', 'mm'], ['autonomy', 'Autonomie', 'h'], ['power', 'Puissance', 'W'], ['weight', 'Poids', 'kg']]
      .filter(function (m) { return list.filter(function (p) { return p.key[m[0]]; }).length >= Math.max(1, list.length / 3); }).slice(0, 3);
    var max = {}; metrics.forEach(function (m) { max[m[0]] = Math.max.apply(null, list.map(function (p) { return p.key[m[0]] || 0; })); });
    var state = { sort: metrics[0] ? metrics[0][0] : 'page', energy: 'all', view: 'grid', cmp: [] };
    $('#tools').innerHTML = '<div class="seg" id="en"><button aria-pressed="true" data-e="all">Toutes énergies</button>' + energies.map(function (e) { return '<button aria-pressed="false" data-e="' + e + '">' + e.charAt(0).toUpperCase() + e.slice(1) + '</button>'; }).join('') + '</div>' +
      '<div style="display:flex;gap:10px;align-items:center"><label class="mono" for="sort" style="font-size:12px;color:var(--mute)">TRIER</label><select id="sort">' + metrics.map(function (m) { return '<option value="' + m[0] + '">' + m[1] + ' décroissant</option>'; }).join('') + '<option value="page">Ordre du catalogue</option></select>' +
      '<div class="seg" id="view"><button aria-pressed="true" data-v="grid">Fiches</button><button aria-pressed="false" data-v="table">Tableau</button></div></div>';
    function rows() {
      return list.filter(function (p) { return state.energy === 'all' || p.key.energy === state.energy; })
        .sort(function (a, b) { return state.sort === 'page' ? (a.page || 0) - (b.page || 0) : (b.key[state.sort] || 0) - (a.key[state.sort] || 0); });
    }
    function draw() {
      var r = rows();
      if (state.view === 'table') {
        $('#results').innerHTML = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Modèle</th><th>Famille</th>' + metrics.map(function (m) { return '<th>' + m[1] + ' (' + m[2] + ')</th>'; }).join('') + '<th>Page</th></tr></thead><tbody>' +
          r.map(function (p) { return '<tr><td><a href="produit.html?p=' + p.slug + '"><img src="' + GC.img(p) + '" alt="" loading="lazy">' + esc(p.name) + '</a></td><td style="font-family:var(--f-sans)">' + esc(p.kind || '') + '</td>' + metrics.map(function (m) { var v = p.key[m[0]]; return '<td><span class="cell">' + (v ? fmt(v, 1) : '—') + '<i style="--w:' + (v ? (v / max[m[0]] * 100).toFixed(1) : 0) + '%"></i></span></td>'; }).join('') + '<td>p.' + (p.page || '—') + '</td></tr>'; }).join('') + '</tbody></table></div>';
      } else {
        $('#results').innerHTML = '<div class="grid">' + r.map(function (p) {
          return '<article class="card" data-reveal><label class="card__cmp"><input type="checkbox" data-cmp="' + p.slug + '"' + (state.cmp.indexOf(p.slug) > -1 ? ' checked' : '') + '> Comparer</label>' +
            '<a href="produit.html?p=' + p.slug + '" style="text-decoration:none;display:contents"><div class="card__img"><span class="card__pg">p.' + (p.page || '—') + '</span><img loading="lazy" src="' + GC.img(p) + '" alt="' + esc((p.kind || '') + ' GRILLOO ' + p.name) + '"></div>' +
            '<div class="card__body"><span class="card__kind">' + esc(p.kind || '') + '</span><span class="card__name">' + esc(p.name) + '</span><div class="kv">' +
            metrics.map(function (m) { var v = p.key[m[0]]; return '<div><span>' + m[1] + '</span><b>' + (v ? fmt(v, 1) + ' ' + m[2] : '—') + '</b><i style="--w:' + (v ? (v / max[m[0]] * 100).toFixed(1) : 0) + '%"></i></div>'; }).join('') + '</div></div></a></article>';
        }).join('') + '</div>';
        $$('[data-cmp]').forEach(function (c) { c.addEventListener('change', function () { var s = c.dataset.cmp, i = state.cmp.indexOf(s); if (c.checked && i < 0) { if (state.cmp.length >= 3) { c.checked = false; GC.toast('Comparaison limitée à 3 machines.'); return; } state.cmp.push(s); } if (!c.checked && i > -1) state.cmp.splice(i, 1); tray(); }); });
        GC.reveal('.card[data-reveal]');
      }
    }
    function tray() {
      var t = $('#tray'); t.classList.toggle('is-on', state.cmp.length > 0);
      $('.tray__items', t).innerHTML = state.cmp.map(function (s) { return '<span>' + esc(GC.product(s).name) + '</span>'; }).join('');
    }
    $('#tray').innerHTML = '<div class="tray__items"></div><button class="btn" id="cmp-go">Comparer</button>';
    $('#cmp-go').addEventListener('click', function () {
      var ps = state.cmp.map(GC.product); if (ps.length < 2) { GC.toast('Sélectionnez au moins 2 machines.'); return; }
      var labels = []; ps.forEach(function (p) { (p.specs || []).forEach(function (s) { if (labels.indexOf(s[0]) < 0 && !/mod[eè]le/i.test(s[0])) labels.push(s[0]); }); });
      var c = $('#cmp'); c.innerHTML = '<div class="cmp__panel" role="dialog" aria-modal="true" aria-label="Comparaison"><button class="cmp__x" aria-label="Fermer">×</button><table><thead><tr><th></th>' + ps.map(function (p) { return '<td><img src="' + GC.img(p) + '" alt="">' + esc(p.name) + '</td>'; }).join('') + '</tr></thead><tbody>' +
        labels.slice(0, 24).map(function (l) { return '<tr><th>' + esc(l) + '</th>' + ps.map(function (p) { var s = (p.specs || []).filter(function (x) { return x[0] === l; })[0]; return '<td>' + (s ? esc(s[1]) : '—') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
      c.classList.add('is-open'); $('.cmp__x', c).focus();
      $('.cmp__x', c).addEventListener('click', function () { c.classList.remove('is-open'); });
      c.addEventListener('click', function (e) { if (e.target === c) c.classList.remove('is-open'); });
    });
    $$('#en button').forEach(function (b) { b.addEventListener('click', function () { state.energy = b.dataset.e; $$('#en button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); draw(); }); });
    $$('#view button').forEach(function (b) { b.addEventListener('click', function () { state.view = b.dataset.v; $$('#view button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); draw(); }); });
    $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; draw(); });
    draw();
  }

  /* ---------- PRODUIT ---------- */
  function produit() {
    chrome('cat');
    var p = GC.product(GC.param('p') || 'g9') || G.products[0]; var f = GC.family(p.family) || {};
    document.title = (p.kind || '') + ' GRILLOO ' + p.name + ' — fiche technique';
    var md = document.querySelector('meta[name=description]'); if (md) md.content = (p.lead || '').slice(0, 155);
    GC.productLd(p);
    $('#crumb').innerHTML = '<a href="index.html">Accueil</a><span>/</span><a href="gamme.html">Catalogue</a><span>/</span><a href="gamme.html?f=' + f.slug + '">' + esc(f.plural || f.name || '') + '</a><span>/</span><span>' + esc(p.name) + '</span>';
    var imgs = [p.img || p.slug].concat(p.imgAlt || []);
    $('#pd-media').innerHTML = stageHTML('pstage') + (imgs.length > 1 ? '<div class="pd__thumbs">' + imgs.map(function (s, i) { return '<button aria-pressed="' + (i === 0) + '" data-i="' + s + '"><img src="' + GC.img(s) + '" alt="Vue ' + (i + 1) + '"></button>'; }).join('') + '</div>' : '');
    var stage = $('#pstage'); setStage(stage, p);
    $$('.pd__thumbs button').forEach(function (b) { b.addEventListener('click', function () { $$('.pd__thumbs button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); setStage(stage, p, b.dataset.i); }); });
    var kf = GC.keyFigures(p);
    var tabs = [['specs', 'Caractéristiques techniques'], ['feat', 'Points forts'], ['acc', 'Accessoires'], ['desc', 'Description']];
    $('#pd-info').innerHTML = '<div><span class="tab">' + esc(p.kind || f.label || '') + '</span><h1 class="h-xl" style="margin-top:18px">' + esc(p.name) + '</h1></div><p class="lead">' + esc(p.lead || '') + '</p>' +
      '<div class="pd__keys">' + kf.map(function (k) { return '<div><b>' + esc(k.v) + (k.u ? ' <small style="font-size:.6em">' + k.u + '</small>' : '') + '</b><span>' + esc(k.l) + '</span></div>'; }).join('') + '</div>' +
      '<div class="pd__ctas"><a class="btn" href="#" data-quote="' + p.slug + '">Demander un devis <span class="arr">→</span></a><a class="btn btn--ghost" href="#" data-todo="Fiche PDF ' + esc(p.name) + '">Fiche PDF</a><span class="mono" style="align-self:center;font-size:12px;color:var(--mute)">Catalogue 2024 · p.' + (p.page || '—') + '</span></div>' +
      '<div><div class="ptabs" role="tablist">' + tabs.map(function (t, i) { return '<button role="tab" aria-selected="' + (i === 0) + '" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div><div id="ppanel" role="tabpanel"></div></div>';
    function panel(t) {
      var h = '';
      if (t === 'specs') {
        h = '<table class="specs">' + (p.specs || []).map(function (s) { return '<tr><th scope="row">' + esc(s[0]) + '</th><td>' + esc(s[1]) + '</td></tr>'; }).join('') + '</table>';
        (p.variants || []).forEach(function (v) { h += '<h3 class="h-m" style="margin:28px 0 8px">Variante ' + esc(v.name) + '</h3><table class="specs">' + (v.specs || []).map(function (s) { return '<tr><th scope="row">' + esc(s[0]) + '</th><td>' + esc(s[1]) + '</td></tr>'; }).join('') + '</table>'; });
      } else if (t === 'feat') h = (p.features || []).length ? '<ul class="bul">' + p.features.map(function (x) { return '<li><span>' + esc(x) + '</span></li>'; }).join('') + '</ul>' : '<p>—</p>';
      else if (t === 'acc') h = '<h3 class="eyebrow" style="margin:18px 0 6px">Accessoires standard</h3><ul class="bul">' + (p.accessories || []).map(function (x) { return '<li><span>' + esc(x) + '</span></li>'; }).join('') + '</ul>' + ((p.options || []).length ? '<h3 class="eyebrow" style="margin:24px 0 6px">Options</h3><ul class="bul">' + p.options.map(function (x) { return '<li><span>' + esc(x) + '</span></li>'; }).join('') + '</ul>' : '');
      else h = [p.lead].concat(p.description || []).map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('');
      $('#ppanel').innerHTML = '<div class="ppanel">' + h + '</div>';
    }
    $$('.ptabs button').forEach(function (b) { b.addEventListener('click', function () { $$('.ptabs button').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); }); panel(b.dataset.t); }); });
    panel('specs');

    /* position in range */
    var sib = GC.byFamily(p.family); var mk = ['productivity', 'tank', 'power', 'weight'].filter(function (k) { return sib.filter(function (x) { return x.key[k]; }).length > 1 && p.key[k]; })[0];
    if (mk) {
      var lbl = { productivity: ['Rendement', 'm²/h'], tank: ['Capacité', 'L'], power: ['Puissance', 'W'], weight: ['Poids', 'kg'] }[mk];
      var vals = sib.filter(function (x) { return x.key[mk]; }); var lo = Math.min.apply(null, vals.map(function (x) { return x.key[mk]; })), hi = Math.max.apply(null, vals.map(function (x) { return x.key[mk]; }));
      $('#pos').innerHTML = '<div class="wrap"><span class="eyebrow">Position dans la gamme</span><h2 class="h-m" style="margin-top:8px">' + lbl[0] + ' — ' + esc(f.plural || f.name) + '</h2><div class="pos__line">' +
        vals.map(function (x, i) { var t = hi === lo ? .5 : (x.key[mk] - lo) / (hi - lo); return '<a class="pos__pt' + (x === p ? ' is-me' : '') + '" href="produit.html?p=' + x.slug + '" style="left:' + (4 + t * 92) + '%;--h:' + (x === p ? 90 : 28 + (i % 3) * 18) + 'px">' + esc(x.name) + '</a>'; }).join('') +
        '</div><div class="pos__scale"><span>' + fmt(lo, 0) + ' ' + lbl[1] + '</span><span>' + fmt(hi, 0) + ' ' + lbl[1] + '</span></div></div>';
    }
    var rel = sib.filter(function (x) { return x !== p; }).slice(0, 4);
    $('#related').innerHTML = rel.length ? '<div class="wrap"><div class="sec__head"><h2 class="h-l">Dans la même gamme</h2><p><a href="gamme.html?f=' + f.slug + '">Voir les ' + sib.length + ' ' + esc((f.plural || '').toLowerCase()) + ' →</a></p></div><div class="grid">' +
      rel.map(function (x) { return '<a class="card is-in" href="produit.html?p=' + x.slug + '"><div class="card__img"><img loading="lazy" src="' + GC.img(x) + '" alt=""></div><div class="card__body"><span class="card__kind">' + esc(x.kind || '') + '</span><span class="card__name">' + esc(x.name) + '</span></div></a>'; }).join('') + '</div></div>' : '';
  }

  window.A = { home: home, gamme: gamme, produit: produit, chrome: chrome, stageHTML: stageHTML, setStage: setStage };
})();
