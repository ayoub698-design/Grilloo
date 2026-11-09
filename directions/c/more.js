/* Direction C — hero scenes, À propos, Nos produits. Depends on c.js (window.C). */
(function () {
  'use strict';
  var $ = GC.$, $$ = GC.$$, esc = GC.esc, fmt = GC.fmt, G = GC.G;
  function scenes() { return GC.SCENES.map(function (s) { s.prod = GC.product(s.p); return s; }).filter(function (s) { return s.prod; }); }
  function switcher(items) {
    var nav = document.createElement('nav'); nav.className = 'hsw'; nav.setAttribute('aria-label', 'Scènes Hero');
    nav.innerHTML = items.map(function (it, i) { return '<a href="#' + it[0] + '">C' + (i + 1) + '<span> · ' + esc(it[1]) + '</span></a>'; }).join('');
    document.body.appendChild(nav); var links = $$('a', nav);
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-on', l.getAttribute('href') === '#' + e.target.id); }); }); }, { threshold: .5 });
    items.forEach(function (it) { io.observe(document.getElementById(it[0])); });
  }
  var USED = [];
  /* First machine whose catalogue sheet cites the sector, preferring a family (each machine used once). */
  function cited(sector, fam) {
    var s = GC.SECTORS.filter(function (x) { return x.slug === sector; })[0]; if (!s) return null;
    var l = GC.sectorProducts(s).filter(function (p) { return USED.indexOf(p) < 0; }); var r = l.filter(function (p) { return p.family === fam; })[0] || l[0] || null; if (r) USED.push(r); return r;
  }

  /* ---------- HERO SCENES ---------- */
  function heros() {
    C.chrome('heros');
    var sc = scenes();

    /* C1 — orbite */
    var h1 = $('#h1'), n = sc.length, cur = 0, ang = 0, timer, R = 46;
    h1.innerHTML = '<div class="wrap hc1__grid"><div class="hc1__copy"><span class="pill"><i></i>Mise en situation</span><h1 class="t-xl">Chaque lieu a sa machine.</h1>' +
      '<p class="lead" id="c1-lead"></p><div class="hc1__badges" id="c1-badges"></div>' +
      '<div class="hero__ctas"><a class="btn" id="c1-cta" href="#">Voir la fiche <span class="dot">→</span></a><a class="btn btn--light" href="produits.html">Nos produits</a></div></div>' +
      '<div class="orb"><span class="orb__ring"></span><div class="orb__main">' + sc.map(function (s, i) { return '<img src="' + GC.sceneImg(s.id) + '" alt="' + esc('GRILLOO ' + s.prod.name + ' — ' + s.place) + '"' + (i ? ' loading="lazy"' : '') + '>'; }).join('') + '</div>' +
      '<div class="orb__rot" id="c1-rot">' + sc.map(function (s, i) { var a = (i + .5) / n * Math.PI * 2; return '<button class="orb__t" style="left:' + (50 + R * Math.sin(a)).toFixed(2) + '%;top:' + (50 - R * Math.cos(a)).toFixed(2) + '%" data-i="' + i + '" aria-pressed="false" aria-label="' + esc(s.prod.name + ' — ' + s.place) + '"><img src="' + GC.sceneImg(s.id) + '" alt=""></button>'; }).join('') + '</div>' +
      '<span class="orb__name" id="c1-name"></span></div></div><span class="hlabel">C1 · Orbite</span>';
    function show(i) {
      var d = ((i - cur) % n + n) % n; if (d > n / 2) d -= n; ang -= d * 360 / n; cur = (i + n) % n; var s = sc[cur];
      $('#c1-rot').style.transform = 'rotate(' + ang + 'deg)';
      $$('.orb__t', h1).forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === cur)); $('img', b).style.setProperty('--counter', (-ang) + 'deg'); });
      $$('.orb__main img', h1).forEach(function (im, j) { im.classList.toggle('is-on', j === cur); });
      $('#c1-name').textContent = 'GRILLOO ' + s.prod.name + ' · ' + s.place;
      $('#c1-lead').textContent = s.title + '. ' + (s.prod.lead || '');
      $('#c1-badges').innerHTML = GC.keyFigures(s.prod).slice(0, 3).map(function (k, j) { return '<span style="animation-delay:' + (j * 80) + 'ms"><b>' + esc(k.v) + (k.u ? ' ' + esc(k.u) : '') + '</b> ' + esc(k.l.toLowerCase()) + '</span>'; }).join('');
      $('#c1-cta').href = 'produit.html?p=' + s.prod.slug;
    }
    function auto() { clearInterval(timer); if (!GC.reduce) timer = setInterval(function () { show(cur + 1); }, 5200); }
    $$('.orb__t', h1).forEach(function (b) { b.addEventListener('click', function () { show(+b.dataset.i); auto(); }); });
    cur = 0; show(0); auto();

    /* C2 — ville */
    var pins = [
      { x: 33, y: 34, place: 'École', p: cited('collectivites', 'autolaveuses') },
      { x: 74, y: 40, place: 'Parking couvert', p: cited('logistique', 'balayeuses') },
      { x: 50, y: 50, place: 'Place piétonne', p: cited('collectivites', 'balayeuses') },
      { x: 66, y: 68, place: 'Marché couvert', p: cited('commerce', 'autoportees') },
      { x: 22, y: 80, place: 'Voirie', p: GC.product('gbe2500') }
    ].filter(function (x) { return x.p; });
    var h2 = $('#h2');
    h2.innerHTML = '<div class="wrap"><span class="pill"><i></i>Collectivités & espaces publics</span><h2 class="t-xl">La ville propre, de la place au parking.</h2><p class="lead">Écoles, places, parkings, marchés et voirie : les machines GRILLOO dont la fiche catalogue cite ces espaces.</p>' +
      '<div class="city"><img src="' + GC.sceneImg('illu-ville') + '" alt="Illustration isométrique d’un quartier : école, place, parking, marché, rue">' +
      pins.map(function (x, i) { return '<a class="pin" href="produit.html?p=' + x.p.slug + '" style="left:' + x.x + '%;top:' + x.y + '%;--dl:-' + (i * .6) + 's"><span class="pin__b"><img src="' + GC.img(x.p) + '" alt=""></span><span class="pin__l">' + esc(x.place) + '<small>' + esc(x.p.name) + '</small></span></a>'; }).join('') + '</div></div><span class="hlabel">C2 · Ville illustrée</span>';

    /* C3 — bulles */
    var spots = [[12, 22, 150], [26, 70, 120], [8, 52, 96], [86, 20, 130], [74, 72, 160], [92, 52, 100], [40, 14, 90], [60, 86, 96], [38, 86, 110], [64, 12, 104]];
    var h3 = $('#h3');
    h3.innerHTML = G.families.map(function (f, i) { var s = spots[i % spots.length]; return '<a class="bub" href="gamme.html?f=' + f.slug + '" style="--x:' + s[0] + '%;--y:' + s[1] + '%;--s:clamp(' + Math.round(s[2] * .55) + 'px,' + (s[2] / 14).toFixed(1) + 'vw,' + s[2] + 'px);--d:' + (10 + (i % 4) * 8) + 'px;--t:' + (7 + i % 5) + 's;--dl:-' + i + 's;--dx:' + (i % 2 ? 14 : -12) + 'px;--dy:' + (i % 3 ? -16 : 12) + 'px"><span class="bub__in"><img src="' + GC.img(GC.heroOf(f.slug)) + '" alt=""></span><span class="bub__l">' + esc(f.plural || f.name) + '</span></a>'; }).join('') +
      '<div class="hc3__center"><span class="pill"><i></i>' + GC.stats().families + ' familles · ' + GC.stats().products + ' machines</span><h2 class="t-xl">Toute la gamme,<br>en un coup d’œil.</h2><p class="lead">Survolez une bulle pour découvrir la famille, cliquez pour voir ses modèles.</p><a class="btn" href="produits.html">Nos produits <span class="dot">→</span></a></div><span class="hlabel">C3 · Bulles</span>';
    h3.addEventListener('pointermove', function (e) { if (GC.reduce) return; var r = h3.getBoundingClientRect(); h3.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3)); h3.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3)); });

    var only = GC.param('h'); if (only) ['h1', 'h2', 'h3'].forEach(function (id) { if (id !== 'h' + only) document.getElementById(id).style.display = 'none'; });
    else switcher([['h1', 'Orbite'], ['h2', 'Ville'], ['h3', 'Bulles']]);
  }

  /* ---------- À PROPOS ---------- */
  function apropos() {
    C.chrome('about');
    var b = G.brand || {}, st = GC.stats();
    $('#ab').innerHTML =
      '<section class="cab"><div class="wrap"><nav class="crumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>›</span><span>À propos de nous</span></nav><div class="cab__grid"><div style="display:flex;flex-direction:column;gap:22px"><span class="pill"><i></i>À propos de GRILLOO</span><h1 class="t-xl">Bienvenue dans l’univers GRILLOO</h1><p class="lead">' + esc(b.intro) + '</p><div class="hero__ctas"><a class="btn" href="produits.html">Nos produits <span class="dot">→</span></a><a class="btn btn--light" href="#" data-quote>Nous contacter</a></div></div>' +
      '<div class="cab__disc"><div><img src="' + GC.sceneImg('about-stock') + '" alt=""></div><span class="chip" style="left:-6%;top:12%"><b>' + st.products + '</b>machines</span><span class="chip" style="right:-4%;top:40%"><b>' + st.families + '</b>familles</span><span class="chip" style="left:4%;bottom:4%"><b>' + fmt(st.maxProd, 0) + ' m²/h</b>rendement max.</span></div></div></div>' +
      '<svg class="fringe" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true"></svg></section>' +
      '<section class="sec" style="padding-bottom:0"><div class="cmis" data-reveal><span class="pill"><i></i>Notre objectif</span><blockquote>' + esc(b.mission).replace('partenaire de confiance', '<em>partenaire de confiance</em>') + '</blockquote><p>' + esc(b.summary) + '</p></div></section>' +
      '<section class="sec"><div class="wrap"><div class="sec__head"><div><span class="pill"><i></i>Nos engagements</span><h2 class="t-l" style="margin-top:16px">Ce qui guide GRILLOO</h2></div><p>Sept engagements, au cœur de chaque machine.</p></div><div class="vcloud" id="vcloud"></div><div class="vcard" id="vcard"></div></div></section>' +
      '<section class="sec" style="background:var(--mist)"><div class="wrap ccity"><img src="' + GC.sceneImg('illu-ville') + '" alt="Illustration d’un quartier : école, place, parking, marché" data-reveal loading="lazy"><div><span class="pill"><i></i>Pour tous les espaces</span><h2 class="t-l" style="margin-top:16px">De l’hôpital à la place du marché</h2><ul>' +
      GC.SECTORS.map(function (s) { return '<li>' + esc(s.short) + '<b>' + GC.sectorProducts(s).length + ' machines</b></li>'; }).join('') + '</ul></div></div></section>' +
      '<section class="sec"><div class="wrap cwar"><div class="cwar__img"><img src="' + GC.sceneImg('about-atelier') + '" alt="" loading="lazy"></div><div class="box"><span class="pill"><i></i>Garantie</span><h2 class="t-l" style="margin:16px 0 10px;font-size:clamp(30px,3.4vw,48px)">Une garantie définie produit par produit</h2><p style="margin:0;color:var(--ink-2)">Les conditions détaillées de garantie sont précisées pour chaque équipement.</p><div class="cwar__grid">' +
      GC.WARRANTY.map(function (w) { return '<div><b>' + esc(w[0]) + '</b><span>' + esc(w[1]) + '</span></div>'; }).join('') + '</div></div></div></section>' +
      '<section class="ccta" data-reveal><h2>' + esc(b.closing) + '</h2><a class="btn" href="#" data-quote>Demander un devis <span class="dot">→</span></a></section>';
    C.fringe($('.cab .fringe')); C.values(); GC.reveal();
  }

  /* ---------- NOS PRODUITS ---------- */
  function produits() {
    C.chrome('prod');
    var b = G.brand || {}, st = GC.stats();
    $('#np').innerHTML = '<header class="ghd"><div class="wrap ghd__grid"><div><nav class="crumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>›</span><span>Nos produits</span></nav><span class="pill"><i></i>Nos produits</span><h1 class="t-xl" style="margin-top:18px">' + st.families + ' familles, ' + st.products + ' machines</h1><p class="lead" style="margin-top:20px">' + esc((b.cover && b.cover.text) || '') + '</p>' +
      '<div class="gstats"><div><b>' + st.products + '</b><span>machines</span></div><div><b>' + st.families + '</b><span>familles</span></div><div><b>' + GC.rng([st.minProd, st.maxProd]) + '</b><span>m²/h</span></div></div></div>' +
      '<div class="ghd__disc"><img src="' + GC.img('g9') + '" alt=""></div></div><svg class="fringe" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true"></svg></header>' +
      '<div class="cnp-nav"><div class="wrap"><nav class="fpills" aria-label="Familles">' + G.families.map(function (f) { return '<a href="#' + f.slug + '">' + GC.icon(f.slug) + esc(f.plural || f.name) + '</a>'; }).join('') + '</nav></div></div>' +
      '<div>' + G.families.map(function (f, i) {
        var s = GC.familyStats(f.slug), sc = GC.sceneOf(f.slug), h = GC.heroOf(f.slug);
        var vis = sc ? '<div class="disc"><img class="photo" loading="lazy" src="' + GC.sceneImg(sc.id) + '" alt="' + esc(f.name + ' GRILLOO en situation') + '"></div><span class="float"><img src="' + GC.img(sc.p) + '" alt=""></span>'
          : '<div class="disc"><img class="cut" loading="lazy" src="' + GC.img(h) + '" alt="' + esc(f.name + ' GRILLOO') + '"></div>';
        return '<section class="cnf" id="' + f.slug + '"><div class="wrap cnf__grid"><div class="cnf__vis" data-reveal>' + vis + '</div><div class="cnf__copy"><span class="pill"><i></i>' + String(i + 1).padStart(2, '0') + ' · ' + esc(f.label || f.name) + '</span><h2 class="t-l">' + esc(f.plural || f.name) + '</h2><p>' + esc(GC.famIntro(f)) + '</p>' +
          '<div class="gstats" style="margin-top:0"><div><b>' + s.count + '</b><span>modèle' + (s.count > 1 ? 's' : '') + '</span></div>' + (s.prod ? '<div><b>' + GC.rng(s.prod) + '</b><span>m²/h</span></div>' : '') + (s.tank ? '<div><b>' + GC.rng(s.tank) + '</b><span>litres</span></div>' : '') + '</div>' +
          '<div class="cnf__models">' + s.list.map(function (p) { return '<a href="produit.html?p=' + p.slug + '"><img loading="lazy" src="' + GC.img(p) + '" alt="">' + esc(p.name) + '</a>'; }).join('') + '</div>' +
          '<div><a class="btn" href="gamme.html?f=' + f.slug + '">Voir les ' + s.count + ' modèles <span class="dot">→</span></a></div></div></div></section>';
      }).join('') + '</div>';
    C.fringe($('.ghd .fringe'));
    var tabs = $$('.cnp-nav a');
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (!e.isIntersecting) return; tabs.forEach(function (t) { var on = t.getAttribute('href') === '#' + e.target.id; if (on) { t.setAttribute('aria-current', 'true'); var nn = t.parentNode; nn.scrollTo({ left: t.offsetLeft - nn.clientWidth / 2 + t.clientWidth / 2, behavior: 'smooth' }); } else t.removeAttribute('aria-current'); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
    $$('.cnf').forEach(function (s) { io.observe(s); });
    GC.reveal();
  }

  /* ---------- ACCUEIL : nouveau Hero + sections Nos produits / À propos de nous ---------- */
  function homeExtra() {
    var st = GC.stats(), hx = $('#hx'), robo = GC.product('roboclean-g-plus');
    if (hx && robo) {
      var sats = ['g9', 'gs30', 'm43', 'gbe1200', 'gh46', 'gp1800', 'g54', 'gk180'].map(GC.product).filter(Boolean), n = sats.length, R = 48;
      var kf = GC.keyFigures(robo);
      hx.innerHTML = '<div class="wrap chx__grid"><div class="chx__copy"><span class="pill"><i></i>Catalogue 2024 · Leader des solutions de nettoyage</span>' +
        '<h1 class="t-xl" aria-label="Nettoyez avec excellence."><span style="white-space:nowrap">Nett<span class="o" aria-hidden="true"></span>yez</span> avec <em>excellence.</em></h1>' +
        '<p class="lead">Des autolaveuses au robot autonome RoboClean G+ : ' + st.products + ' machines GRILLOO fiables, ergonomiques et durables, pour chaque surface.</p>' +
        '<div class="hero__ctas"><a class="btn" href="produits.html">Nos produits <span class="dot">→</span></a><a class="btn btn--light" href="produit.html?p=roboclean-g-plus">Découvrir le RoboClean G+</a></div>' +
        '<div class="chx__trust"><div class="av">' + ['g9', 'gs30', 'm43', 'gbe1200'].map(function (s) { return '<span><img src="' + GC.img(s) + '" alt=""></span>'; }).join('') + '</div><p><b>' + st.families + ' familles, ' + st.products + ' machines</b><br>du lavage à la voirie</p></div></div>' +
        '<div class="chx__stage"><span class="chx__ring2"></span><span class="chx__ring"></span><div class="chx__disc"><img src="' + GC.sceneImg('hero-c') + '" alt="Autolaveuse autonome GRILLOO RoboClean G+"></div>' +
        '<div class="chx__orbit">' + sats.map(function (p, i) { var a = i / n * Math.PI * 2; return '<a class="chx__sat" href="produit.html?p=' + p.slug + '" style="left:' + (50 + R * Math.sin(a)).toFixed(2) + '%;top:' + (50 - R * Math.cos(a)).toFixed(2) + '%" title="' + esc((p.kind || '') + ' ' + p.name) + '"><img src="' + GC.img(p) + '" alt="' + esc(p.name) + '"></a>'; }).join('') + '</div>' +
        kf.slice(0, 2).map(function (k, i) { var pos = i ? 'right:-2%;top:30%' : 'left:-4%;top:58%'; return '<div class="chx__badge" style="' + pos + ';animation-delay:' + (1 + i * .2) + 's"><b>' + esc(k.v) + (k.u ? ' ' + esc(k.u) : '') + '</b><span>' + esc(k.l) + '</span></div>'; }).join('') +
        '<a class="chx__name" href="produit.html?p=roboclean-g-plus">RoboClean G+<span>Autolaveuse autonome</span></a></div></div>' +
        '<svg class="fringe" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true"></svg>';
      C.fringe($('.fringe', hx));
    }
    var np = $('#nos-produits');
    if (np) {
      np.innerHTML = '<div class="wrap"><div class="sec__head"><div><span class="pill"><i></i>Nos produits</span><h2 class="t-l" style="margin-top:16px">' + st.families + ' familles, ' + st.products + ' machines</h2></div><a class="btn" href="produits.html">Tous nos produits <span class="dot">→</span></a></div><div class="cnp2__grid">' +
        G.families.map(function (f) { var s = GC.familyStats(f.slug), sc = GC.sceneOf(f.slug), r = s.prod ? GC.rng(s.prod) + ' m²/h' : s.tank ? GC.rng(s.tank) + ' L' : '';
          var m = sc ? '<img class="photo" loading="lazy" src="' + GC.sceneImg(sc.id) + '" alt="' + esc(f.name + ' GRILLOO en situation') + '">' : '<img class="cutimg" loading="lazy" src="' + GC.img(GC.heroOf(f.slug)) + '" alt="' + esc(f.name + ' GRILLOO') + '">';
          return '<a class="cnp2__c" href="produits.html#' + f.slug + '" data-reveal><span class="n">' + s.count + ' modèle' + (s.count > 1 ? 's' : '') + '</span><span class="cnp2__disc">' + m + '</span><b>' + esc(f.plural || f.name) + '</b><span>' + esc(r) + '</span></a>'; }).join('') + '</div></div>';
    }
    var ab = $('#a-propos');
    if (ab) {
      var b = G.brand || {};
      ab.innerHTML = '<div class="wrap cab2__grid"><div class="cab2__media" data-reveal><div class="big"><img loading="lazy" src="' + GC.sceneImg('about-stock') + '" alt="Entrepôt de stock"></div><div class="sm"><img loading="lazy" src="' + GC.sceneImg('about-atelier') + '" alt="Atelier : brosses, raclettes, filtres"></div><span class="chip"><b>' + st.products + '</b>machines au catalogue</span></div>' +
        '<div style="display:flex;flex-direction:column;gap:22px"><span class="pill"><i></i>À propos de nous</span><h2 class="t-l">Le partenaire de confiance du nettoyage</h2><p class="lead">' + esc(b.intro || '') + '</p>' +
        '<div class="cab2__vals">' + (b.values || []).map(function (v, i) { return '<span><i>' + (i + 1) + '</i>' + esc(v.title) + '</span>'; }).join('') + '</div>' +
        '<div class="hero__ctas"><a class="btn" href="apropos.html">En savoir plus <span class="dot">→</span></a><a class="btn btn--light" href="#" data-quote>Nous contacter</a></div></div></div>';
    }
    GC.reveal();
  }

  C.heros = heros; C.apropos = apropos; C.produits = produits; C.homeExtra = homeExtra;
})();
