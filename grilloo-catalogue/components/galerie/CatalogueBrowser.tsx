'use client';
import { useMemo } from 'react';
import { useCatalogFilter } from '@/lib/hooks';
import { families, products, productsOf, energies, ENERGY_LABEL, getFamily, familyIntro, type Energy } from '@/lib/catalog';
import { ProductCard } from './ProductCard';
import { Search, Close } from './icons';
import { Reveal } from './motion';

const SORTS = [
  { v: 'catalogue', l: 'Ordre du catalogue' },
  { v: 'rendement', l: 'Rendement' },
  { v: 'capacite', l: 'Capacité' },
  { v: 'nom', l: 'Nom' },
] as const;

export function CatalogueBrowser() {
  const f = useCatalogFilter();
  const allEnergies = useMemo(() => energies(products), []);
  const fam = f.family ? getFamily(f.family) : undefined;
  const indexOf = useMemo(() => new Map(products.map((p, i) => [p.slug, i + 1])), []);
  const active = !!(f.query || f.family || f.energy);

  return (
    <div>
      {/* Recherche */}
      <div className="grid gap-10 lg:grid-cols-12">
        <label className="relative block lg:col-span-7">
          <span className="sr-only">Rechercher une machine</span>
          <Search className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 ga-text-stone" />
          <input
            type="search"
            value={f.query}
            onChange={(e) => f.setQuery(e.target.value)}
            placeholder="Rechercher une machine…"
            className="ga-display w-full border-0 border-b border-ga-ink/70 bg-transparent py-4 pl-10 pr-10 text-[clamp(20px,2.4vw,32px)] italic placeholder:text-[#A9A49B] focus:border-ga-ink focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {f.query && (
            <button type="button" onClick={() => f.setQuery('')} className="absolute right-0 top-1/2 -translate-y-1/2 p-2" aria-label="Effacer la recherche">
              <Close className="h-4 w-4" />
            </button>
          )}
        </label>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 lg:col-span-4 lg:col-start-9">
          <p className="whitespace-nowrap pb-4 text-[13.5px] ga-text-stone" aria-live="polite">
            <span className="ga-num text-[28px] text-ga-ink">{f.results.length}</span>
            <span className="ml-2">{f.results.length > 1 ? 'machines' : 'machine'} sur {f.total}</span>
          </p>
          <label className="pb-4 text-[13px]">
            <span className="ga-caps ga-text-stone mr-3">Trier</span>
            <select value={f.sort} onChange={(e) => f.setSort(e.target.value as typeof f.sort)} className="ga-input !inline-block !w-auto !py-1 text-[13.5px]">
              {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </label>
        </div>
      </div>

      {/* Familles */}
      <nav aria-label="Filtrer par famille" className="mt-12">
        <p className="ga-caps ga-text-stone">Familles</p>
        <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-3 text-[14.5px]">
          <li>
            <button type="button" aria-pressed={!f.family} onClick={() => f.setFamily('')} className={`py-1 ${!f.family ? '' : 'ga-text-stone hover:text-ga-ink'}`}>
              <span className={`ga-link ${!f.family ? 'ga-link--on' : ''}`}>Toutes</span>
              <sup className="ml-1 text-[10px] ga-text-stone">{f.total}</sup>
            </button>
          </li>
          {families.map((x) => {
            const on = f.family === x.slug;
            return (
              <li key={x.slug}>
                <button type="button" aria-pressed={on} onClick={() => f.setFamily(on ? '' : x.slug)} className={`py-1 ${on ? 'ga-display text-[17px] italic' : 'ga-text-stone hover:text-ga-ink'}`}>
                  <span className={`ga-link ${on ? 'ga-link--on' : ''}`}>{x.plural}</span>
                  <sup className="ml-1 font-sans text-[10px] not-italic ga-text-stone">{productsOf(x.slug).length}</sup>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Énergie */}
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-ga-line pb-8 text-[13.5px]" role="group" aria-label="Filtrer par énergie">
        <span className="ga-caps ga-text-stone">Énergie</span>
        {(['', ...allEnergies] as (Energy | '')[]).map((e) => {
          const on = f.energy === e;
          return (
            <button key={e || 'all'} type="button" aria-pressed={on} onClick={() => f.setEnergy(e)} className={`flex items-center gap-2 py-1 ${on ? '' : 'ga-text-stone hover:text-ga-ink'}`}>
              <span className={`inline-block h-[7px] w-[7px] rounded-full border ${on ? 'border-ga-ink bg-ga-ink' : 'border-[#B9B4AA]'}`} aria-hidden />
              {e ? ENERGY_LABEL[e] : 'Toutes'}
            </button>
          );
        })}
        {active && (
          <button type="button" onClick={f.reset} className="ml-auto flex items-center gap-2 py-1 text-ga-ink">
            <Close className="h-3 w-3" /> <span className="ga-link">Réinitialiser</span>
          </button>
        )}
      </div>

      {fam && (
        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <h2 className="ga-display text-[clamp(34px,3.6vw,52px)] leading-none lg:col-span-5">{fam.plural}</h2>
          <p className="max-w-2xl text-[15px] leading-[1.75] ga-text-stone lg:col-span-6 lg:col-start-7">{familyIntro(fam)}</p>
        </div>
      )}

      {f.results.length > 0 ? (
        <ul className="mt-16 grid gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14 lg:gap-y-24">
          {f.results.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 3) * 120}>
              <ProductCard p={p} index={indexOf.get(p.slug)} headingLevel={fam ? 'h3' : 'h2'} />
            </Reveal>
          ))}
        </ul>
      ) : (
        <div className="mx-auto mt-20 max-w-xl py-16 text-center">
          <p className="ga-caps ga-text-stone">Aucun résultat</p>
          <p className="ga-display mt-5 text-[34px] leading-tight md:text-[42px]">Aucune machine ne correspond <em>à cette recherche.</em></p>
          <p className="mt-5 text-[15px] leading-relaxed ga-text-stone">
            Essayez un autre terme (« moquette », « batterie », « G9 »…) ou retirez un filtre. Vous pouvez aussi nous décrire votre besoin.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <button type="button" onClick={f.reset} className="ga-btn ga-btn--ink">Voir toutes les machines</button>
          </div>
        </div>
      )}
    </div>
  );
}
