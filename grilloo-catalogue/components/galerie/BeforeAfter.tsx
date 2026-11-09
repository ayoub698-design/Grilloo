'use client';
import Image from 'next/image';
import { useState } from 'react';

/** Comparateur avant / après : curseur accessible (input range), rideau vertical. */
export function BeforeAfter({ before, after, caption }: { before: string; after: string; caption: string }) {
  const [v, setV] = useState(50);
  return (
    <figure>
      <div className="ga-ba relative aspect-[4/3] w-full select-none overflow-hidden bg-ga-ivory sm:aspect-[16/9]">
        <Image src={after} alt="Après : sol béton propre et sec" fill sizes="(min-width: 1024px) 70vw, 92vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>
          <Image src={before} alt="Avant : sol béton encrassé" fill sizes="(min-width: 1024px) 70vw, 92vw" className="object-cover" />
        </div>
        <span className="ga-caps pointer-events-none absolute left-4 top-4 bg-ga-paper/90 px-2.5 py-1.5 text-ga-ink">Avant</span>
        <span className="ga-caps pointer-events-none absolute right-4 top-4 bg-ga-paper/90 px-2.5 py-1.5 text-ga-ink">Après</span>
        <input
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(Number(e.target.value))}
          aria-label="Comparer avant et après : faire glisser"
          aria-valuetext={`${v} % avant`}
          className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
        />
        <div className="ga-ba__handle pointer-events-none absolute inset-y-0 z-0" style={{ left: `${v}%` }} aria-hidden>
          <div className="absolute inset-y-0 -left-px w-px bg-white" />
          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 bg-white/15 text-white">
            <svg viewBox="0 0 24 10" className="h-2.5 w-6" fill="none" stroke="currentColor" strokeWidth="1"><path d="M5 1 1 5l4 4M19 1l4 4-4 4M1 5h22" /></svg>
          </span>
        </div>
      </div>
      <figcaption className="mt-4 flex flex-wrap justify-between gap-4 text-[13px] ga-text-stone">
        <span className="italic">{caption}</span>
        <span className="ga-caps">Faites glisser le curseur</span>
      </figcaption>
    </figure>
  );
}
