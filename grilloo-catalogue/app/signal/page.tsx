import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { brand, families, familyHero, fmt, getFamily, getProduct, process, products, stats, warranty } from '@/lib/catalog';
import { img, beforeAfter } from '@/lib/assets';
import { site } from '@/lib/site';
import { Btn, Container, Eyebrow, Pill, familyHref, productHref, quoteHref, to } from '@/components/signal/ui';
import { Marquee, Reveal } from '@/components/signal/motion';
import { BristleEdge, DiagonalEdge, RoundSticker, SqueegeeEdge } from '@/components/signal/shapes';
import FeaturedShowcase from '@/components/signal/FeaturedShowcase';
import { citedStandards, topProductivity } from '@/components/signal/data';
import { ArrowRight, Download, File } from '@/components/signal/icons';

export const metadata = {
  title: { absolute: 'GRILLOO — La puissance du nettoyage entre vos mains' },
  description: `Catalogue GRILLOO 2024 : ${stats.products} machines de nettoyage professionnelles en ${stats.families} familles. Autolaveuses, autoportées, robot RoboClean G+, aspirateurs, monobrosses, balayeuses.`,
};

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export default function SignalHome() {
  const g9 = getProduct('g9')!;
  const robo = getProduct('roboclean-g-plus')!;
  const g54 = getProduct('g54')!;
  const g01m = getProduct('g01m');
  const g100 = getProduct('g100');
  const topFam = getFamily(topProductivity.family);

  const stepVisual = [
    { src: beforeAfter.before, alt: 'Sol béton sale avant lavage (visuel d’illustration)', tag: 'Avant' },
    { src: img.ambiance('brosse'), alt: 'Brosse d’autolaveuse en rotation sur un sol carrelé mouillé (visuel d’illustration)', tag: null },
    { src: img.product(g54.img || g54.slug), alt: `Autolaveuse GRILLOO ${g54.name}`, tag: null, cut: true },
    { src: beforeAfter.after, alt: 'Sol béton propre et sec après le passage (visuel d’illustration)', tag: 'Après' },
  ];

  return (
    <>
      {/* ============ 1 · HERO ============ */}
      <section aria-labelledby="hero-title" className="relative">
        <Container className="relative">
          <div className="relative flex flex-col pb-4 pt-6 md:pt-8 lg:block lg:min-h-[max(700px,min(calc(100svh-76px),920px))] lg:pb-12">
            {/* Aplat cyan + machine qui en déborde (derrière le titre sur grand écran) */}
            <div className="relative order-3 mt-8 h-[380px] sm:h-[500px] lg:absolute lg:bottom-12 lg:right-0 lg:top-[min(19vw,290px)] lg:mt-0 lg:h-auto lg:w-[44%]">
              <div className="si-enter-rise absolute inset-x-0 bottom-0 top-[24%] rounded-[36px] bg-si-cyan md:rounded-[48px]" style={d(120)}>
                <p aria-hidden="true" className="si-display-cond absolute bottom-2 left-5 select-none text-[clamp(5rem,13vw,13rem)] leading-[.8] text-white/40 md:left-8">G9</p>
                <Link href={productHref('g9')} className="si-btn absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-bold [font-stretch:110%] md:bottom-6 md:right-6">
                  {g9.name} · {g9.kind} <ArrowRight className="si-arrow h-4 w-4" />
                </Link>
              </div>
              <div className="si-enter-rise group absolute bottom-[8%] left-1/2 h-[94%] w-[88%] -translate-x-1/2 sm:w-[72%] lg:w-[80%]" style={d(260)}>
                <Image src={img.product('g9')} alt={`Autolaveuse autoportée GRILLOO ${g9.name}`} fill priority sizes="(min-width: 1024px) 40vw, 88vw" className="si-cut object-contain object-bottom drop-shadow-[0_40px_30px_rgba(10,10,10,.28)]" />
              </div>
              <RoundSticker
                text={`Rendement théorique · ${g9.name} · Rendement théorique · ${g9.name} · `}
                center={<><span className="si-num block text-[clamp(1.3rem,2.1vw,2rem)] font-black [font-stretch:115%]">{fmt(g9.key.productivity, 0)}</span><span className="si-label text-[10px]">m²/h</span></>}
                className="si-enter-pop absolute right-2 top-[2%] z-10 w-[112px] shadow-[0_7px_0_#0A0A0A] sm:w-[140px] lg:-left-[8%] lg:right-auto lg:top-[60%] lg:w-[min(12vw,176px)]"
              />
            </div>

            <div className="relative z-20 order-1">
              <div className="si-enter flex flex-wrap items-center gap-2">
                <Pill tone="ink">Catalogue 2024</Pill>
                <Pill tone="white" className="ring-1 ring-inset ring-si-ink/20">{brand.tagline}</Pill>
              </div>
            </div>

            <h1 id="hero-title" className="si-halo relative z-20 order-2 mt-6 text-si-ink lg:mt-8">
              <span className="si-display si-enter-x block text-[clamp(2rem,8.3vw,8.6rem)] lg:text-[min(7.9vw,8.6rem)]" style={d(0)}>La puissance</span>
              <span className="si-display si-enter-x block text-[clamp(2rem,8.3vw,8.6rem)] lg:text-[min(7.9vw,8.6rem)]" style={d(90)}>du nettoyage</span>
              <span className="si-enter-x block text-[clamp(2rem,8.3vw,8.6rem)] lg:text-[min(7.9vw,8.6rem)] leading-[.86]" style={d(180)}>
                <span className="si-display-cond text-[1.18em] text-si-cyan">entre vos </span>
                <span className="si-display">mains.</span>
              </span>
            </h1>

            <div className="relative z-20 order-4 mt-8 lg:mt-10 lg:max-w-[46%]">
              <p className="si-enter max-w-lg text-[17px] leading-relaxed text-si-ink/80 md:text-[18px]" style={d(300)}>
                {brand.cover.text}
              </p>
              <div className="si-enter mt-7 flex flex-wrap gap-3" style={d(380)}>
                <Btn href={to('/produits')} tone="ink" size="lg">Voir les {stats.products} machines</Btn>
                <Btn href={quoteHref()} tone="outline" size="lg" arrow={false}>Demander un devis</Btn>
              </div>
              <ul className="mt-9 flex flex-wrap items-center gap-3" aria-label="Chiffres du catalogue">
                <li className="si-enter-pop rotate-[-4deg] rounded-full bg-si-ink px-5 py-3 text-white" style={d(520)}>
                  <span className="si-num text-[26px] font-black leading-none [font-stretch:120%]">{stats.products}</span>
                  <span className="si-label ml-2 text-[10px]">machines</span>
                </li>
                <li className="si-enter-pop rotate-[3deg] rounded-full bg-si-cyan px-5 py-3" style={d(600)}>
                  <span className="si-num text-[26px] font-black leading-none [font-stretch:120%]">{stats.families}</span>
                  <span className="si-label ml-2 text-[10px]">familles</span>
                </li>
                <li className="si-enter-pop rotate-[-2deg] rounded-full bg-si-yellow px-5 py-3" style={d(680)}>
                  <span className="si-label mr-2 text-[10px]">jusqu’à</span>
                  <span className="si-num text-[26px] font-black leading-none [font-stretch:120%]">{fmt(stats.maxProd, 0)}</span>
                  <span className="si-label ml-1.5 text-[10px]">m²/h</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>

        <div className="mt-14 border-y-[3px] border-si-ink bg-white md:mt-20">
          <Marquee
            label="Modèles du catalogue"
            items={products.map((p) => (
              <Link key={p.slug} href={productHref(p.slug)} className="flex items-center gap-5 px-5 py-4 md:gap-7 md:px-7 md:py-5">
                <span className="whitespace-nowrap text-[clamp(1.6rem,3.4vw,3.2rem)] font-black uppercase leading-none tracking-[-0.02em] [font-stretch:120%] hover:text-si-cyan">{p.name}</span>
                <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full bg-si-cyan" />
              </Link>
            ))}
          />
        </div>
      </section>

      {/* ============ 2 · PRODUITS PHARES ============ */}
      <section aria-labelledby="phares-title" className="py-20 md:py-28">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow n="01">Produits phares</Eyebrow>
              <h2 id="phares-title" className="mt-5">
                <Reveal as="span" variant="left" className="si-display block text-[clamp(2.6rem,10vw,9.5rem)]">Huit</Reveal>
                <Reveal as="span" variant="right" delay={80} className="si-display-cond block whitespace-nowrap text-[clamp(2.8rem,11.4vw,9.6rem)] text-si-cyan">machines phares</Reveal>
              </h2>
            </div>
            <Reveal className="max-w-sm text-[17px] leading-relaxed text-si-ink/75 lg:pb-4" delay={150}>
              Une sélection du catalogue, une machine par grand usage : du robot autonome {robo.name} à la polisseuse GP1800.
            </Reveal>
          </div>

          <div className="mt-12 md:mt-16">
            <FeaturedShowcase />
          </div>

          <div className="mt-16 md:mt-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h3 className="text-[clamp(1.6rem,3vw,2.6rem)] font-black uppercase leading-none tracking-[-0.02em] [font-stretch:120%]">Les {stats.families} familles</h3>
              <Link href={to('/produits')} className="si-btn inline-flex items-center gap-2 text-[15px] font-bold underline decoration-2 underline-offset-4">Tout le catalogue <ArrowRight className="si-arrow h-4 w-4" /></Link>
            </div>
            <ul className="si-scroll-x -mx-5 mt-6 flex gap-2.5 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
              {families.map((f, k) => (
                <Reveal as="li" key={f.slug} variant="pop" delay={k * 40} className="shrink-0">
                  <Link href={familyHref(f.slug)} className="si-btn group flex h-[60px] items-center gap-3 rounded-full bg-white pl-1.5 pr-5 ring-2 ring-inset ring-si-ink hover:bg-si-cyan md:h-[68px]">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-si-cyan-soft md:h-14 md:w-14">
                      <Image src={img.product(familyHero(f.slug))} alt="" fill sizes="56px" className="si-cut object-contain p-1.5" />
                    </span>
                    <span className="whitespace-nowrap text-[15px] font-extrabold leading-tight [font-stretch:108%] md:text-[16px]">{f.plural}</span>
                    <span className="si-num grid h-7 min-w-7 place-items-center rounded-full bg-si-ink px-1.5 text-[12px] font-bold text-white">{f.count}</span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ============ 3 · CONCEPT & SAVOIR-FAIRE ============ */}
      <section aria-labelledby="concept-title" className="relative">
        <DiagonalEdge fill="#D9F3F6" />
        <div className="-mt-px bg-si-cyan-soft pb-16 pt-10 md:pb-24 md:pt-12">
          <Container>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <Eyebrow n="02">Savoir-faire · le principe</Eyebrow>
                <h2 id="concept-title" className="mt-5">
                  <Reveal as="span" variant="left" className="si-display block text-[clamp(2.4rem,8.6vw,8.6rem)]">Un passage.</Reveal>
                  <Reveal as="span" variant="left" delay={90} className="si-display-cond block text-[clamp(2.8rem,10.4vw,10.4rem)]">Quatre gestes.</Reveal>
                </h2>
              </div>
              <Reveal className="text-[17px] leading-relaxed text-si-ink/80 lg:col-span-4 lg:pb-3" delay={120}>
                Le principe d’une autolaveuse, tel que le décrivent les fiches du catalogue : la machine lave, brosse, aspire et sèche en avançant.
              </Reveal>
            </div>

            <ol className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:mt-16 lg:grid-cols-4">
              {process.map((s, k) => {
                const v = stepVisual[k];
                return (
                  <Reveal as="li" key={s.step} delay={k * 110} className="group relative">
                    <div className={`relative aspect-[4/4.6] overflow-hidden rounded-[28px] ${v.cut ? 'bg-si-cyan' : 'bg-si-ink'}`}>
                      <Image src={v.src} alt={v.alt} fill sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw" className={v.cut ? 'si-cut object-contain p-8' : 'object-cover transition-transform duration-700 group-hover:scale-105'} />
                      {v.tag && <span className={`si-label absolute left-4 top-4 rounded-full px-3 py-1.5 ${v.tag === 'Après' ? 'bg-si-yellow' : 'bg-white'}`}>{v.tag}</span>}
                      <span aria-hidden="true" className="si-display absolute -bottom-2 right-3 text-[clamp(5rem,9vw,8.5rem)] leading-none text-white [text-shadow:0_2px_0_rgba(10,10,10,.08)]">{k + 1}</span>
                    </div>
                    <h3 className="mt-4 flex items-baseline gap-2 sm:mt-5 sm:gap-3">
                      <span className="si-label text-si-grey">0{k + 1}</span>
                      <span className="si-display text-[clamp(1.3rem,3.2vw,3rem)]">{s.step}</span>
                    </h3>
                    <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-si-ink/80 sm:text-[15px]">{s.text}</p>
                    {k < 3 && <ArrowRight aria-hidden="true" className="absolute -right-4 top-[42%] hidden h-7 w-7 text-si-ink lg:block" />}
                  </Reveal>
                );
              })}
            </ol>
            <p className="mt-10 text-[13px] text-si-grey">
              Visuels d’illustration (photos provisoires). Pression de brosse : de {g01m ? `${g01m.name}` : 'G01M'} à {g100 ? g100.name : 'G100'}, selon les fiches.
            </p>
          </Container>
        </div>
        <BristleEdge fill="#1FB8CC" />
      </section>

      {/* ============ 4 · RÉASSURANCE FACTUELLE ============ */}
      <section aria-labelledby="faits-title" className="pb-28 pt-14 md:pb-44 md:pt-20">
        <Container>
          <Eyebrow n="03">Réassurance · que des faits</Eyebrow>
          <h2 id="faits-title" className="sr-only">Les chiffres du catalogue, la garantie et les normes citées</h2>

          <dl className="mt-8 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {[
              { n: String(stats.products), u: '', l: 'machines professionnelles au catalogue 2024' },
              { n: String(stats.families), u: '', l: 'familles, de l’autolaveuse au compresseur' },
              { n: fmt(stats.maxProd, 0), u: 'm²/h', l: `rendement théorique maximal (${topFam?.name ?? ''} ${topProductivity.name})` },
              { n: '8→120', u: 'kg', l: `pression de brosse, de la ${g01m?.name ?? 'G01M'} à la ${g100?.name ?? 'G100'}` },
            ].map((s, k) => (
              <Reveal key={k} delay={k * 90} className="flex flex-col gap-4 border-t-[6px] border-si-ink pt-4 xl:flex-row xl:items-end xl:justify-between">
                <dt className="order-2 max-w-[14rem] text-[15px] font-semibold leading-snug xl:pb-2 xl:text-right">{s.l}</dt>
                <dd className="si-num order-1 flex items-baseline gap-3 whitespace-nowrap font-black uppercase leading-[.8] tracking-[-0.045em] [font-stretch:100%] text-[clamp(3.6rem,14.5vw,5rem)] md:text-[clamp(4rem,8.2vw,8.6rem)]">
                  {s.n}{s.u && <span className="text-[.28em] tracking-normal text-si-cyan">{s.u}</span>}
                </dd>
              </Reveal>
            ))}
          </dl>

          <div className="mt-20 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Garantie */}
            <Reveal className="rounded-[32px] p-6 ring-2 ring-inset ring-si-ink md:p-9 lg:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="si-display text-[clamp(1.9rem,3.4vw,3.2rem)]">Garantie</h3>
                <Pill tone="yellow">Catalogue p. 6</Pill>
              </div>
              <dl className="mt-6 divide-y-2 divide-si-ink/10">
                {warranty.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
                    <dt className="si-label pt-1 text-si-grey">{k}</dt>
                    <dd className="text-[16px] font-semibold leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Normes citées */}
            <Reveal delay={90} className="order-last grid grid-cols-1 gap-6 rounded-[32px] bg-si-cyan-soft p-6 md:p-9 lg:col-span-12 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <h3 className="si-display text-[clamp(2rem,3.4vw,3.2rem)]">Normes</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-si-ink/75">Indices, classes et directives cités tels quels par les fiches produits.</p>
              </div>
              <ul className="grid grid-cols-2 gap-2 lg:col-span-9 lg:grid-cols-3">
                {citedStandards.map((c) => (
                  <li key={c.label} className="min-w-0 rounded-[18px] bg-white p-3.5">
                    <p className="text-[18px] font-black leading-tight [font-stretch:112%]">{c.label}</p>
                    <p className="mt-1 text-[12px] leading-snug text-si-ink/65">{c.detail}</p>
                    <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
                      {c.products.map((p) => (
                        <Link key={p.slug} href={productHref(p.slug)} className="text-[12px] font-bold underline decoration-si-cyan decoration-2 underline-offset-2 hover:text-si-ink/70">{p.name}</Link>
                      ))}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* PDF */}
            <Reveal delay={180} className="lg:col-span-4">
              <a href={img.catalogue} download className="si-btn group flex h-full min-h-[280px] flex-col justify-between rounded-[32px] bg-si-ink p-6 text-white md:p-8">
                <span className="flex items-center justify-between">
                  <File className="h-9 w-9 text-si-cyan" />
                  <span className="si-label rounded-full bg-si-yellow px-2.5 py-1 text-si-ink">PDF</span>
                </span>
                <span>
                  <span className="si-display-cond block text-[clamp(2.6rem,4vw,3.6rem)]">Catalogue<br />2024</span>
                  <span className="mt-3 block text-[15px] text-white/70">{stats.products} fiches complètes, caractéristiques et accessoires.</span>
                  <span className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-si-cyan px-5 text-[14px] font-bold text-si-ink">
                    <Download className="h-4 w-4" /> Télécharger
                  </span>
                </span>
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============ 5 · APPEL À L'ACTION ============ */}
      <section aria-labelledby="cta-title" className="si-on-cyan relative">
        <div className="pointer-events-none absolute right-[1%] top-[-40px] z-10 hidden h-[520px] w-[29%] max-w-[500px] lg:block xl:top-[-70px]">
          <Reveal variant="pop" className="group pointer-events-auto absolute inset-0">
            <Image src={img.product(robo.img || robo.slug)} alt={`Autolaveuse autonome GRILLOO ${robo.name}`} fill sizes="34vw" className="si-cut object-contain object-top drop-shadow-[0_30px_30px_rgba(10,10,10,.25)]" />
          </Reveal>
        </div>
        <SqueegeeEdge />
        <div className="-mt-px bg-si-cyan pb-20 pt-6 md:pb-28">
          <Container className="relative">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
              <div className="relative z-10 lg:col-span-8">
                <Eyebrow n="04">Contact</Eyebrow>
                <h2 id="cta-title" className="mt-6">
                  <Reveal as="span" variant="left" className="si-display block whitespace-nowrap text-[clamp(2.3rem,9.4vw,7.6rem)]">Un devis,</Reveal>
                  <Reveal as="span" variant="left" delay={80} className="si-display block whitespace-nowrap text-[clamp(2.3rem,9.4vw,7.6rem)]">une démo,</Reveal>
                  <Reveal as="span" variant="left" delay={160} className="si-display-cond block whitespace-nowrap text-[clamp(2.9rem,12vw,10rem)]">un conseil.</Reveal>
                </h2>
                <p className="mt-8 max-w-xl text-[18px] leading-relaxed">
                  Indiquez votre surface, votre type de sol et la machine qui vous intéresse.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Btn href={quoteHref()} tone="ink" size="lg">Demander un devis</Btn>
                  <Btn href={to('/contact')} tone="white" size="lg" arrow={false}>Nous contacter</Btn>
                </div>
                <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-3 text-[15px]">
                  <div><dt className="si-label text-si-ink/70">Téléphone</dt><dd className="mt-1 font-bold">{site.phone}</dd></div>
                  <div><dt className="si-label text-si-ink/70">E-mail</dt><dd className="mt-1 font-bold">{site.email}</dd></div>
                </dl>
              </div>
              <div className="lg:col-span-4">
                <div className="relative mx-auto h-[300px] w-full max-w-[340px] lg:hidden">
                  <Image src={img.product(robo.img || robo.slug)} alt={`Autolaveuse autonome GRILLOO ${robo.name}`} fill sizes="80vw" className="object-contain drop-shadow-[0_24px_24px_rgba(10,10,10,.25)]" />
                </div>
                <Link href={productHref(robo.slug)} className="si-btn mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-bold [font-stretch:110%] lg:float-right">
                  {robo.name} · autolaveuse autonome <ArrowRight className="si-arrow h-4 w-4" />
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </section>
    </>
  );
}
