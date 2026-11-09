import Image from 'next/image';
import type { CSSProperties } from 'react';
import { img } from '@/lib/assets';

/**
 * Le produit posé sur un socle ivoire, avec ombre de contact et ombre portée longue.
 * `niche` ajoute une arche en creux derrière l'objet (hero, fiche produit).
 */
export function Plinth({
  src, slug, alt, sizes = '(min-width: 1024px) 33vw, 90vw', priority = false, ratio = '4 / 5', base = 0.24,
  niche = false, inset = 10, top = 6, className = '',
}: {
  src?: string; slug?: string; alt: string; sizes?: string; priority?: boolean; ratio?: string; base?: number;
  niche?: boolean; inset?: number; top?: number; className?: string;
}) {
  const source = src ?? img.product(slug ?? '');
  return (
    <div
      className={`ga-plinth ${className}`}
      style={{ '--ar': ratio, '--base': base, '--ox': `${inset}%`, '--top': `${top}%` } as CSSProperties}
    >
      {niche && <div className="ga-plinth__niche" aria-hidden />}
      <div className="ga-plinth__block" aria-hidden />
      <div className="ga-plinth__long" aria-hidden />
      <div className="ga-plinth__contact" aria-hidden />
      <div className="ga-plinth__obj">
        <Image src={source} alt={alt} fill sizes={sizes} priority={priority} className="object-contain object-[50%_100%]" />
      </div>
    </div>
  );
}
