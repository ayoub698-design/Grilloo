/* Direction B — hero scenes, À propos, Nos produits. Depends on b.js (window.B). */
(function () {
  'use strict';
  var $ = GC.$, $$ = GC.$$, esc = GC.esc, fmt = GC.fmt, G = GC.G;
  function scenes() { return GC.SCENES.map(function (s) { s.prod = GC.product(s.p); return s; }).filter(function (s) { return s.prod; }); }
  function switcher(items) {
    var nav = document.createElement('nav'); nav.className = 'hsw'; nav.setAttribute('aria-label', 'Scènes Hero');
    nav.innerHTML = items.map(function (it, i) { return '<a href="#' + it[0] + '">B' + (i + 1) + '<span> · ' + esc(it[1]) + '</span></a>'; }).join('');
    document.body.appendChild(nav); var links = $$('a', nav);
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-on', l.getAttribute('href') === '#' + e.target.id); }); }); }, { threshold: .5 });
    items.forEach(function (it) { io.observe(document.getElementById(it[0])); });
  }

  /* ---------- HERO SCENES ---------- */
  function heros() {
    B.chrome('heros');
    var sc = scenes();

    /* B1 — cinéma */
    var h1 = $('#h1'), DUR = 7000, cur = -1, timer;
    h1.innerHTML = '<div class="hb1__slides">' + sc.map(function (s, i) { return '<img src="' + GC.sceneImg(s.id) + '" alt="' + esc((s.prod.kind || '') + ' GRILLOO ' + s.prod.name + ' — ' + s.place) + '"' + (i ? ' loading="lazy"' : '') + '>'; }).join('') + '</div>' +
      '<div class="hb1__card" id="b1-card"></div>' +
      '<div class="wrap hb1__in"><div class="hb1__copy"><span class="kick" id="b1-place"></span><h1 class="disp">Chaque lieu,<br><em>sa machine.</em></h1><p class="lead">Six machines du catalogue GRILLOO 2024, mises en situation là où elles travaillent.</p>' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--solid" id="b1-cta" href="#">Voir la fiche</a><a class="btn" href="produits.html">Nos produits</a></div></div>' +
      '<div class="hb1__tabs wrap">' + sc.map(function (s, i) { return '<button aria-pressed="false" data-i="' + i + '"><i></i><b>' + esc(s.prod.name) + '</b>' + esc(s.place) + '</button>'; }).join('') + '</div></div>' +
      '<span class="hlabel">B1 · Cinéma</span>';
    function show(i) {
      cur = i; var s = sc[i];
      $$('.hb1__slides img', h1).forEach(function (im, j) { im.classList.toggle('is-on', j === i); });
      $$('.hb1__tabs button', h1).forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === i)); b.style.setProperty('--dur', DUR + 'ms'); });
      $('#b1-place').textContent = s.place + ' · ' + s.title;
      $('#b1-cta').href = 'produit.html?p=' + s.prod.slug;
      var c = $('#b1-card'); c.classList.remove('is-swap'); void c.offsetWidth;
      c.innerHTML = '<span class="kick">' + esc(s.prod.kind || '') + '</span><b class="n">GRILLOO ' + esc(s.prod.name) + '</b><div class="k">' + GC.keyFigures(s.prod).slice(0, 4).map(function (k) { return '<div><b>' + esc(k.v) + ' <small style="font-size:.55em">' + esc(k.u) + '</small></b><span>' + esc(k.l) + '</span></div>'; }).join('') + '</div>';
      c.classList.add('is-swap');
    }
    function auto() { clearInterval(timer); if (!GC.reduce) timer = setInterval(function () { show((cur + 1) % sc.length); }, DUR); }
    $$('.hb1__tabs button', h1).forEach(function (b) { b.addEventListener('click', function () { show(+b.dataset.i); auto(); }); });
    show(0); auto();

    /* B2 — avant / après */
    var m43 = GC.product('m43'), h2 = $('#h2');
    h2.innerHTML = '<img src="' + GC.sceneImg('m43-marbre') + '" alt="Monobrosse GRILLOO M43 sur un sol en marbre">' +
      '<div class="hb2__before" aria-hidden="true"><img src="' + GC.sceneImg('m43-marbre') + '" alt=""></div>' +
      '<div class="hb2__bar"><span class="hb2__knob" aria-hidden="true">⟷</span></div>' +
      '<span class="hb2__tag hb2__tag--l">Avant</span><span class="hb2__tag hb2__tag--r">Après · GRILLOO M43</span>' +
      '<div class="hb2__copy"><div class="wrap"><div><span class="kick">Monobrosses</span><h2 class="disp" style="margin-top:14px">La brillance retrouvée.</h2><p class="lead" style="margin-top:16px">' + esc(m43 ? m43.lead : '') + '</p></div>' +
      '<a class="btn btn--solid" href="gamme.html?f=monobrosses">Voir les monobrosses</a></div></div><span class="hlabel">B2 · Avant / après — faites glisser</span>';
    var x = 88, drag = false, intro = true;
    function setX(v) { x = Math.max(3, Math.min(97, v)); h2.style.setProperty('--x', x + '%'); }
    function px(e) { var r = h2.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; }
    h2.addEventListener('pointerdown', function (e) { if (e.target.closest('a')) return; drag = true; intro = false; h2.setPointerCapture(e.pointerId); setX(px(e)); });
    h2.addEventListener('pointermove', function (e) { if (drag) setX(px(e)); else if (e.pointerType === 'mouse' && !intro) setX(px(e)); });
    h2.addEventListener('pointerup', function () { drag = false; });
    setX(88);
    new IntersectionObserver(function (en, o) { if (!en[0].isIntersecting) return; o.disconnect(); var t0 = performance.now(); (function step(t) { if (!intro) return; var k = Math.min(1, (t - t0) / 1800), e = 1 - Math.pow(1 - k, 3); setX(88 - 40 * e); if (k < 1) requestAnimationFrame(step); else intro = false; })(t0); }, { threshold: .5 }).observe(h2);

    /* B3 — mosaïque */
    var h3 = $('#h3');
    h3.innerHTML = '<div class="wrap"><div class="bento" id="bento">' + sc.map(function (s, i) { return '<a class="bento__t b' + (i + 1) + '" href="produit.html?p=' + s.prod.slug + '"><img src="' + GC.sceneImg(s.id) + '" alt="' + esc('GRILLOO ' + s.prod.name + ' — ' + s.place) + '" loading="lazy"><span><b>' + esc(s.prod.name) + '</b>' + esc(s.place) + '</span></a>'; }).join('') +
      '<div class="bento__c"><span class="kick">' + GC.stats().products + ' machines · ' + GC.stats().families + ' familles</span><h2 class="disp">Sur le terrain, partout.</h2><p class="mut" style="margin:0">Entrepôts, hôpitaux, parkings, hôtels, ateliers.</p><a class="btn btn--solid" href="produits.html">Nos produits</a></div></div></div><span class="hlabel">B3 · Mosaïque</span>';
    var bento = $('#bento');
    h3.addEventListener('pointermove', function (e) { if (GC.reduce) return; var r = h3.getBoundingClientRect(); bento.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3)); bento.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3)); });

    var only = GC.param('h'); if (only) ['h1', 'h2', 'h3'].forEach(function (id) { if (id !== 'h' + only) document.getElementById(id).style.display = 'none'; });
    else switcher([['h1', 'Cinéma'], ['h2', 'Avant / après'], ['h3', 'Mosaïque']]);
  }

  /* ---------- À PROPOS ---------- */
  function apropos() {
    B.chrome('about');
    var b = G.brand || {};
    $('#ab').innerHTML =
      '<section class="abh"><img src="' + GC.sceneImg('about-stock') + '" alt=""><div class="wrap"><nav class="crumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>/</span><span>À propos de nous</span></nav><span class="kick">À propos de GRILLOO</span><h1 class="disp" style="margin-top:16px">Bienvenue dans l’univers GRILLOO</h1><p class="lead">' + esc(b.intro) + '</p></div></section>' +
      '<svg class="squeegee" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true" style="background:var(--night)"><path class="fill" d="M0,120 L0,8 Q720,120 1440,8 L1440,120 Z"/><path class="rim" d="M0,8 Q720,120 1440,8"/></svg>' +
      '<section class="abm"><div class="wrap"><span class="kick">Notre objectif</span><blockquote>' + esc(b.mission).replace('partenaire de confiance', '<em>partenaire de confiance</em>') + '</blockquote><p>' + esc(b.summary) + '</p></div></section>' +
      '<section class="abv"><div class="wrap"><span class="kick">Nos engagements</span><h2 class="disp d-xl" style="margin-top:14px">Sept engagements</h2><div class="abv__grid">' +
      (b.values || []).map(function (v, i) { return '<article class="abv__c" data-reveal><span class="n">0' + (i + 1) + '</span><h3>' + esc(v.title) + '</h3><p>' + esc(v.text) + '</p></article>'; }).join('') + '</div></div></section>' +
      '<section class="abs"><div class="wrap abs__grid"><div class="abs__ill" data-reveal><img src="' + GC.sceneImg('illu-batiment') + '" alt="Illustration d’un bâtiment aux usages multiples" loading="lazy"></div><div><span class="kick">Pour tous les espaces</span><h2 class="disp d-l" style="margin:14px 0 24px">Du couloir d’hôpital à la voirie</h2>' +
      '<ul class="sects__list">' + GC.SECTORS.map(function (s) { return '<li><button style="cursor:default;color:#C9DADE"><span class="disp" style="font-size:clamp(24px,2.4vw,36px)">' + esc(s.short) + '</span><small>' + GC.sectorProducts(s).length + ' machines citées</small></button></li>'; }).join('') + '</ul></div></div></section>' +
      '<section class="abw"><div class="wrap"><div class="abw__grid"><div class="abw__img"><img src="' + GC.sceneImg('about-atelier') + '" alt="" loading="lazy"></div><div class="glass"><span class="kick">Garantie</span><h2 class="disp d-l" style="margin:14px 0 10px">Une garantie définie produit par produit</h2><p class="mut" style="margin:0">Les conditions détaillées de garantie sont précisées pour chaque équipement.</p><div class="abw__list">' +
      GC.WARRANTY.map(function (w) { return '<div><b>' + esc(w[0]) + '</b><span>' + esc(w[1]) + '</span></div>'; }).join('') + '</div></div></div></div></section>' +
      '<section class="close"><div class="wrap"><span class="kick">GRILLOO</span><h2 class="disp d-l" style="margin:16px auto 30px;max-width:14em">' + esc(b.closing) + '</h2><div class="btns"><a class="btn btn--solid" href="#" data-quote>Demander un devis</a><a class="btn" href="produits.html">Nos produits</a></div></div></section>';
    var img = $('.abh > img'); GC.onScroll(function () { if (scrollY < innerHeight) img.style.setProperty('--py', (scrollY * .3) + 'px'); });
    GC.reveal('[data-reveal], .squeegee');
  }

  /* ---------- NOS PRODUITS ---------- */
  function produits() {
    B.chrome('prod');
    var b = G.brand || {}, st = GC.stats();
    $('#np').innerHTML = '<header class="nph"><div class="wrap nph__grid"><div><nav class="crumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>/</span><span>Nos produits</span></nav><span class="kick">Nos produits</span><h1 class="disp" style="margin-top:16px">Nos produits</h1></div>' +
      '<div><p class="lead">' + esc((b.cover && b.cover.text) || '') + '</p><div class="nph__stats"><div><b>' + st.products + '</b><span>machines</span></div><div><b>' + st.families + '</b><span>familles</span></div><div><b>' + fmt(st.maxProd, 0) + '</b><span>m²/h max.</span></div></div></div></div></header>' +
      '<div class="npnav"><div class="wrap"><nav class="chips" aria-label="Familles">' + G.families.map(function (f) { return '<a href="#' + f.slug + '">' + esc(f.plural || f.name) + '</a>'; }).join('') + '</nav></div></div>' +
      G.families.map(function (f, i) {
        var s = GC.familyStats(f.slug), sc = GC.sceneOf(f.slug);
        var bg = sc ? '<img class="bg" loading="lazy" src="' + GC.sceneImg(sc.id) + '" alt="">' : '<div class="npf__cut">' + B.refl(GC.img(GC.heroOf(f.slug))) + '</div>';
        var r = s.prod ? GC.rng(s.prod) + ' m²/h' : s.tank ? GC.rng(s.tank) + ' L' : '';
        return '<section class="npf' + (sc ? '' : ' npf--plain') + '" id="' + f.slug + '">' + bg + '<div class="wrap"><div class="npf__copy"><span class="kick">' + String(i + 1).padStart(2, '0') + ' / ' + String(G.families.length).padStart(2, '0') + ' · ' + s.count + ' modèle' + (s.count > 1 ? 's' : '') + (r ? ' · ' + r : '') + '</span>' +
          '<h2 class="disp">' + esc(f.plural || f.name) + '</h2><p>' + esc(GC.famIntro(f)) + '</p><div><a class="btn btn--solid" href="gamme.html?f=' + f.slug + '">Voir les ' + s.count + ' modèles</a></div></div>' +
          '<div class="npf__strip">' + s.list.map(function (p) { var k = GC.keyFigures(p)[0]; return '<a href="produit.html?p=' + p.slug + '"><img loading="lazy" src="' + GC.img(p) + '" alt=""><b>' + esc(p.name) + '</b><span>' + (k ? esc(k.v + (k.u ? ' ' + k.u : '')) : '') + '</span></a>'; }).join('') + '</div></div></section>';
      }).join('');
    var tabs = $$('.npnav a');
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (!e.isIntersecting) return; e.target.classList.add('is-in'); tabs.forEach(function (t) { var on = t.getAttribute('href') === '#' + e.target.id; if (on) { t.setAttribute('aria-current', 'true'); var n = t.parentNode; n.scrollTo({ left: t.offsetLeft - n.clientWidth / 2 + t.clientWidth / 2, behavior: 'smooth' }); } else t.removeAttribute('aria-current'); }); }); }, { rootMargin: '-40% 0px -55% 0px' });
    $$('.npf').forEach(function (s) { io.observe(s); });
  }

  /* ---------- ACCUEIL : nouveau Hero + sections Nos produits / À propos de nous ---------- */
  function homeExtra() {
    var hx = $('#hx'), st = GC.stats(), g9 = GC.product('g9');
    if (hx && g9) {
      var kf = GC.keyFigures(g9), src = GC.sceneImg('hero-b');
      var chipPos = [['56%', '24%'], ['84%', '20%'], ['60%', '66%']];
      hx.innerHTML = '<div class="bhx__layer bhx__dirty" aria-hidden="true"><img src="' + src + '" alt=""></div>' +
        '<div class="bhx__layer bhx__clean"><img src="' + src + '" alt="Autolaveuse autoportée GRILLOO G9 dans un hall industriel, sol mouillé"></div>' +
        '<div class="bhx__blade" aria-hidden="true"><svg viewBox="0 0 90 1000" preserveAspectRatio="none"><defs><filter id="bglow" x="-50%" width="200%"><feGaussianBlur stdDeviation="6"/></filter></defs>' +
        '<path d="M70,0 Q20,500 70,1000" fill="none" stroke="#3FD3E6" stroke-width="10" filter="url(#bglow)" opacity=".8"/><path d="M70,0 Q20,500 70,1000" fill="none" stroke="#0B0F11" stroke-width="12"/><path d="M76,0 Q26,500 76,1000" fill="none" stroke="#3FD3E6" stroke-width="2.5"/>' +
        '<path d="M58,0 Q8,500 58,1000" fill="none" stroke="rgba(230,250,255,.35)" stroke-width="14" filter="url(#bglow)"/></svg></div>' +
        '<div class="bhx__spot" aria-hidden="true"></div>' +
        kf.slice(0, 3).map(function (k, i) { return '<div class="bhx__chip" style="left:' + chipPos[i][0] + ';top:' + chipPos[i][1] + '"><b>' + esc(k.v) + ' <small style="font-size:.5em">' + esc(k.u) + '</small></b><span>' + esc(k.l) + ' · G9</span></div>'; }).join('') +
        '<div class="wrap bhx__in"><div class="bhx__copy"><span class="kick">Leader des solutions de nettoyage</span><h1 class="disp"><span><i>La puissance</i></span><span><i>du nettoyage</i></span><span><i>entre vos mains.</i></span></h1>' +
        '<p class="lead">Autolaveuses, autoportées, balayeuses, aspirateurs industriels : ' + st.products + ' machines GRILLOO pensées pour des résultats impeccables à chaque passage.</p>' +
        '<div class="bhx__ctas"><a class="btn btn--solid" href="produits.html">Nos produits</a><a class="btn" href="produit.html?p=g9">Découvrir la G9</a></div></div></div>' +
        '<div class="bhx__bar"><div class="wrap"><span class="s"><b>' + st.products + '</b>machines</span><span class="s"><b>' + st.families + '</b>familles</span><a href="apropos.html"><b>7</b>engagements</a><span class="bhx__cue"><i></i>Faites défiler</span></div></div>';
      var layers = $$('.bhx__layer', hx), spot = $('.bhx__spot', hx);
      GC.onScroll(function () { if (scrollY < innerHeight * 1.2) layers.forEach(function (l) { l.style.setProperty('--py', (scrollY * .25) + 'px'); }); });
      hx.addEventListener('pointermove', function (e) { var r = hx.getBoundingClientRect(); spot.style.setProperty('--sx', ((e.clientX - r.left) / r.width * 100) + '%'); spot.style.setProperty('--sy', ((e.clientY - r.top) / r.height * 100) + '%'); });
    }
    var np = $('#nos-produits');
    if (np) {
      var withScene = G.families.filter(function (f) { return GC.sceneOf(f.slug); }), others = G.families.filter(function (f) { return !GC.sceneOf(f.slug); });
      var order = ['autoportees', 'autolaveuses', 'aspirateurs', 'balayeuses', 'monobrosses', 'injecteurs'];
      withScene.sort(function (a, b) { return order.indexOf(a.slug) - order.indexOf(b.slug); });
      np.innerHTML = '<div class="wrap"><div class="bnp__head"><div><span class="kick">Nos produits</span><h2 class="disp d-xl" style="margin-top:14px">' + st.families + ' familles,<br>' + st.products + ' machines</h2></div><a class="btn btn--solid" href="produits.html">Tous nos produits</a></div>' +
        '<div class="bnp__grid">' + withScene.map(function (f) { var s = GC.familyStats(f.slug), sc = GC.sceneOf(f.slug), r = s.prod ? GC.rng(s.prod) + ' m²/h' : s.tank ? GC.rng(s.tank) + ' L' : ''; return '<a class="bnp__t" href="produits.html#' + f.slug + '" data-reveal><img loading="lazy" src="' + GC.sceneImg(sc.id) + '" alt="' + esc(f.name + ' GRILLOO en situation') + '"><div><h3>' + esc(f.plural || f.name) + '<small>' + s.count + ' modèle' + (s.count > 1 ? 's' : '') + (r ? ' · ' + r : '') + '</small></h3><span class="go">→</span></div></a>'; }).join('') + '</div>' +
        '<div class="bnp__more">' + others.map(function (f) { var s = GC.familyStats(f.slug); return '<a href="produits.html#' + f.slug + '" data-reveal><img loading="lazy" src="' + GC.img(GC.heroOf(f.slug)) + '" alt=""><div><b>' + esc(f.plural || f.name) + '</b><span>' + s.count + ' modèle' + (s.count > 1 ? 's' : '') + '</span></div></a>'; }).join('') + '</div></div>';
    }
    var ab = $('#a-propos');
    if (ab) {
      var b = G.brand || {}, v = (b.values || []).slice(0, 3);
      ab.innerHTML = '<div class="wrap bab__grid"><div class="bab__media" data-reveal><img loading="lazy" src="' + GC.sceneImg('about-stock') + '" alt="Entrepôt de stock"><div class="ins"><img loading="lazy" src="' + GC.sceneImg('about-atelier') + '" alt="Atelier : brosses, raclettes, filtres"></div>' +
        '<div class="bab__stats"><div><b>' + st.products + '</b><span>machines</span></div><div><b>' + st.families + '</b><span>familles</span></div><div><b>7</b><span>engagements</span></div></div></div>' +
        '<div style="display:flex;flex-direction:column;gap:22px"><span class="kick">À propos de nous</span><h2 class="disp d-l">Le partenaire de confiance du nettoyage</h2><p class="lead">' + esc(b.intro || '') + '</p>' +
        '<ul class="bab__list">' + v.map(function (x, i) { return '<li><span>0' + (i + 1) + '</span><div><b>' + esc(x.title) + '</b><p>' + esc(x.text.split('. ')[0].replace(/\.$/, '')) + '.</p></div></li>'; }).join('') + '</ul>' +
        '<div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--solid" href="apropos.html">En savoir plus sur GRILLOO</a><a class="btn" href="#" data-quote>Nous contacter</a></div></div></div>';
      var im = $('.bab__media > img', ab); GC.onScroll(function () { var p = GC.progress(ab); im.style.setProperty('--py', ((p - .5) * 60).toFixed(1) + 'px'); });
    }
    GC.reveal();
  }

  B.heros = heros; B.apropos = apropos; B.produits = produits; B.homeExtra = homeExtra;
})();
