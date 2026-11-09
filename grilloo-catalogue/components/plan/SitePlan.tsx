import { Reveal } from './Reveal';

/** Plan d'accès schématique (l'adresse n'est pas connue : plan illustratif, sans échelle). */
const T = '#0D5560', C = '#49B5BF';
const d = (ms: number) => ({ ['--d' as string]: `${ms}ms` });

export function SitePlan() {
  const blocks: [number, number, number, number][] = [
    [40, 40, 200, 120], [290, 40, 180, 120], [520, 40, 240, 120], [810, 40, 150, 120],
    [40, 230, 200, 150], [810, 230, 150, 150],
    [40, 450, 200, 110], [290, 450, 180, 110], [520, 450, 240, 110], [810, 450, 150, 110],
  ];
  return (
    <Reveal>
      <svg viewBox="0 0 1000 600" className="pl-draw block h-auto w-full" role="img" aria-label="Plan d’accès schématique : le site GRILLOO au centre d’un îlot, entrée sur la voie principale. Adresse à fournir.">
        <defs>
          <pattern id="pl-sp-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="9" stroke={T} strokeOpacity=".16" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="1000" height="600" fill="#fff" />
        {/* Îlots */}
        {blocks.map(([x, y, w, h], i) => (
          <rect key={i} className="d f" pathLength={1} x={x} y={y} width={w} height={h} fill="url(#pl-sp-hatch)" stroke={T} strokeOpacity=".55" style={d(i * 60)} />
        ))}
        {/* Axes de voirie */}
        <g stroke={T} strokeOpacity=".35" strokeDasharray="10 8" className="o" style={d(500)}>
          <line x1="0" y1="195" x2="1000" y2="195" /><line x1="0" y1="415" x2="1000" y2="415" />
          <line x1="265" y1="0" x2="265" y2="600" /><line x1="785" y1="0" x2="785" y2="600" />
        </g>
        {/* Site */}
        <rect className="d" pathLength={1} x="290" y="230" width="470" height="150" fill="#fff" stroke={T} strokeWidth="1.5" style={d(700)} />
        <rect className="d f" pathLength={1} x="310" y="250" width="230" height="110" fill="#F2F6F7" stroke={T} style={d(900)} />
        <text x="425" y="300" textAnchor="middle" fontSize="13" fill={T} className="o" style={{ fontFamily: 'var(--font-geist-mono)', ...d(1200) }}>SITE GRILLOO</text>
        <text x="425" y="320" textAnchor="middle" fontSize="11" fill={T} fillOpacity=".7" className="o" style={{ fontFamily: 'var(--font-geist-mono)', ...d(1250) }}>adresse à fournir</text>
        {/* Stationnement */}
        <g className="o" style={d(1100)}>
          {Array.from({ length: 7 }).map((_, i) => <line key={i} x1={570 + i * 26} y1="250" x2={570 + i * 26} y2="290" stroke={T} strokeOpacity=".5" />)}
          <rect x="561" y="320" width="30" height="30" fill="none" stroke={T} />
          <text x="576" y="341" textAnchor="middle" fontSize="16" fill={T} style={{ fontFamily: 'var(--font-geist)' }}>P</text>
          <text x="602" y="340" fontSize="10.5" fill={T} fillOpacity=".7" style={{ fontFamily: 'var(--font-geist-mono)' }}>STATIONNEMENT</text>
        </g>
        {/* Accès */}
        <path className="d" pathLength={1} d="M0 415 H360 V384" fill="none" stroke={C} strokeWidth="3" style={d(1300)} />
        <path d="M352 392 L360 380 L368 392 Z" fill={C} className="o" style={d(1900)} />
        <text x="372" y="402" fontSize="10.5" fill={T} className="o" style={{ fontFamily: 'var(--font-geist-mono)', ...d(1900) }}>ENTRÉE</text>
        <text x="20" y="438" fontSize="10.5" fill={T} fillOpacity=".7" className="o" style={{ fontFamily: 'var(--font-geist-mono)', ...d(1500) }}>VOIE D’ACCÈS — À PRÉCISER</text>
        {/* Nord */}
        <g transform="translate(975 290)" className="o" style={d(800)}>
          <circle r="16" fill="#fff" stroke={T} />
          <path d="M0 -11 L6 8 L0 4 L-6 8 Z" fill={T} />
          <text y="34" textAnchor="middle" fontSize="11" fill={T} style={{ fontFamily: 'var(--font-geist-mono)' }}>N</text>
        </g>
      </svg>
    </Reveal>
  );
}
