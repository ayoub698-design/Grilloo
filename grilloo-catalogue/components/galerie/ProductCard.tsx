import Link from 'next/link';
import { getFamily, keyFigures, type Product } from '@/lib/catalog';
import { Plinth } from './Plinth';
import { productHref, quoteHref } from './links';
import { ArrowRight } from './icons';

/** Carte produit « objet exposé » : socle, cartel (nom, type, 2 chiffres), deux actions. */
export function ProductCard({ p, index, sizes, ratio = '4 / 5', headingLevel = 'h3' }: { p: Product; index?: number; sizes?: string; ratio?: string; headingLevel?: 'h2' | 'h3' }) {
  const fam = getFamily(p.family);
  const figs = keyFigures(p, 2);
  const H = headingLevel;
  return (
    <article className="ga-lift group relative flex flex-col">
      <Link href={productHref(p.slug)} className="block" aria-label={`${p.name} — voir la fiche`} tabIndex={-1}>
        <Plinth slug={p.slug} alt={`${p.name}, ${p.kind.toLowerCase()} GRILLOO`} ratio={ratio} sizes={sizes ?? '(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 90vw'} />
      </Link>
      <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-ga-line pt-4">
        <p className="ga-caps ga-text-stone truncate">{fam?.plural ?? p.kind}</p>
        {index != null && <p className="ga-caps ga-text-stone shrink-0">N°{String(index).padStart(2, '0')}</p>}
      </div>
      <H className="ga-display mt-3 text-[28px] leading-[1.05] break-words md:text-[32px]">
        <Link href={productHref(p.slug)} className="ga-link">{p.name}</Link>
      </H>
      <p className="mt-1 text-[14px] ga-text-stone">{p.kind}</p>
      {figs.length > 0 && (
        <dl className="mt-5 grid grid-cols-2 gap-x-6">
          {figs.map((f) => (
            <div key={f.id} className="min-w-0">
              <dt className="ga-caps ga-text-stone truncate">{f.label}</dt>
              <dd className="ga-num mt-1 truncate text-[22px] leading-none">
                {f.value}
                {f.unit && <span className="ml-1 font-sans text-[12px] tracking-wide ga-text-stone">{f.unit}</span>}
              </dd>
            </div>
          ))}
        </dl>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px]">
        <Link href={productHref(p.slug)} className="inline-flex items-center gap-2.5">
          <span className="ga-link">Voir la fiche</span>
          <ArrowRight className="ga-arrow h-[8px] w-[18px]" />
        </Link>
        <Link href={quoteHref(p.slug)} className="ga-text-stone hover:text-ga-ink">
          <span className="ga-link">Demander un devis</span>
        </Link>
      </div>
    </article>
  );
}
