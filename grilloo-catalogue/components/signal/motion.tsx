'use client';
/* Mouvement « Signal » : révélation au scroll, cartes qui basculent, marquee réactif au scroll. */
import { createElement, useEffect, useRef, type CSSProperties, type ReactNode, type ElementType } from 'react';
import { useReveal } from '@/lib/hooks';

/** Glisse / rebondit à l'entrée dans la vue (désactivé si mouvement réduit). */
export function Reveal({
  as = 'div', variant = 'up', delay = 0, className = '', children, threshold = 0.15, ...rest
}: {
  as?: ElementType; variant?: 'up' | 'left' | 'right' | 'pop' | 'wipe'; delay?: number; className?: string; children: ReactNode; threshold?: number;
} & Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'children'>) {
  const { ref, inView } = useReveal<HTMLElement>({ rootMargin: '0px 0px -8% 0px', threshold });
  return createElement(
    as,
    { ...rest, ref, 'data-in': inView ? 'true' : 'false', className: `si-reveal si-${variant} ${className}`, style: { '--d': `${delay}ms` } as CSSProperties },
    children,
  );
}

/** Bascule légère de la carte selon la position du pointeur (souris uniquement). */
export function Tilt({ children, className = '', max = 5 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);
  useEffect(() => { reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }, []);
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse' || reduced.current) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${(x * max * 2).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-y * max * 2).toFixed(2)}deg`);
    el.dataset.active = 'true';
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
    el.dataset.active = 'false';
  };
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`si-tilt ${className}`}>
      {children}
    </div>
  );
}

/** Bandeau défilant : vitesse de base + accélération selon la vitesse de scroll, sens selon la direction. */
export function Marquee({ items, className = '', itemClassName = '', base = 70, label }: { items: ReactNode[]; className?: string; itemClassName?: string; base?: number; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let x = 0, last = performance.now(), lastY = window.scrollY, boost = 0, dir = 1, raf = 0;
    const loop = (t: number) => {
      const dt = Math.min(64, t - last) / 1000;
      last = t;
      const y = window.scrollY, dy = y - lastY;
      lastY = y;
      if (dy !== 0) dir = dy > 0 ? 1 : -1;
      const target = dt > 0 ? Math.min(Math.abs(dy) / dt * 0.9, 1400) : 0;
      boost += (target - boost) * 0.08;
      const w = el.scrollWidth / 2;
      x -= dir * (base + boost) * dt;
      if (w > 0) { if (x <= -w) x += w; if (x > 0) x -= w; }
      el.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [base]);
  return (
    <div className={`overflow-hidden ${className}`} role="region" aria-label={label}>
      <div ref={track} className="si-marquee-track">
        {[0, 1].map((k) => (
          <ul key={k} aria-hidden={k === 1 || undefined} className="flex shrink-0 items-center">
            {items.map((it, i) => (<li key={i} className={itemClassName}>{it}</li>))}
          </ul>
        ))}
      </div>
    </div>
  );
}
