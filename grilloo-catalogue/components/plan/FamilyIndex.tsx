'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { families, familyHero, familyIntro, fmtRange, getProduct, productsOf, range } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { IArrow } from './icons';
import { Crops, DimH, Mono, href, pad } from './ui';

const pages = (slug: string) => {
  const p = productsOf(slug).map((x) => x.page);
  const a = Math.min(...p), b = Math.max(...p);
  return a === b ? `p. ${a}` : `p. ${a}–${b}`;
};

/** Index des 10 familles (tableau des planches) + aperçu de la planche survolée. */
export function FamilyIndex() {
  const [active, setActive] = useState(families[0].slug);
  const f = families.find((x) => x.slug === active)!;
  const list = productsOf(f.slug);
  const hero = getProduct(familyHero(f.slug) ?? '') ?? list[0];
  const prod = range(list, 'productivity');
  const tank = range(list, 'tank');
  const width = range(list, 'width');
  const intro = familyIntro(f);
  const short = intro.length > 230 ? `${intro.slice(0, 230).replace(/\s+\S*$/, '')}…` : intro;
  const idx = families.indexOf(f);

  return (
    <div className="grid gap-10 lg:grid-cols-8 lg:gap-0">
      <div className="lg:col-span-5 lg:pr-10">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Index des familles du catalogue</caption>
          <thead>
            <tr className="border-b border-pl-teal font-pl-mono text-[10px] uppercase tracking-[0.1em] text-pl-ink/55">
              <th scope="col" className="w-12 py-2 font-normal">N°</th>
              <th scope="col" className="py-2 font-normal">Famille</th>
              <th scope="col" className="w-20 py-2 text-right font-normal">Modèles</th>
              <th scope="col" className="hidden w-24 py-2 text-right font-normal sm:table-cell">Catalogue</th>
              <th scope="col" className="w-10 py-2"><span className="sr-only">Lien</span></th>
            </tr>
          </thead>
          <tbody>
            {families.map((x, i) => {
              const on = x.slug === active;
              return (
                <tr key={x.slug} onMouseEnter={() => setActive(x.slug)}
                  className={`group relative border-b border-pl-line transition-colors duration-300 ${on ? 'bg-pl-paper' : 'hover:bg-pl-paper'}`}>
                  <td className="py-0 align-middle">
                    <span className={`font-pl-mono text-[11px] ${on ? 'text-pl-teal' : 'text-pl-ink/50'}`}>{pad(i + 1)}</span>
                  </td>
                  <td className="py-0">
                    <Link href={`${href('/produits')}?famille=${x.slug}`} onFocus={() => setActive(x.slug)}
                      className="block py-3.5 text-[17px] tracking-[-0.015em] text-pl-ink after:absolute after:inset-0 after:content-[''] sm:text-[19px]">
                      <span className={`mr-2 inline-block h-px align-middle transition-all duration-500 ${on ? 'w-5 bg-pl-cyan' : 'w-0 bg-transparent'}`} aria-hidden="true" />
                      {x.plural}
                    </Link>
                  </td>
                  <td className="py-0 text-right font-pl-mono text-[12px] text-pl-ink/80 pl-tnum">{pad(x.count)}</td>
                  <td className="hidden py-0 text-right font-pl-mono text-[11px] text-pl-ink/55 sm:table-cell">{pages(x.slug)}</td>
                  <td className="py-0 text-right text-pl-teal"><IArrow className={`ml-auto transition-transform duration-500 ${on ? 'translate-x-0' : '-translate-x-1 opacity-40'}`} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Aperçu de planche */}
      <div className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-24 border border-pl-teal bg-white" aria-live="polite">
          <div className="flex items-center justify-between border-b border-pl-teal px-3 py-2">
            <Mono className="text-pl-teal">Planche {pad(idx + 1)} / 10</Mono>
            <Mono className="text-pl-ink/55">{pages(f.slug)}</Mono>
          </div>
          <div key={f.slug} data-in="true" className="pl-graph relative aspect-[4/3.1]">
            <Crops />
            <div className="pl-wipe absolute inset-[10%_16%_18%]">
              {hero && <Image src={img.product(hero.img)} alt={`${hero.name} — ${f.name}`} fill sizes="320px" className="object-contain" />}
            </div>
            {width && <DimH label={`Largeurs de travail ${fmtRange(width)} mm`} className="bottom-[7%] left-[16%] right-[16%]" labelBg="#F6F8F8" />}
          </div>
          <div className="border-t border-pl-line p-4">
            <p className="text-[22px] font-light leading-tight tracking-[-0.025em]">{f.plural}</p>
            {short && <p className="mt-2 text-[13.5px] leading-relaxed text-pl-ink/70">{short}</p>}
            <dl className="mt-4 grid grid-cols-2 border-t border-pl-line pt-3 font-pl-mono text-[11px]">
              <div><dt className="text-[9.5px] uppercase tracking-[0.1em] text-pl-ink/55">Rendement</dt><dd className="mt-0.5">{prod ? `${fmtRange(prod)} m²/h` : 'Selon fiche'}</dd></div>
              <div><dt className="text-[9.5px] uppercase tracking-[0.1em] text-pl-ink/55">Capacité</dt><dd className="mt-0.5">{tank ? `${fmtRange(tank)} L` : 'Selon fiche'}</dd></div>
            </dl>
          </div>
          <Link href={`${href('/produits')}?famille=${f.slug}`} className="flex items-center justify-between border-t border-pl-teal px-4 py-3 text-[14px] text-pl-teal hover:bg-pl-paper">
            Voir les {f.count} modèles <IArrow />
          </Link>
        </div>
      </div>
    </div>
  );
}
