'use client';
import Image from 'next/image';
import { useMemo } from 'react';
import { useCatalogFilter } from '@/lib/hooks';
import { ENERGY_LABEL, energies, families, familyHero, getFamily, products, type Energy } from '@/lib/catalog';
import { img } from '@/lib/assets';
import ProductCard from './ProductCard';
import { Close, Search } from './icons';

const SORTS = [
  { v: 'catalogue', l: 'Ordre du catalogue' },
  { v: 'rendement', l: 'Rendement' },
  { v: 'capacite', l: 'Capacité' },
  { v: 'nom', l: 'Nom (A → Z)' },
] as const;

export default function CatalogueClient() {
  const { query, setQuery, family, setFamily, energy, setEnergy, sort, setSort, results, reset, total } = useCatalogFilter();
  const famPool = useMemo(() => (family ? products.filter((p) => p.family === family) : products), [family]);
  const energyList = energies(famPool);
  const fam = family ? getFamily(family) : null;
  const filtered = !!(query || family || energy);

  return (
    <div>
      {/* Recherche */}
      <div className="relative">
        <label htmlFor="si-q" className="sr-only">Rechercher une machine</label>
        <Search aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 h-7 w-7 -translate-y-1/2 md:left-8 md:h-9 md:w-9" />
        <input
          id="si-q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="G9, moquette…"
          autoComplete="off"
          className="h-[72px] w-full rounded-full bg-si-cyan-soft pl-14 pr-16 text-[18px] font-extrabold sm:pl-16 sm:text-[22px] tracking-[-0.01em] text-si-ink outline-none ring-[3px] ring-inset ring-transparent transition-shadow [font-stretch:115%] placeholder:font-semibold placeholder:text-si-ink/40 focus:ring-si-ink md:h-[96px] md:pl-24 md:pr-24 md:text-[34px]"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Effacer la recherche" className="si-btn absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-si-ink text-white md:right-5 md:h-14 md:w-14">
            <Close className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Familles */}
      <div className="mt-8">
        <p className="si-label text-si-grey" id="fam-label">Familles</p>
        <div role="group" aria-labelledby="fam-label" className="si-scroll-x -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          <button
            type="button"
            aria-pressed={!family}
            onClick={() => setFamily('')}
            className={`si-btn flex h-14 shrink-0 items-center gap-2 rounded-full px-5 text-[15px] font-extrabold [font-stretch:108%] ring-2 ring-inset ring-si-ink ${!family ? 'bg-si-ink text-white' : 'bg-white hover:bg-si-cyan-soft'}`}
          >
            Toutes <span className={`si-num text-[12px] ${!family ? 'text-si-cyan' : 'text-si-grey'}`}>{total}</span>
          </button>
          {families.map((f) => {
            const on = family === f.slug;
            return (
              <button
                key={f.slug}
                type="button"
                aria-pressed={on}
                onClick={() => { setFamily(on ? '' : f.slug); setEnergy(''); }}
                className={`si-btn group flex h-14 shrink-0 items-center gap-2.5 rounded-full pl-1.5 pr-4 text-[15px] font-extrabold [font-stretch:108%] ring-2 ring-inset ring-si-ink ${on ? 'bg-si-ink text-white' : 'bg-white hover:bg-si-cyan-soft'}`}
              >
                <span className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-full ${on ? 'bg-si-cyan' : 'bg-si-cyan-soft'}`}>
                  <Image src={img.product(familyHero(f.slug))} alt="" fill sizes="44px" className="si-cut object-contain p-1" />
                </span>
                <span className="whitespace-nowrap">{f.plural}</span>
                <span className={`si-num text-[12px] ${on ? 'text-si-cyan' : 'text-si-grey'}`}>{f.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Énergie + tri */}
      <div className="mt-6 flex flex-col gap-4 border-y-2 border-si-ink py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Énergie">
          <span className="si-label mr-1 text-si-grey">Énergie</span>
          {(['', ...energyList] as (Energy | '')[]).map((e) => {
            const on = energy === e;
            return (
              <button
                key={e || 'all'}
                type="button"
                aria-pressed={on}
                onClick={() => setEnergy(e)}
                className={`si-btn h-9 rounded-full px-4 text-[13px] font-bold [font-stretch:108%] ${on ? 'bg-si-cyan text-si-ink' : 'bg-[#F2F2F2] hover:bg-si-cyan-soft'}`}
              >
                {e ? ENERGY_LABEL[e] : 'Toutes'}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="si-sort" className="si-label text-si-grey">Trier par</label>
          <select
            id="si-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-10 appearance-none rounded-full bg-si-ink bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2716%27%20height=%2716%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27white%27%20stroke-width=%273%27%3E%3Cpath%20d=%27M6%209l6%206%206-6%27/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_14px_center] bg-no-repeat pl-4 pr-10 text-[13px] font-bold text-white [font-stretch:108%]"
          >
            {SORTS.map((s) => (<option key={s.v} value={s.v}>{s.l}</option>))}
          </select>
        </div>
      </div>

      {/* Résumé */}
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4" aria-live="polite">
        <p className="flex items-baseline gap-3">
          <span className="si-num text-[clamp(3rem,6vw,5.5rem)] font-black leading-[.8] tracking-[-0.04em] [font-stretch:125%]">{results.length}</span>
          <span className="text-[15px] font-bold">
            machine{results.length > 1 ? 's' : ''}
            {fam ? <> · {fam.plural}</> : null}
            {energy ? <> · {ENERGY_LABEL[energy]}</> : null}
            {query ? <> · « {query} »</> : null}
          </span>
        </p>
        {filtered && (
          <button type="button" onClick={reset} className="si-btn inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-bold ring-2 ring-inset ring-si-ink hover:bg-si-yellow">
            <Close className="h-3.5 w-3.5" /> Réinitialiser les filtres
          </button>
        )}
      </div>
      {fam?.intro && <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-si-ink/75">{fam.intro}</p>}

      {/* Grille */}
      {results.length ? (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {results.map((p, k) => (
            <li key={p.slug}><ProductCard p={p} priority={k < 3} /></li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 overflow-hidden rounded-[36px] bg-si-yellow p-8 md:p-14">
          <p className="si-display text-[clamp(2.4rem,7vw,6rem)]">Aucune machine</p>
          <p className="mt-4 max-w-lg text-[17px] leading-relaxed">Aucun modèle ne correspond à cette combinaison. Essayez un autre mot-clé (« moquette », « balayeuse », « G9 »…) ou retirez un filtre.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={reset} className="si-btn inline-flex h-12 items-center rounded-full bg-si-ink px-6 text-[14px] font-bold text-white">Voir les {total} machines</button>
            {['aspirateur', 'balayeuse', 'moquette'].map((s) => (
              <button key={s} type="button" onClick={() => { reset(); setQuery(s); }} className="si-btn inline-flex h-12 items-center rounded-full bg-white px-5 text-[14px] font-bold">« {s} »</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
