'use client';
/**
 * Primitives de mouvement « Galerie » : lent (≈900 ms), ease-out, désactivé en mouvement réduit.
 * La logique d'apparition vient de `useReveal` (lib/hooks).
 */
import { createElement, useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { useReveal } from '@/lib/hooks';

type RevealProps = {
  as?: ElementType;
  variant?: 'rise' | 'fade' | 'img';
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
} & Record<string, unknown>;

export function Reveal({ as = 'div', variant = 'rise', delay = 0, className = '', style, children, ...rest }: RevealProps) {
  const { ref, inView } = useReveal<HTMLElement>();
  return createElement(
    as,
    { ref, 'data-in': inView, className: `ga-r ga-r--${variant} ${className}`, style: { ...style, '--d': `${delay}ms` } as CSSProperties, ...rest },
    children,
  );
}

/** Titre révélé ligne par ligne derrière un masque vertical. */
export function Lines({ as = 'h2', lines, className = '', delay = 0, id }: { as?: ElementType; lines: ReactNode[]; className?: string; delay?: number; id?: string }) {
  const { ref, inView } = useReveal<HTMLElement>({ rootMargin: '0px 0px -5% 0px', threshold: 0.1 });
  return createElement(
    as,
    { ref, id, 'data-in': inView, className: `ga-lines ${className}`, style: { '--d': `${delay}ms` } as CSSProperties },
    lines.map((l, i) => (
      <span key={i} className="ga-l" style={{ '--i': i } as CSSProperties}>
        <span>{l}</span>
      </span>
    )),
  );
}

/** Parallaxe très légère (translation verticale proportionnelle à la position dans la vue). */
export function Parallax({ speed = 0.06, className = '', children }: { speed?: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const off = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
      el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [speed]);
  return <div ref={ref} className={`will-change-transform ${className}`}>{children}</div>;
}

/**
 * Séparateur : une seule courbe en filet de 1 px qui traverse la page et se dessine lentement.
 * `shape` choisit le tracé ; le petit point marque l'endroit où le filet « se pose ».
 */
const CURVES = {
  descend: 'M0 18 C 360 18, 520 104, 820 92 S 1260 40, 1440 70',
  rise: 'M0 86 C 280 92, 520 20, 860 28 S 1240 84, 1440 30',
  swell: 'M0 60 C 420 60, 560 8, 760 8 S 1100 104, 1440 104',
} as const;
const DOTS = { descend: [820, 92], rise: [860, 28], swell: [760, 8] } as const;

export function Curve({ shape = 'descend', className = '', tone = 'cyan' }: { shape?: keyof typeof CURVES; className?: string; tone?: 'cyan' | 'line' }) {
  const { ref, inView } = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const stroke = tone === 'cyan' ? '#49B5BF' : '#D9D4CA';
  const [cx, cy] = DOTS[shape];
  return (
    <div ref={ref} data-in={inView} className={`ga-curve pointer-events-none relative w-full ${className}`} aria-hidden>
      <svg viewBox="0 0 1440 112" preserveAspectRatio="none" className="block h-[64px] w-full md:h-[112px]" fill="none">
        <path d={CURVES[shape]} stroke={stroke} strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={1} className="ga-draw" />
      </svg>
      <span
        className="absolute h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#49B5BF] bg-ga-paper transition-opacity duration-[900ms] delay-[1800ms]"
        style={{ left: `${(cx / 1440) * 100}%`, top: `${(cy / 112) * 100}%`, opacity: inView ? 1 : 0 }}
      />
    </div>
  );
}
