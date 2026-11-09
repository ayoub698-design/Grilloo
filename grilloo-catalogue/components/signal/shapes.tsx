/* Séparateurs et formes « Signal » : raclette incurvée, frange de brosse, diagonale franche. */

const CYAN = '#1FB8CC';

/**
 * Raclette : la lame incurvée d'un suceur d'autolaveuse vue de dessus.
 * Un aplat dont le bord forme un arc, souligné par la « lèvre » caoutchouc (filet encre) et ses deux embouts.
 * `position="top"` : posé en haut d'un bloc de couleur `fill` (l'arc mord sur la section précédente).
 */
export function SqueegeeEdge({ fill = CYAN, lip = '#0A0A0A', className = '', flip = false }: { fill?: string; lip?: string; className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true" className={`block h-[56px] w-full md:h-[110px] ${flip ? 'rotate-180' : ''} ${className}`}>
      <path d="M0 140 V96 C 360 8, 1080 8, 1440 96 V140 Z" fill={fill} />
      <path d="M-4 80 C 356 -8, 1084 -8, 1444 80" fill="none" stroke={lip} strokeWidth="5" vectorEffect="non-scaling-stroke" />
      <path d="M-4 66 C 356 -22, 1084 -22, 1444 66" fill="none" stroke={lip} strokeWidth="1.5" strokeDasharray="2 10" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Frange de brosse : poils fins de longueurs inégales qui pendent du bloc du dessus. Déterministe (pas d'aléa au rendu). */
export function BristleEdge({ fill = CYAN, className = '', count = 160, down = true }: { fill?: string; className?: string; count?: number; down?: boolean }) {
  const w = 1440, step = w / count, bw = step * 0.46;
  let d = '';
  for (let i = 0; i < count; i++) {
    const x = i * step + (step - bw) / 2;
    const len = 26 + 22 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.37)) + 10 * ((i * 7) % 5) / 4;
    d += `M${x.toFixed(1)} 0h${bw.toFixed(1)}v${len.toFixed(1)}l-${(bw / 2).toFixed(1)} 4l-${(bw / 2).toFixed(1)} -4z`;
  }
  return (
    <svg viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true" className={`block h-[34px] w-full md:h-[56px] ${down ? '' : 'rotate-180'} ${className}`}>
      <rect x="0" y="0" width="1440" height="10" fill={fill} />
      <path d={d} fill={fill} />
    </svg>
  );
}

/** Diagonale franche. `dir="up"` : monte vers la droite. */
export function DiagonalEdge({ fill = CYAN, className = '', dir = 'up' }: { fill?: string; className?: string; dir?: 'up' | 'down' }) {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true" className={`block h-[48px] w-full md:h-[110px] ${className}`}>
      <polygon points={dir === 'up' ? '0,120 1440,0 1440,120' : '0,0 1440,120 0,120'} fill={fill} />
    </svg>
  );
}

/** Sticker rond au texte circulaire qui tourne lentement. */
export function RoundSticker({ text, center, className = '', tone = 'yellow' }: { text: string; center: React.ReactNode; className?: string; tone?: 'yellow' | 'ink' | 'white' }) {
  const bg = tone === 'yellow' ? 'bg-si-yellow text-si-ink' : tone === 'ink' ? 'bg-si-ink text-white' : 'bg-white text-si-ink';
  const id = `rs-${text.replace(/[^a-z0-9]/gi, '').slice(0, 12)}`;
  return (
    <div className={`relative grid aspect-square place-items-center rounded-full ${bg} ${className}`}>
      <svg viewBox="0 0 200 200" className="si-spin absolute inset-0 h-full w-full" aria-hidden="true">
        <defs><path id={id} d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" /></defs>
        <text fontSize="13" fontWeight="800" fill="currentColor" style={{ fontStretch: '108%', textTransform: 'uppercase' }}>
          <textPath href={`#${id}`} textLength="486" lengthAdjust="spacing">{text.toUpperCase()}</textPath>
        </text>
      </svg>
      <div className="relative text-center leading-none">{center}</div>
    </div>
  );
}
