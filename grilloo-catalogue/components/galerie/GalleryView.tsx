'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gallery } from '@/lib/assets';
import { getSector } from '@/lib/sectors';
import { getProduct } from '@/lib/catalog';
import { productHref, pad } from './links';
import { Reveal } from './motion';
import { ArrowLeft, ArrowRight, Close, Expand } from './icons';

type Item = (typeof gallery)[number];

const LAYOUT = [
  { span: 'lg:col-span-7', ar: 'aspect-[4/3]' },
  { span: 'lg:col-span-5 lg:mt-32', ar: 'aspect-[4/5]' },
  { span: 'lg:col-span-5', ar: 'aspect-[4/5]' },
  { span: 'lg:col-span-7 lg:mt-24', ar: 'aspect-[4/3]' },
  { span: 'lg:col-span-12', ar: 'aspect-[16/9] lg:aspect-[21/9]' },
];

/** Rangées éditoriales : paire 7/5, paire 5/7, pleine largeur ; une paire incomplète devient pleine largeur. */
function layoutFor(n: number) {
  const rows = [[0, 1], [2, 3], [4]];
  const out: (typeof LAYOUT)[number][] = [];
  let r = 0;
  while (out.length < n) {
    const row = rows[r % rows.length];
    const left = n - out.length;
    if (row.length === 2 && left === 1) out.push(LAYOUT[4]);
    else row.forEach((k) => out.length < n && out.push(LAYOUT[k]));
    r++;
  }
  return out;
}

const label = (g: Item) => {
  const p = getProduct(g.product);
  return { product: p, sector: getSector(g.sector) };
};

export function GalleryView() {
  const [tag, setTag] = useState('');
  const [open, setOpen] = useState<number | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const tags = useMemo(() => Array.from(new Set(gallery.map((g) => g.sector))), []);
  const list = useMemo(() => (tag ? gallery.filter((g) => g.sector === tag) : gallery), [tag]);

  const show = (i: number, el: HTMLElement) => { lastFocus.current = el; setOpen(i); };
  const close = useCallback(() => { setOpen(null); lastFocus.current?.focus(); }, []);
  const step = useCallback((d: number) => setOpen((o) => (o == null ? o : (o + d + list.length) % list.length)), [list.length]);

  useEffect(() => {
    if (open == null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open, close, step]);

  const layout = useMemo(() => layoutFor(list.length), [list.length]);
  const current = open != null ? list[open] : null;
  const cur = current ? label(current) : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-ga-line pb-6 text-[14.5px]" role="group" aria-label="Filtrer par secteur">
        <span className="ga-caps ga-text-stone mr-1">Secteur</span>
        {['', ...tags].map((t) => {
          const on = tag === t;
          return (
            <button key={t || 'all'} type="button" aria-pressed={on} onClick={() => setTag(t)} className={`py-1 ${on ? 'ga-display text-[17px] italic' : 'ga-text-stone hover:text-ga-ink'}`}>
              <span className={`ga-link ${on ? 'ga-link--on' : ''}`}>{t ? getSector(t)?.short ?? t : 'Tous'}</span>
              <sup className="ml-1 font-sans text-[10px] not-italic ga-text-stone">{t ? gallery.filter((g) => g.sector === t).length : gallery.length}</sup>
            </button>
          );
        })}
      </div>

      <ul className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-24">
        {list.map((g, i) => {
          const L = layout[i];
          const { product, sector } = label(g);
          const wide = L === LAYOUT[4];
          return (
            <Reveal as="li" key={g.id} className={`${L.span} ${wide ? 'sm:col-span-2' : ''}`}>
              <figure>
                <button type="button" onClick={(e) => show(i, e.currentTarget)} className="group relative block w-full overflow-hidden bg-ga-ivory text-left" aria-label={`Agrandir : ${g.place}${product ? `, ${product.name}` : ''}`}>
                  <span className={`relative block ${L.ar}`}>
                    <Image src={g.src} alt={`${product?.name ?? ''} — ${g.place} (visuel d’illustration)`} fill sizes={wide ? '92vw' : '(min-width: 1024px) 55vw, (min-width: 640px) 45vw, 92vw'} className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]" />
                  </span>
                  <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center bg-ga-paper/90 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden>
                    <Expand className="h-3.5 w-3.5" />
                  </span>
                </button>
                <figcaption className="mt-4 grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 border-t border-ga-line pt-4">
                  <span className="ga-caps ga-text-stone">N°{pad(gallery.indexOf(g) + 1)}</span>
                  <span className="min-w-0">
                    <span className="ga-display block text-[22px] leading-tight">{g.place}</span>
                    {product && (
                      <Link href={productHref(product.slug)} className="mt-1 inline-block text-[13.5px] ga-text-stone hover:text-ga-ink">
                        <span className="ga-link">{product.name} — {product.kind}</span>
                      </Link>
                    )}
                  </span>
                  <span className="ga-caps ga-text-stone text-right">{sector?.short}</span>
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </ul>

      {current && cur && (
        <div role="dialog" aria-modal="true" aria-label={`${current.place} — vue agrandie`} className="ga-lightbox fixed inset-0 z-50 flex flex-col bg-ga-paper">
          <div className="flex items-center justify-between px-5 py-4 sm:px-8 lg:px-14">
            <p className="ga-caps ga-text-stone">N°{pad(gallery.indexOf(current) + 1)} — {open! + 1} / {list.length}</p>
            <button ref={closeRef} type="button" onClick={close} className="ga-caps flex h-11 items-center gap-3">
              Fermer <Close className="h-4 w-4" />
            </button>
          </div>
          <figure key={current.id} className="flex min-h-0 flex-1 flex-col px-5 pb-6 sm:px-8 lg:px-14">
            <div className="relative min-h-0 flex-1">
              <Image src={current.src} alt={`${cur.product?.name ?? ''} — ${current.place} (visuel d’illustration)`} fill sizes="100vw" className="object-contain" />
            </div>
            <figcaption className="mx-auto mt-5 flex w-full max-w-5xl flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-ga-line pt-4">
              <span className="ga-display text-[24px]">{current.place}</span>
              <span className="text-[13.5px] ga-text-stone">
                {cur.product && <Link href={productHref(cur.product.slug)} className="ga-link text-ga-ink">{cur.product.name}</Link>}
                {cur.sector && <> · {cur.sector.name}</>} · visuel d’illustration
              </span>
            </figcaption>
          </figure>
          {list.length > 1 && (
            <div className="flex items-center justify-center gap-10 pb-6">
              <button type="button" onClick={() => step(-1)} className="flex h-11 items-center gap-3 text-[13px]" aria-label="Image précédente"><ArrowLeft /> Précédente</button>
              <button type="button" onClick={() => step(1)} className="flex h-11 items-center gap-3 text-[13px]" aria-label="Image suivante">Suivante <ArrowRight /></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
