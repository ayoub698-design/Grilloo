import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { brand, families, featured, fmt, fmtRange, getProduct, keyFigures, process, productsOf, range, stats, warranty, familyHero } from '@/lib/catalog';
import { img, beforeAfter } from '@/lib/assets';
import { Reveal, Lines, Parallax, Curve } from '@/components/galerie/motion';
import { Plinth } from '@/components/galerie/Plinth';
import { ProductCard } from '@/components/galerie/ProductCard';
import { Caption, TextLink, Button, ArchCut, Container } from '@/components/galerie/ui';
import { ArrowRight, ArrowDown, Download } from '@/components/galerie/icons';
import { to, productHref, quoteHref, familyHref, pad } from '@/components/galerie/links';
import { citedStandards, topProductivity } from '@/components/galerie/facts';

export const metadata: Metadata = {
  title: { absolute: 'GRILLOO — Nettoyez avec excellence · Galerie' },
  description: `${brand.cover.text} ${stats.products} machines professionnelles en ${stats.families} familles.`,
};

const ROMAN = ['I', 'II', 'III', 'IV'];

export default function GalerieHome() {
  const hero = getProduct('roboclean-g-plus')!;
  const heroFigs = keyFigures(hero, 2);
  const cta = getProduct('g9')!;
  const standards = citedStandards();

  return (
    <>
      {/* 1 — Hero */}
      <section aria-labelledby="ga-hero-title" className="relative overflow-hidden">
        <Container className="grid lg:min-h-[min(calc(100svh-84px),920px)] items-center gap-12 pb-16 pt-10 lg:grid-cols-12 lg:gap-8 lg:pb-20 lg:pt-6">
          <div className="lg:col-span-7">
            <Reveal variant="fade"><Caption rule>{brand.cover.title}</Caption></Reveal>
            <Lines
              as="h1"
              id="ga-hero-title"
              className="ga-display mt-8 text-[clamp(56px,8vw,128px)] leading-[.92] tracking-[-0.035em]"
              lines={['Nettoyez', <span key="b">avec <em>excellence</em></span>]}
              delay={150}
            />
            <Reveal delay={450}>
              <p className="ga-display mt-8 max-w-xl text-[clamp(22px,2.1vw,30px)] italic leading-[1.2]">{brand.backCover}</p>
              <p className="mt-6 max-w-[34rem] text-[15px] leading-[1.75] ga-text-stone">{brand.cover.text}</p>
            </Reveal>
            <Reveal delay={650} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
              <Button href={to('/produits')}>Découvrir la collection</Button>
              <TextLink href={quoteHref()}>Demander un devis</TextLink>
            </Reveal>
          </div>

          <div className="relative lg:col-span-5">
            <Reveal variant="img" delay={250}>
              <Parallax speed={0.05}>
                <Plinth slug={hero.slug} alt="RoboClean G+, autolaveuse autonome GRILLOO, posée sur un socle" niche priority ratio="5 / 6" base={0.2} inset={20} top={14} sizes="(min-width: 1024px) 46vw, 92vw" className="mx-auto max-w-[620px]" />
              </Parallax>
            </Reveal>
            <Reveal delay={900} className="mx-auto mt-6 flex max-w-[620px] items-start justify-between gap-6 border-t border-ga-line pt-4">
              <div>
                <p className="ga-caps ga-text-stone">N°01 — {hero.kind}</p>
                <Link href={productHref(hero.slug)} className="ga-display mt-1 inline-block whitespace-nowrap text-[24px]"><span className="ga-link">{hero.name}</span></Link>
              </div>
              <dl className="flex gap-7 text-right">
                {heroFigs.map((f, i) => (
                  <div key={f.id} className={i ? 'hidden sm:block' : ''}>
                    <dt className="ga-caps ga-text-stone">{f.label}</dt>
                    <dd className="ga-num mt-1 text-[20px]">{f.value}<span className="ml-1 font-sans text-[11px] ga-text-stone">{f.unit}</span></dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </Container>
        <a href="#collection" className="ga-caps ga-text-stone absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex">
          <span>La collection</span>
          <ArrowDown className="h-[22px] w-[10px]" />
        </a>
      </section>

      <Curve shape="descend" />

      {/* 2 — Collection */}
      <section id="collection" aria-labelledby="ga-collection-title" className="scroll-mt-24 pb-24 pt-16 lg:pb-36 lg:pt-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal variant="fade"><Caption rule>N°02 — La collection</Caption></Reveal>
              <Lines id="ga-collection-title" className="ga-display mt-6 text-[clamp(42px,5.6vw,88px)] leading-[.98]" lines={['Huit machines,', <em key="e">une par usage.</em>]} />
            </div>
            <Reveal delay={200} className="self-end lg:col-span-4 lg:col-start-9">
              <p className="text-[15px] leading-[1.75] ga-text-stone">
                Une sélection parmi les {stats.products} machines du catalogue 2024 — de l’autolaveuse autonome à la balayeuse autoportée, chacune présentée avec ses chiffres de fiche.
              </p>
              <TextLink href={to('/produits')} className="mt-6">Voir les {stats.products} machines</TextLink>
            </Reveal>
          </div>

          <ul className="mt-20 grid gap-x-10 gap-y-20 sm:grid-cols-2 lg:mt-28 lg:grid-cols-3 lg:gap-x-14 lg:gap-y-28 lg:pb-28">
            {featured.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i % 3) * 140} className={i % 3 === 1 ? 'lg:translate-y-28' : i % 3 === 2 ? 'lg:translate-y-12' : ''}>
                <ProductCard p={p} index={i + 1} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" />
              </Reveal>
            ))}
          </ul>

          {/* Les dix familles */}
          <div className="mt-28 grid gap-10 lg:mt-36 lg:grid-cols-12">
            <div className="self-start lg:sticky lg:top-32 lg:col-span-4">
              <Caption>Les familles</Caption>
              <Lines as="h3" className="ga-display mt-5 text-[clamp(34px,3.6vw,52px)] leading-[1.02]" lines={[`${stats.families} familles,`, <em key="e">{stats.products} machines.</em>]} />
              <p className="mt-6 max-w-sm text-[14.5px] leading-[1.75] ga-text-stone">
                Chaque famille réunit des modèles de même principe ; les écarts se lisent dans les chiffres : rendement, capacité, largeur de travail.
              </p>
            </div>
            <ol className="border-t border-ga-ink/80 lg:col-span-8">
              {families.map((f, i) => {
                const list = productsOf(f.slug);
                const prod = range(list, 'productivity');
                const tank = range(list, 'tank');
                const hint = prod ? `${fmtRange(prod)} m²/h` : tank ? `${fmtRange(tank)} L` : '';
                return (
                  <Reveal as="li" key={f.slug} variant="fade" delay={i * 50} className="border-b border-ga-line">
                    <Link href={familyHref(f.slug)} className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-5 sm:grid-cols-[3rem_1fr_9rem_auto] md:py-6">
                      <span className="ga-caps ga-text-stone">{pad(i + 1)}</span>
                      <span className="ga-display min-w-0 text-[24px] leading-[1.1] transition-transform duration-700 group-hover:translate-x-2 sm:text-[30px]">
                        {f.plural}
                        <span className="ml-3 align-top font-sans text-[11px] tracking-wider ga-text-stone">{list.length}</span>
                      </span>
                      <span className="hidden text-right text-[13px] ga-text-stone sm:block">{hint}</span>
                      <span className="flex items-center gap-4">
                        <span className="pointer-events-none relative hidden h-14 w-14 opacity-0 transition-all duration-700 group-hover:opacity-100 md:block" aria-hidden>
                          <Image src={img.product(familyHero(f.slug))} alt="" fill sizes="56px" className="object-contain mix-blend-multiply" />
                        </span>
                        <ArrowRight className="ga-arrow h-[9px] w-[20px]" />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </Container>
      </section>

      {/* 3 — Savoir-faire */}
      <section aria-labelledby="ga-savoir-title" className="relative bg-ga-ivory">
        <ArchCut />
        <Container className="pb-24 pt-14 lg:pb-36 lg:pt-20">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <Reveal variant="fade"><Caption rule>N°03 — Savoir-faire</Caption></Reveal>
              <Lines id="ga-savoir-title" className="ga-display mt-6 text-[clamp(42px,5.4vw,84px)] leading-[.98]" lines={['Quatre gestes,', <em key="e">un seul passage.</em>]} />
              <Reveal delay={200} className="mt-10 border-l border-[#49B5BF] pl-6">
                <p className="ga-caps ga-text-stone">L’objectif de la marque</p>
                <blockquote className="ga-display mt-3 text-[22px] italic leading-[1.35] md:text-[25px]">« {brand.mission} »</blockquote>
              </Reveal>
              <Reveal delay={300} className="mt-10"><TextLink href={to('/a-propos')}>L’histoire et les engagements GRILLOO</TextLink></Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <div className="grid grid-cols-2 gap-3 sm:gap-5">
                <Reveal variant="img" as="figure">
                  <div className="relative aspect-[3/4] overflow-hidden bg-ga-ivory">
                    <Image src={beforeAfter.before} alt="Sol béton encrassé, avant le passage d’une autolaveuse" fill sizes="(min-width: 1024px) 24vw, 45vw" className="object-cover" />
                  </div>
                  <figcaption className="ga-caps ga-text-stone mt-3">Avant</figcaption>
                </Reveal>
                <Reveal variant="img" as="figure" delay={200} className="mt-16 sm:mt-24">
                  <div className="relative aspect-[3/4] overflow-hidden bg-ga-ivory">
                    <Image src={beforeAfter.after} alt="Le même sol béton, propre et sec après le passage" fill sizes="(min-width: 1024px) 24vw, 45vw" className="object-cover" />
                  </div>
                  <figcaption className="ga-caps ga-text-stone mt-3">Après</figcaption>
                </Reveal>
              </div>
              <p className="mt-6 max-w-md text-[12.5px] italic leading-relaxed ga-text-stone">{beforeAfter.caption}</p>
            </div>
          </div>

          <ol className="mt-20 grid gap-y-12 border-t border-ga-ink/70 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
            {process.map((s, i) => (
              <Reveal as="li" key={s.step} delay={i * 140} className="pt-8 sm:pr-8 lg:border-l lg:border-ga-line lg:pl-8 lg:first:border-l-0 lg:first:pl-0">
                <span className="ga-num text-[15px] italic ga-text-stone">{ROMAN[i]}.</span>
                <h3 className="ga-display mt-4 text-[34px] leading-none">{s.step}</h3>
                <p className="mt-5 max-w-xs text-[14.5px] leading-[1.7] ga-text-stone">{s.text}</p>
              </Reveal>
            ))}
          </ol>
          <p className="mt-10 text-[12.5px] ga-text-stone">Principe d’une autolaveuse, tel que décrit dans les fiches du catalogue.</p>
        </Container>
      </section>

      {/* 4 — Réassurance factuelle */}
      <section aria-labelledby="ga-reperes-title" className="pb-24 pt-24 lg:pb-32 lg:pt-36">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal variant="fade"><Caption rule>N°04 — Repères</Caption></Reveal>
              <Lines id="ga-reperes-title" className="ga-display mt-6 text-[clamp(42px,5.4vw,84px)] leading-[.98]" lines={['Des faits,', <em key="e">rien que des faits.</em>]} />
            </div>
            <Reveal delay={200} className="self-end lg:col-span-4 lg:col-start-9">
              <p className="text-[15px] leading-[1.75] ga-text-stone">Chiffres, garanties et normes : uniquement ce que publient le catalogue 2024 et les fiches produits.</p>
            </Reveal>
          </div>

          <dl className="mt-16 grid border-t border-ga-ink/80 md:grid-cols-3 lg:mt-24">
            {[
              { v: String(stats.products), u: '', l: 'machines au catalogue 2024', d: 'Toutes présentées fiche par fiche.' },
              { v: String(stats.families), u: '', l: 'familles', d: 'De l’autolaveuse accompagnée aux équipements.' },
              { v: fmt(topProductivity?.key.productivity ?? stats.maxProd, 0), u: 'm²/h', l: 'de rendement théorique', d: `Maximum du catalogue — ${topProductivity?.kind.toLowerCase() ?? ''} ${topProductivity?.name ?? ''}.` },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 150} className="border-b border-ga-line py-10 md:border-b-0 md:border-l md:px-10 md:first:border-l-0 md:first:pl-0">
                <dt className="sr-only">{s.l}</dt>
                <dd>
                  <span className="ga-num block text-[clamp(84px,9vw,148px)] leading-[.85] tracking-[-0.04em]">
                    {s.v}{s.u && <span className="ml-2 align-top font-sans text-[14px] tracking-wide ga-text-stone">{s.u}</span>}
                  </span>
                  <span className="ga-display mt-6 block text-[22px] italic">{s.l}</span>
                  <span className="mt-2 block text-[13.5px] ga-text-stone">{s.d}</span>
                </dd>
              </Reveal>
            ))}
          </dl>

          <div className="mt-20 grid gap-16 lg:mt-28 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-5">
              <h3 className="ga-display text-[30px] leading-tight">Garantie</h3>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed ga-text-stone">Principes du catalogue (p. 6). La durée est précisée produit par produit.</p>
              <dl className="mt-8 border-t border-ga-line text-[14px]">
                {warranty.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-ga-line py-3.5 sm:grid-cols-[10rem_1fr]">
                    <dt className="ga-caps ga-text-stone pt-0.5">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={150} className="lg:col-span-6 lg:col-start-7">
              <h3 className="ga-display text-[30px] leading-tight">Normes et garanties citées par les fiches</h3>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed ga-text-stone">Relevées telles quelles dans les caractéristiques des machines concernées.</p>
              <table className="mt-8 w-full border-t border-ga-line text-left text-[14px]">
                <caption className="sr-only">Normes, indices et garanties cités dans les fiches produits</caption>
                <thead className="sr-only"><tr><th>Critère</th><th>Valeur</th><th>Machines</th></tr></thead>
                <tbody>
                  {standards.map((r) => (
                    <tr key={r.title + r.value} className="border-b border-ga-line align-top">
                      <th scope="row" className="ga-caps ga-text-stone w-[36%] py-3.5 pr-4 font-medium">{r.title}</th>
                      <td className="ga-num w-[22%] py-3 pr-4 text-[18px] leading-snug">{r.value}</td>
                      <td className="py-3.5 text-[13px] leading-relaxed">
                        {r.products.map((p, i) => (
                          <span key={p.slug}>{i > 0 && ', '}<Link href={productHref(p.slug)} className="ga-link">{p.name}</Link></span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>

          <Reveal className="mt-20 flex flex-col gap-6 border-y border-ga-line py-8 sm:flex-row sm:items-center sm:justify-between lg:mt-28">
            <div className="flex items-baseline gap-5">
              <span className="ga-caps ga-text-stone">PDF</span>
              <p className="ga-display text-[24px] leading-tight md:text-[28px]">{brand.cover.title}</p>
            </div>
            <a href={img.catalogue} target="_blank" rel="noopener" className="ga-btn ga-btn--line shrink-0">
              <Download className="h-4 w-4" /> Télécharger le catalogue
            </a>
          </Reveal>
        </Container>
      </section>

      <Curve shape="rise" />

      {/* 5 — Appel à l'action */}
      <section aria-labelledby="ga-cta-title" className="pb-24 pt-10 lg:pb-36">
        <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <Reveal variant="fade"><Caption rule>N°05 — Devis</Caption></Reveal>
            <Lines id="ga-cta-title" className="ga-display mt-6 text-[clamp(46px,6.4vw,104px)] leading-[.95]" lines={['Une machine,', 'une surface,', <em key="e">un devis.</em>]} />
            <Reveal delay={250}>
              <p className="mt-8 max-w-md text-[15px] leading-[1.75] ga-text-stone">
                Indiquez le modèle qui vous intéresse, la surface à traiter et le type de sol. Une démonstration, un conseil ou une question de service après-vente passent par le même formulaire.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
                <Button href={quoteHref()}>Demander un devis</Button>
                <TextLink href={to('/contact')}>Coordonnées et horaires</TextLink>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal variant="img">
              <Link href={productHref(cta.slug)} className="ga-lift block" aria-label={`${cta.name} — voir la fiche`}>
                <Plinth slug={cta.slug} alt={`${cta.name}, autolaveuse autoportée GRILLOO`} ratio="1 / 1" base={0.22} inset={12} top={4} sizes="(min-width: 1024px) 40vw, 92vw" />
              </Link>
            </Reveal>
            <p className="mt-4 flex justify-between border-t border-ga-line pt-4 text-[13px]">
              <span className="ga-caps ga-text-stone">{cta.name} — {cta.kind}</span>
              <span className="ga-num ga-text-stone">{fmt(cta.key.productivity, 0)} m²/h</span>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
