'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gallery, beforeAfter } from '@/lib/assets';
import { getProduct } from '@/lib/catalog';
import { getSector } from '@/lib/sectors';
import { productHref } from './ui';
import { ArrowLeft, ArrowRight, Close, Expand } from './icons';

const tags = Array.from(new Set(gallery.map((g) => g.sector)));

export function Gallery() {
  const [tag, setTag] = useState('');
  const [open, setOpen] = useState<number | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const items = gallery.filter((g) => !tag || g.sector === tag);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const cur = open !== null ? items[open] : null;
  const curP = cur ? getProduct(cur.product) : null;
  const step = (n: number) => setOpen((o) => (o === null ? o : (o + n + items.length) % items.length));

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par secteur">
        {['', ...tags].map((t) => {
          const on = tag === t;
          const n = t ? gallery.filter((g) => g.sector === t).length : gallery.length;
          return (
            <button
              key={t || 'all'}
              type="button"
              aria-pressed={on}
              onClick={() => setTag(t)}
              className={`si-btn flex h-12 items-center gap-2 rounded-full px-5 text-[14px] font-extrabold [font-stretch:108%] ring-2 ring-inset ring-si-ink ${on ? 'bg-si-ink text-white' : 'bg-white hover:bg-si-cyan-soft'}`}
            >
              {t ? getSector(t)?.short ?? t : 'Tous'}
              <span className={`si-num text-[11px] ${on ? 'text-si-cyan' : 'text-si-grey'}`}>{n}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:[grid-auto-rows:300px]">
        {items.map((g, i) => {
          const p = getProduct(g.product);
          const big = i === 0 && items.length > 2;
          const fill = i === items.length - 1 && i > 0 && (items.length > 2 ? items.length + 3 : items.length) % 3 === 2;
          return (
            <li key={g.id} className={`si-swap ${big ? 'sm:col-span-2 lg:row-span-2' : ''} ${fill ? 'lg:col-span-2' : ''}`}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block aspect-[3/2] w-full overflow-hidden rounded-[32px] bg-si-ink text-left lg:aspect-auto lg:h-full"
                aria-label={`Agrandir : ${g.place}${p ? `, ${p.name}` : ''}`}
              >
                <Image src={g.src} alt={`${g.place}${p ? ` — GRILLOO ${p.name}` : ''} (visuel d’illustration)`} fill sizes={big ? '(min-width: 1024px) 66vw, 92vw' : '(min-width: 1024px) 33vw, 92vw'} className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
                <span className="absolute left-4 top-4 flex gap-1.5">
                  <span className="si-label rounded-full bg-si-cyan px-3 py-1.5 text-[10px] text-si-ink">{getSector(g.sector)?.short ?? g.sector}</span>
                </span>
                <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-si-ink transition-transform group-hover:scale-110"><Expand className="h-4 w-4" /></span>
                <span className="absolute inset-x-5 bottom-4 text-white">
                  <span className={`block font-black uppercase leading-none [font-stretch:118%] ${big ? 'text-[clamp(1.8rem,3.4vw,3.2rem)]' : 'text-[22px]'}`}>{p?.name}</span>
                  <span className="mt-1.5 block text-[14px] font-semibold text-white/85">{g.place}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dlg}
        onClose={() => setOpen(null)}
        onClick={(e) => { if (e.target === dlg.current) setOpen(null); }}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); }}
        className="si-dialog m-auto w-[min(1200px,94vw)] max-w-none overflow-visible bg-transparent p-0"
        aria-label={cur ? `${cur.place} — vue agrandie` : 'Vue agrandie'}
      >
        {cur && (
          <figure className="overflow-hidden rounded-[28px] bg-white">
            <div className="relative aspect-[3/2] w-full bg-si-ink">
              <Image src={cur.src} alt={`${cur.place}${curP ? ` — GRILLOO ${curP.name}` : ''} (visuel d’illustration)`} fill sizes="94vw" className="object-cover" />
            </div>
            <figcaption className="flex flex-wrap items-center gap-4 p-4 md:p-5">
              <div className="min-w-0 flex-1">
                <p className="text-[20px] font-black uppercase leading-none [font-stretch:118%]">{curP?.name} <span className="text-[14px] font-semibold normal-case text-si-grey [font-stretch:100%]">· {cur.place}</span></p>
                <p className="mt-1 text-[12px] text-si-grey">Visuel d’illustration (photo provisoire) — ne représente pas un chantier réel.</p>
              </div>
              {curP && (
                <Link href={productHref(curP.slug)} className="si-btn inline-flex h-11 items-center gap-2 rounded-full bg-si-ink px-5 text-[13px] font-bold text-white">
                  Voir la fiche {curP.name} <ArrowRight className="si-arrow h-4 w-4" />
                </Link>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => step(-1)} aria-label="Image précédente" className="si-btn grid h-11 w-11 place-items-center rounded-full ring-2 ring-inset ring-si-ink"><ArrowLeft className="h-4 w-4" /></button>
                <button type="button" onClick={() => step(1)} aria-label="Image suivante" className="si-btn grid h-11 w-11 place-items-center rounded-full ring-2 ring-inset ring-si-ink"><ArrowRight className="h-4 w-4" /></button>
                <button type="button" onClick={() => setOpen(null)} aria-label="Fermer" className="si-btn grid h-11 w-11 place-items-center rounded-full bg-si-cyan" autoFocus><Close className="h-4 w-4" /></button>
              </div>
            </figcaption>
          </figure>
        )}
      </dialog>
    </div>
  );
}

/** Comparaison avant / après sur le même cadrage. */
export function BeforeAfter() {
  const [v, setV] = useState(50);
  return (
    <figure>
      <div className="si-ba relative aspect-[3/2] w-full select-none overflow-hidden rounded-[36px] bg-si-ink md:aspect-[16/8]">
        <Image src={beforeAfter.after} alt="Après : sol béton propre et sec" fill sizes="(min-width: 1024px) 80vw, 94vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>
          <Image src={beforeAfter.before} alt="Avant : sol béton sale" fill sizes="(min-width: 1024px) 80vw, 94vw" className="object-cover" />
        </div>
        <span className="si-label absolute left-4 top-4 rounded-full bg-white px-3 py-1.5">Avant</span>
        <span className="si-label absolute right-4 top-4 rounded-full bg-si-yellow px-3 py-1.5">Après</span>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-[6px] -translate-x-1/2 bg-si-cyan" style={{ left: `${v}%` }}>
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-si-cyan text-si-ink shadow-[0_6px_0_#0A0A0A]">
            <span className="flex"><ArrowLeft className="h-4 w-4" /><ArrowRight className="h-4 w-4" /></span>
          </span>
        </div>
        <label htmlFor="ba-range" className="sr-only">Position du curseur avant / après</label>
        <input
          id="ba-range"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 focus-visible:opacity-100"
          aria-valuetext={`${v} % avant`}
        />
      </div>
      <figcaption className="mt-3 text-[13px] text-si-grey">{beforeAfter.caption} Glissez le curseur pour comparer.</figcaption>
    </figure>
  );
}

