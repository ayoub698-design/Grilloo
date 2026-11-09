import Image from 'next/image';
import { brand, getProduct, keyFigures, stats } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { Reveal } from './Reveal';
import { Btn, Cartouche, Container, DimH, DimV, Mono, href, productDims, quoteHref } from './ui';

/** § 01 — Hero : titre, détouré dans un cadre de dessin coté, chiffres de la fiche, cartouche. */
export function HomeHero() {
  const p = getProduct('roboclean-g-plus')!;
  const figs = keyFigures(p, 4);
  const dims = productDims(p);
  const water = p.specs.find(([k]) => /réservoir d.eau propre/i.test(k));
  const brush = p.specs.find(([k]) => /largeur de travail des brosses/i.test(k));

  return (
    <section aria-labelledby="pl-hero-title" className="relative bg-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Container className="h-full"><div className="pl-grid8 h-full border-r border-pl-line opacity-70" /></Container>
      </div>
      <Container className="relative">
        <div className="grid gap-y-10 pb-14 pt-10 md:pt-14 lg:grid-cols-8 lg:gap-x-0 lg:pb-20 lg:pt-16">
          {/* Texte */}
          <Reveal className="lg:col-span-4 lg:pr-12 lg:pt-6">
            <div className="pl-rise flex items-center gap-3">
              <span className="h-2 w-2 bg-pl-cyan" aria-hidden="true" />
              <Mono className="text-pl-teal">{brand.cover.title}</Mono>
            </div>
            <h1 id="pl-hero-title" className="mt-7 text-[clamp(3.1rem,6.6vw,5.9rem)] font-light leading-[0.9] tracking-[-0.055em] text-pl-ink">
              <span className="pl-wipe block pb-[0.06em]" style={{ ['--d' as string]: '80ms' }}>Nettoyez</span>
              <span className="pl-wipe block pb-[0.06em]" style={{ ['--d' as string]: '200ms' }}>avec</span>
              <span className="pl-wipe block pb-[0.06em] text-pl-teal" style={{ ['--d' as string]: '320ms' }}>excellence</span>
            </h1>
            <div className="pl-rule mt-7 h-px w-full max-w-[30rem] bg-pl-teal" style={{ ['--d' as string]: '400ms' }} aria-hidden="true" />
            <p className="pl-rise mt-5 max-w-[30rem] text-[16px] leading-[1.6] text-pl-ink/80" style={{ ['--d' as string]: '450ms' }}>
              {brand.cover.text}
            </p>
            <div className="pl-rise mt-8 flex flex-wrap gap-3" style={{ ['--d' as string]: '600ms' }}>
              <Btn href={href('/produits')} className="w-full sm:w-auto">Explorer les {stats.products} machines</Btn>
              <Btn href={quoteHref()} variant="line" className="w-full sm:w-auto">Demander un devis</Btn>
            </div>
            <dl className="pl-rise mt-10 grid max-w-[30rem] grid-cols-3 border-t border-pl-line" style={{ ['--d' as string]: '750ms' }}>
              {[
                [String(stats.products), 'machines'],
                [String(stats.families), 'familles'],
                ['2024', 'catalogue'],
              ].map(([v, k]) => (
                <div key={k} className="border-r border-pl-line pt-3 last:border-r-0 [&:not(:first-child)]:pl-4">
                  <dt className="sr-only">{k}</dt>
                  <dd className="text-[26px] font-light tracking-[-0.03em] text-pl-ink pl-tnum">{v}</dd>
                  <dd className="font-pl-mono text-[10.5px] uppercase tracking-[0.08em] text-pl-ink/60">{k}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Planche */}
          <Reveal as="figure" className="lg:col-span-4" aria-label={`${p.name} — planche cotée`}>
            <div className="border border-pl-teal bg-white">
              <div className="flex items-center justify-between border-b border-pl-teal px-3 py-2">
                <Mono className="text-pl-teal">Fig. 01 — {p.name}</Mono>
                <Mono className="text-pl-ink/55">Vue 3/4 · {p.kind}</Mono>
              </div>
              <div className="pl-graph relative pt-4">
                <div className="relative ml-[20%] aspect-[556/630] w-[62%] sm:ml-[17%] sm:w-[50%] lg:max-w-[340px]">
                  <div className="absolute inset-[7%]">
                    <Image src={img.product(p.img)} alt={`${p.name}, ${p.kind.toLowerCase()} GRILLOO`} fill priority sizes="(min-width: 1024px) 340px, 60vw" className="object-contain" />
                  </div>
                  {dims.h && <DimV label={dims.h} className="-left-11 top-[7%] bottom-[7%] sm:-left-14" labelBg="#F6F8F8" />}
                  {dims.w && <DimH label={dims.w} className="-bottom-2 left-[7%] right-[7%]" labelBg="#F6F8F8" />}
                  {/* Repères annotés (masqués sur mobile, faute de place) */}
                  <div className="hidden sm:block">
                    <svg className="pl-draw absolute inset-0 h-full w-full overflow-visible text-pl-teal" viewBox="0 0 100 113" preserveAspectRatio="none" aria-hidden="true">
                      <path className="d" pathLength={1} d="M81 98.3 L92 104 L104 104" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" style={{ ['--d' as string]: '1300ms' }} />
                      <path className="d" pathLength={1} d="M48 43 L78 22 L104 22" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" style={{ ['--d' as string]: '1450ms' }} />
                    </svg>
                    <span className="pl-rise absolute left-[81%] top-[87%] -ml-[4px] -mt-[4px] h-2 w-2 rounded-full border border-pl-teal bg-white" style={{ ['--d' as string]: '1300ms' }} aria-hidden="true" />
                    <span className="pl-rise absolute left-[48%] top-[38%] -ml-[4px] -mt-[4px] h-2 w-2 rounded-full border border-pl-teal bg-white" style={{ ['--d' as string]: '1450ms' }} aria-hidden="true" />
                    {brush && (
                      <p className="pl-rise absolute left-[104%] top-[92%] w-40 -translate-y-full pb-1 pl-2" style={{ ['--d' as string]: '1700ms' }}>
                        <Mono className="block text-pl-ink/55">Brosses</Mono>
                        <span className="font-pl-mono text-[11.5px] text-pl-ink">{brush[1]}</span>
                      </p>
                    )}
                    {water && (
                      <p className="pl-rise absolute left-[104%] top-[19.5%] w-40 -translate-y-full pb-1 pl-2" style={{ ['--d' as string]: '1800ms' }}>
                        <Mono className="block text-pl-ink/55">Eau propre / sale</Mono>
                        <span className="font-pl-mono text-[11.5px] text-pl-ink">{water[1]}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="h-10" />
              </div>
              {/* Chiffres clés de la fiche */}
              <dl className="grid grid-cols-2 border-t border-pl-teal sm:grid-cols-4">
                {figs.map((f, i) => (
                  <div key={f.id} className={`border-pl-line px-3 py-3 ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t sm:border-t-0' : ''} ${i === 2 ? 'sm:border-l' : ''}`}>
                    <dt className="font-pl-mono text-[10px] uppercase tracking-[0.08em] text-pl-ink/55">{f.label}</dt>
                    <dd className="mt-1 text-[22px] font-light tracking-[-0.03em] text-pl-ink pl-tnum">
                      <span className="pl-settle" style={{ ['--d' as string]: `${900 + i * 120}ms` }}>{f.value}</span>
                      <span className="ml-1 font-pl-mono text-[11px] tracking-normal text-pl-teal">{f.unit}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <figcaption>
              <Cartouche className="border-t-0" cells={[
                { k: 'Désignation', v: p.name },
                { k: 'Famille', v: 'Autolaveuse' },
                { k: 'Réf. catalogue', v: `p. ${p.page}` },
                { k: 'Feuille', v: '01 / 05' },
              ]} />
            </figcaption>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
