'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { featured, getFamily, keyFigures } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { nameScale, productHref, quoteHref } from './ui';
import { ArrowRight } from './icons';

/** Vitrine des produits phares : liste de modèles à gauche, grande scène à droite. */
export default function FeaturedShowcase() {
  const [i, setI] = useState(0);
  const p = featured[i];
  const fam = getFamily(p.family);
  const figs = keyFigures(p, 3);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
      {/* Sélecteur */}
      <div className="min-w-0 lg:col-span-4">
        <div role="tablist" aria-label="Produits phares" aria-orientation="vertical" className="si-scroll-x -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
          {featured.map((f, k) => {
            const on = k === i;
            return (
              <button
                key={f.slug}
                role="tab"
                id={`ft-${f.slug}`}
                aria-selected={on}
                aria-controls="ft-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setI(k)}
                onKeyDown={(e) => {
                  const n = featured.length;
                  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); const j = (i + 1) % n; setI(j); document.getElementById(`ft-${featured[j].slug}`)?.focus(); }
                  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); const j = (i - 1 + n) % n; setI(j); document.getElementById(`ft-${featured[j].slug}`)?.focus(); }
                }}
                className={`group flex shrink-0 items-center gap-3 rounded-full px-4 py-2 text-left transition-colors lg:rounded-none lg:border-b-2 lg:border-si-ink/10 lg:px-0 lg:py-3 ${on ? 'bg-si-ink text-white lg:bg-transparent lg:text-si-ink' : 'bg-si-cyan-soft lg:bg-transparent'}`}
              >
                <span className={`si-label hidden w-8 lg:inline ${on ? 'text-si-cyan' : 'text-si-grey'}`}>{String(k + 1).padStart(2, '0')}</span>
                <span className={`whitespace-nowrap font-black uppercase leading-none tracking-[-0.02em] [font-stretch:115%] text-[15px] lg:text-[clamp(1.4rem,2.2vw,2.2rem)] transition-transform duration-500 ${on ? 'lg:translate-x-2' : 'lg:group-hover:translate-x-2'}`}>
                  {f.name}
                </span>
                <span className={`si-label ml-auto hidden max-w-[11rem] text-right text-[10px] leading-tight lg:inline ${on ? 'text-si-ink' : 'text-si-grey'}`}>{getFamily(f.family)?.name}</span>
                {on && <span aria-hidden="true" className="hidden h-3 w-3 shrink-0 rounded-full bg-si-cyan lg:block" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scène */}
      <div id="ft-panel" role="tabpanel" aria-labelledby={`ft-${p.slug}`} className="min-w-0 lg:col-span-8">
        <div className="relative overflow-hidden rounded-[36px] bg-si-cyan-soft">
          <div className="relative h-[380px] sm:h-[460px] lg:h-[560px]">
            <p key={`n-${p.slug}`} aria-hidden="true" className={`si-swap-text pointer-events-none absolute inset-x-0 top-[17%] select-none sm:top-[6%] whitespace-nowrap text-center font-black uppercase leading-[.8] tracking-[-0.04em] text-si-cyan ${nameScale(p.name.split(' ')[0], 'stage')}`}>
              {p.name.split(' ')[0]}
            </p>
            <div key={p.slug} className="si-swap absolute inset-x-[8%] bottom-[4%] top-[14%]">
              <Image src={img.product(p.img || p.slug)} alt={`${fam?.name ?? p.kind} GRILLOO ${p.name}`} fill sizes="(min-width: 1024px) 50vw, 90vw" className="object-contain drop-shadow-[0_30px_30px_rgba(10,10,10,.18)]" />
            </div>
            <span className="si-label absolute left-5 top-5 rounded-full bg-white px-3 py-1.5">{fam?.name}</span>
            {figs[0] && (
              <div className="absolute bottom-5 right-4 rotate-[-6deg] rounded-full bg-si-yellow px-4 py-3 text-center shadow-[0_6px_0_#0A0A0A] sm:bottom-7 sm:right-6 sm:px-5">
                <p className="si-num text-[22px] font-black leading-none [font-stretch:115%] sm:text-[28px]">{figs[0].value}<span className="ml-1 text-[13px]">{figs[0].unit}</span></p>
                <p className="si-label mt-1 text-[9px]">{figs[0].label}</p>
              </div>
            )}
          </div>
          <div className="grid gap-5 border-t-2 border-si-ink/10 bg-white/60 p-5 sm:p-7 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h3 className="text-[clamp(1.6rem,3vw,2.6rem)] font-black uppercase leading-[.95] tracking-[-0.02em] [font-stretch:120%]">{p.name}</h3>
              <p className="mt-3 line-clamp-3 max-w-2xl text-[15px] leading-relaxed text-si-ink/75">{p.lead}</p>
              {figs.length > 1 && (
                <dl className="mt-4 flex flex-wrap gap-2">
                  {figs.slice(1).map((f) => (
                    <div key={f.id} className="flex items-baseline gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-si-ink/15">
                      <dt className="si-label text-[10px] text-si-grey">{f.label}</dt>
                      <dd className="si-num text-[15px] font-extrabold">{f.value}{f.unit && ` ${f.unit}`}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <div className="flex flex-wrap gap-2 md:flex-col md:items-stretch">
              <Link href={productHref(p.slug)} className="si-btn inline-flex h-12 items-center justify-center gap-2 rounded-full bg-si-ink px-6 text-[14px] font-bold text-white [font-stretch:110%]">
                Voir la fiche <ArrowRight className="si-arrow h-4 w-4" />
              </Link>
              <Link href={quoteHref(p.slug)} className="si-btn inline-flex h-12 items-center justify-center rounded-full bg-si-cyan px-6 text-[14px] font-bold text-si-ink [font-stretch:110%]">
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
