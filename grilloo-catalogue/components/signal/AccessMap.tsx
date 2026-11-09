/* Plan d'accès stylisé : l'adresse n'est pas connue → plan illustratif, clairement étiqueté. */
export default function AccessMap() {
  const blocks: [number, number, number, number][] = [
    [30, 30, 150, 90], [200, 30, 120, 90], [340, 30, 170, 60], [530, 30, 140, 90],
    [30, 140, 90, 120], [140, 140, 180, 50], [140, 210, 80, 50], [240, 210, 80, 50], [530, 140, 140, 60],
    [30, 280, 150, 90], [200, 280, 120, 90], [530, 220, 140, 150], [380, 300, 130, 70],
  ];
  return (
    <figure className="overflow-hidden rounded-[36px] bg-si-cyan-soft">
      <svg viewBox="0 0 700 400" className="block h-auto w-full" role="img" aria-labelledby="map-t">
        <title id="map-t">Plan d’accès illustratif — adresse à fournir par GRILLOO</title>
        <rect width="700" height="400" fill="#D9F3F6" />
        {blocks.map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="10" fill="#FFFFFF" />
        ))}
        {/* parc */}
        <rect x="340" y="110" width="170" height="170" rx="85" fill="#BFE9EF" />
        {/* voie rapide en diagonale */}
        <path d="M-20 390 L720 60" stroke="#0A0A0A" strokeWidth="22" />
        <path d="M-20 390 L720 60" stroke="#FFD23F" strokeWidth="3" strokeDasharray="14 12" />
        {/* itinéraire */}
        <path d="M60 380 C 160 330, 210 260, 330 250 S 420 200, 425 170" fill="none" stroke="#1FB8CC" strokeWidth="8" strokeLinecap="round" strokeDasharray="2 16" />
        {/* repère */}
        <g transform="translate(425 165)">
          <circle r="46" fill="#1FB8CC" opacity=".25" />
          <path d="M0 0 C -26 -28, -26 -70, 0 -76 C 26 -70, 26 -28, 0 0 Z" transform="translate(0 6)" fill="#0A0A0A" />
          <circle cy="-40" r="14" fill="#1FB8CC" />
          <text y="-34" textAnchor="middle" fontSize="18" fontWeight="900" fill="#0A0A0A">?</text>
        </g>
        <text x="22" y="388" fontSize="11" fontWeight="700" letterSpacing="2" fill="#0A0A0A" opacity=".55">N ↑</text>
      </svg>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-si-ink/10 bg-white px-5 py-4">
        <span className="text-[15px] font-black uppercase [font-stretch:115%]">Plan d’accès — adresse à fournir</span>
        <span className="si-label rounded-full bg-si-yellow px-3 py-1.5 text-[10px]">Illustration</span>
      </figcaption>
    </figure>
  );
}
