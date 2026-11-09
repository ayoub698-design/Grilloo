'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ENERGY_LABEL, energies, families, familyIntro, fmt, getFamily, products, searchProducts, type Energy } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { useCatalogFilter } from '@/lib/hooks';
import { IArrow, IClose, IGrid, IPlus, ISearch, ITable } from './icons';
import { ProductPlate } from './ProductPlate';
import { Mono, pad, productHref, quoteHref } from './ui';

const SORTS = [
  ['catalogue', 'Ordre du catalogue'],
  ['rendement', 'Rendement décroissant'],
  ['capacite', 'Capacité décroissante'],
  ['nom', 'Nom (A → Z)'],
] as const;

export function CatalogueClient() {
  const { query, setQuery, family, setFamily, energy, setEnergy, sort, setSort, results, reset, total } = useCatalogFilter();
  const [view, setView] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    try { const v = localStorage.getItem('pl-view'); if (v === 'table' || v === 'grid') setView(v); } catch {}
  }, []);
  const changeView = (v: 'grid' | 'table') => { setView(v); try { localStorage.setItem('pl-view', v); } catch {} };

  const base = useMemo(() => searchProducts(query, products), [query]);
  const famCount = (slug: string) => base.filter((p) => p.family === slug && (!energy || p.key.energy === energy)).length;
  const scope = useMemo(() => base.filter((p) => !family || p.family === family), [base, family]);
  const allEnergies = energies(products);
  const fam = family ? getFamily(family) : undefined;
  const filtered = !!(query || family || energy);

  return (
    <div className="grid gap-8 lg:grid-cols-8 lg:gap-0">
      {/* Index des familles */}
      <aside className="min-w-0 lg:col-span-2 lg:pr-8" aria-label="Familles">
        <div className="lg:sticky lg:top-24">
          <Mono className="text-pl-ink/55">Index · familles</Mono>
          <div className="pl-scroll-x -mx-4 mt-3 px-4 lg:mx-0 lg:px-0">
            <ul className="flex gap-1.5 lg:block lg:gap-0 lg:border-t lg:border-pl-teal">
              {[{ slug: '', plural: 'Toutes les familles' }, ...families].map((f, i) => {
                const on = family === f.slug;
                const c = f.slug ? famCount(f.slug) : base.filter((p) => !energy || p.key.energy === energy).length;
                return (
                  <li key={f.slug || 'all'} className="shrink-0">
                    <button type="button" onClick={() => setFamily(f.slug)} aria-pressed={on}
                      className={`group flex w-full items-baseline gap-3 whitespace-nowrap border px-3 py-2 text-left text-[13.5px] transition-colors lg:whitespace-normal lg:border-0 lg:border-b lg:border-pl-line lg:px-0 lg:py-2.5 ${on ? 'border-pl-teal bg-pl-teal text-white lg:bg-transparent lg:text-pl-teal' : 'border-pl-line text-pl-ink/80 hover:text-pl-ink'}`}>
                      <span className={`hidden font-pl-mono text-[10px] lg:inline ${on ? 'text-pl-teal' : 'text-pl-ink/45'}`}>{pad(i)}</span>
                      <span className="flex-1">
                        <span className={`mr-1.5 hidden h-px align-middle transition-all duration-500 lg:inline-block ${on ? 'w-4 bg-pl-cyan' : 'w-0'}`} aria-hidden="true" />
                        {f.plural}
                      </span>
                      <span className={`font-pl-mono text-[10.5px] pl-tnum ${on ? 'text-white/80 lg:text-pl-teal' : 'text-pl-ink/50'}`}>{pad(c)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </aside>

      <div className="min-w-0 lg:col-span-6">
        {/* Barre d'outils */}
        <div className="border border-pl-teal bg-white">
          <div className="flex items-stretch border-b border-pl-line">
            <label htmlFor="pl-q" className="flex items-center pl-4 text-pl-teal"><ISearch /><span className="sr-only">Rechercher une machine</span></label>
            <input id="pl-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher : modèle, famille, usage…"
              className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-[15px] text-pl-ink placeholder:text-pl-ink/45 focus:outline-none" autoComplete="off" />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="px-4 text-pl-ink/60 hover:text-pl-teal" aria-label="Effacer la recherche"><IClose /></button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Énergie">
              <Mono className="mr-1 text-pl-ink/55">Énergie</Mono>
              {(['', ...allEnergies] as (Energy | '')[]).map((e) => {
                const on = energy === e;
                const n = e ? scope.filter((p) => p.key.energy === e).length : scope.length;
                return (
                  <button key={e || 'all'} type="button" onClick={() => setEnergy(e)} aria-pressed={on} disabled={!on && n === 0}
                    className={`border px-2.5 py-1 font-pl-mono text-[11px] transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${on ? 'border-pl-teal bg-pl-teal text-white' : 'border-pl-line text-pl-ink/75 hover:border-pl-teal'}`}>
                    {e ? ENERGY_LABEL[e] : 'Toutes'}
                  </button>
                );
              })}
            </div>
            <div className="ml-auto flex items-center gap-3">
              <label className="flex items-center gap-2">
                <Mono className="text-pl-ink/55">Tri</Mono>
                <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="border border-pl-line bg-white px-2 py-1 font-pl-mono text-[11.5px] text-pl-ink focus:border-pl-teal">
                  {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              <div className="flex border border-pl-line" role="group" aria-label="Affichage">
                <button type="button" onClick={() => changeView('grid')} aria-pressed={view === 'grid'} aria-label="Affichage en planches"
                  className={`p-1.5 ${view === 'grid' ? 'bg-pl-teal text-white' : 'text-pl-ink/70 hover:text-pl-teal'}`}><IGrid /></button>
                <button type="button" onClick={() => changeView('table')} aria-pressed={view === 'table'} aria-label="Affichage en tableau"
                  className={`border-l border-pl-line p-1.5 ${view === 'table' ? 'bg-pl-teal text-white' : 'text-pl-ink/70 hover:text-pl-teal'}`}><ITable /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Bandeau de famille / résultat */}
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-pl-line pb-4">
          <div className="max-w-2xl">
            <p className="text-[24px] font-light tracking-[-0.025em] text-pl-ink" aria-live="polite">
              {fam ? fam.plural : 'Toutes les machines'}
              <span className="ml-3 font-pl-mono text-[12px] tracking-normal text-pl-teal">{pad(results.length)} / {pad(total)}</span>
            </p>
            {fam && familyIntro(fam) && <p className="mt-2 text-[14px] leading-relaxed text-pl-ink/70">{familyIntro(fam)}</p>}
          </div>
          {filtered && (
            <button type="button" onClick={reset} className="inline-flex items-center gap-2 font-pl-mono text-[11px] uppercase tracking-[0.08em] text-pl-teal hover:text-pl-ink">
              <IClose size={12} /> Réinitialiser
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="mt-8 grid place-items-center border border-dashed border-pl-teal/50 bg-pl-paper px-6 py-16 text-center">
            <svg width="120" height="84" viewBox="0 0 120 84" className="text-pl-teal" aria-hidden="true">
              <rect x="0.5" y="0.5" width="119" height="83" fill="#fff" stroke="currentColor" />
              <path d="M0.5 0.5 119.5 83.5M119.5 0.5 0.5 83.5" stroke="#49B5BF" strokeDasharray="3 3" />
            </svg>
            <p className="mt-6 text-[22px] font-light tracking-[-0.02em]">Aucune machine ne correspond.</p>
            <p className="mt-2 max-w-sm text-[14px] text-pl-ink/70">Modifiez la recherche ou les filtres, ou décrivez votre besoin : nous orienterons votre choix.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 bg-pl-teal px-5 text-[14px] text-white hover:bg-pl-ink">Réinitialiser les filtres</button>
              <Link href={quoteHref()} className="inline-flex min-h-11 items-center gap-2 border border-pl-teal px-5 text-[14px] text-pl-teal hover:bg-pl-teal hover:text-white">Décrire mon besoin</Link>
            </div>
          </div>
        ) : view === 'grid' ? (
          <ul className="mt-6 grid grid-cols-2 xl:grid-cols-3">
            {results.map((p, i) => <li key={p.slug}><ProductPlate p={p} n={i + 1} priority={i < 3} headingLevel={2} /></li>)}
          </ul>
        ) : (
          <div className="mt-6 overflow-x-auto border border-pl-line">
            <table className="w-full min-w-[760px] border-collapse text-left text-[13.5px]">
              <caption className="sr-only">Machines du catalogue, vue tableau</caption>
              <thead className="bg-pl-paper font-pl-mono text-[10px] uppercase tracking-[0.1em] text-pl-ink/60">
                <tr className="border-b border-pl-teal">
                  <th scope="col" className="px-3 py-2.5 font-normal">Fig.</th>
                  <th scope="col" className="py-2.5 font-normal">Machine</th>
                  <th scope="col" className="py-2.5 font-normal">Famille</th>
                  <th scope="col" className="py-2.5 text-right font-normal">Rendement</th>
                  <th scope="col" className="py-2.5 text-right font-normal">Largeur</th>
                  <th scope="col" className="py-2.5 text-right font-normal">Capacité</th>
                  <th scope="col" className="py-2.5 pl-4 font-normal">Énergie</th>
                  <th scope="col" className="py-2.5 pr-3 text-right font-normal"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {results.map((p, i) => (
                  <tr key={p.slug} className="group border-b border-pl-line hover:bg-pl-paper">
                    <td className="px-3 py-2 font-pl-mono text-[11px] text-pl-teal">{pad(i + 1)}</td>
                    <td className="py-2">
                      <Link href={productHref(p.slug)} className="flex items-center gap-3">
                        <span className="pl-graph relative block h-11 w-11 shrink-0 border border-pl-line">
                          <Image src={img.product(p.img)} alt="" fill sizes="44px" className="object-contain p-1" />
                        </span>
                        <span>
                          <span className="block text-[15px] text-pl-ink group-hover:text-pl-teal">{p.name}</span>
                          <span className="font-pl-mono text-[10.5px] text-pl-ink/55">p. {p.page}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="py-2 text-pl-ink/75">{getFamily(p.family)?.name}</td>
                    <td className="py-2 text-right font-pl-mono text-[12px] pl-tnum">{p.key.productivity ? `${fmt(p.key.productivity, 0)} m²/h` : '—'}</td>
                    <td className="py-2 text-right font-pl-mono text-[12px] pl-tnum">{p.key.width ? `${fmt(p.key.width, 0)} mm` : '—'}</td>
                    <td className="py-2 text-right font-pl-mono text-[12px] pl-tnum">{p.key.tank ? `${fmt(p.key.tank)} L` : '—'}</td>
                    <td className="py-2 pl-4 font-pl-mono text-[11.5px] text-pl-ink/75">{p.key.energy ? ENERGY_LABEL[p.key.energy] : '—'}</td>
                    <td className="py-2 pr-3">
                      <div className="flex justify-end gap-1">
                        <Link href={productHref(p.slug)} className="inline-flex items-center gap-1 px-2 py-1 text-[12.5px] text-pl-teal hover:underline">Voir la fiche <IArrow size={12} /></Link>
                        <Link href={quoteHref(p.slug)} aria-label={`Demander un devis pour ${p.name}`} className="inline-flex items-center gap-1 border border-pl-line px-2 py-1 text-[12.5px] text-pl-ink/80 hover:border-pl-teal hover:bg-pl-teal hover:text-white"><IPlus size={11} /> Devis</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
