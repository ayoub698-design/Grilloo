import Image from 'next/image';
import Link from 'next/link';
import { getFamily, keyFigures, type Product } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { Tilt } from './motion';
import { nameScale, productHref, quoteHref } from './ui';
import { ArrowRight } from './icons';

/** Carte produit « Signal » : détouré sur tuile teintée, nom de modèle énorme, 2 chiffres clés. */
export default function ProductCard({ p, tint = 'soft', priority = false }: { p: Product; tint?: 'soft' | 'cyan' | 'grey'; priority?: boolean }) {
  const fam = getFamily(p.family);
  const figs = keyFigures(p, 2);
  const bg = tint === 'cyan' ? 'bg-si-cyan' : tint === 'grey' ? 'bg-[#F2F2F2]' : 'bg-si-cyan-soft';
  return (
    <Tilt className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white ring-1 ring-si-line transition-shadow hover:shadow-[0_24px_60px_-28px_rgba(10,10,10,.35)]">
        <Link href={productHref(p.slug)} className="block focus-visible:outline-offset-[-3px]" aria-label={`${p.name} — voir la fiche`}>
          <div className={`relative m-2 aspect-[4/3.3] overflow-hidden rounded-[22px] ${bg}`}>
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-[38%] left-1/2 aspect-square w-[78%] -translate-x-1/2 rounded-full bg-white/70 transition-transform duration-500 group-hover:scale-110" />
            <Image
              src={img.product(p.img || p.slug)}
              alt={`${fam?.name ?? p.kind} GRILLOO ${p.name}`}
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 40vw, 90vw"
              priority={priority}
              className="si-cut object-contain p-7 md:p-8"
            />
            <span className="si-label absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px]">{fam?.name ?? p.kind}</span>
          </div>
          <div className="px-5 pb-1 pt-3">
            <h3 className={`font-black uppercase leading-[.9] tracking-[-0.02em] ${nameScale(p.name)} break-words`}>{p.name}</h3>
          </div>
        </Link>
        <dl className="grid grid-cols-2 gap-3 px-5 pb-4 pt-3">
          {figs.map((f) => (
            <div key={f.id} className="min-w-0 border-t-2 border-si-ink pt-2">
              <dt className="si-label truncate text-[10px] text-si-grey">{f.label}</dt>
              <dd className="mt-1 line-clamp-2 text-[17px] font-extrabold leading-tight [font-stretch:105%]">
                <span className="si-num">{f.value}</span>{f.unit && <span className="ml-1 text-[13px] font-bold text-si-grey">{f.unit}</span>}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto flex flex-wrap gap-2 px-5 pb-5">
          <Link href={productHref(p.slug)} className="si-btn inline-flex h-10 items-center gap-2 rounded-full bg-si-ink px-4 text-[13px] font-bold text-white [font-stretch:108%]">
            Voir la fiche <ArrowRight className="si-arrow h-3.5 w-3.5" />
          </Link>
          <Link href={quoteHref(p.slug)} className="si-btn inline-flex h-10 items-center rounded-full px-4 text-[13px] font-bold ring-2 ring-inset ring-si-ink [font-stretch:108%] hover:bg-si-cyan" aria-label={`Demander un devis pour ${p.name}`}>
            Demander un devis
          </Link>
        </div>
      </article>
    </Tilt>
  );
}
