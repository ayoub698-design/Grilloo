/* Direction B — « Raclette ». */
(function () {
  'use strict';
  var $ = GC.$, $$ = GC.$$, esc = GC.esc, fmt = GC.fmt, G = GC.G;

  function chrome(cur) {
    var nav = [['Nos produits', 'produits.html', 'prod'], ['Catalogue', 'gamme.html', 'cat'], ['Le passage', 'index.html#passage', 'pass'], ['RoboClean G+', 'produit.html?p=roboclean-g-plus', 'robo'], ['À propos de nous', 'apropos.html', 'about'], ['Contact', null]];
    $('#hd').innerHTML = '<header class="hd" data-header><div class="wrap hd__in"><a class="hd__logo" href="index.html" aria-label="GRILLOO — accueil"><img src="' + GC.brand('logo-mark-white') + '" alt="GRILLOO" width="109" height="32"></a>' +
      '<nav class="hd__nav" data-menu aria-label="Navigation principale">' + nav.map(function (n) { return n[1] ? '<a href="' + n[1] + '"' + (n[2] === cur ? ' aria-current="page"' : '') + '>' + n[0] + '</a>' : '<a href="#" data-todo="' + n[0] + '">' + n[0] + '</a>'; }).join('') + '</nav>' +
      '<a class="btn btn--solid hd__cta" href="#" data-quote>Devis</a><button class="hd__burger" data-menu-btn aria-expanded="false" aria-label="Menu"><span></span><span></span></button></div></header>';
    $('#ft').innerHTML = '<footer class="ft"><div class="wrap"><div class="ft__grid"><div><img src="' + GC.brand('logo-lockup-white') + '" alt="GRILLOO — Leader des solutions de nettoyage" style="width:170px"><p style="max-width:26em;margin-top:18px">' + esc((G.brand && G.brand.mission) || '') + '</p><div class="ft__soc">' + GC.social() + '</div></div>' +
      '<div><h4>Gammes</h4><ul>' + G.families.map(function (f) { return '<li><a href="gamme.html?f=' + f.slug + '">' + esc(f.plural || f.name) + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><h4>GRILLOO</h4><ul><li><a href="gamme.html">Catalogue</a></li><li><a href="apropos.html">À propos de nous</a></li><li><a href="produits.html">Nos produits</a></li><li><a href="heros.html">Scènes Hero</a></li><li><a href="#" data-todo="Garantie & SAV">Garantie & SAV</a></li><li><a href="#" data-todo="Conseils">Conseils</a></li></ul></div>' +
      '<div><h4>Contact</h4><ul><li>' + esc((G.brand && G.brand.site) || 'www.grilloo.net') + '</li><li><a href="#" data-quote>Demander un devis</a></li><li><a href="../Catalogue-GRILLOO-2024.pdf">Catalogue 2024 (PDF)</a></li><li style="opacity:.6">Coordonnées : à fournir</li></ul></div></div>' +
      '<div class="ft__base"><span>© GRILLOO</span><span>Maquette · Direction B « Raclette »</span></div></div></footer>';
    GC.header();
    document.addEventListener('pointermove', function (e) { var b = e.target.closest && e.target.closest('.btn'); if (b) { var r = b.getBoundingClientRect(); b.style.setProperty('--mx', (e.clientX - r.left) + 'px'); } });
  }
  function refl(src) { return '<img src="' + src + '" alt=""><img class="refl" src="' + src + '" alt="" aria-hidden="true">'; }

  /* ---------- HOME ---------- */
  function home() {
    chrome('home');
    var g9 = GC.product('g9');
    if (g9 && $('#machine')) {
      $('#machine').innerHTML = refl(GC.img(g9));
      $('#machine img').alt = 'Autolaveuse autoportée GRILLOO G9';
      var kf = GC.keyFigures(g9);
      $('#label').innerHTML = '<span>Autoportée</span><b>GRILLOO G9</b><span>' + kf.slice(0, 2).map(function (k) { return k.v + ' ' + k.u; }).join(' · ') + '</span>';
    }
    var hero = $('.hero'), bg = $('.hero__bg'), spot = $('.hero__spot');
    if (hero && bg && spot) {
    GC.onScroll(function () { if (scrollY < innerHeight * 1.2) bg.style.setProperty('--py', (scrollY * .28) + 'px'); });
    hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); spot.style.setProperty('--sx', ((e.clientX - r.left) / r.width * 100) + '%'); spot.style.setProperty('--sy', Math.max(55, (e.clientY - r.top) / r.height * 100) + '%'); });
    }

    passage(); rail(); robot(); macro(); sectors();
    $$('.squeegee').forEach(function (s) { s.setAttribute('data-reveal', ''); });
    GC.reveal('[data-reveal], .squeegee');
  }

  function passage() {
    var el = $('#passage'); if (!el) return;
    var steps = [
      ['01 — Brosser', 'Le plateau de brosse décolle la salissure', 'Plateau en aluminium moulé sous pression sur la plupart des modèles. Pression de brosse de 8 kg sur l’autolaveuse compacte G01M jusqu’à 120 kg sur l’autoportée G100.'],
      ['02 — Aspirer', 'L’eau sale part directement au réservoir', 'Le moteur d’aspiration récupère la solution sale pendant le passage, avec arrêt différé pour vider le circuit. Jusqu’à 346 litres de réservoir de récupération sur la G100.'],
      ['03 — Sécher', 'Le suceur incurvé laisse un sol sec', 'Le suceur incurvé ramène l’eau vers l’aspiration pour un séchage exceptionnel. Ses lèvres se remplacent sans aucun outil.']
    ];
    $('#pass-steps').innerHTML = steps.map(function (s, i) { return '<div class="pass__step' + (i === 0 ? ' is-on' : '') + '"><span class="kick">' + s[0] + '</span><h3 class="disp d-m">' + s[1] + '</h3><p>' + s[2] + '</p></div>'; }).join('');
    $('#pass-dots').innerHTML = steps.map(function (_, i) { return '<i' + (i === 0 ? ' class="is-on"' : '') + '></i>'; }).join('');
    var passed = $('#passed'), blade = $('#blade'), bead = $('#bead'), rim = $('#rim'), sheen = $('#sheen'), meter = $('.pass__meter'), pct = $('#pass-pct');
    var stEls = $$('.pass__step'), dots = $$('#pass-dots i'), last = -1;
    GC.onScroll(function () {
      var p = GC.stickyProgress(el), e = Math.min(1, Math.max(0, (p - .05) / .9));
      var y = 1120 - e * 1380, b = 230;
      var curve = 'M-20,' + y + ' Q800,' + (y + b) + ' 1620,' + y;
      passed.setAttribute('d', 'M-20,1100 L' + curve.slice(1) + ' L1620,1100 Z');
      blade.setAttribute('d', curve); rim.setAttribute('d', 'M-20,' + (y - 9) + ' Q800,' + (y + b - 9) + ' 1620,' + (y - 9));
      bead.setAttribute('d', 'M-20,' + (y - 22) + ' Q800,' + (y + b - 22) + ' 1620,' + (y - 22));
      sheen.setAttribute('d', 'M-20,' + y + ' Q800,' + (y + b) + ' 1620,' + y + ' L1620,' + (y + 90) + ' Q800,' + (y + b + 90) + ' -20,' + (y + 90) + ' Z');
      meter.style.setProperty('--p', e.toFixed(3)); pct.textContent = Math.round(e * 100) + ' %';
      var i = Math.min(2, Math.floor(e * 3)); if (i !== last) { last = i; stEls.forEach(function (s, j) { s.classList.toggle('is-on', j === i); }); dots.forEach(function (d, j) { d.classList.toggle('is-on', j <= i); }); }
    });
  }

  function rail() {
    var track = $('#rail-track'), pin = $('#rail-pin'); if (!track) return;
    track.innerHTML = G.families.map(function (f, i) {
      var s = GC.familyStats(f.slug), h = GC.heroOf(f.slug);
      var r = s.prod ? ['Rendement', GC.rng(s.prod) + ' m²/h'] : s.tank ? ['Capacité', GC.rng(s.tank) + ' L'] : ['Modèles', ''];
      return '<a class="fam" href="gamme.html?f=' + f.slug + '"><span class="fam__n">' + String(i + 1).padStart(2, '0') + ' / ' + String(G.families.length).padStart(2, '0') + '</span>' +
        '<h3 class="disp fam__name">' + esc(f.plural || f.name) + '<small>' + s.count + ' modèle' + (s.count > 1 ? 's' : '') + '</small></h3>' +
        '<div class="fam__img">' + refl(GC.img(h)) + '</div>' +
        '<div class="fam__foot"><span>' + r[0] + '<b>' + r[1] + '</b></span><span class="fam__go">→</span></div></a>';
    }).join('');
    var mq = matchMedia('(max-width: 800px)');
    function size() { if (mq.matches) { pin.style.height = ''; return; } pin.style.height = (track.scrollWidth - innerWidth + innerHeight) + 'px'; }
    size(); addEventListener('resize', size); addEventListener('load', size);
    GC.onScroll(function () { if (mq.matches) return; var p = GC.stickyProgress(pin); track.style.transform = 'translate3d(' + (-p * (track.scrollWidth - innerWidth)) + 'px,0,0)'; });
  }

  function robot() {
    var p = GC.product('roboclean-g-plus'), wrap = $('#robo-plan'); if (!wrap || !p) return;
    $('#robo-lead').textContent = p.lead || '';
    var items = ['Capteurs de dernière génération, caméras 3D et systèmes de protection anti-collision.', 'Conforme à la norme EN IEC 63327 : détecte et évite les obstacles par « déplacement sans contact ».', 'Ralentit ou s’arrête à l’approche d’un obstacle ou d’une personne, puis reprend sa vitesse.', 'S’arrête immédiatement si une personne surgit devant la machine.', 'Données stockées sur des serveurs européens ; pixellisation ciblée des vidéos.'];
    $('#robo-list').innerHTML = items.map(function (t, i) { return '<li><span>' + String(i + 1).padStart(2, '0') + '</span>' + esc(t) + '</li>'; }).join('');
    var cv = $('canvas', wrap), ctx = cv.getContext('2d'), st = $('.robo__status', wrap), stT = $('b', st);
    var W = 800, H = 600, dpr = Math.min(2, devicePixelRatio || 1); cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
    var trail = document.createElement('canvas'); trail.width = W; trail.height = H; var tc = trail.getContext('2d');
    var mw = 54, ml = 74, pts = [], m = 70; for (var r = 0, y = m; y < H - m + 1; y += mw + 6, r++) { pts.push(r % 2 ? [W - m, y] : [m, y]); pts.push(r % 2 ? [m, y] : [W - m, y]); }
    var mach = { x: pts[0][0], y: pts[0][1], a: 0, i: 1, v: 0 }, person = null, SLOW = 150, STOP = 80;
    function loc(e) { var b = cv.getBoundingClientRect(); return { x: (e.clientX - b.left) / b.width * W, y: (e.clientY - b.top) / b.height * H }; }
    wrap.addEventListener('pointermove', function (e) { person = loc(e); });
    wrap.addEventListener('pointerdown', function (e) { person = loc(e); });
    wrap.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') person = null; });
    var state = '';
    function setState(s) { if (s === state) return; state = s; st.className = 'robo__status' + (s === 'slow' ? ' is-slow' : s === 'stop' ? ' is-stop' : ''); stT.textContent = s === 'stop' ? 'Arrêt — personne dans la zone de protection' : s === 'slow' ? 'Ralentissement — personne à proximité' : 'Vitesse de travail'; }
    function frame() {
      var t = pts[mach.i], dx = t[0] - mach.x, dy = t[1] - mach.y, d = Math.hypot(dx, dy);
      var target = 1.6, pd = person ? Math.hypot(person.x - mach.x, person.y - mach.y) : 1e9;
      if (pd < STOP) { target = 0; setState('stop'); } else if (pd < SLOW) { target = .45; setState('slow'); } else setState('run');
      mach.v += (target - mach.v) * .12; if (target === 0 && pd < STOP) mach.v = Math.min(mach.v, .05);
      var ta = Math.atan2(dy, dx), da = Math.atan2(Math.sin(ta - mach.a), Math.cos(ta - mach.a)); mach.a += da * .12;
      if (Math.abs(da) < .5) { var s = Math.min(mach.v, d); mach.x += Math.cos(mach.a) * s; mach.y += Math.sin(mach.a) * s; }
      if (d < 2) { mach.i = (mach.i + 1) % pts.length; if (mach.i === 0) { tc.clearRect(0, 0, W, H); mach.x = pts[0][0]; mach.y = pts[0][1]; mach.i = 1; } }
      tc.save(); tc.translate(mach.x, mach.y); tc.rotate(mach.a); tc.fillStyle = 'rgba(120, 220, 235, .07)'; tc.fillRect(-4, -mw / 2, 8, mw); tc.restore();
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#071419'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(150,205,215,.06)'; ctx.lineWidth = 1; for (var gx = 0; gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); } for (var gy = 0; gy < H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
      ctx.drawImage(trail, 0, 0);
      ctx.setLineDash([5, 6]); ctx.lineWidth = 1.2;
      ctx.strokeStyle = state === 'slow' ? 'rgba(242,178,58,.9)' : 'rgba(63,211,230,.45)'; ctx.beginPath(); ctx.arc(mach.x, mach.y, SLOW, 0, 7); ctx.stroke();
      ctx.strokeStyle = state === 'stop' ? 'rgba(255,91,91,.95)' : 'rgba(255,91,91,.4)'; ctx.beginPath(); ctx.arc(mach.x, mach.y, STOP, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      ctx.save(); ctx.translate(mach.x, mach.y); ctx.rotate(mach.a);
      ctx.fillStyle = '#8B9AA0'; roundRect(-ml / 2, -mw / 2 + 4, ml, mw - 8, 12); ctx.fill();
      ctx.fillStyle = '#5E6E74'; roundRect(-ml / 2 + 8, -mw / 2 + 10, ml - 34, mw - 20, 8); ctx.fill();
      ctx.strokeStyle = '#E2E8EA'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-ml / 2 - 6, -mw / 2 - 2); ctx.quadraticCurveTo(-ml / 2 - 16, 0, -ml / 2 - 6, mw / 2 + 2); ctx.stroke();
      ctx.fillStyle = '#3FD3E6'; ctx.beginPath(); ctx.arc(ml / 2 - 6, 0, 4, 0, 7); ctx.fill();
      ctx.restore();
      if (person) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(person.x, person.y, 7, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.arc(person.x, person.y, 16, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '500 13px "IBM Plex Mono", monospace'; ctx.fillText('Vous', person.x + 14, person.y - 12); }
      requestAnimationFrame(frame);
    }
    function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
    var started = false; new IntersectionObserver(function (en) { if (en[0].isIntersecting && !started) { started = true; requestAnimationFrame(frame); } }).observe(wrap);
  }

  function macro() {
    var el = $('#macro'); if (!el) return; var im = $('.macro__img', el), tx = $('.macro__txt', el);
    GC.onScroll(function () { var p = GC.stickyProgress(el), e = Math.min(1, p / .6); im.style.setProperty('--ci', (22 * (1 - e)).toFixed(2) + '%'); im.style.setProperty('--cr', (40 * (1 - e)).toFixed(1) + 'px'); im.style.setProperty('--cs', (1.15 - .15 * e).toFixed(3)); tx.style.setProperty('--qo', Math.min(1, Math.max(0, (p - .35) / .3)).toFixed(3)); });
  }

  function sectors() {
    var list = $('#sects-list'), view = $('#sects-view'); if (!list) return;
    var secs = GC.SECTORS.map(function (s) { return { s: s, l: GC.sectorProducts(s) }; }).filter(function (x) { return x.l.length; });
    list.innerHTML = secs.map(function (x, i) { return '<li><button role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '"><span class="disp">' + esc(x.s.short) + '</span><small>' + x.l.length + ' machine' + (x.l.length > 1 ? 's' : '') + '</small></button></li>'; }).join('');
    view.innerHTML = secs.map(function (x, i) { return '<img class="bg' + (i === 0 ? ' is-on' : '') + '" src="' + GC.amb(x.s.img) + '" alt="" loading="lazy">'; }).join('') + '<div class="sects__models" id="sects-models"></div>';
    function show(i) {
      $$('button', list).forEach(function (b, j) { b.setAttribute('aria-selected', String(j === i)); }); $$('img.bg', view).forEach(function (im, j) { im.classList.toggle('is-on', j === i); });
      $('#sects-models').innerHTML = secs[i].l.slice(0, 9).map(function (p) { return '<a href="produit.html?p=' + p.slug + '"><img src="' + GC.img(p) + '" alt="">' + esc(p.name) + '</a>'; }).join('');
      $('#sects-name').textContent = secs[i].s.name;
    }
    $$('button', list).forEach(function (b) { b.addEventListener('mouseenter', function () { show(+b.dataset.i); }); b.addEventListener('click', function () { show(+b.dataset.i); }); });
    show(0);
  }

  /* ---------- GAMME ---------- */
  function gamme() {
    chrome('cat');
    var f = GC.family(GC.param('f')), list = f ? GC.byFamily(f.slug) : G.products.slice();
    document.title = (f ? (f.plural || f.name) : 'Catalogue') + ' — GRILLOO';
    var s = GC.familyStats(f ? f.slug : '');
    $('#ghero').innerHTML = '<div class="wrap ghero__in"><div><nav class="crumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>/</span><a href="gamme.html">Catalogue</a>' + (f ? '<span>/</span><span>' + esc(f.plural || f.name) + '</span>' : '') + '</nav>' +
      '<span class="kick">' + (f ? list.length + ' modèle' + (list.length > 1 ? 's' : '') : list.length + ' machines · ' + G.families.length + ' familles') + '</span><h1 class="disp d-xl" style="margin-top:18px">' + esc(f ? f.plural || f.name : 'Le catalogue') + '</h1>' +
      '<p class="lead" style="margin:22px 0 40px">' + esc(f ? f.intro || '' : 'Toutes les machines GRILLOO 2024, de la monobrosse à la balayeuse de voirie.') + '</p></div>' +
      '<div class="ghero__img"><img src="' + GC.img(f ? GC.heroOf(f.slug) : 'g9') + '" alt=""></div></div><div class="ghero__floor"></div>';
    $('#chips').innerHTML = '<a href="gamme.html"' + (!f ? ' aria-current="page"' : '') + '>Tout</a>' + G.families.map(function (x) { return '<a href="gamme.html?f=' + x.slug + '"' + (f && f.slug === x.slug ? ' aria-current="page"' : '') + '>' + esc(x.plural || x.name) + '</a>'; }).join('');
    var energies = list.map(function (p) { return p.key.energy; }).filter(function (e, i, a) { return e && a.indexOf(e) === i; });
    var st = { e: 'all', sort: 'productivity' };
    $('#gtools').innerHTML = '<div class="chips" style="padding:0" id="en"><button aria-pressed="true" data-e="all">Toutes énergies</button>' + energies.map(function (e) { return '<button aria-pressed="false" data-e="' + e + '">' + e.charAt(0).toUpperCase() + e.slice(1) + '</button>'; }).join('') + '</div>' +
      '<select id="sort" aria-label="Trier"><option value="productivity">Rendement</option><option value="tank">Capacité</option><option value="weight">Poids</option><option value="page">Ordre du catalogue</option></select>';
    function draw() {
      var r = list.filter(function (p) { return st.e === 'all' || p.key.energy === st.e; }).sort(function (a, b) { return st.sort === 'page' ? (a.page || 0) - (b.page || 0) : (b.key[st.sort] || 0) - (a.key[st.sort] || 0); });
      $('#tiles').innerHTML = r.map(function (p) {
        return '<a class="tile" href="produit.html?p=' + p.slug + '" data-reveal><div class="tile__img">' + refl(GC.img(p)).replace('alt=""', 'alt="' + esc(p.kind + ' GRILLOO ' + p.name) + '" loading="lazy"') + '</div><div class="tile__body"><span class="tile__kind">' + esc(p.kind || '') + '</span><span class="disp tile__name">' + esc(p.name) + '</span>' +
          '<div class="tile__kv">' + GC.keyFigures(p).slice(0, 3).map(function (k) { return '<div><b>' + esc(k.v) + '</b><span>' + esc(k.u || '') + ' ' + esc(k.l) + '</span></div>'; }).join('') + '</div></div></a>';
      }).join('');
      GC.reveal('.tile[data-reveal]');
    }
    $$('#en button').forEach(function (b) { b.addEventListener('click', function () { st.e = b.dataset.e; $$('#en button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); draw(); }); });
    $('#sort').addEventListener('change', function (e) { st.sort = e.target.value; draw(); });
    draw();
  }

  /* ---------- PRODUIT ---------- */
  function produit() {
    chrome('cat');
    var p = GC.product(GC.param('p') || 'g9') || G.products[0], f = GC.family(p.family) || {};
    document.title = (p.kind || '') + ' GRILLOO ' + p.name + ' — GRILLOO'; GC.productLd(p);
    var kf = GC.keyFigures(p), pos = [['8%', '26%'], ['auto', '22%', '8%'], ['12%', '58%'], ['auto', '56%', '10%']];
    $('#pstage').innerHTML = '<span class="disp pstage__name" aria-hidden="true">' + esc(p.name) + '</span>' +
      '<div class="pstage__img">' + refl(GC.img(p)).replace('alt=""', 'alt="' + esc((p.kind || '') + ' GRILLOO ' + p.name) + '"') + '</div>' +
      '<div class="pstage__chips">' + kf.map(function (k, i) { var q = pos[i]; return '<div class="pchip" style="left:' + q[0] + ';top:' + q[1] + ';' + (q[2] ? 'right:' + q[2] + ';' : '') + 'animation-delay:' + (0.5 + i * .15) + 's"><b>' + esc(k.v) + ' <small style="font-size:.5em">' + esc(k.u) + '</small></b><span>' + esc(k.l) + '</span></div>'; }).join('') + '</div>' +
      '<div class="wrap pstage__head"><div><nav class="crumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>/</span><a href="gamme.html?f=' + f.slug + '">' + esc(f.plural || f.name || '') + '</a><span>/</span><span>' + esc(p.name) + '</span></nav><span class="kick">' + esc(p.kind || '') + ' · catalogue p.' + (p.page || '—') + '</span><h1 class="disp" style="margin-top:12px">GRILLOO ' + esc(p.name) + '</h1></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn--solid" href="#" data-quote="' + p.slug + '">Demander un devis</a><a class="btn" href="#" data-todo="Fiche PDF">Fiche PDF</a></div></div>';
    var nm = $('.pstage__name'); GC.onScroll(function () { nm.style.setProperty('--ny', (scrollY * .35) + 'px'); });
    var specs = '<table class="pspecs">' + (p.specs || []).map(function (s) { return '<tr><th scope="row">' + esc(s[0]) + '</th><td>' + esc(s[1]) + '</td></tr>'; }).join('') + '</table>';
    (p.variants || []).forEach(function (v) { specs += '<h3 class="disp d-m" style="margin:30px 0 8px">' + esc(v.name) + '</h3><table class="pspecs">' + (v.specs || []).map(function (s) { return '<tr><th scope="row">' + esc(s[0]) + '</th><td>' + esc(s[1]) + '</td></tr>'; }).join('') + '</table>'; });
    $('#pbody').innerHTML = '<div class="glass" data-reveal><span class="kick">Caractéristiques techniques</span><div style="margin-top:16px">' + specs + '</div></div>' +
      '<div style="display:grid;gap:20px;align-content:start"><div class="glass" data-reveal><p class="lead">' + esc(p.lead || '') + '</p>' + (p.description || []).slice(0, 3).map(function (d) { return '<p class="mut">' + esc(d) + '</p>'; }).join('') + '</div>' +
      ((p.features || []).length ? '<div class="glass" data-reveal><span class="kick">Points forts</span><ol class="pfeat" style="margin-top:16px">' + p.features.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></div>' : '') +
      ((p.accessories || []).length ? '<div class="glass" data-reveal><span class="kick">Accessoires standard</span><ol class="pfeat" style="margin-top:16px">' + p.accessories.concat(p.options || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></div>' : '') + '</div>';
    var rel = GC.byFamily(p.family).filter(function (x) { return x !== p; }).slice(0, 4);
    $('#rel').innerHTML = rel.length ? '<div class="wrap"><span class="kick">Même famille</span><h2 class="disp d-l" style="margin:14px 0 0">' + esc(f.plural || f.name) + '</h2><div class="tiles">' + rel.map(function (x) { return '<a class="tile" href="produit.html?p=' + x.slug + '"><div class="tile__img">' + refl(GC.img(x)) + '</div><div class="tile__body"><span class="tile__kind">' + esc(x.kind || '') + '</span><span class="disp tile__name">' + esc(x.name) + '</span></div></a>'; }).join('') + '</div></div>' : '';
    GC.reveal();
  }

  window.B = { home: home, gamme: gamme, produit: produit, chrome: chrome, refl: refl };
})();
