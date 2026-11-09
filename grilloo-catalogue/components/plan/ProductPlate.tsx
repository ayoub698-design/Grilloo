import Image from 'next/image';
import Link from 'next/link';
import { getFamily, keyFigures, type Product } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { IArrow, IPlus } from './icons';
import { Crops, Figure, Mono, pad, productHref, quoteHref } from './ui';

/**
 * Carte produit dessinée comme une planche : en-tête mono, détouré sur papier millimétré, 2 cotes, actions.
 * S'adapte à sa propre largeur (container queries) : compacte en 2 colonnes mobiles, complète ailleurs.
 */
export function ProductPlate({ p, n, priority = false, headingLevel = 3 }: { p: Product; n: number; priority?: boolean; headingLevel?: 2 | 3 }) {
  const fam = getFamily(p.family);
  const figs = keyFigures(p, 2);
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="pl-plate group @container relative flex h-full flex-col bg-white outline outline-1 -outline-offset-[0.5px] outline-pl-line transition-[outline-color] duration-300 hover:z-[1] hover:outline-pl-teal focus-within:z-[1] focus-within:outline-pl-teal">
      <div className="flex items-center justify-between gap-2 border-b border-pl-line px-3 py-2">
        <Mono className="whitespace-nowrap text-pl-teal">Fig. {pad(n)}</Mono>
        <Mono className="hidden truncate text-pl-ink/55 @min-[300px]:block">{fam?.name}</Mono>
        <Mono className="whitespace-nowrap text-pl-ink/55">p.&nbsp;{p.page}</Mono>
      </div>
      <Link href={productHref(p.slug)} tabIndex={-1} aria-hidden="true" className="pl-graph relative block aspect-[5/4] overflow-hidden">
        <Crops />
        <Image src={img.product(p.img)} alt="" fill priority={priority} sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw" className="pl-cut object-contain p-[12%]" />
      </Link>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-3 @min-[260px]:px-4">
        <H className="text-[17px] font-normal leading-tight tracking-[-0.02em] text-pl-ink @min-[260px]:text-[20px]">
          <Link href={productHref(p.slug)} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">{p.name}</Link>
        </H>
        <Mono className="mt-1 block normal-case tracking-[0.02em] text-pl-ink/60">{p.kind}</Mono>
        {figs.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-3 @min-[260px]:grid-cols-2">
            {figs.map((f) => <Figure key={f.id} value={f.value} unit={f.unit} label={f.label} className="min-w-0 [&_p]:truncate" />)}
          </div>
        )}
      </div>
      <div className="relative z-[2] grid grid-cols-2 border-t border-pl-line text-[13px] @min-[260px]:grid-cols-[1fr_auto]">
        <Link href={productHref(p.slug)} className="flex items-center justify-between gap-2 px-3 py-2.5 text-pl-teal transition-colors hover:bg-pl-paper @min-[260px]:px-4">
          <span className="whitespace-nowrap"><span className="hidden @min-[260px]:inline">Voir la f</span><span className="@min-[260px]:hidden">F</span>iche</span>
          <IArrow size={14} className="shrink-0" />
        </Link>
        <Link href={quoteHref(p.slug)} className="flex items-center gap-1.5 whitespace-nowrap border-l border-pl-line px-3 py-2.5 text-pl-ink/80 transition-colors hover:bg-pl-teal hover:text-white" aria-label={`Demander un devis pour ${p.name}`}>
          <IPlus size={13} className="shrink-0" /> <span className="hidden @min-[340px]:inline">Demander un devis</span><span className="@min-[340px]:hidden">Devis</span>
        </Link>
      </div>
    </article>
  );
}
