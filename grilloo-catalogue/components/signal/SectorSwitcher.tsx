'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { sectors, sectorProducts, isCited } from '@/lib/sectors';
import { getFamily } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { familyHref, productHref, quoteHref } from './ui';
import { ArrowRight } from './icons';

const SHOW = 8;

export default function SectorSwitcher() {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const h = window.location.hash.slice(1);
    const i = sectors.findIndex((s) => s.slug === h);
    if (i >= 0) setCur(i);
  }, []);
  const pick = (i: number) => {
    setCur(i);
    window.history.replaceState(null, '', `#${sectors[i].slug}`);
  };

  return (
    <div>
      <div role="tablist" aria-label="Secteurs" className="si-scroll-x -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        {sectors.map((s, i) => {
          const on = i === cur;
          return (
            <button
              key={s.slug}
              id={`tab-${s.slug}`}
              role="tab"
              aria-selected={on}
              aria-controls={`panel-${s.slug}`}
              tabIndex={on ? 0 : -1}
              onClick={() => pick(i)}
              onKeyDown={(e) => {
                const n = sectors.length;
                let j = -1;
                if (e.key === 'ArrowRight') j = (cur + 1) % n;
                if (e.key === 'ArrowLeft') j = (cur - 1 + n) % n;
                if (j >= 0) { e.preventDefault(); pick(j); document.getElementById(`tab-${sectors[j].slug}`)?.focus(); }
              }}
              className={`si-btn flex h-12 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] font-extrabold [font-stretch:108%] ring-2 ring-inset ring-si-ink md:h-14 md:px-5 md:text-[15px] ${on ? 'bg-si-ink text-white' : 'bg-white hover:bg-si-cyan-soft'}`}
            >
              <span className={`si-num text-[11px] ${on ? 'text-si-cyan' : 'text-si-grey'}`}>{String(i + 1).padStart(2, '0')}</span>
              {s.short}
            </button>
          );
        })}
      </div>

      {sectors.map((s, i) => {
        const list = sectorProducts(s);
        const cited = isCited(s);
        const illu = s.image.endsWith('.png');
        return (
          <section
            key={s.slug}
            id={`panel-${s.slug}`}
            role="tabpanel"
            aria-labelledby={`tab-${s.slug}`}
            hidden={i !== cur}
            className="mt-8"
          >
            <div className="si-swap-text grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="relative lg:col-span-6">
                <div className={`relative aspect-[4/3] overflow-hidden rounded-[36px] ${illu ? 'bg-si-cyan-soft' : 'bg-si-ink'}`}>
                  <Image src={s.image} alt={`${s.name} — visuel d’illustration`} fill sizes="(min-width: 1024px) 48vw, 92vw" className={illu ? 'object-contain p-8' : 'object-cover'} />
                  <span className="si-label absolute bottom-4 left-4 rounded-full bg-white px-3 py-1.5 text-[10px]">Visuel d’illustration</span>
                </div>
                <span aria-hidden="true" className="si-display-cond absolute -right-2 -top-8 select-none text-[clamp(6rem,12vw,11rem)] leading-none text-si-cyan md:-right-5">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="min-w-0 lg:col-span-6">
                <h2 className="text-[clamp(2rem,4.2vw,3.8rem)] font-black uppercase leading-[.92] tracking-[-0.02em] [font-stretch:112%] [hyphens:auto]" lang="fr">{s.name}</h2>
                <p className="mt-5 text-[19px] font-medium leading-relaxed">{s.need}</p>
                <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <dt className="si-label text-si-grey">Surfaces</dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {s.surfaces.map((x) => (<span key={x} className="rounded-full bg-si-cyan-soft px-3 py-1.5 text-[13px] font-bold">{x}</span>))}
                    </dd>
                  </div>
                  <div>
                    <dt className="si-label text-si-grey">Familles pertinentes</dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {s.families.map((f) => (
                        <Link key={f} href={familyHref(f)} className="rounded-full px-3 py-1.5 text-[13px] font-bold ring-2 ring-inset ring-si-ink hover:bg-si-cyan">{getFamily(f)?.plural ?? f}</Link>
                      ))}
                    </dd>
                  </div>
                </dl>
                <Link href={quoteHref()} className="si-btn mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-si-cyan px-6 text-[14px] font-bold">
                  Demander conseil pour ce secteur <ArrowRight className="si-arrow h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-12">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-t-[6px] border-si-ink pt-4">
                <h3 className="text-[clamp(1.4rem,2.4vw,2rem)] font-black uppercase [font-stretch:118%]">
                  <span className="si-num">{list.length}</span> machine{list.length > 1 ? 's' : ''}
                </h3>
                <p className="text-[14px] text-si-grey">
                  {cited ? 'Machines dont la fiche cite ce type de lieu.' : 'Le catalogue ne cite pas ce secteur : machines des familles pertinentes.'}
                </p>
              </div>
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                {list.slice(0, SHOW).map((p) => (
                  <li key={p.slug}>
                    <Link href={productHref(p.slug)} className="group block rounded-[22px] bg-si-cyan-soft p-3 transition-colors hover:bg-si-cyan">
                      <span className="relative block aspect-square">
                        <Image src={img.product(p.img || p.slug)} alt="" fill sizes="(min-width: 1024px) 11vw, 45vw" className="si-cut object-contain" />
                      </span>
                      <span className="mt-2 line-clamp-2 min-h-[2.3em] text-[14px] font-black uppercase leading-[1.15] [font-stretch:100%]">{p.name}</span>
                      <span className="si-label block truncate text-[9px] text-si-ink/60">{getFamily(p.family)?.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {list.length > SHOW && (
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Autres machines">
                  {list.slice(SHOW).map((p) => (
                    <li key={p.slug}><Link href={productHref(p.slug)} className="inline-flex rounded-full px-3 py-1.5 text-[13px] font-bold ring-1 ring-inset ring-si-ink/25 hover:bg-si-cyan-soft">{p.name}</Link></li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
