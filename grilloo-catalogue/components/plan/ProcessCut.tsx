'use client';
import { useState } from 'react';
import { process } from '@/lib/catalog';
import { useReveal } from '@/lib/hooks';
import { pad } from './ui';

/**
 * Coupe A—A d'une autolaveuse accompagnée (dessin de principe, non à l'échelle).
 * 1 Laver (solution déposée) · 2 Brosser (plateau) · 3 Aspirer (moteur, flexible) · 4 Sécher (suceur).
 */
const T = '#0D5560', C = '#49B5BF';
const d = (ms: number) => ({ ['--d' as string]: `${ms}ms` });

export function ProcessCut() {
  const { ref, inView } = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const [active, setActive] = useState<number | null>(null);
  const hl = (n: number) => (active === null || active === n ? 1 : 0.28);
  const ring = (n: number) => (active === n ? C : T);

  const Marker = ({ n, x, y }: { n: number; x: number; y: number }) => (
    <g className="o pl-step-hl" style={d(1400 + n * 120)}>
      <circle cx={x} cy={y} r="15" fill={active === n ? T : '#fff'} stroke={ring(n)} strokeWidth="1.25" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fill={active === n ? '#fff' : T} style={{ fontFamily: 'var(--font-geist-mono)' }}>{pad(n)}</text>
    </g>
  );
  const Label = ({ x, y, children, anchor = 'start' }: { x: number; y: number; children: string; anchor?: 'start' | 'end' | 'middle' }) => (
    <text x={x} y={y} textAnchor={anchor} fontSize="11" letterSpacing=".8" fill={T} fillOpacity=".75" className="o" style={{ fontFamily: 'var(--font-geist-mono)', ...d(1500) }}>{children}</text>
  );

  return (
    <div ref={ref} data-in={inView ? 'true' : 'false'}>
      <div className="pl-scroll-x -mx-4 px-4 sm:mx-0 sm:px-0">
        <svg viewBox="0 0 1200 470" className="pl-draw block h-auto w-full min-w-[760px]" role="img"
          aria-label="Coupe de principe d’une autolaveuse : la solution est déposée devant la brosse, le plateau brosse le sol, le suceur arrière ramène l’eau sale vers l’aspiration, le sol est sec derrière la machine.">
          <defs>
            <pattern id="pl-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke={T} strokeOpacity=".35" strokeWidth="1" />
            </pattern>
            <pattern id="pl-hatch-c" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <line x1="0" y1="0" x2="0" y2="5" stroke={C} strokeOpacity=".55" strokeWidth="1" />
            </pattern>
            <marker id="pl-ah" viewBox="0 0 9 7" refX="9" refY="3.5" markerWidth="9" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 9 3.5 0 7z" fill={T} />
            </marker>
            <marker id="pl-ahc" viewBox="0 0 9 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 9 3.5 0 7z" fill={C} />
            </marker>
          </defs>

          {/* Sol + hachures de coupe */}
          <rect x="40" y="400" width="1120" height="22" fill="url(#pl-hatch)" className="o" style={d(200)} />
          <path className="d" pathLength={1} d="M40 400H1160" stroke={T} strokeWidth="1.5" fill="none" style={d(0)} />
          {/* État du sol : sec | humide | sale */}
          <rect x="352" y="394" width="318" height="6" fill="url(#pl-hatch-c)" className="o" style={d(1200)} />
          <g className="o" style={d(1300)} fill={T} fillOpacity=".55">
            {[905, 932, 951, 978, 1004, 1022, 1051, 1078, 1096, 1121, 1140].map((x, i) => (
              <circle key={x} cx={x} cy={396 - (i % 3) * 1.6} r={1.2 + (i % 2) * 0.7} />
            ))}
          </g>
          <Label x={120} y={448}>SOL SEC</Label>
          <Label x={511} y={448} anchor="middle">FILM DE SOLUTION</Label>
          <Label x={1020} y={448} anchor="middle">SALISSURE</Label>
          <path className="d" pathLength={1} d="M60 432H330M352 432H670M880 432H1150" stroke={T} strokeOpacity=".4" fill="none" strokeDasharray="1" style={d(900)} />

          {/* Sens d'avancement */}
          <g className="o" style={d(600)}>
            <line x1="930" y1="70" x2="1110" y2="70" stroke={T} markerEnd="url(#pl-ah)" />
            <text x="930" y="58" fontSize="11" letterSpacing=".8" fill={T} style={{ fontFamily: 'var(--font-geist-mono)' }}>SENS D’AVANCEMENT</text>
          </g>

          {/* Timon / poignée */}
          <path className="d" pathLength={1} d="M330 170 L262 66 M244 62 H282" stroke={T} strokeWidth="2" fill="none" strokeLinecap="round" style={d(300)} />
          {/* Carrosserie (coupe) */}
          <path className="d" pathLength={1} d="M330 330 V150 Q330 120 360 120 H820 Q850 120 860 148 L884 300 Q886 330 860 330 Z" stroke={T} strokeWidth="1.5" fill="#fff" style={d(200)} />
          {/* Cloisons */}
          <path className="d" pathLength={1} d="M342 200 H872 M410 132 V196 M470 204 V318" stroke={T} strokeOpacity=".6" fill="none" style={d(500)} />

          {/* Réservoir de récupération (haut) */}
          <g style={{ opacity: hl(3), transition: 'opacity .35s' }}>
            <path className="d" pathLength={1} d="M420 140 H836 Q846 140 848 150 L854 190 H420 Z" stroke={T} fill="none" style={d(650)} />
            <path className="o" d="M422 176 Q470 170 520 176 T620 176 T720 176 T852 176 V190 H422 Z" fill={C} fillOpacity=".18" style={d(1500)} />
            <Label x={430} y={160}>EAU DE RÉCUPÉRATION</Label>
            {/* Moteur d'aspiration */}
            <circle className="d" pathLength={1} cx="376" cy="166" r="22" stroke={T} fill="none" style={d(700)} />
            <g className="pl-spin" style={{ transformOrigin: '376px 166px' }}>
              <path className="d" pathLength={1} d="M376 150 V182 M360 166 H392 M365 155 L387 177 M387 155 L365 177" stroke={T} strokeOpacity=".7" fill="none" style={d(800)} />
            </g>
          </g>

          {/* Réservoir d'eau propre (bas) */}
          <g style={{ opacity: hl(1), transition: 'opacity .35s' }}>
            <path className="d" pathLength={1} d="M480 210 H866 L878 300 Q878 318 860 318 H480 Z" stroke={T} fill="none" style={d(700)} />
            <path className="o" d="M482 240 Q560 234 640 240 T800 240 T870 240 L876 300 Q876 316 860 316 H482 Z" fill={C} fillOpacity=".28" style={d(1500)} />
            <Label x={492} y={230}>EAU PROPRE + DÉTERGENT</Label>
            {/* Alimentation vers la brosse */}
            <path className="d" pathLength={1} d="M760 318 V372" stroke={C} strokeWidth="2" fill="none" style={d(1000)} />
            <path className="pl-flow" d="M760 318 V372" stroke={T} strokeWidth="2" strokeDasharray="3 9" fill="none" />
          </g>

          {/* Batteries */}
          <rect x="342" y="210" width="118" height="100" fill="url(#pl-hatch)" stroke={T} strokeOpacity=".6" className="o" style={d(800)} />
          <text x="401" y="264" textAnchor="middle" fontSize="10" letterSpacing=".8" fill={T} className="o" style={{ fontFamily: 'var(--font-geist-mono)', ...d(1500) }}>BATTERIES</text>

          {/* Plateau de brosse */}
          <g style={{ opacity: hl(2), transition: 'opacity .35s' }}>
            <path className="d" pathLength={1} d="M672 330 V372 H850 V330" stroke={T} strokeWidth="1.5" fill="none" style={d(900)} />
            <rect className="d" pathLength={1} x="684" y="372" width="154" height="12" stroke={T} fill="#fff" style={d(1000)} />
            <path className="pl-flow" d="M688 392 H834" stroke={T} strokeWidth="15" strokeDasharray="1.2 4" fill="none" opacity=".75" />
          </g>

          {/* Roues */}
          <circle className="d" pathLength={1} cx="520" cy="366" r="34" stroke={T} strokeWidth="1.5" fill="#fff" style={d(800)} />
          <circle className="d" pathLength={1} cx="520" cy="366" r="8" stroke={T} fill="none" style={d(900)} />
          <circle className="d" pathLength={1} cx="868" cy="388" r="12" stroke={T} fill="#fff" style={d(950)} />
          <path className="d" pathLength={1} d="M868 330 V376" stroke={T} fill="none" style={d(950)} />

          {/* Suceur arrière + flexible d'aspiration */}
          <g style={{ opacity: hl(4) === 1 || hl(3) === 1 ? 1 : 0.28, transition: 'opacity .35s' }}>
            <path className="d" pathLength={1} d="M300 362 Q300 350 312 350 H354 Q364 350 364 362 V372 H300 Z" stroke={T} strokeWidth="1.5" fill="#fff" style={d(1000)} />
            <path className="d" pathLength={1} d="M312 372 Q318 390 316 400 M352 372 Q346 390 348 400" stroke={T} strokeWidth="2" fill="none" style={d(1100)} />
            <path className="d" pathLength={1} d="M330 350 V318 Q330 290 300 270 Q276 250 300 230 Q330 206 416 190" stroke={C} strokeWidth="2.5" fill="none" style={d(1150)} />
            <path className="pl-flow" d="M330 350 V318 Q330 290 300 270 Q276 250 300 230 Q330 206 416 190" stroke={T} strokeWidth="2.5" strokeDasharray="3 9" fill="none" style={{ animationDirection: 'reverse' }} />
          </g>

          {/* Repères numérotés + lignes de rappel */}
          <path className="d" pathLength={1} d="M845 372 L940 300 H990" stroke={T} strokeOpacity=".7" fill="none" style={d(1300)} />
          <path className="d" pathLength={1} d="M760 398 L790 448" stroke={T} strokeOpacity=".7" fill="none" style={d(1300)} />
          <path className="d" pathLength={1} d="M386 147 L430 92 H448" stroke={T} strokeOpacity=".7" fill="none" style={d(1300)} />
          <path className="d" pathLength={1} d="M300 372 L220 330 H170" stroke={T} strokeOpacity=".7" fill="none" style={d(1300)} />
          <Marker n={1} x={1005} y={300} />
          <Marker n={2} x={805} y={460} />
          <Marker n={3} x={463} y={92} />
          <Marker n={4} x={155} y={330} />
          <Label x={1028} y={296}>SOLUTION</Label>
          <Label x={1028} y={311}>DÉPOSÉE</Label>
          <Label x={828} y={464}>PLATEAU DE BROSSE</Label>
          <Label x={486} y={96}>MOTEUR D’ASPIRATION</Label>
          <Label x={60} y={300}>SUCEUR INCURVÉ</Label>

          {/* Repère de coupe */}
          <g className="o" style={d(400)}>
            <text x="60" y="28" fontSize="11" letterSpacing=".8" fill={T} style={{ fontFamily: 'var(--font-geist-mono)' }}>COUPE A—A · PRINCIPE, NON À L’ÉCHELLE</text>
          </g>
        </svg>
      </div>

      <p className="mt-2 font-pl-mono text-[10px] uppercase tracking-[0.08em] text-pl-ink/55 sm:hidden" aria-hidden="true">← Faire défiler le dessin →</p>
      <ol className="mt-10 grid border-t border-pl-teal sm:grid-cols-2 lg:grid-cols-4">
        {process.map((s, i) => {
          const n = i + 1, on = active === n;
          return (
            <li key={s.step} className="border-b border-pl-line sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
              <button type="button" onMouseEnter={() => setActive(n)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(n)} onBlur={() => setActive(null)}
                className={`flex h-full w-full flex-col items-start justify-start p-5 text-left transition-colors duration-300 lg:p-6 ${on ? 'bg-white' : 'hover:bg-white/70'}`}>
                <span className={`font-pl-mono text-[11px] ${on ? 'text-pl-teal' : 'text-pl-ink/55'}`}>{pad(n)} —</span>
                <span className="mt-3 block text-[26px] font-light tracking-[-0.03em] text-pl-ink">{s.step}</span>
                <span className="mt-2 block text-[14px] leading-relaxed text-pl-ink/75">{s.text}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
