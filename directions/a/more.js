/* Direction A — hero scenes, À propos, Nos produits. Depends on a.js (window.A). */
(function () {
  'use strict';
  var $ = GC.$, $$ = GC.$$, esc = GC.esc, fmt = GC.fmt, G = GC.G;
  function figs(p, n) { return GC.keyFigures(p).slice(0, n || 3).map(function (k) { return '<div><b>' + esc(k.v) + (k.u ? ' ' + esc(k.u) : '') + '</b><span>' + esc(k.l) + '</span></div>'; }).join(''); }
  function switcher(items) {
    var nav = document.createElement('nav'); nav.className = 'hsw'; nav.setAttribute('aria-label', 'Scènes Hero');
    nav.innerHTML = items.map(function (it, i) { return '<a href="#' + it[0] + '"><b>H' + (i + 1) + '</b><span>' + esc(it[1]) + '</span></a>'; }).join('');
    document.body.appendChild(nav);
    var links = $$('a', nav);
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-on', l.getAttribute('href') === '#' + e.target.id); }); }); }, { threshold: .5 });
    items.forEach(function (it) { io.observe(document.getElementById(it[0])); });
  }
  function inView(el, cls) { new IntersectionObserver(function (en, o) { if (en[0].isIntersecting) { el.classList.add(cls || 'is-in'); o.disconnect(); } }, { threshold: .25 }).observe(el); }

  /* ---------- HERO SCENES ---------- */
  function heros() {
    A.chrome('heros');
    var sc = GC.SCENES.map(function (s) { s.prod = GC.product(s.p); return s; }).filter(function (s) { return s.prod; });

    /* H1 — planche photo */
    var h1 = $('#h1');
    h1.innerHTML = '<div class="wrap ha1__grid"><div class="ha1__copy"><span class="tab">Mise en situation</span><h1 class="h-xl">Chaque surface a sa machine.</h1>' +
      '<p class="lead">Entrepôt, couloir hospitalier, parking, hall en marbre, moquette d’hôtel, atelier : six lieux, six machines GRILLOO du catalogue 2024.</p>' +
      '<p class="ha1__place" id="h1-place"></p><div class="hero__ctas"><a class="btn" id="h1-cta" href="#">Voir la fiche <span class="arr">→</span></a><a class="btn btn--ghost" href="produits.html">Nos produits</a></div></div>' +
      '<div><div class="frame"><div class="frame__img">' + sc.map(function (s, i) { return '<img src="' + GC.sceneImg(s.id) + '" alt="' + esc((s.prod.kind || '') + ' GRILLOO ' + s.prod.name + ' — ' + s.place) + '"' + (i ? ' loading="lazy"' : '') + '>'; }).join('') + '</div>' +
      '<span class="frame__ref" id="h1-ref"></span><div class="frame__figs" id="h1-figs"></div></div>' +
      '<div class="thumbs">' + sc.map(function (s, i) { return '<button aria-pressed="false" data-i="' + i + '"><img src="' + GC.sceneImg(s.id) + '" alt=""><span>' + esc(s.prod.name) + '</span><i></i></button>'; }).join('') + '</div></div></div><span class="hlabel">H1 · Planche photo</span>';
    var cur = -1, timer, DUR = 6000;
    function show(i) {
      cur = i; var s = sc[i];
      $$('.frame__img img', h1).forEach(function (im, j) { im.classList.toggle('is-on', j === i); });
      $$('.thumbs button', h1).forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === i)); b.style.setProperty('--dur', DUR + 'ms'); });
      $('#h1-ref').textContent = 'GRILLOO ' + s.prod.name + ' · ' + s.place;
      var f = $('#h1-figs'); f.classList.remove('is-swap'); void f.offsetWidth; f.innerHTML = figs(s.prod, 3); f.classList.add('is-swap');
      $('#h1-place').textContent = s.title + ' — ' + (s.prod.kind || '') + ' ' + s.prod.name;
      $('#h1-cta').href = 'produit.html?p=' + s.prod.slug;
    }
    function auto() { clearInterval(timer); if (!GC.reduce) timer = setInterval(function () { show((cur + 1) % sc.length); }, DUR); }
    $$('.thumbs button', h1).forEach(function (b) { b.addEventListener('click', function () { show(+b.dataset.i); auto(); }); });
    show(0); auto();

    /* H2 — coupe technique */
    var g100 = GC.product('g100'), g01 = GC.product('g01m');
    var p100 = g100 && GC.spec(g100, /pression/i), p01 = g01 && GC.spec(g01, /pression/i);
    var st = GC.stats();
    var h2 = $('#h2');
    h2.innerHTML = '<div class="wrap"><div class="ha2__head"><div><p class="eyebrow">Le principe de l’autolaveuse</p><h2 class="h-xl" style="margin-top:14px">Laver, brosser, aspirer, <em>sécher.</em><br>Un seul passage.</h2></div>' +
      '<p>L’autolaveuse dépose la solution, brosse le sol puis récupère l’eau sale grâce à son suceur incurvé : le sol est sec derrière la machine.</p></div>' +
      '<div class="cut" id="cut"><img src="' + GC.sceneImg('illu-coupe') + '" alt="Schéma en coupe : solution, brosse, raclette et sol sec">' +
      '<div class="cut__pin cut__pin--top" style="left:4%;--l:40px"><code>01</code><b>Solution</b><span>Réservoir de solution et dosage du détergent.</span></div>' +
      '<div class="cut__pin cut__pin--bot" style="left:36%;--l:30px"><code>02</code><b>Brossage</b><span>Pression de brosse de ' + esc(p01 || '—') + ' (G01M) à ' + esc(p100 || '—') + ' (G100).</span></div>' +
      '<div class="cut__pin cut__pin--top" style="left:66%;--l:56px"><code>03</code><b>Aspiration</b><span>Le suceur incurvé ramène l’eau sale vers le réservoir de récupération.</span></div>' +
      '<div class="cut__pin cut__pin--bot" style="left:76%;--l:30px"><code>04</code><b>Sol sec</b><span>Un séchage exceptionnel, passage après passage.</span></div></div>' +
      '<div class="ha2__foot"><div><b>' + GC.familyStats('autolaveuses').count + '</b><span>autolaveuses accompagnées</span></div><div><b>' + GC.familyStats('autoportees').count + '</b><span>autolaveuses autoportées</span></div><div><b>' + GC.rng(GC.range(GC.byFamily('autolaveuses').concat(GC.byFamily('autoportees')), 'productivity')) + '</b><span>m²/h de rendement théorique</span></div><div><b>' + st.products + '</b><span>machines au catalogue</span></div></div></div><span class="hlabel" style="color:#6E858A">H2 · Coupe technique</span>';
    inView($('#cut'));

    /* H3 — bâtiment */
    var floors = [['sante', 30], ['logistique', 43], ['commerce', 55], ['hotellerie', 67], ['collectivites', 90]];
    var secs = floors.map(function (f) { var s = GC.SECTORS.filter(function (x) { return x.slug === f[0]; })[0]; return { s: s, y: f[1], l: GC.sectorProducts(s) }; });
    var h3 = $('#h3');
    h3.innerHTML = '<div class="wrap ha3__grid"><div class="ha3__copy"><span class="tab tab--cyan">Du sous-sol au dernier étage</span><h2 class="h-xl">Un bâtiment, toute la gamme.</h2>' +
      '<p class="lead">Touchez un étage : les machines dont la fiche catalogue cite ce lieu apparaissent.</p>' +
      '<div class="secpanel">' + secs.map(function (x, i) { return '<div class="secpanel__row" data-i="' + i + '"><code>' + String(i + 1).padStart(2, '0') + '</code><b>' + esc(x.s.short) + '</b><span>' + x.l.length + ' machines</span></div>'; }).join('') + '<div class="secpanel__models" id="h3-models" aria-live="polite"></div></div></div>' +
      '<div class="bld"><img src="' + GC.sceneImg('illu-batiment') + '" alt="Illustration isométrique d’un bâtiment : santé, logistique, commerce, hôtellerie, bureaux, rue">' +
      secs.map(function (x, i) { return '<button class="spot" style="left:' + (46 + (i % 2) * 14) + '%;top:' + x.y + '%" data-i="' + i + '" aria-pressed="false" aria-label="' + esc(x.s.name) + '">' + (i + 1) + '</button>'; }).join('') + '</div></div><span class="hlabel">H3 · Bâtiment interactif</span>';
    var sel = 0, t3;
    function pick(i) {
      sel = i; $$('.spot', h3).forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === i)); }); $$('.secpanel__row', h3).forEach(function (r, j) { r.classList.toggle('is-on', j === i); });
      $('#h3-models').innerHTML = secs[i].l.slice(0, 10).map(function (p, k) { return '<a href="produit.html?p=' + p.slug + '" style="animation-delay:' + (k * 40) + 'ms"><img src="' + GC.img(p) + '" alt="">' + esc(p.name) + '</a>'; }).join('');
    }
    $$('.spot, .secpanel__row', h3).forEach(function (b) { b.addEventListener('click', function () { clearInterval(t3); pick(+b.dataset.i); }); b.addEventListener('mouseenter', function () { clearInterval(t3); pick(+b.dataset.i); }); });
    pick(0); if (!GC.reduce) t3 = setInterval(function () { pick((sel + 1) % secs.length); }, 3200);

    var only = GC.param('h'); if (only) ['h1', 'h2', 'h3'].forEach(function (id) { if (id !== 'h' + only) document.getElementById(id).style.display = 'none'; });
    else switcher([['h1', 'Planche photo'], ['h2', 'Coupe technique'], ['h3', 'Bâtiment']]);
  }

  /* ---------- À PROPOS ---------- */
  function apropos() {
    A.chrome('about');
    var b = G.brand || {}, st = GC.stats();
    $('#ab').innerHTML =
      '<section class="ab-hero"><div class="wrap"><nav class="crumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>/</span><span>À propos de nous</span></nav>' +
      '<div class="ab-hero__grid"><div style="display:flex;flex-direction:column;gap:22px"><span class="tab">À propos de GRILLOO</span><h1 class="h-xl">Bienvenue dans l’univers GRILLOO</h1><p class="lead">' + esc(b.intro) + '</p>' +
      '<div class="hero__ctas"><a class="btn" href="produits.html">Nos produits <span class="arr">→</span></a><a class="btn btn--ghost" href="#" data-quote>Nous contacter</a></div></div>' +
      '<div class="frame"><div class="frame__img"><img src="' + GC.sceneImg('about-stock') + '" alt=""></div><span class="frame__ref">GRILLOO · ' + esc(b.tagline) + '</span></div></div></div></section>' +
      '<div class="ruler" id="ab-ruler"><div class="ruler__ticks"></div><div class="wrap ruler__row"><div class="ruler__cell"><b>' + st.products + '</b><span>machines au catalogue 2024</span></div><div class="ruler__cell"><b>' + st.families + '</b><span>familles de matériels</span></div><div class="ruler__cell"><b>' + fmt(st.minProd, 0) + '–' + fmt(st.maxProd, 0) + '</b><span>m²/h de rendement théorique</span></div><div class="ruler__cell"><b>7</b><span>engagements de marque</span></div></div></div>' +
      '<section class="sec sec--ink mission"><span class="tri" style="right:7%;top:-40px" aria-hidden="true"></span><div class="wrap"><p class="eyebrow">Notre objectif</p><blockquote style="margin-top:18px">' + esc(b.mission).replace('partenaire de confiance', '<em>partenaire de confiance</em>') + '</blockquote><p>' + esc(b.summary) + '</p></div></section>' +
      '<section class="sec sec--white"><div class="wrap"><div class="sec__head"><div><p class="eyebrow">Nos engagements</p><h2 class="h-l" style="margin-top:10px">Sept points,<br>un cahier des charges</h2></div><p>Les engagements qui guident la conception de chaque machine GRILLOO.</p></div><div class="vals">' +
      (b.values || []).map(function (v, i) { return '<div class="val" data-reveal><code>SPEC-' + String(i + 1).padStart(2, '0') + '</code><h3>' + esc(v.title) + '</h3><p>' + esc(v.text) + '</p></div>'; }).join('') + '</div></div></section>' +
      '<section class="sec"><div class="wrap ab-spaces"><img src="' + GC.sceneImg('illu-batiment') + '" alt="Illustration d’un bâtiment aux usages multiples" data-reveal loading="lazy"><div><p class="eyebrow">Pour tous les espaces</p><h2 class="h-l" style="margin:10px 0 18px">Du couloir d’hôpital à la voirie</h2><p class="lead">Les fiches du catalogue citent ces lieux d’usage :</p>' +
      '<div class="secpanel" style="margin-top:20px">' + GC.SECTORS.map(function (s, i) { return '<div class="secpanel__row" style="cursor:default"><code>' + String(i + 1).padStart(2, '0') + '</code><b>' + esc(s.name) + '</b><span>' + GC.sectorProducts(s).length + '</span></div>'; }).join('') + '</div></div></div></section>' +
      '<section class="sec sec--white"><div class="wrap ab-split"><div class="frame"><div class="frame__img"><img src="' + GC.sceneImg('about-atelier') + '" alt="" loading="lazy"></div><span class="frame__ref">Pièces et entretien</span></div>' +
      '<div><p class="eyebrow">Garantie</p><h2 class="h-l" style="margin:10px 0 18px">Une garantie définie<br>produit par produit</h2><p class="lead">Les conditions détaillées de garantie sont précisées pour chaque équipement.</p><div class="war" style="margin-top:24px;border-top:1px solid var(--ink)">' +
      GC.WARRANTY.map(function (w) { return '<div><b>' + esc(w[0]) + '</b><span>' + esc(w[1]) + '</span></div>'; }).join('') + '</div></div></div></section>' +
      '<section class="band"><div class="wrap band__in"><div><p class="eyebrow" style="color:#E6FBFD">En résumé</p><h2 class="h-l" style="margin-top:12px;max-width:16em;font-size:clamp(28px,3.4vw,52px)">' + esc(b.closing) + '</h2></div><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn" href="#" data-quote>Demander un devis <span class="arr">→</span></a><a class="btn btn--ghost" href="../Catalogue-GRILLOO-2024.pdf">Catalogue PDF</a></div></div></section>';
    var ticks = $('#ab-ruler .ruler__ticks'); GC.onScroll(function () { ticks.style.setProperty('--rx', (-scrollY * .25 % 100) + 'px'); });
    GC.reveal();
  }

  /* ---------- NOS PRODUITS ---------- */
  function produits() {
    A.chrome('prod');
    var b = G.brand || {}, st = GC.stats();
    $('#np').innerHTML = '<div class="wrap"><nav class="crumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>/</span><span>Nos produits</span></nav>' +
      '<header class="np-head"><div><span class="tab">Nos produits</span><h1 class="h-xl" style="margin-top:20px">' + st.families + ' familles,<br>' + st.products + ' machines</h1></div><div><p class="lead">' + esc((b.cover && b.cover.text) || '') + '</p><p style="margin-top:18px"><a class="btn" href="gamme.html">Tout le catalogue filtrable <span class="arr">→</span></a></p></div></header></div>' +
      '<div class="np-nav"><div class="wrap"><nav class="ftabs" aria-label="Familles">' + G.families.map(function (f) { return '<a href="#' + f.slug + '">' + GC.icon(f.slug) + esc(f.plural || f.name) + '</a>'; }).join('') + '</nav></div></div>' +
      '<div id="np-list">' + G.families.map(function (f, i) {
        var s = GC.familyStats(f.slug), sc = GC.sceneOf(f.slug), hero = GC.product(GC.heroOf(f.slug));
        var vis = sc ? '<div class="np-visual" data-ref="GRILLOO ' + esc(GC.product(sc.p).name) + ' · ' + esc(sc.place) + '"><img class="photo" loading="lazy" src="' + GC.sceneImg(sc.id) + '" alt="' + esc(f.name + ' GRILLOO en situation') + '"></div>'
          : '<div class="np-visual np-visual--plate" data-ref="GRILLOO ' + esc(hero ? hero.name : '') + '"><img class="cutimg" loading="lazy" src="' + GC.img(GC.heroOf(f.slug)) + '" alt="' + esc(f.name + ' GRILLOO') + '"></div>';
        var stats = '<div><b>' + s.count + '</b><span>modèle' + (s.count > 1 ? 's' : '') + '</span></div>' + (s.prod ? '<div><b>' + GC.rng(s.prod) + '</b><span>m²/h</span></div>' : '') + (s.tank ? '<div><b>' + GC.rng(s.tank) + '</b><span>litres</span></div>' : '');
        return '<section class="np-fam" id="' + f.slug + '"><div class="wrap"><div class="np-fam__grid"><div class="np-fam__copy" data-reveal><span class="np-fam__n">' + GC.icon(f.slug) + String(i + 1).padStart(2, '0') + ' / ' + String(G.families.length).padStart(2, '0') + ' · ' + esc(f.label || '') + '</span>' +
          '<h2>' + esc(f.plural || f.name) + '</h2><p>' + esc(GC.famIntro(f)) + '</p><div class="np-stats">' + stats + '</div><p><a class="btn" href="gamme.html?f=' + f.slug + '">Voir les ' + s.count + ' modèles <span class="arr">→</span></a></p></div>' + vis + '</div>' +
          '<div class="np-models">' + s.list.map(function (p) { var k = GC.keyFigures(p)[0]; return '<a href="produit.html?p=' + p.slug + '"><img loading="lazy" src="' + GC.img(p) + '" alt=""><b>' + esc(p.name) + '</b><span>' + (k ? esc(k.v + (k.u ? ' ' + k.u : '')) : '') + '</span></a>'; }).join('') + '</div></div></section>';
      }).join('') + '</div>';
    var tabs = $$('.np-nav a');
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) tabs.forEach(function (t) { var on = t.getAttribute('href') === '#' + e.target.id; if (on) { t.setAttribute('aria-current', 'true'); var n = t.parentNode; n.scrollTo({ left: t.offsetLeft - n.clientWidth / 2 + t.clientWidth / 2, behavior: 'smooth' }); } else t.removeAttribute('aria-current'); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
    $$('.np-fam').forEach(function (s) { io.observe(s); });
    GC.reveal();
  }

  /* ---------- ACCUEIL : nouveau Hero + sections Nos produits / À propos de nous ---------- */
  function homeExtra() {
    var hx = $('#hx');
    if (hx) {
      var hots = [['g54', 14, 48, 0], ['g9', 47, 30, 0], ['gbe1200', 80, 62, 1]].map(function (h) { var p = GC.product(h[0]); return p ? { p: p, x: h[1], y: h[2], l: h[3] } : null; }).filter(Boolean);
      hx.innerHTML = '<div class="wrap ahx__grid"><div class="ahx__copy"><span class="tab">Catalogue de matériels de nettoyage 2024</span>' +
        '<h1 class="h-xl"><span><i>Nettoyez</i></span><span><i>avec</i></span><span><i>excellence.</i></span></h1>' +
        '<p class="typer">Des machines pour vos <b id="typer"></b></p>' +
        '<p class="lead">Autolaveuses, autoportées, balayeuses, aspirateurs industriels : ' + GC.stats().products + ' machines GRILLOO, des solutions fiables, ergonomiques et durables.</p>' +
        '<div class="hero__ctas"><a class="btn" href="produits.html">Nos produits <span class="arr">→</span></a><a class="btn btn--ghost" href="#guide">Trouver ma machine</a></div>' +
        '<div class="ahx__strip">' + G.families.slice(0, 5).map(function (f) { return '<span>' + esc(f.plural || f.name) + '</span>'; }).join('') + '<span>+ ' + (G.families.length - 5) + ' familles</span></div></div>' +
        '<div class="ahx__media"><img src="' + GC.sceneImg('hero-a') + '" alt="Autolaveuse G54, autoportée G9 et balayeuse GBE1200 GRILLOO">' +
        hots.map(function (h, i) { var k = GC.keyFigures(h.p)[0]; return '<a class="hot' + (h.l ? ' hot--l' : '') + '" href="produit.html?p=' + h.p.slug + '" style="left:' + h.x + '%;top:' + h.y + '%;animation-delay:' + (1.4 + i * .25) + 's"><span class="hot__dot"></span><span class="hot__card"><small>' + esc(h.p.kind || '') + '</small><b>' + esc(h.p.name) + '</b><span>' + (k ? esc(k.v + (k.u ? ' ' + k.u : '')) + ' · ' + esc(k.l.toLowerCase()) : '') + '</span></span></a>'; }).join('') + '</div></div>';
      var hs = ('.hot', hx), hi = 0; function hot() { hs.forEach(function (h, j) { h.classList.toggle('is-on', j === hi); }); hi = (hi + 1) % hs.length; } setTimeout(function () { hot(); if (!GC.reduce) setInterval(hot, 2600); }, 2200);
      var words = ['entrepôts', 'hôpitaux', 'parkings', 'halls en marbre', 'hôtels', 'ateliers', 'voiries'], wi = 0, ci = 0, del = false, tEl = $('#typer');
      (function type() { var w = words[wi]; if (GC.reduce) { tEl.textContent = w; return; } ci += del ? -1 : 1; tEl.textContent = w.slice(0, ci); var wait = del ? 40 : 85; if (!del && ci === w.length) { del = true; wait = 1600; } else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; wait = 300; } setTimeout(type, wait); })();
    }
    var np = $('#nos-produits');
    if (np) {
      np.innerHTML = '<div class="wrap"><div class="sec__head"><div><p class="eyebrow">Nos produits</p><h2 class="h-l" style="margin-top:10px">' + GC.stats().families + ' familles,<br>' + GC.stats().products + ' machines</h2></div>' +
        '<p>Du lavage des sols durs au séchage des moquettes, de l’aspiration industrielle à la voirie. <a href="produits.html" style="font-weight:700;color:var(--cyan-ink)">Voir tous nos produits →</a></p></div><div class="hp-grid">' +
        G.families.map(function (f, i) {
          var s = GC.familyStats(f.slug), sc = GC.sceneOf(f.slug), r = s.prod ? GC.rng(s.prod) + ' m²/h' : s.tank ? GC.rng(s.tank) + ' L' : '';
          var m = sc ? '<div class="hp-card__m"><img class="photo" loading="lazy" src="' + GC.sceneImg(sc.id) + '" alt="' + esc(f.name + ' GRILLOO en situation') + '">' : '<div class="hp-card__m is-plate"><img class="cutimg" loading="lazy" src="' + GC.img(GC.heroOf(f.slug)) + '" alt="' + esc(f.name + ' GRILLOO') + '">';
          return '<a class="hp-card" href="produits.html#' + f.slug + '" data-reveal style="transition-delay:' + (i % 5) * 60 + 'ms">' + m + '<span class="hp-card__n">' + String(i + 1).padStart(2, '0') + ' · ' + s.count + ' modèle' + (s.count > 1 ? 's' : '') + '</span></div><div class="hp-card__b"><b>' + esc(f.plural || f.name) + '</b><span>' + esc(r) + '</span><i>Découvrir →</i></div></a>';
        }).join('') + '</div></div>';
    }
    var ab = $('#a-propos');
    if (ab) {
      var b = G.brand || {}, v = (b.values || []).slice(0, 3);
      ab.innerHTML = '<div class="wrap hab"><div class="hab__media" data-reveal><div class="ph ph--big"><img loading="lazy" src="' + GC.sceneImg('about-atelier') + '" alt="Atelier d’entretien : brosses, raclettes, filtres"></div><div class="ph ph--small"><img loading="lazy" src="' + GC.sceneImg('about-stock') + '" alt="Entrepôt de stock"></div><span class="badge">GRILLOO · ' + esc(b.tagline || '') + '</span></div>' +
        '<div style="display:flex;flex-direction:column;gap:20px"><p class="eyebrow">À propos de nous</p><h2 class="h-l">Le partenaire de confiance du nettoyage</h2><p class="lead">' + esc(b.intro || '') + '</p>' +
        '<div class="hab__vals">' + v.map(function (x, i) { return '<div><code>SPEC-0' + (i + 1) + '</code><b>' + esc(x.title) + '</b></div>'; }).join('') + '</div>' +
        '<div class="hero__ctas"><a class="btn" href="apropos.html">En savoir plus sur GRILLOO <span class="arr">→</span></a><a class="btn btn--ghost" href="#" data-quote>Nous contacter</a></div></div></div>';
    }
    GC.reveal();
  }

  A.heros = heros; A.apropos = apropos; A.produits = produits; A.homeExtra = homeExtra;
})();
