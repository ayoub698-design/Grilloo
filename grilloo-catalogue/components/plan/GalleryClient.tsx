'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { beforeAfter, gallery } from '@/lib/assets';
import { getProduct } from '@/lib/catalog';
import { getSector } from '@/lib/sectors';
import { IArrow, IArrowLeft, IClose, IExpand } from './icons';
import { Mono, pad, productHref, quoteHref } from './ui';

type Item = (typeof gallery)[number];

export function GalleryClient() {
  const tags = Array.from(new Set(gallery.map((g) => g.sector)));
  const [tag, setTag] = useState('');
  const [open, setOpen] = useState<number | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const items = gallery.map((g, i) => ({ ...g, n: i + 1 })).filter((g) => !tag || g.sector === tag);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const cur = open !== null ? gallery[open] : null;
  const step = (dir: number) => setOpen((o) => (o === null ? o : (o + dir + gallery.length) % gallery.length));

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 border-y border-pl-line py-3" role="group" aria-label="Filtrer par secteur">
        <Mono className="mr-2 text-pl-ink/55">Secteur</Mono>
        {['', ...tags].map((t) => {
          const on = tag === t;
          const n = t ? gallery.filter((g) => g.sector === t).length : gallery.length;
          return (
            <button key={t || 'all'} type="button" onClick={() => setTag(t)} aria-pressed={on}
              className={`border px-2.5 py-1 font-pl-mono text-[11px] transition-colors ${on ? 'border-pl-teal bg-pl-teal text-white' : 'border-pl-line text-pl-ink/75 hover:border-pl-teal'}`}>
              {t ? getSector(t)?.short ?? t : 'Tous'} <span className={on ? 'text-white/70' : 'text-pl-ink/45'}>{pad(n)}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-8 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-12">
        {items.map((g, i) => {
          const p = getProduct(g.product);
          const wide = (Math.floor(i / 2) % 2 === 0) === (i % 2 === 0);
          const single = items.length % 2 === 1 && i === items.length - 1;
          return (
            <li key={g.id} className={single ? 'lg:col-span-7' : wide ? 'lg:col-span-7' : 'lg:col-span-5'}>
              <figure className="pl-plate group">
                <button type="button" onClick={() => setOpen(g.n - 1)} className="relative block w-full overflow-hidden border border-pl-teal bg-pl-paper text-left"
                  aria-label={`Agrandir : ${g.place}${p ? `, ${p.name}` : ''}`}>
                  <span className="flex items-center justify-between border-b border-pl-teal bg-white px-3 py-2">
                    <Mono className="text-pl-teal">Pl. {pad(g.n)}</Mono>
                    <Mono className="text-pl-ink/55">{getSector(g.sector)?.short}</Mono>
                  </span>
                  <span className="relative block aspect-[3/2] overflow-hidden">
                    <Image src={g.src} alt={`${g.place} — ${p?.name ?? 'machine GRILLOO'} (visuel d’illustration)`} fill sizes="(min-width: 1024px) 50vw, 100vw"
                      className="pl-cut object-cover" />
                    <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center bg-white/90 text-pl-teal opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"><IExpand /></span>
                  </span>
                </button>
                <figcaption className="mt-3 grid grid-cols-[auto_1fr_auto] items-baseline gap-3">
                  <span className="font-pl-mono text-[11px] text-pl-teal">Fig. {pad(g.n)}</span>
                  <span className="text-[15px] text-pl-ink">{g.place}{p && <> · <Link href={productHref(p.slug)} className="text-pl-teal underline decoration-pl-line underline-offset-4 hover:decoration-pl-cyan">{p.name}</Link></>}</span>
                  <span className="font-pl-mono text-[10px] uppercase tracking-[0.08em] text-pl-ink/50">Illustration</span>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>

      <dialog ref={dlg} className="pl-dialog" onClose={() => setOpen(null)} aria-label={cur ? `${cur.place}, vue agrandie` : 'Vue agrandie'}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); }}>
        {cur && (() => {
          const p = getProduct(cur.product);
          return (
            <div className="flex h-full w-full items-center justify-center p-3 sm:p-8" onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
              <div className="pl-dialog-panel flex max-h-full w-full max-w-[1200px] flex-col border border-pl-teal bg-white">
                <div className="flex items-center justify-between border-b border-pl-teal px-3 py-2">
                  <Mono className="text-pl-teal">Pl. {pad((open ?? 0) + 1)} / {pad(gallery.length)} — {cur.place}</Mono>
                  <button type="button" onClick={() => setOpen(null)} className="flex items-center gap-2 font-pl-mono text-[11px] uppercase tracking-[0.08em] text-pl-ink hover:text-pl-teal" autoFocus>
                    Fermer <IClose />
                  </button>
                </div>
                <div className="relative min-h-0 flex-1 bg-pl-paper">
                  <div className="relative aspect-[3/2] max-h-[72vh] w-full">
                    <Image src={cur.src} alt={`${cur.place} — ${p?.name ?? 'machine GRILLOO'} (visuel d’illustration)`} fill sizes="100vw" className="object-contain" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-pl-line px-3 py-3">
                  <p className="text-[14px] text-pl-ink/80">
                    {getSector(cur.sector)?.name} · Visuel d’illustration provisoire, ne représente pas un chantier réel.
                  </p>
                  <div className="flex items-center gap-2">
                    {p && <Link href={productHref(p.slug)} className="inline-flex items-center gap-2 border border-pl-teal px-3 py-1.5 text-[13px] text-pl-teal hover:bg-pl-teal hover:text-white">Fiche {p.name} <IArrow size={13} /></Link>}
                    {p && <Link href={quoteHref(p.slug)} className="inline-flex items-center gap-2 bg-pl-teal px-3 py-1.5 text-[13px] text-white hover:bg-pl-ink">Demander un devis</Link>}
                    <button type="button" onClick={() => step(-1)} className="border border-pl-line p-2 text-pl-ink hover:border-pl-teal" aria-label="Image précédente"><IArrowLeft /></button>
                    <button type="button" onClick={() => step(1)} className="border border-pl-line p-2 text-pl-ink hover:border-pl-teal" aria-label="Image suivante"><IArrow /></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </dialog>
    </>
  );
}

/** Comparateur avant / après (curseur clavier + souris). */
export function BeforeAfter() {
  const [v, setV] = useState(50);
  return (
    <figure>
      <div className="pl-ba relative aspect-[3/2] w-full select-none overflow-hidden border border-pl-teal bg-pl-paper outline-offset-2 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-pl-cyan sm:aspect-[16/8]">
        <Image src={beforeAfter.after} alt="Sol béton après un passage d’autolaveuse (illustration)" fill sizes="(min-width: 1024px) 1200px, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>
          <Image src={beforeAfter.before} alt="Sol béton avant nettoyage (illustration)" fill sizes="(min-width: 1024px) 1200px, 100vw" className="object-cover" />
        </div>
        {/* Ligne de coupe */}
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${v}%` }} aria-hidden="true">
          <div className="absolute inset-y-0 -ml-px w-0.5 bg-white" />
          <div className="absolute inset-y-0 -ml-px border-l border-dashed border-pl-teal" />
          <div className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-pl-teal bg-white font-pl-mono text-[10px] text-pl-teal">A—A</div>
        </div>
        <span className="pointer-events-none absolute left-3 top-3 bg-white px-2 py-1 font-pl-mono text-[10.5px] uppercase tracking-[0.08em] text-pl-ink">Avant</span>
        <span className="pointer-events-none absolute right-3 top-3 bg-pl-teal px-2 py-1 font-pl-mono text-[10.5px] uppercase tracking-[0.08em] text-white">Après</span>
        <label className="sr-only" htmlFor="pl-ba">Position de la comparaison avant / après</label>
        <input id="pl-ba" type="range" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" aria-valuetext={`${v} % avant`} />
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
        <span className="text-[14px] text-pl-ink/80">{beforeAfter.caption}</span>
        <span className="font-pl-mono text-[10.5px] text-pl-ink/55">{v} % / {100 - v} %</span>
      </figcaption>
    </figure>
  );
}
export type { Item };
