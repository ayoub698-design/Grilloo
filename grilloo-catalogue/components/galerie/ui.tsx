import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from './icons';

/** Légende en petites capitales, avec filet cyan facultatif. */
export function Caption({ children, rule = false, className = '' }: { children: ReactNode; rule?: boolean; className?: string }) {
  return (
    <p className={`ga-caps ga-text-stone flex items-center gap-3 ${className}`}>
      {rule && <span className="inline-block h-px w-8 bg-[#49B5BF]" aria-hidden />}
      <span>{children}</span>
    </p>
  );
}

/** Lien éditorial : texte + flèche fine, soulignement qui se dessine. */
export function TextLink({ href, children, className = '', download }: { href: string; children: ReactNode; className?: string; download?: boolean }) {
  const inner = (
    <>
      <span className="ga-link">{children}</span>
      <ArrowRight className="ga-arrow h-[9px] w-[20px]" />
    </>
  );
  const cls = `group inline-flex items-center gap-3 text-[14px] tracking-[.01em] ${className}`;
  if (download || href.endsWith('.pdf')) return <a href={href} className={cls} target="_blank" rel="noopener">{inner}</a>;
  return <Link href={href} className={cls}>{inner}</Link>;
}

export function Button({ href, children, variant = 'ink', className = '' }: { href: string; children: ReactNode; variant?: 'ink' | 'line'; className?: string }) {
  return (
    <Link href={href} className={`ga-btn ga-btn--${variant} ${className}`}>
      <span>{children}</span>
      <ArrowRight className="ga-arrow h-[9px] w-[20px]" />
    </Link>
  );
}

/** Arche peu profonde découpée en haut d'une bande ivoire (le papier « mord » la bande). */
export function ArchCut({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 96" preserveAspectRatio="none" className={`ga-arch ${className}`} style={flip ? { transform: 'scaleY(-1)' } : undefined} aria-hidden>
      <path d="M0 0 H1440 V0 C 1100 0, 980 96, 720 96 C 460 96, 340 0, 0 0 Z" fill="#FAF9F6" />
      <path d="M0 0 C 340 0, 460 96, 720 96 C 980 96, 1100 0, 1440 0" fill="none" stroke="#E4E0D8" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** En-tête de page éditorial (numéro, légende, titre). Le titre est fourni par l'appelant (h1). */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14 ${className}`}>{children}</div>;
}
