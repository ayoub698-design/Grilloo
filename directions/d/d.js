/* Direction D — « Pro 3D ». Accueil, Nos produits, fiche produit, À propos de nous. */
(function () {
  'use strict';
  var $ = GC.$, $$ = GC.$$, esc = GC.esc, fmt = GC.fmt, G = GC.G;
  var CLAY = '../shared/img/clay/ic/';
  function clay(n) { return CLAY + n + (n === 'hero' ? '.jpg' : '.png'); }
  var I = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    search: '<svg class="s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
  };
  var st = GC.stats();
  function plural(n, w) { return n + ' ' + w + (n > 1 ? 's' : ''); }
  function famMeta(f) { var s = GC.familyStats(f.slug); return { s: s, r: s.prod ? GC.rng(s.prod) + ' m²/h' : s.tank ? GC.rng(s.tank) + ' L' : '' }; }

  /* ---------- chrome ---------- */
  function chrome(cur) {
    var mm = G.families.map(function (f) { var m = famMeta(f); return '<a href="produits.html?f=' + f.slug + '"><img src="' + GC.img(GC.heroOf(f.slug)) + '" alt="" loading="lazy"><div><b>' + esc(f.plural || f.name) + '</b><span>' + plural(m.s.count, 'modèle') + (m.r ? ' · ' + m.r : '') + '</span></div></a>'; }).join('');
    $('#hd').innerHTML = '<header class="hd" data-header><div class="wrap hd__in">' +
      '<a class="hd__logo" href="index.html" aria-label="GRILLOO — accueil"><img src="' + GC.brand('logo-mark-cyan') + '" alt="GRILLOO" width="109" height="32"></a>' +
      '<nav class="hd__nav" data-menu aria-label="Navigation principale">' +
      '<div class="mm" id="mm"><button type="button" aria-expanded="false"' + (cur === 'prod' ? ' style="color:var(--teal)"' : '') + '>Nos produits ' + I.chev + '</button><div class="mm__panel">' + mm +
      '<div class="mm__foot"><span>' + st.products + ' machines au catalogue 2024</span><a class="link" href="produits.html">Voir tous nos produits ' + I.arrow + '</a></div></div></div>' +
      '<a href="index.html#choisir">Bien choisir</a><a href="index.html#secteurs">Secteurs</a>' +
      '<a href="apropos.html"' + (cur === 'about' ? ' aria-current="page"' : '') + '>À propos de nous</a><a href="#" data-todo="Contact">Contact</a></nav>' +
      '<div class="hd__act"><a class="btn" href="#" data-quote>Demander un devis ' + I.arrow + '</a><button class="hd__burger" data-menu-btn aria-expanded="false" aria-label="Menu"><span></span><span></span><span></span></button></div></div></header>';
    var m = $('#mm'), b = $('button', m), t;
    function set(o) { m.classList.toggle('is-open', o); b.setAttribute('aria-expanded', String(o)); }
    b.addEventListener('click', function () { set(!m.classList.contains('is-open')); });
    if (matchMedia('(hover: hover)').matches) { m.addEventListener('mouseenter', function () { clearTimeout(t); set(true); }); m.addEventListener('mouseleave', function () { t = setTimeout(function () { set(false); }, 160); }); }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    document.addEventListener('click', function (e) { if (!m.contains(e.target)) set(false); });
    $('#ft').innerHTML = '<footer class="ft"><div class="wrap"><div class="ft__grid"><div><img src="' + GC.brand('logo-lockup-cyan') + '" alt="GRILLOO — Leader des solutions de nettoyage" style="width:160px"><p style="max-width:30em;margin:18px 0 0">' + esc((G.brand && G.brand.mission) || '') + '</p><div class="ft__soc">' + GC.social() + '</div></div>' +
      '<div><h4>Nos produits</h4><ul>' + G.families.slice(0, 6).map(function (f) { return '<li><a href="produits.html?f=' + f.slug + '">' + esc(f.plural || f.name) + '</a></li>'; }).join('') + '<li><a href="produits.html">Tous nos produits</a></li></ul></div>' +
      '<div><h4>GRILLOO</h4><ul><li><a href="apropos.html">À propos de nous</a></li><li><a href="index.html#choisir">Bien choisir</a></li><li><a href="index.html#secteurs">Secteurs</a></li><li><a href="apropos.html#garantie">Garantie &amp; SAV</a></li></ul></div>' +
      '<div><h4>Contact</h4><ul><li>' + esc((G.brand && G.brand.site) || 'www.grilloo.net') + '</li><li><a href="#" data-quote>Demander un devis</a></li><li><a href="../Catalogue-GRILLOO-2024.pdf">Catalogue 2024 (PDF)</a></li><li style="color:var(--mute)">Adresse et téléphone : à fournir</li></ul></div></div>' +
      '<div class="ft__base"><span>© GRILLOO — Leader des solutions de nettoyage</span><span>Maquette · Direction D « Pro 3D »</span></div></div></footer>';
    GC.header();
  }

  /* ---------- recherche de machine ---------- */
  function finder(el, opts) {
    opts = opts || {};
    el.innerHTML = I.search + '<input type="search" placeholder="Rechercher une machine : G9, aspirateur, balayeuse…" aria-label="Rechercher une machine" autocomplete="off"><button class="btn" type="button">Rechercher</button><div class="finder__list" role="listbox"></div>';
    var inp = $('input', el), list = $('.finder__list', el), btn = $('button', el), act = -1, res = [];
    function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function search(q) { q = norm(q).trim(); if (!q) return []; return G.products.filter(function (p) { var f = GC.family(p.family) || {}; return norm(p.name + ' ' + p.kind + ' ' + f.name + ' ' + f.plural).indexOf(q) > -1; }).slice(0, 8); }
    function draw() { res = search(inp.value); act = -1; list.innerHTML = res.length ? res.map(function (p) { var k = GC.keyFigures(p)[0]; return '<a href="produit.html?p=' + p.slug + '"><img src="' + GC.img(p) + '" alt=""><div><b>' + esc(p.name) + '</b><br><span>' + esc(p.kind || '') + '</span></div><em>' + (k ? esc(k.v + (k.u ? ' ' + k.u : '')) : '') + '</em></a>'; }).join('') : '<p style="margin:8px;color:var(--mute);font-size:14px">Aucune machine ne correspond.</p>'; el.classList.toggle('is-open', !!inp.value.trim()); if (opts.onInput) opts.onInput(inp.value); }
    inp.addEventListener('input', draw);
    inp.addEventListener('keydown', function (e) {
      var a = $$('a', list);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); act = Math.max(0, Math.min(a.length - 1, act + (e.key === 'ArrowDown' ? 1 : -1))); a.forEach(function (x, i) { x.classList.toggle('is-active', i === act); }); }
      if (e.key === 'Enter') { e.preventDefault(); if (a[act]) location.href = a[act].href; else go(); }
      if (e.key === 'Escape') el.classList.remove('is-open');
    });
    function go() { var q = inp.value.trim(); location.href = 'produits.html' + (q ? '?q=' + encodeURIComponent(q) : ''); }
    btn.addEventListener('click', go);
    document.addEventListener('click', function (e) { if (!el.contains(e.target)) el.classList.remove('is-open'); });
    if (opts.value) { inp.value = opts.value; }
    return inp;
  }

  /* ---------- blocs réutilisables ---------- */
  function famCards() {
    return '<div class="fam-grid">' + G.families.map(function (f, i) { var m = famMeta(f); return '<a class="fam" href="produits.html?f=' + f.slug + '" data-reveal style="transition-delay:' + (i % 5) * 60 + 'ms"><div class="fam__media"><span class="fam__count">' + plural(m.s.count, 'modèle') + '</span><img loading="lazy" src="' + GC.img(GC.heroOf(f.slug)) + '" alt="' + esc(f.name + ' GRILLOO') + '"></div><div class="fam__body"><div><b>' + esc(f.plural || f.name) + '</b><span>' + esc(m.r) + '</span></div><span class="fam__go">' + I.arrow + '</span></div></a>'; }).join('') + '</div>';
  }
  function sectorCards() {
    return '<div class="sec-grid">' + GC.SECTORS.map(function (s, i) { var l = GC.sectorProducts(s); if (!l.length) return ''; return '<article class="sector" data-reveal style="transition-delay:' + (i % 3) * 80 + 'ms"><div class="sector__ill"><img loading="lazy" src="' + clay('sec-' + s.slug) + '" alt=""></div><div><h3 class="h3">' + esc(s.name) + '</h3><p>' + plural(l.length, 'machine') + ' dont la fiche cite ce secteur</p><div class="models">' + l.slice(0, 4).map(function (p) { return '<a href="produit.html?p=' + p.slug + '">' + esc(p.name) + '</a>'; }).join('') + (l.length > 4 ? '<a href="produits.html">+' + (l.length - 4) + '</a>' : '') + '</div></div></article>'; }).join('') + '</div>';
  }
  function warranty() {
    return '<div class="war" id="garantie" data-reveal><div class="war__head"><img src="' + clay('val-garantie') + '" alt="" loading="lazy"><div><h2 class="h3" style="font-size:26px">Garantie &amp; service client</h2><p class="muted" style="margin:8px 0 0">Une garantie définie produit par produit, avec des conditions précisées pour chaque équipement.</p></div></div>' +
      '<div class="war__grid">' + GC.WARRANTY.map(function (w) { return '<div><b>' + esc(w[0]) + '</b><span>' + esc(w[1]) + '</span></div>'; }).join('') + '</div></div>';
  }
  function cta() {
    return '<div class="cta" data-reveal><div><h2 class="h2">' + esc((G.brand && G.brand.backCover) || 'La puissance du nettoyage entre vos mains.') + '</h2><p>Décrivez votre surface, votre type de sol et votre usage : l’équipe GRILLOO vous oriente vers la machine adaptée.</p>' +
      '<div class="cta__btns"><a class="btn" href="#" data-quote>Demander un devis ' + I.arrow + '</a><a class="btn btn--light" href="../Catalogue-GRILLOO-2024.pdf">Télécharger le catalogue</a></div></div><img class="float" src="' + clay('cta') + '" alt="" loading="lazy"></div>';
  }
  function aboutBlock(full) {
    var b = G.brand || {}, v = b.values || [];
    return '<div class="about"><div class="about__ill" data-reveal><img class="main" loading="lazy" src="' + clay('about') + '" alt="Illustration : entrepôt, atelier de service et livraison GRILLOO"></div>' +
      '<div class="about__copy"><span class="eyebrow"><i></i>À propos de nous</span><h2 class="h2">Le partenaire de confiance du nettoyage</h2><p class="lead">' + esc(b.intro || '') + '</p>' +
      '<div class="vals">' + v.slice(0, full ? 7 : 4).map(function (x) { return '<div class="val"><img loading="lazy" src="' + clay('val-' + x.key) + '" alt=""><b>' + esc(x.title) + '</b></div>'; }).join('') + '</div>' +
      (full ? '' : '<div class="cta__btns"><a class="btn" href="apropos.html">En savoir plus sur GRILLOO ' + I.arrow + '</a><a class="btn btn--ghost" href="#" data-quote>Nous contacter</a></div>') + '</div></div>';
  }

  /* ---------- ACCUEIL ---------- */
  function home() {
    chrome('home');
    var g9 = GC.product('g9'), robo = GC.product('roboclean-g-plus'), k9 = g9 ? GC.keyFigures(g9)[0] : null;
    $('#hero').innerHTML = '<div class="wrap hero__grid"><div class="hero__copy">' +
      '<span class="eyebrow"><i></i>Catalogue 2024 · ' + st.products + ' machines professionnelles</span>' +
      '<h1 class="h1">La puissance du nettoyage <span class="hl">entre vos mains.</span></h1>' +
      '<p class="lead">' + esc((G.brand && G.brand.cover && G.brand.cover.text) || '') + '</p>' +
      '<div><div class="finder" id="finder"></div><div class="finder__tags" style="margin-top:14px">Populaires : <a href="produit.html?p=g9">G9</a><a href="produit.html?p=roboclean-g-plus">RoboClean G+</a><a href="produits.html?f=aspirateurs">Aspirateurs</a><a href="produits.html?f=balayeuses">Balayeuses</a></div></div>' +
      '<div class="stats"><div><b>' + st.products + '</b><span>machines</span></div><div><b>' + st.families + '</b><span>familles</span></div><div><b>' + fmt(st.maxProd, 0) + '</b><span>m²/h, rendement max.</span></div></div></div>' +
      '<div class="hero__media" id="hmedia"><div class="hero__card"><img src="' + clay('hero') + '" alt="Autolaveuse autoportée GRILLOO G9 sur un sol à moitié nettoyé"></div>' +
      (g9 && k9 ? '<a class="glass" href="produit.html?p=g9" style="left:-4%;bottom:12%;--d:18px;animation-delay:.5s"><span class="ico"><img src="' + GC.img(g9) + '" alt=""></span><div><b>' + esc(k9.v + ' ' + k9.u) + '</b><span>' + esc(k9.l) + ' · G9</span></div></a>' : '') +
      (robo ? '<a class="glass" href="produit.html?p=roboclean-g-plus" style="right:-3%;top:9%;--d:-14px;animation-delay:.7s"><span class="ico"><img src="' + GC.img(robo) + '" alt=""></span><div><b>RoboClean G+</b><span>Autolaveuse autonome</span></div></a>' : '') +
      '<img class="hero__ill float" src="' + clay('val-innovation') + '" alt="" style="left:6%;top:-6%">' +
      '<img class="hero__ill float" src="' + clay('val-fiabilite') + '" alt="" style="right:8%;bottom:-8%;width:clamp(64px,7vw,100px);animation-delay:-3s"></div></div>';
    finder($('#finder'));
    var hm = $('#hmedia');
    if (!GC.reduce) hm.addEventListener('pointermove', function (e) { var r = hm.getBoundingClientRect(); hm.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3)); hm.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3)); });

    $('#nos-produits').innerHTML = '<div class="wrap"><div class="sec__head"><div><span class="eyebrow"><i></i>Nos produits</span><h2 class="h2">' + st.families + ' familles de machines, une seule exigence</h2><p>De l’autolaveuse compacte à la balayeuse de voirie, chaque machine dispose de sa fiche technique complète.</p></div><a class="btn btn--ghost" href="produits.html">Tous nos produits ' + I.arrow + '</a></div>' + famCards() + '</div>';

    var en = {}; G.products.forEach(function (p) { if (p.key.energy) en[p.key.energy] = (en[p.key.energy] || 0) + 1; });
    var steps = [
      ['step-sol', true, 'Quel type de sol ?', 'Sol dur, moquette ou extérieur : chaque famille répond à une surface.', [['autolaveuses', 'Sols durs'], ['injecteurs', 'Moquettes'], ['balayeuses', 'Extérieur']]],
      ['step-surface', true, 'Quelle surface ?', 'Le rendement en m²/h de chaque fiche permet de dimensionner la machine : de ' + fmt(st.minProd, 0) + ' à ' + fmt(st.maxProd, 0) + ' m²/h.', [['autoportees', 'Grandes surfaces']]],
      ['step-acces', false, 'Quel encombrement ?', 'Largeur de passage, rayon de braquage et poids, selon vos allées et vos accès.', [['autolaveuses', 'Compactes']]],
      ['step-energie', false, 'Quelle énergie ?', Object.keys(en).map(function (k) { return en[k] + ' ' + k; }).join(' · ') + '.', [['', 'Tout le catalogue']]]
    ];
    $('#choisir').innerHTML = '<div class="wrap"><div class="sec__head"><div><span class="eyebrow"><i></i>Bien choisir</span><h2 class="h2">Votre machine en quatre questions</h2><p>Le bon matériel dépend du sol, de la surface, de l’accès et de l’énergie disponible.</p></div><a class="btn" href="#" data-quote>Être conseillé ' + I.arrow + '</a></div>' +
      '<div class="steps">' + steps.map(function (s, i) { return '<div class="step" data-reveal style="transition-delay:' + i * 90 + 'ms"><div class="step__disc"><img' + (s[1] ? ' class="mask"' : '') + ' loading="lazy" src="' + clay(s[0]) + '" alt=""><span class="step__n">' + (i + 1) + '</span></div><h3 class="h3">' + s[2] + '</h3><p>' + esc(s[3]) + '</p><div class="chips">' + s[4].map(function (c) { return '<a href="produits.html' + (c[0] ? '?f=' + c[0] : '') + '">' + c[1] + '</a>'; }).join('') + '</div></div>'; }).join('') + '</div></div>';

    if (robo) {
      var kr = GC.keyFigures(robo).slice(0, 3);
      var facts = ['Capteurs de dernière génération, caméras 3D et systèmes anti-collision.', 'Conforme à la norme EN IEC 63327 : détection et évitement des obstacles sans contact.', 'Ralentit ou s’arrête à l’approche d’une personne, puis reprend sa vitesse de travail.', 'Utilisable aussi en mode manuel, avec poignée extensible.'];
      $('#robo').innerHTML = '<div class="wrap"><div class="spot" data-reveal><div class="spot__copy"><span class="eyebrow"><i></i>Autolaveuse autonome</span><h2 class="h2" style="color:#fff">RoboClean G+, le nettoyage qui se pilote seul</h2><p class="lead">' + esc(robo.lead || '') + '</p>' +
        '<ul class="spot__list">' + facts.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
        '<div class="spot__kpis">' + kr.map(function (k) { return '<div><b>' + esc(k.v + (k.u ? ' ' + k.u : '')) + '</b><span>' + esc(k.l) + '</span></div>'; }).join('') + '</div>' +
        '<div class="cta__btns"><a class="btn" style="background:#fff;color:var(--teal)" href="produit.html?p=roboclean-g-plus">Voir la fiche technique ' + I.arrow + '</a><a class="btn btn--light" href="#" data-quote="roboclean-g-plus">Démonstration</a></div></div>' +
        '<div class="spot__media"><img loading="lazy" src="' + GC.sceneImg('hero-c') + '" alt="Autolaveuse autonome GRILLOO RoboClean G+"></div></div></div>';
    }
    $('#secteurs').innerHTML = '<div class="wrap"><div class="sec__head"><div><span class="eyebrow"><i></i>Secteurs</span><h2 class="h2">Pensées pour vos espaces</h2><p>Chaque secteur liste les machines dont la fiche catalogue mentionne cet usage.</p></div></div>' + sectorCards() + '</div>';
    $('#a-propos').innerHTML = '<div class="wrap">' + aboutBlock(false) + '</div>';
    $('#garantie-cta').innerHTML = '<div class="wrap" style="display:grid;gap:24px">' + warranty() + cta() + '</div>';
    GC.reveal();
  }

  /* ---------- NOS PRODUITS ---------- */
  function produits() {
    chrome('prod');
    var fs = GC.param('f'), q = GC.param('q') || '', f0 = GC.family(fs);
    $('#phead').innerHTML = '<div class="wrap"><nav class="crumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>/</span>' + (f0 ? '<a href="produits.html">Nos produits</a><span>/</span><span>' + esc(f0.plural || f0.name) + '</span>' : '<span>Nos produits</span>') + '</nav>' +
      '<div class="phead__grid" style="margin-top:20px"><div class="phead__copy"><span class="eyebrow"><i></i>' + (f0 ? esc(f0.label || f0.name) : 'Catalogue 2024') + '</span><h1 class="h1">' + (f0 ? esc(f0.plural || f0.name) : 'Nos produits') + '</h1><p class="lead">' + esc(f0 ? GC.famIntro(f0) : ((G.brand && G.brand.cover && G.brand.cover.text) || '')) + '</p>' +
      '<div class="stats"><div><b>' + (f0 ? GC.familyStats(f0.slug).count : st.products) + '</b><span>machines</span></div>' + (f0 ? '' : '<div><b>' + st.families + '</b><span>familles</span></div>') + '</div></div>' +
      (f0 ? '<div class="pd__stage" style="max-width:420px;width:100%;justify-self:center"><img src="' + GC.img(GC.heroOf(f0.slug)) + '" alt=""></div>' : '<img class="phead__ill float" src="' + clay('about') + '" alt="">') + '</div></div>';
    $('#fbar').innerHTML = '<div class="wrap fbar__in"><div class="finder" id="pf"></div><nav class="chiprow" aria-label="Familles"><a class="all" href="produits.html"' + (!f0 ? ' aria-current="page"' : '') + '>Tout</a>' + G.families.map(function (f) { return '<a href="produits.html?f=' + f.slug + '"' + (f0 && f0.slug === f.slug ? ' aria-current="page"' : '') + '><img src="' + GC.img(GC.heroOf(f.slug)) + '" alt="">' + esc(f.plural || f.name) + '</a>'; }).join('') + '</nav></div>';
    function draw(query) {
      var nq = String(query || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
      var fams = f0 ? [f0] : G.families;
      var html = fams.map(function (f) {
        var list = GC.byFamily(f.slug).filter(function (p) { return !nq || (p.name + ' ' + p.kind + ' ' + f.name).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').indexOf(nq) > -1; });
        if (!list.length) return '';
        var m = famMeta(f);
        return '<section class="fsec" id="' + f.slug + '"><div class="wrap"><div class="fsec__head"><div><h2 class="h2" style="font-size:clamp(28px,2.8vw,40px)">' + esc(f.plural || f.name) + '</h2>' + (f0 ? '' : '<p>' + esc(GC.famIntro(f)) + '</p>') + '</div><div class="fsec__meta"><span><b>' + m.s.count + '</b> modèles</span>' + (m.r ? '<span><b>' + esc(m.r) + '</b></span>' : '') + '</div></div>' +
          '<div class="pgrid">' + list.map(function (p) { return '<a class="pcard" href="produit.html?p=' + p.slug + '" data-reveal><div class="pcard__media"><img loading="lazy" src="' + GC.img(p) + '" alt="' + esc((p.kind || '') + ' GRILLOO ' + p.name) + '"></div><div class="pcard__body"><div class="pcard__top"><b>' + esc(p.name) + '</b><span>' + esc(p.kind || '') + '</span></div><div class="kfs">' + GC.keyFigures(p).slice(0, 2).map(function (k) { return '<div><b>' + esc(k.v + (k.u ? ' ' + k.u : '')) + '</b><span>' + esc(k.l) + '</span></div>'; }).join('') + '</div></div></a>'; }).join('') + '</div></div></section>';
      }).join('');
      $('#plist').innerHTML = html || '<div class="wrap" style="padding:60px 0;text-align:center"><p class="lead" style="margin:0 auto">Aucune machine ne correspond à « ' + esc(query) + ' ».</p></div>';
      GC.reveal('.pcard[data-reveal]');
    }
    finder($('#pf'), { value: q, onInput: draw });
    $('#pf .btn').style.display = 'none';
    draw(q);
    var cta0 = $('#pcta'); if (cta0) cta0.innerHTML = '<div class="wrap">' + cta() + '</div>';
    GC.reveal();
  }

  /* ---------- FICHE PRODUIT ---------- */
  function produit() {
    chrome('prod');
    var p = GC.product(GC.param('p') || 'g9') || G.products[0], f = GC.family(p.family) || {};
    document.title = (p.kind || '') + ' GRILLOO ' + p.name + ' — fiche technique';
    var md = document.querySelector('meta[name=description]'); if (md) md.content = (p.lead || '').slice(0, 155);
    GC.productLd(p);
    var imgs = [p.img || p.slug].concat(p.imgAlt || []), kf = GC.keyFigures(p);
    var tabs = [['specs', 'Caractéristiques'], ['feat', 'Points forts'], ['acc', 'Accessoires'], ['desc', 'Description']];
    $('#pd').innerHTML = '<div class="wrap"><nav class="crumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>/</span><a href="produits.html">Nos produits</a><span>/</span><a href="produits.html?f=' + f.slug + '">' + esc(f.plural || f.name || '') + '</a><span>/</span><span>' + esc(p.name) + '</span></nav>' +
      '<div class="pd"><div class="pd__media"><div class="pd__stage"><img id="pimg" src="' + GC.img(imgs[0]) + '" alt="' + esc((p.kind || '') + ' GRILLOO ' + p.name) + '"></div>' + (imgs.length > 1 ? '<div class="pd__thumbs">' + imgs.map(function (s, i) { return '<button aria-pressed="' + (i === 0) + '" data-i="' + s + '"><img src="' + GC.img(s) + '" alt="Vue ' + (i + 1) + '"></button>'; }).join('') + '</div>' : '') + '</div>' +
      '<div class="pd__info"><span class="eyebrow"><i></i>' + esc(p.kind || f.name || '') + ' · Catalogue 2024, p. ' + (p.page || '—') + '</span><h1 class="h1">GRILLOO ' + esc(p.name) + '</h1><p class="lead">' + esc(p.lead || '') + '</p>' +
      '<div class="pd__kpis">' + kf.map(function (k) { return '<div><b>' + esc(k.v) + (k.u ? ' <small style="font-size:.6em">' + esc(k.u) + '</small>' : '') + '</b><span>' + esc(k.l) + '</span></div>'; }).join('') + '</div>' +
      '<div class="pd__btns"><a class="btn" href="#" data-quote="' + p.slug + '">Demander un devis ' + I.arrow + '</a><a class="btn btn--ghost" href="#" data-todo="Fiche PDF ' + esc(p.name) + '">Fiche PDF</a></div>' +
      '<div class="tabs" role="tablist">' + tabs.map(function (t, i) { return '<button role="tab" aria-selected="' + (i === 0) + '" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div><div id="ppanel" role="tabpanel"></div></div></div></div>';
    $$('.pd__thumbs button').forEach(function (b) { b.addEventListener('click', function () { $$('.pd__thumbs button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); var im = $('#pimg'); im.style.animation = 'none'; void im.offsetWidth; im.style.animation = ''; im.src = GC.img(b.dataset.i); }); });
    function tbl(rows) { return '<table class="specs">' + rows.map(function (s) { return '<tr><th scope="row">' + esc(s[0]) + '</th><td>' + esc(s[1]) + '</td></tr>'; }).join('') + '</table>'; }
    function ticks(l) { return l && l.length ? '<ul class="ticks">' + l.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '<p class="muted">Non précisé dans le catalogue.</p>'; }
    function panel(t) {
      var h = '';
      if (t === 'specs') { h = tbl(p.specs || []); (p.variants || []).forEach(function (v) { h += '<h3 class="h3" style="margin:26px 0 8px">Variante ' + esc(v.name) + '</h3>' + tbl(v.specs || []); }); }
      else if (t === 'feat') h = ticks(p.features);
      else if (t === 'acc') h = '<h3 class="h3" style="margin-bottom:12px">Accessoires standard</h3>' + ticks(p.accessories) + ((p.options || []).length ? '<h3 class="h3" style="margin:24px 0 12px">Options</h3>' + ticks(p.options) : '');
      else h = (p.description || []).map(function (x) { return '<p style="color:var(--ink-2)">' + esc(x) + '</p>'; }).join('') || '<p class="muted">' + esc(p.lead || '') + '</p>';
      $('#ppanel').innerHTML = '<div class="panel">' + h + '</div>';
    }
    $$('.tabs button').forEach(function (b) { b.addEventListener('click', function () { $$('.tabs button').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); }); panel(b.dataset.t); }); });
    panel('specs');
    var rel = GC.byFamily(p.family).filter(function (x) { return x !== p; }).slice(0, 4);
    $('#rel').innerHTML = rel.length ? '<div class="wrap"><div class="sec__head"><div><span class="eyebrow"><i></i>Même famille</span><h2 class="h2">' + esc(f.plural || f.name) + '</h2></div><a class="btn btn--ghost" href="produits.html?f=' + f.slug + '">Toute la famille ' + I.arrow + '</a></div><div class="pgrid">' +
      rel.map(function (x) { return '<a class="pcard" href="produit.html?p=' + x.slug + '"><div class="pcard__media"><img loading="lazy" src="' + GC.img(x) + '" alt=""></div><div class="pcard__body"><div class="pcard__top"><b>' + esc(x.name) + '</b><span>' + esc(x.kind || '') + '</span></div></div></a>'; }).join('') + '</div></div>' : '';
  }

  /* ---------- À PROPOS DE NOUS ---------- */
  function apropos() {
    chrome('about');
    var b = G.brand || {};
    $('#ab').innerHTML = '<section class="phead"><div class="wrap"><nav class="crumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>/</span><span>À propos de nous</span></nav>' +
      '<div class="phead__grid" style="margin-top:20px"><div class="phead__copy"><span class="eyebrow"><i></i>À propos de nous</span><h1 class="h1">Bienvenue dans l’univers <span class="hl">GRILLOO</span></h1><p class="lead">' + esc(b.intro || '') + '</p>' +
      '<div class="stats"><div><b>' + st.products + '</b><span>machines</span></div><div><b>' + st.families + '</b><span>familles</span></div><div><b>7</b><span>engagements</span></div></div></div><img class="phead__ill float" src="' + clay('about') + '" alt="Illustration : entrepôt, atelier et livraison"></div></div></section>' +
      '<section class="sec" style="padding-top:24px"><div class="wrap"><div class="spot" style="grid-template-columns:1fr" data-reveal><div class="spot__copy" style="align-items:center;text-align:center;padding:clamp(40px,6vw,88px)"><span class="eyebrow" style="align-self:center"><i></i>Notre objectif</span><h2 class="h2" style="color:#fff;max-width:20em">' + esc(b.mission || '') + '</h2><p class="lead" style="max-width:44em">' + esc(b.summary || '') + '</p></div></div></div></section>' +
      '<section class="sec sec--white"><div class="wrap"><div class="sec__head"><div><span class="eyebrow"><i></i>Nos engagements</span><h2 class="h2">Sept engagements, au cœur de chaque machine</h2></div></div><div class="vals" style="grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px">' +
      (b.values || []).map(function (v, i) { return '<div class="val val--full" data-reveal style="transition-delay:' + (i % 3) * 70 + 'ms"><img loading="lazy" src="' + clay('val-' + v.key) + '" alt=""><div><b style="font-size:18px">' + esc(v.title) + '</b><p>' + esc(v.text) + '</p></div></div>'; }).join('') + '</div></div></section>' +
      '<section class="sec"><div class="wrap"><div class="sec__head"><div><span class="eyebrow"><i></i>Pour tous les espaces</span><h2 class="h2">Du couloir d’hôpital à la voirie</h2><p>Les lieux d’usage cités par les fiches du catalogue.</p></div><a class="btn btn--ghost" href="produits.html">Nos produits ' + I.arrow + '</a></div>' + sectorCards() + '</div></section>' +
      '<section class="sec sec--white"><div class="wrap" style="display:grid;gap:24px">' + warranty() + '</div></section>' +
      '<section class="sec" style="padding-top:clamp(60px,7vw,96px)"><div class="wrap">' + cta() + '</div></section>';
    GC.reveal();
  }

  window.D = { home: home, produits: produits, produit: produit, apropos: apropos };
})();
