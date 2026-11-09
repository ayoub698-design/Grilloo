/**
 * Dessins axonométriques au trait (projection isométrique 30°), un par secteur.
 * Chaque dessin est composé de volumes simples (boîtes, cylindres) tracés à la main en coordonnées 3D,
 * peints de l'arrière vers l'avant. Le tracé cyan pointillé figure le passage d'une machine.
 * Animation : classes .d (tracé) / .f (remplissage) / .o (fondu) pilotées par un ancêtre data-in.
 */
import type { ReactNode } from 'react';

type V3 = [number, number, number];
const T = '#0D5560', C = '#49B5BF';
const TONE = { top: '#FFFFFF', left: '#F2F6F7', right: '#E6EEEF', floor: '#FFFFFF' };

function makeIso(W: number, D: number, H: number, vw = 480, vh = 360, pad = 22) {
  const c = 0.8660254, sn = 0.5;
  const s = Math.min((vw - 2 * pad) / ((W + D) * c), (vh - 2 * pad) / ((W + D) * sn + H));
  const ox = pad + D * c * s + (vw - 2 * pad - (W + D) * c * s) / 2;
  const oy = pad + H * s + (vh - 2 * pad - ((W + D) * sn * s + H * s)) / 2;
  const P = (x: number, y: number, z: number): [number, number] => [ox + (x - y) * c * s, oy + (x + y) * sn * s - z * s];
  const pts = (l: V3[]) => l.map(([x, y, z]) => P(x, y, z).map((v) => v.toFixed(1)).join(',')).join(' ');
  let k = 0;
  const dl = () => ({ ['--d' as string]: `${Math.min(k++ * 28, 1800)}ms` });
  const els: ReactNode[] = [];
  const push = (e: ReactNode) => { els.push(e); };

  const poly = (l: V3[], fill: string, sw = 1, op = 1) => push(
    <polygon key={els.length} className="d f" pathLength={1} points={pts(l)} fill={fill} stroke={T} strokeWidth={sw} strokeOpacity={op} strokeLinejoin="round" style={dl()} />,
  );
  const line = (l: V3[], o: { op?: number; sw?: number; dash?: string; color?: string } = {}) => push(
    <polyline key={els.length} className={o.dash ? 'o' : 'd'} pathLength={o.dash ? undefined : 1} points={pts(l)} fill="none" stroke={o.color ?? T}
      strokeWidth={o.sw ?? 1} strokeOpacity={o.op ?? 1} strokeDasharray={o.dash} style={dl()} />,
  );
  /** Boîte : faces visibles +y (gauche), +x (droite), dessus. */
  const box = (x: number, y: number, z: number, w: number, d: number, h: number) => {
    poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], TONE.left);
    poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], TONE.right);
    poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], TONE.top);
  };
  /** Cylindre vertical. */
  const cyl = (x: number, y: number, z: number, r: number, h: number) => {
    const [cx, cy0] = P(x, y, z), cy1 = cy0 - h * s, rx = 1.2247 * r * s, ry = 0.7071 * r * s;
    push(<path key={els.length} className="d f" pathLength={1} fill={TONE.left} stroke={T}
      d={`M${cx - rx} ${cy1} V${cy0} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy0} V${cy1}`} style={dl()} />);
    push(<ellipse key={els.length} className="d f" pathLength={1} cx={cx} cy={cy1} rx={rx} ry={ry} fill={TONE.top} stroke={T} style={dl()} />);
  };
  /** Sphère (houppier d'arbre). */
  const ball = (x: number, y: number, z: number, r: number) => {
    const [cx, cy] = P(x, y, z);
    push(<circle key={els.length} className="d f" pathLength={1} cx={cx} cy={cy} r={r * s} fill={TONE.top} stroke={T} style={dl()} />);
  };
  /** Sol avec calepinage. */
  const floor = (step: number, x0 = 0, y0 = 0, x1 = W, y1 = D) => {
    poly([[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]], TONE.floor, 1.25);
    for (let x = x0 + step; x < x1; x += step) line([[x, y0, 0], [x, y1, 0]], { op: 0.18 });
    for (let y = y0 + step; y < y1; y += step) line([[x0, y, 0], [x1, y, 0]], { op: 0.18 });
  };
  /** Rectangle sur un plan vertical y = cte (ou x = cte). */
  const rectY = (y: number, x0: number, x1: number, z0: number, z1: number, fill = '#fff') => poly([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], fill);
  const rectX = (x: number, y0: number, y1: number, z0: number, z1: number, fill = '#fff') => poly([[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]], fill);
  /** Passage de machine (cyan pointillé animé + flèche). */
  const route = (l: V3[]) => {
    const [a, b] = [P(...l[l.length - 2]), P(...l[l.length - 1])];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const ah = (t: number) => `${b[0] + Math.cos(ang + t) * 9},${b[1] + Math.sin(ang + t) * 9}`;
    push(<g key={els.length} className="o" style={dl()}>
      <polyline points={pts(l)} fill="none" stroke={C} strokeWidth={6} strokeOpacity={0.16} strokeLinejoin="round" />
      <polyline className="pl-flow" points={pts(l)} fill="none" stroke={C} strokeWidth={1.5} strokeDasharray="6 6" strokeLinejoin="round" />
      <polygon points={`${b[0]},${b[1]} ${ah(Math.PI - 0.4)} ${ah(Math.PI + 0.4)}`} fill={C} />
    </g>);
  };
  const text = (x: number, y: number, z: number, t: string) => {
    const [px, py] = P(x, y, z);
    push(<text key={els.length} className="o" x={px} y={py} fontSize="10" fill={T} style={{ fontFamily: 'var(--font-geist-mono)', ...dl() }}>{t}</text>);
  };
  const walls = (h: number, t = 2) => { box(0, 0, 0, t, D, h); box(t, 0, 0, W - t, t, h); };

  return { P, s, poly, line, box, cyl, ball, floor, rectY, rectX, route, text, walls, els, W, D, H };
}

type Iso = ReturnType<typeof makeIso>;

/* ---------- Composants de scène ---------- */
function rack(g: Iso, x0: number, x1: number, y0: number, y1: number, levels = [0, 13, 26, 39], top = 44, fill: boolean[] = []) {
  const posts = [x0, x0 + (x1 - x0) / 3, x0 + (2 * (x1 - x0)) / 3, x1 - 1.6];
  posts.forEach((x) => g.box(x, y0, 0, 1.6, 1.6, top));
  levels.forEach((z, li) => {
    g.box(x0, y0, z + 0.1, x1 - x0, y1 - y0, 1.2);
    if (li === levels.length - 1) return;
    for (let b = 0; b < 3; b++) {
      if (fill[li * 3 + b] === false) continue;
      const bx = x0 + b * ((x1 - x0) / 3) + 3;
      g.box(bx, y0 + 2, z + 1.3, (x1 - x0) / 3 - 6, y1 - y0 - 4, 9);
    }
  });
  posts.forEach((x) => g.box(x, y1 - 1.6, 0, 1.6, 1.6, top));
}
function desk(g: Iso, x: number, y: number) {
  g.box(x, y, 0, 1.2, 14, 11); g.box(x + 24.8, y, 0, 1.2, 14, 11);
  g.box(x, y, 11, 26, 14, 1.2);
  g.box(x + 8, y + 1.5, 12.2, 10, 1, 7);
  g.box(x + 12.5, y + 20.5, 0, 1, 1, 6);
  g.box(x + 9, y + 17, 6, 8, 8, 1.2);
  g.box(x + 9, y + 24, 7.2, 8, 1.2, 8);
}

/* ---------- Scènes ---------- */
const scenes: Record<string, { caption: string; draw: () => Iso }> = {
  sante: { caption: 'Couloir de soins', draw: () => {
    const g = makeIso(150, 70, 36);
    g.floor(10); g.walls(36);
    [20, 62, 104].forEach((x) => { g.rectY(2.05, x, x + 14, 0, 24); g.line([[x + 11, 2.1, 11], [x + 12.5, 2.1, 11]]); });
    g.rectX(2.05, 32, 46, 0, 24);
    [[2, 20], [34, 62], [76, 104], [118, 150]].forEach(([a, b]) => g.line([[a, 2.6, 10], [b, 2.6, 10]], { sw: 1.4 }));
    g.box(50, 35, 0, 24, 11, 5); g.box(47, 34, 5, 28, 13, 4); g.box(45, 34, 5, 2, 13, 13);
    g.box(120, 38, 0, 11, 7, 12); g.box(119, 37, 12, 13, 9, 1);
    g.route([[8, 58, 0], [142, 58, 0]]);
    return g;
  } },
  logistique: { caption: 'Allée de rayonnages', draw: () => {
    const g = makeIso(150, 112, 50);
    g.floor(15); g.walls(50);
    g.rectY(2.05, 96, 124, 0, 30); [6, 12, 18, 24].forEach((z) => g.line([[96, 2.1, z], [124, 2.1, z]], { op: 0.5 }));
    rack(g, 10, 130, 8, 22, [0, 13, 26, 39], 44, [true, false, true, true, true, false, true, true, true]);
    g.route([[12, 44, 0], [140, 44, 0]]);
    rack(g, 10, 130, 64, 78, [0, 13, 26, 39], 44, [true, true, false, false, true, true, true, false, true]);
    g.box(30, 92, 0, 14, 11, 1.6); g.box(31, 93, 1.6, 12, 9, 9);
    g.box(56, 94, 0, 14, 11, 1.6);
    return g;
  } },
  industrie: { caption: 'Atelier de production', draw: () => {
    const g = makeIso(130, 112, 50);
    g.floor(13); g.walls(50);
    for (let x = 10; x < 120; x += 22) g.rectY(2.05, x, x + 20, 30, 44);
    g.cyl(18, 22, 0, 8, 34); g.cyl(38, 22, 0, 8, 34);
    g.line([[38, 22, 34], [38, 22, 42], [125, 22, 42]], { sw: 2 });
    g.box(66, 18, 0, 34, 22, 20); g.box(70, 22, 20, 22, 14, 7); g.box(104, 26, 0, 6, 8, 26);
    g.route([[10, 54, 0], [116, 54, 0], [116, 100, 0]]);
    [[30, 72], [68, 72], [30, 84], [68, 84]].forEach(([x, y]) => g.box(x, y, 0, 1.6, 1.6, 14));
    g.box(29, 71, 14, 42, 16, 2);
    g.box(36, 74, 16, 8, 6, 4);
    g.cyl(96, 86, 0, 4, 10); g.cyl(104, 92, 0, 4, 10);
    return g;
  } },
  commerce: { caption: 'Surface de vente', draw: () => {
    const g = makeIso(140, 112, 40);
    g.floor(10); g.walls(40);
    g.rectY(2.05, 70, 130, 4, 30); [90, 110].forEach((x) => g.line([[x, 2.1, 4], [x, 2.1, 30]], { op: 0.6 }));
    const row = (y: number) => { g.box(16, y, 0, 72, 8, 12); [4, 8].forEach((z) => g.line([[16, y + 8.05, z], [88, y + 8.05, z]], { op: 0.45 })); };
    row(14);
    g.route([[10, 32, 0], [102, 32, 0], [102, 58, 0]]);
    row(44);
    g.route([[102, 58, 0], [10, 58, 0]]);
    row(74);
    g.box(108, 74, 0, 8, 22, 10); g.box(116, 90, 0, 16, 6, 10); g.box(110, 80, 10, 4, 4, 5);
    return g;
  } },
  hotellerie: { caption: 'Hall d’accueil', draw: () => {
    const g = makeIso(130, 112, 46);
    g.floor(20); g.walls(46);
    g.rectY(2.05, 74, 106, 18, 34, '#F2F6F7');
    g.rectX(2.05, 30, 70, 0, 34);
    g.box(70, 12, 0, 40, 8, 11); g.box(69, 11, 11, 42, 10, 1.2);
    g.cyl(40, 40, 0, 4, 44); g.cyl(92, 40, 0, 4, 44);
    g.box(22, 62, 0, 50, 32, 0.4); g.poly([[26, 66, 0.45], [68, 66, 0.45], [68, 90, 0.45], [26, 90, 0.45]], '#F6F8F8', 1, 0.5);
    g.route([[12, 52, 0], [118, 52, 0]]);
    g.box(6, 64, 0, 3, 28, 12); g.box(9, 64, 0, 9, 28, 5);
    g.cyl(118, 96, 0, 4, 7); g.ball(118, 96, 14, 7);
    return g;
  } },
  bureaux: { caption: 'Plateau de bureaux', draw: () => {
    const g = makeIso(130, 112, 40);
    g.floor(15); g.walls(40);
    for (let x = 8; x < 125; x += 24) g.rectY(2.05, x, x + 20, 14, 34);
    for (let y = 8; y < 105; y += 24) g.rectX(2.05, y, y + 20, 14, 34);
    desk(g, 22, 18); desk(g, 64, 18);
    g.route([[10, 52, 0], [118, 52, 0]]);
    desk(g, 22, 66); desk(g, 64, 66);
    return g;
  } },
  collectivites: { caption: 'Place publique', draw: () => {
    const g = makeIso(150, 112, 34);
    g.floor(10);
    g.box(0, 0, 0, 44, 30, 28); [8, 16, 24].forEach((z) => g.line([[0, 30.05, z], [44, 30.05, z]], { op: 0.5 })); g.rectY(30.05, 16, 28, 0, 7);
    [[70, 16], [100, 16], [130, 16]].forEach(([x, y]) => { g.cyl(x, y, 0, 1.2, 12); g.ball(x, y, 20, 9); });
    g.box(64, 44, 0, 18, 4, 3); g.box(64, 44, 3, 18, 1.2, 4);
    g.box(100, 44, 0, 18, 4, 3); g.box(100, 44, 3, 18, 1.2, 4);
    g.route([[14, 92, 0], [138, 92, 0], [138, 64, 0], [14, 64, 0]]);
    [30, 80, 130].forEach((x) => { g.box(x, 104, 0, 1.2, 1.2, 24); g.box(x - 1.5, 103.5, 24, 4.2, 2.2, 1.2); });
    return g;
  } },
  proprete: { caption: 'Sites de natures différentes', draw: () => {
    const g = makeIso(160, 122, 60);
    g.floor(20);
    g.box(12, 10, 0, 30, 26, 56); for (let z = 8; z < 56; z += 8) { g.line([[12, 36.05, z], [42, 36.05, z]], { op: 0.45 }); g.line([[42.05, 10, z], [42.05, 36, z]], { op: 0.45 }); }
    g.box(66, 10, 0, 76, 34, 22); for (let x = 74; x < 142; x += 8) g.line([[x, 44.05, 0], [x, 44.05, 22]], { op: 0.35 }); g.rectY(44.05, 120, 134, 0, 14);
    g.route([[60, 56, 0], [150, 56, 0], [150, 108, 0], [74, 108, 0]]);
    g.box(18, 72, 0, 38, 28, 18); g.rectY(100.05, 30, 42, 0, 9); g.line([[18, 100.05, 12], [56, 100.05, 12]], { op: 0.5 });
    return g;
  } },
  prescripteurs: { caption: 'Coupe de bâtiment', draw: () => {
    const g = makeIso(122, 100, 84);
    g.floor(20);
    const cols: [number, number][] = [[20, 15], [54, 15], [88, 15], [20, 73], [54, 73], [88, 73]];
    const levels = [0, 18, 36, 54];
    levels.forEach((z, i) => {
      g.box(20, 15, z, 70, 60, 2);
      if (i === 0) { g.poly([[30, 25, 2.05], [80, 25, 2.05], [80, 65, 2.05], [30, 65, 2.05]], '#F6F8F8', 1, 0.4); g.route([[34, 60, 2.1], [76, 60, 2.1], [76, 30, 2.1]]); }
      cols.forEach(([x, y]) => g.box(x, y, z + 2, 2, 2, 16));
    });
    g.box(20, 15, 72, 70, 60, 2);
    g.line([[104, 80, 0], [104, 80, 74]], { color: C });
    [...levels, 72].forEach((z, i) => { g.line([[101, 80, z], [107, 80, z]], { color: C }); if (i < 4) g.text(108, 80, z + 6, `N+${i}`); });
    return g;
  } },
};

export function AxoDrawing({ slug, className = '' }: { slug: string; className?: string }) {
  const sc = scenes[slug];
  if (!sc) return null;
  const g = sc.draw();
  return (
    <svg viewBox="0 0 480 360" className={`pl-draw block h-auto w-full ${className}`} role="img" aria-label={`Axonométrie au trait : ${sc.caption.toLowerCase()}`}>
      {g.els}
    </svg>
  );
}
export const axoCaption = (slug: string) => scenes[slug]?.caption ?? '';
