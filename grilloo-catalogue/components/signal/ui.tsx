import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from './icons';

/** Racine de l'orientation. Liens internes toujours avec barre finale. */
export const BASE = '/signal';
export const to = (path = '') => `${BASE}${path.replace(/\/?$/, '/')}`.replace(/\/\/+/g, '/');
export const productHref = (slug: string) => to(`/produits/${slug}`);
export const quoteHref = (slug?: string) => `${to('/contact')}${slug ? `?produit=${slug}` : ''}`;
export const familyHref = (slug: string) => `${to('/produits')}?famille=${slug}`;

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1600px] px-5 md:px-10 ${className}`}>{children}</div>;
}

type Tone = 'ink' | 'cyan' | 'white' | 'outline' | 'yellow' | 'outline-ink';
const tones: Record<Tone, string> = {
  ink: 'bg-si-ink text-white hover:bg-[#222]',
  cyan: 'bg-si-cyan text-si-ink hover:bg-[#35c6d8]',
  white: 'bg-white text-si-ink hover:bg-si-cyan-soft',
  yellow: 'bg-si-yellow text-si-ink',
  outline: 'bg-transparent text-si-ink ring-2 ring-inset ring-si-ink hover:bg-si-ink hover:text-white',
  'outline-ink': 'bg-transparent text-si-ink ring-2 ring-inset ring-si-ink/80 hover:bg-white',
};

/** Bouton pilule (lien). */
export function Btn({
  href, children, tone = 'ink', size = 'md', className = '', arrow = true, download, external,
}: {
  href: string; children: ReactNode; tone?: Tone; size?: 'sm' | 'md' | 'lg'; className?: string; arrow?: boolean; download?: boolean; external?: boolean;
}) {
  const sz = size === 'lg' ? 'h-16 px-8 text-lg' : size === 'sm' ? 'h-10 px-4 text-sm' : 'h-12 px-6 text-[15px]';
  const cls = `si-btn inline-flex items-center justify-center gap-2.5 rounded-full font-bold whitespace-nowrap [font-stretch:110%] ${sz} ${tones[tone]} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <ArrowRight className="si-arrow h-[1.1em] w-[1.1em]" />}
    </>
  );
  if (download || external) {
    return (
      <a href={href} className={cls} {...(download ? { download: '' } : {})} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    );
  }
  return <Link href={href} className={cls}>{inner}</Link>;
}

/** Étiquette arrondie. */
export function Pill({ children, tone = 'line', className = '' }: { children: ReactNode; tone?: 'line' | 'ink' | 'cyan' | 'yellow' | 'soft' | 'white'; className?: string }) {
  const t = {
    line: 'ring-1 ring-inset ring-si-ink/20 text-si-ink',
    ink: 'bg-si-ink text-white',
    cyan: 'bg-si-cyan text-si-ink',
    yellow: 'bg-si-yellow text-si-ink',
    soft: 'bg-si-cyan-soft text-si-ink',
    white: 'bg-white text-si-ink',
  }[tone];
  return <span className={`si-label inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 ${t} ${className}`}>{children}</span>;
}

/** Taille d'un nom de modèle selon sa longueur (les noms vont de « G9 » à « GS-TNE7-E 0.85KW MH 10L »). */
export function nameScale(name: string, level: 'card' | 'hero' | 'stage' = 'card') {
  const n = name.length;
  if (level === 'hero') {
    if (n <= 3) return 'text-[44vw] md:text-[30vw] si-wide';
    if (n <= 5) return 'text-[30vw] md:text-[22vw] si-wide';
    if (n <= 8) return 'text-[21vw] md:text-[15vw] si-semi';
    if (n <= 12) return 'text-[17vw] md:text-[11vw] si-cond';
    return 'text-[13vw] md:text-[8.2vw] si-cond';
  }
  if (level === 'stage') {
    if (n <= 3) return 'text-[42vw] lg:text-[22rem] si-wide';
    if (n <= 5) return 'text-[30vw] lg:text-[17rem] si-wide';
    if (n <= 8) return 'text-[20vw] lg:text-[11rem] si-semi';
    return 'text-[15vw] lg:text-[8rem] si-cond';
  }
  if (n <= 4) return 'text-[56px] si-wide';
  if (n <= 7) return 'text-[44px] si-semi';
  if (n <= 12) return 'text-[38px] si-cond';
  return 'text-[28px] si-cond';
}

/** Titre de section : une ligne extra-large + une ligne condensée. */
export function Eyebrow({ n, children, className = '' }: { n?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`si-label flex items-center gap-3 text-si-ink ${className}`}>
      {n && <span className="grid h-7 min-w-7 place-items-center rounded-full bg-si-ink px-2 text-[10px] text-white">{n}</span>}
      <span>{children}</span>
    </p>
  );
}
