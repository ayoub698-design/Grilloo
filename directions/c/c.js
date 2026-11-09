/* Direction C — « Disque ». */
(function () {
  'use strict';
  var $ = GC.$, $$ = GC.$$, esc = GC.esc, fmt = GC.fmt, G = GC.G;

  function chrome(cur) {
    var nav = [['Nos produits', 'produits.html', 'prod'], ['Catalogue', 'gamme.html', 'cat'], ['Choisir', 'index.html#choisir', 'ch'], ['Rénovation', 'index.html#renovation', 'ren'], ['À propos de nous', 'apropos.html', 'about'], ['Contact', null]];
    $('#hd').innerHTML = '<header class="hd" data-header><div class="hd__in"><a class="hd__logo" href="index.html" aria-label="GRILLOO — accueil"><img src="' + GC.brand('logo-mark-cyan') + '" alt="GRILLOO" width="102" height="30"></a>' +
      '<nav class="hd__nav" data-menu aria-label="Navigation principale">' + nav.map(function (n) { return n[1] ? '<a href="' + n[1] + '"' + (n[2] === cur ? ' aria-current="page"' : '') + '>' + n[0] + '</a>' : '<a href="#" data-todo="' + n[0] + '">' + n[0] + '</a>'; }).join('') + '</nav>' +
      '<a class="btn hd__cta" href="#" data-quote>Devis <span class="dot">→</span></a><button class="hd__burger" data-menu-btn aria-expanded="false" aria-label="Menu"><span></span><span></span></button></div></header>';
    $('#ft').innerHTML = '<footer class="ft"><div class="wrap"><div class="ft__grid"><div><img src="' + GC.brand('logo-lockup-white') + '" alt="GRILLOO — Leader des solutions de nettoyage" style="width:170px"><p style="max-width:26em;margin-top:18px">' + esc((G.brand && G.brand.closing) || '') + '</p><div class="ft__soc">' + GC.social() + '</div></div>' +
      '<div><h4>Gammes</h4><ul>' + G.families.map(function (f) { return '<li><a href="gamme.html?f=' + f.slug + '">' + esc(f.plural || f.name) + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><h4>GRILLOO</h4><ul><li><a href="gamme.html">Catalogue</a></li><li><a href="index.html#choisir">Bien choisir</a></li><li><a href="apropos.html">À propos de nous</a></li><li><a href="produits.html">Nos produits</a></li><li><a href="heros.html">Scènes Hero</a></li><li><a href="#" data-todo="Garantie & SAV">Garantie & SAV</a></li></ul></div>' +
      '<div><h4>Contact</h4><ul><li>' + esc((G.brand && G.brand.site) || 'www.grilloo.net') + '</li><li><a href="#" data-quote>Demander un devis</a></li><li><a href="../Catalogue-GRILLOO-2024.pdf">Catalogue 2024 (PDF)</a></li><li style="opacity:.6">Coordonnées : à fournir</li></ul></div></div>' +
      '<div class="ft__base"><span>© GRILLOO</span><span>Maquette · Direction C « Disque »</span></div></div></footer>';
    GC.header();
  }

  function fringe(el, color) {
    var n = 180, s = '';
    for (var i = 0; i < n; i++) { var x = (i + Math.random() * .6) / n * 1440, h = 16 + Math.random() * 40, c = i % 3 ? 'var(--teal)' : 'var(--cyan)', o = (.25 + Math.random() * .55).toFixed(2), r = (Math.random() * 8 - 4).toFixed(1);
      s += '<line x1="' + x.toFixed(1) + '" y1="64" x2="' + (x + (Math.random() * 6 - 3)).toFixed(1) + '" y2="' + (64 - h).toFixed(1) + '" stroke="' + c + '" stroke-opacity="' + o + '" stroke-width="1.6" style="--r:' + r + 'deg;animation-delay:-' + (Math.random() * 3).toFixed(2) + 's"/>'; }
    el.innerHTML = s;
  }

  /* ---------- HOME ---------- */
  function home() {
    chrome('home');
    dial();
    $$('.fringe').forEach(function (f) { fringe(f); });
    marquee(); choose(); marble(); vacuum(); sectors(); values(); closer();
    GC.reveal();
  }

  function dial() {
    var root = $('#dial'); if (!root) return;
    var fams = G.families, n = fams.length, step = 360 / n, cur = 0, timer, R = 40.5;
    root.innerHTML = '<div class="dial__ring"></div><div class="dial__bristles"></div><div class="dial__rot" id="dial-rot">' +
      fams.map(function (f, i) { var a = i * step * Math.PI / 180; return '<button class="dial__btn" style="left:' + (50 + R * Math.sin(a)).toFixed(2) + '%;top:' + (50 - R * Math.cos(a)).toFixed(2) + '%;margin:-6.5% 0 0 -6.5%" data-i="' + i + '" aria-label="' + esc(f.plural || f.name) + '" aria-pressed="false">' + GC.icon(f.slug) + '</button>'; }).join('') +
      '</div><a class="dial__core" id="dial-core" href="#"><img alt=""><b></b><span></span></a><span class="dial__notch" aria-hidden="true"></span>';
    var rot = $('#dial-rot'), core = $('#dial-core'), im = $('img', core), angle = 0;
    function show(i, user) {
      if (user) clearInterval(timer);
      var d = ((i - cur) % n + n) % n; if (d > n / 2) d -= n; angle -= d * step; cur = (i + n) % n;
      rot.style.transform = 'rotate(' + angle + 'deg)';
      $$('.dial__btn .gc-ico', rot).forEach(function (ic) { ic.style.setProperty('--counter', (-angle) + 'deg'); });
      $$('.dial__btn', rot).forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === cur)); });
      var f = fams[cur], s = GC.familyStats(f.slug);
      im.classList.add('is-out');
      setTimeout(function () { im.src = GC.img(GC.heroOf(f.slug)); im.alt = f.plural || f.name; im.onload = function () { im.classList.remove('is-out'); }; }, 220);
      $('b', core).textContent = f.plural || f.name; $('span', core).textContent = s.count + ' modèle' + (s.count > 1 ? 's' : '') + (s.prod ? ' · jusqu’à ' + fmt(s.prod[1], 0) + ' m²/h' : '');
      core.href = 'gamme.html?f=' + f.slug;
      var hf = $('#hero-fam'); if (hf) { hf.href = core.href; hf.innerHTML = GC.icon(f.slug) + '<div><b>' + esc(f.plural || f.name) + '</b><span>' + esc(f.intro ? f.intro.split('. ')[0].slice(0, 90) + '…' : s.count + ' modèles') + '</span></div>'; }
    }
    $$('.dial__btn', rot).forEach(function (b) { b.addEventListener('click', function () { show(+b.dataset.i, true); }); });
    var drag = null;
    root.addEventListener('pointerdown', function (e) { if (e.target.closest('.dial__btn,.dial__core')) return; var r = root.getBoundingClientRect(); drag = { cx: r.left + r.width / 2, cy: r.top + r.height / 2, a0: Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2), base: angle }; root.setPointerCapture(e.pointerId); rot.style.transition = 'none'; clearInterval(timer); });
    root.addEventListener('pointermove', function (e) { if (!drag) return; var a = Math.atan2(e.clientY - drag.cy, e.clientX - drag.cx); angle = drag.base + (a - drag.a0) * 180 / Math.PI; rot.style.transform = 'rotate(' + angle + 'deg)'; $$('.dial__btn .gc-ico', rot).forEach(function (ic) { ic.style.setProperty('--counter', (-angle) + 'deg'); }); });
    root.addEventListener('pointerup', function () { if (!drag) return; drag = null; rot.style.transition = ''; var i = Math.round(-angle / step); angle = -i * step; cur = ((i % n) + n) % n; show(cur); });
    show(0);
    if (!GC.reduce) timer = setInterval(function () { show(cur + 1); }, 4200);
  }

  function marquee() {
    var t = $('#marq'); if (!t) return;
    var list = ['g9', 'roboclean-g-plus', 'gs30', 'm43', 'gbe1200', 'gh46', 'g54', 'gp1800', 'gk180', 'ge30', 'g7', 'gs-tne3', 'gbe2500', 'gnh150'].map(GC.product).filter(Boolean);
    var html = list.map(function (p) { return '<a class="marq__item" href="produit.html?p=' + p.slug + '"><span><img src="' + GC.img(p) + '" alt="" loading="lazy"></span>' + esc(p.name) + '</a>'; }).join('');
    t.innerHTML = html + html;
    var x = 0, last = scrollY, boost = 0, hover = false;
    t.addEventListener('mouseenter', function () { hover = true; }); t.addEventListener('mouseleave', function () { hover = false; });
    (function loop() { var dy = scrollY - last; last = scrollY; boost = boost * .9 + Math.abs(dy) * .08; if (!hover && !GC.reduce) { x -= .6 + boost; var w = t.scrollWidth / 2; if (-x > w) x += w; t.style.transform = 'translate3d(' + x + 'px,0,0)'; } requestAnimationFrame(loop); })();
  }

  function choose() {
    var el = $('#steps'); if (!el) return;
    var st = GC.stats(), lo = G.products.filter(function (p) { return p.key.productivity === st.minProd; })[0], hi = G.products.filter(function (p) { return p.key.productivity === st.maxProd; })[0];
    var en = {}; G.products.forEach(function (p) { if (p.key.energy) en[p.key.energy] = (en[p.key.energy] || 0) + 1; });
    var L = function (href, t) { return '<a href="' + href + '">' + esc(t) + '</a>'; };
    var steps = [
      ['Quel sol ?', 'Sol dur, moquette ou extérieur : chaque famille répond à un type de surface.', L('gamme.html?f=autolaveuses', 'Autolaveuses') + L('gamme.html?f=monobrosses', 'Monobrosses') + L('gamme.html?f=injecteurs', 'Injecteurs-extracteurs') + L('gamme.html?f=balayeuses', 'Balayeuses')],
      ['Quelle surface ?', 'Le rendement en m²/h de chaque fiche permet de dimensionner la machine.', '<p style="margin:0 0 8px">De ' + fmt(st.minProd, 0) + ' m²/h' + (lo ? ' (' + esc(lo.name) + ')' : '') + ' à ' + fmt(st.maxProd, 0) + ' m²/h' + (hi ? ' (' + esc(hi.name) + ')' : '') + '.</p>' + L('gamme.html?f=autoportees', 'Voir les autoportées')],
      ['Quel encombrement ?', 'Largeur de passage, rayon de braquage et poids selon vos allées.', '<p style="margin:0 0 8px">Rayon de braquage de 1,3 m sur l’autoportée G7 ; conception compacte de la G5 pour les espaces restreints.</p>' + L('produit.html?p=g7', 'G7') + L('produit.html?p=g5', 'G5')],
      ['Quelle énergie ?', 'Batterie, secteur, manuel ou pneumatique : selon l’accès à une prise.', '<p style="margin:0 0 8px">' + Object.keys(en).map(function (k) { return en[k] + ' ' + k; }).join(' · ') + '</p>' + L('gamme.html', 'Tout le catalogue')]
    ];
    el.innerHTML = steps.map(function (s, i) { return '<button class="step" aria-expanded="' + (i === 0) + '" data-reveal><span class="step__n"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30"/></svg>' + (i + 1) + '</span><h3>' + s[0] + '</h3><p>' + s[1] + '</p><div class="step__more"><div><div class="step__links">' + s[2] + '</div></div></div></button>'; }).join('');
    $$('.step', el).forEach(function (b) { b.addEventListener('click', function (e) { if (e.target.closest('a')) return; $$('.step', el).forEach(function (x) { x.setAttribute('aria-expanded', String(x === b)); }); }); });
  }

  function marble() {
    var el = $('#pad'); if (!el) return;
    var S = [
      ['#16 · #30', 'Meulage initial', 'Diamant métallique #16 ou #30, selon la dureté du sol.'],
      ['#80 → #300', 'Meulage fin', 'Diamant métallique #80, #150 puis #300, par étapes.'],
      ['#50', 'Réparation des rayures', 'Tampons de polissage en résine #50 pour effacer les rayures laissées par les diamants métalliques.'],
      ['Durcisseur', 'Durcissement', 'Vaporiser le durcisseur et garder le sol humide pendant 2 heures. Si le sol l’absorbe rapidement, vaporiser à nouveau.'],
      ['#150 → #500', 'Polissage fin', 'Tampons de polissage en résine #150, #300, #500.'],
      ['#1000 → #3000', 'Polissage super fin', 'Tampons de polissage en résine #1000, #2000, #3000.'],
      ['Crème', 'Finition brillante', 'Appliquer la crème de polissage au balai à brosse, uniformément. Après séchage, terminer au brunissoir à grande vitesse GP1800 avec les tampons noirs DT021.']
    ];
    var n = S.length, cur = 0, R = 37;
    el.innerHTML = '<div class="pad__disc"></div><div class="pad__rot" id="pad-rot">' + S.map(function (s, i) { var a = i / n * Math.PI * 2; return '<span class="pad__lbl" style="left:' + (50 + R * Math.sin(a)).toFixed(2) + '%;top:' + (50 - R * Math.cos(a)).toFixed(2) + '%">' + esc(s[0]) + '</span>'; }).join('') + '</div><div class="pad__center"><b id="pad-n">1</b><span>étape sur ' + n + '</span></div><span class="pad__notch"></span>';
    var txt = $('#mstep'), dots = $('#mdots'); dots.innerHTML = S.map(function () { return '<i></i>'; }).join('');
    var turn = 0;
    function go(i) {
      var d = i - cur; cur = (i + n) % n; turn -= d * 360 / n;
      $('#pad-rot').style.transform = 'rotate(' + turn + 'deg)'; $('.pad__disc', el).style.transform = 'rotate(' + (turn * 2) + 'deg)';
      $$('.pad__lbl', el).forEach(function (l, j) { l.style.setProperty('--cr', (-turn) + 'deg'); l.classList.toggle('is-on', j === cur); });
      $('#pad-n').textContent = cur + 1;
      txt.innerHTML = '<span class="mstep__n">Étape ' + (cur + 1) + ' — ' + esc(S[cur][0]) + '</span><h3>' + esc(S[cur][1]) + '</h3><p>' + esc(S[cur][2]) + '</p>';
      $$('i', dots).forEach(function (d, j) { d.classList.toggle('is-on', j === cur); });
    }
    $('#mprev').addEventListener('click', function () { go(cur - 1); }); $('#mnext').addEventListener('click', function () { go(cur + 1); });
    go(0);
  }

  function vacuum() {
    var el = $('#vac'); if (!el) return;
    var s = GC.familyStats('aspirateurs'), disc = $('.vac__disc', el);
    $('#vac-img').src = GC.img('gs30');
    $('#vac-nums').innerHTML = '<div><b>' + s.count + '</b><span>modèles</span></div>' + (s.tank ? '<div><b>' + GC.rng(s.tank) + ' L</b><span>de cuve</span></div>' : '') + '<div><b>Inox · PVC</b><span>cuves</span></div>';
    GC.onScroll(function () { var p = GC.progress(el), e = Math.min(1, Math.max(0, (p - .1) / .45)); disc.style.setProperty('--vs', (.72 + .28 * e).toFixed(3)); disc.style.setProperty('--vr', (-24 + 24 * e).toFixed(2) + 'deg'); });
  }

  function sectors() {
    var el = $('#sgrid'); if (!el) return;
    el.innerHTML = GC.SECTORS.map(function (s) { var l = GC.sectorProducts(s); if (!l.length) return ''; return '<a class="scirc" href="#" data-todo="Secteur — ' + esc(s.short) + '" data-reveal><span class="scirc__img"><img loading="lazy" src="' + GC.amb(s.img) + '" alt=""></span><b>' + esc(s.short) + '</b><span>' + l.length + ' machine' + (l.length > 1 ? 's' : '') + ' citée' + (l.length > 1 ? 's' : '') + '</span></a>'; }).join('');
  }

  function values() {
    var el = $('#vcloud'), card = $('#vcard'); if (!el) return; var v = (G.brand && G.brand.values) || [];
    el.innerHTML = v.map(function (x, i) { return '<button aria-pressed="' + (i === 0) + '" data-i="' + i + '">' + esc(x.title) + '</button>'; }).join('');
    function show(i) { $$('button', el).forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === i)); }); card.classList.remove('is-swap'); void card.offsetWidth; card.classList.add('is-swap'); card.innerHTML = '<span class="vcard__n">0' + (i + 1) + '</span><div><h3 class="t-m">' + esc(v[i].title) + '</h3><p>' + esc(v[i].text) + '</p></div>'; }
    $$('button', el).forEach(function (b) { b.addEventListener('click', function () { show(+b.dataset.i); }); });
    if (v.length) show(0);
  }

  function closer() {
    var el = $('#closer'); if (!el) return; var c = $('.closer__circle', el), t = $('.closer__txt', el);
    GC.onScroll(function () { var p = GC.stickyProgress(el); c.style.setProperty('--cs', (.16 + p * 2.4).toFixed(3)); t.style.setProperty('--co', Math.min(1, Math.max(0, (p - .3) / .25)).toFixed(3)); });
  }

  /* ---------- GAMME ---------- */
  function gamme() {
    chrome('cat');
    var f = GC.family(GC.param('f')), list = f ? GC.byFamily(f.slug) : G.products.slice();
    document.title = (f ? (f.plural || f.name) : 'Catalogue') + ' — GRILLOO';
    var s = { count: list.length, prod: GC.range(list, 'productivity'), tank: GC.range(list, 'tank') };
    $('#ghd').innerHTML = '<div class="wrap ghd__grid"><div><nav class="crumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>›</span><a href="gamme.html">Catalogue</a>' + (f ? '<span>›</span><span>' + esc(f.plural || f.name) + '</span>' : '') + '</nav>' +
      '<span class="pill"><i></i>' + esc(f ? (f.label || f.name) : 'Catalogue 2024') + '</span><h1 class="t-xl" style="margin-top:18px">' + esc(f ? f.plural || f.name : 'Toutes les machines') + '</h1><p class="lead" style="margin-top:20px">' + esc(f ? f.intro || '' : 'Les ' + list.length + ' machines GRILLOO, de la monobrosse à la balayeuse de voirie.') + '</p>' +
      '<div class="gstats"><div><b>' + s.count + '</b><span>modèles</span></div>' + (s.prod ? '<div><b>' + GC.rng(s.prod) + '</b><span>m²/h</span></div>' : '') + (s.tank ? '<div><b>' + GC.rng(s.tank) + '</b><span>litres</span></div>' : '') + '</div></div>' +
      '<div class="ghd__disc"><img src="' + GC.img(f ? GC.heroOf(f.slug) : 'g9') + '" alt=""></div></div><svg class="fringe" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true"></svg>';
    fringe($('#ghd .fringe'));
    $('#fp').innerHTML = '<a href="gamme.html"' + (!f ? ' aria-current="page"' : '') + '>Tout</a>' + G.families.map(function (x) { return '<a href="gamme.html?f=' + x.slug + '"' + (f && f.slug === x.slug ? ' aria-current="page"' : '') + '>' + GC.icon(x.slug) + esc(x.plural || x.name) + '</a>'; }).join('');
    var energies = list.map(function (p) { return p.key.energy; }).filter(function (e, i, a) { return e && a.indexOf(e) === i; });
    var st = { e: 'all', sort: 'productivity' };
    $('#fp2').innerHTML = '<button aria-pressed="true" data-e="all">Toutes énergies</button>' + energies.map(function (e) { return '<button aria-pressed="false" data-e="' + e + '">' + e.charAt(0).toUpperCase() + e.slice(1) + '</button>'; }).join('') +
      '<span style="flex:1"></span>' + [['productivity', 'Rendement'], ['tank', 'Capacité'], ['page', 'Catalogue']].map(function (o, i) { return '<button aria-pressed="' + (i === 0) + '" data-s="' + o[0] + '">↓ ' + o[1] + '</button>'; }).join('');
    function draw() {
      var r = list.filter(function (p) { return st.e === 'all' || p.key.energy === st.e; }).sort(function (a, b) { return st.sort === 'page' ? (a.page || 0) - (b.page || 0) : (b.key[st.sort] || 0) - (a.key[st.sort] || 0); });
      $('#cards').innerHTML = r.map(function (p) { return '<a class="ccard" href="produit.html?p=' + p.slug + '" data-reveal><div class="ccard__disc"><img loading="lazy" src="' + GC.img(p) + '" alt="' + esc((p.kind || '') + ' GRILLOO ' + p.name) + '"></div><div class="ccard__top"><span class="ccard__name">' + esc(p.name) + '</span><span class="ccard__kind">' + esc(p.kind || '') + '</span></div><div class="ccard__badges">' + GC.keyFigures(p).slice(0, 3).map(function (k) { return '<span><b>' + esc(k.v) + '</b> ' + esc(k.u || k.l) + '</span>'; }).join('') + '</div></a>'; }).join('');
      GC.reveal('.ccard[data-reveal]');
    }
    $$('#fp2 [data-e]').forEach(function (b) { b.addEventListener('click', function () { st.e = b.dataset.e; $$('#fp2 [data-e]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); draw(); }); });
    $$('#fp2 [data-s]').forEach(function (b) { b.addEventListener('click', function () { st.sort = b.dataset.s; $$('#fp2 [data-s]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); draw(); }); });
    draw();
  }

  /* ---------- PRODUIT ---------- */
  function produit() {
    chrome('cat');
    var p = GC.product(GC.param('p') || 'g9') || G.products[0], f = GC.family(p.family) || {};
    document.title = (p.kind || '') + ' GRILLOO ' + p.name + ' — GRILLOO'; GC.productLd(p);
    var kf = GC.keyFigures(p), pos = [['0%', '4%'], ['73%', '0%'], ['-2%', '68%'], ['74%', '70%']];
    $('#pgrid').innerHTML = '<div class="porbit"><span class="porbit__ring"></span><div class="porbit__disc"><img src="' + GC.img(p) + '" alt="' + esc((p.kind || '') + ' GRILLOO ' + p.name) + '"></div>' +
      kf.map(function (k, i) { return '<div class="badge" style="left:' + pos[i][0] + ';top:' + pos[i][1] + ';animation-delay:' + (.3 + i * .12) + 's"><b>' + esc(k.v) + (k.u ? ' ' + esc(k.u) : '') + '</b><span>' + esc(k.l) + '</span></div>'; }).join('') + '</div>' +
      '<div class="ptitle"><nav class="crumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>›</span><a href="gamme.html?f=' + f.slug + '">' + esc(f.plural || f.name || '') + '</a><span>›</span><span>' + esc(p.name) + '</span></nav>' +
      '<span class="pill"><i></i>' + esc(p.kind || '') + '</span><h1 class="t-xl">GRILLOO ' + esc(p.name) + '</h1><p class="lead">' + esc(p.lead || '') + '</p>' +
      '<div class="ctas"><a class="btn" href="#" data-quote="' + p.slug + '">Demander un devis <span class="dot">→</span></a><a class="btn btn--light" href="#" data-todo="Fiche PDF">Fiche PDF</a></div><span style="font-size:14px;color:var(--mute)">Catalogue GRILLOO 2024 · page ' + (p.page || '—') + '</span></div>';
    var specs = '<table class="cspecs">' + (p.specs || []).map(function (s) { return '<tr><th scope="row">' + esc(s[0]) + '</th><td>' + esc(s[1]) + '</td></tr>'; }).join('') + '</table>';
    (p.variants || []).forEach(function (v) { specs += '<h3 class="t-m" style="margin:26px 0 10px">' + esc(v.name) + '</h3><table class="cspecs">' + (v.specs || []).map(function (s) { return '<tr><th scope="row">' + esc(s[0]) + '</th><td>' + esc(s[1]) + '</td></tr>'; }).join('') + '</table>'; });
    $('#pcols').innerHTML = '<div class="box" data-reveal><h2>Caractéristiques techniques</h2>' + specs + '</div><div style="display:grid;gap:20px;align-content:start">' +
      ((p.features || []).length ? '<div class="box" data-reveal><h2>Points forts</h2><ol class="nlist">' + p.features.map(function (x) { return '<li><span>' + esc(x) + '</span></li>'; }).join('') + '</ol></div>' : '') +
      ((p.accessories || []).length ? '<div class="box" data-reveal><h2>Accessoires</h2><div class="achips">' + p.accessories.concat(p.options || []).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div></div>' : '') +
      ((p.description || []).length ? '<div class="box" data-reveal><h2>En détail</h2>' + p.description.map(function (d) { return '<p style="color:var(--ink-2)">' + esc(d) + '</p>'; }).join('') + '</div>' : '') + '</div>';
    var rel = GC.byFamily(p.family).filter(function (x) { return x !== p; }).slice(0, 4);
    $('#rel').innerHTML = rel.length ? '<div class="wrap"><div class="sec__head"><h2 class="t-l">Dans la même famille</h2><a class="btn btn--light" href="gamme.html?f=' + f.slug + '">Toute la gamme</a></div><div class="cards">' + rel.map(function (x) { return '<a class="ccard" href="produit.html?p=' + x.slug + '"><div class="ccard__disc"><img loading="lazy" src="' + GC.img(x) + '" alt=""></div><div class="ccard__top"><span class="ccard__name">' + esc(x.name) + '</span><span class="ccard__kind">' + esc(x.kind || '') + '</span></div></a>'; }).join('') + '</div></div>' : '';
    GC.reveal();
  }

  window.C = { home: home, gamme: gamme, produit: produit, chrome: chrome, fringe: fringe, values: values };
})();
