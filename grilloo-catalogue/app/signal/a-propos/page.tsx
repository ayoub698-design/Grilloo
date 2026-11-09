import Image from 'next/image';
import Link from 'next/link';
import { brand, families, familyHero, familyIntro, stats, warranty } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { Btn, Container, Eyebrow, Pill, familyHref, quoteHref } from '@/components/signal/ui';
import { Reveal } from '@/components/signal/motion';
import { DiagonalEdge, SqueegeeEdge } from '@/components/signal/shapes';
import { ArrowRight } from '@/components/signal/icons';

export const metadata = {
  title: 'À propos de nous',
  description: 'GRILLOO, leader des solutions de nettoyage : histoire, objectif, 7 engagements, expertise sur 10 familles de machines et principes de garantie.',
};

const tones = [
  'bg-si-cyan text-si-ink',
  'bg-white ring-2 ring-inset ring-si-ink',
  'bg-si-ink text-white',
  'bg-si-cyan-soft',
  'bg-white ring-2 ring-inset ring-si-ink',
  'bg-si-yellow text-si-ink',
  'bg-si-ink text-white',
];

export default function SignalAbout() {
  return (
    <>
      {/* Histoire */}
      <section className="pb-16 pt-8 md:pb-24 md:pt-12">
        <Container>
          <Eyebrow>À propos de nous</Eyebrow>
          <h1 className="mt-5">
            <span className="si-display si-enter-x block text-[clamp(2.6rem,10vw,10rem)]">Nettoyez</span>
            <span className="si-enter-x block text-[clamp(2.6rem,10vw,10rem)] leading-[.86]" style={{ '--d': '90ms' } as React.CSSProperties}>
              <span className="si-display-cond text-[1.14em] text-si-cyan">avec </span><span className="si-display">excellence</span>
            </span>
          </h1>
          <p className="si-label mt-4 text-si-grey">{brand.headline} — signature du catalogue 2024</p>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <Reveal className="lg:col-span-6">
              <p className="text-[22px] font-semibold leading-snug md:text-[28px] [font-stretch:105%]">{brand.intro}</p>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-si-ink/75">{brand.closing}</p>
            </Reveal>
            <Reveal delay={120} className="relative lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[36px] bg-si-cyan">
                <Image src={img.scene('about-atelier')} alt="Atelier et machines de nettoyage (visuel d’illustration provisoire)" fill sizes="(min-width: 1024px) 48vw, 92vw" className="object-cover" />
              </div>
              <div className="absolute -top-5 right-3 rotate-[4deg] rounded-full bg-si-yellow px-5 py-3 shadow-[0_6px_0_#0A0A0A] md:-right-4">
                <span className="si-num text-[26px] font-black [font-stretch:120%]">{stats.products}</span>
                <span className="si-label ml-2 text-[10px]">machines · {stats.families} familles</span>
              </div>
              <p className="mt-3 text-[12px] text-si-grey">Visuel d’illustration provisoire, en attente des photos GRILLOO.</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Objectif */}
      <section className="relative" aria-labelledby="objectif">
        <DiagonalEdge fill="#1FB8CC" />
        <div className="si-on-cyan -mt-px bg-si-cyan pb-16 pt-8 md:pb-24">
          <Container>
            <Eyebrow n="01">Objectif</Eyebrow>
            <h2 id="objectif" className="sr-only">L’objectif de GRILLOO</h2>
            <Reveal variant="left" as="p" className="mt-6 max-w-[22ch] text-[clamp(2rem,4.8vw,4.6rem)] font-black uppercase leading-[.95] tracking-[-0.02em] [font-stretch:112%]">
              Devenir le partenaire de confiance du nettoyage.
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              <Reveal as="p" className="text-[18px] leading-relaxed">{brand.mission}</Reveal>
              <Reveal as="p" delay={100} className="text-[18px] leading-relaxed">{brand.summary}</Reveal>
            </div>
          </Container>
        </div>
      </section>

      {/* 7 engagements */}
      <section className="py-20 md:py-28" aria-labelledby="valeurs">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="valeurs">
              <Reveal as="span" variant="left" className="si-display block text-[clamp(2.4rem,8vw,8rem)]">7 engage&shy;ments</Reveal>
            </h2>
            <p className="max-w-sm text-[16px] leading-relaxed text-si-ink/70">Les objectifs de la marque, tels que présentés dans le catalogue 2024.</p>
          </div>
          <ol className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {brand.values.map((v, k) => (
              <Reveal as="li" key={v.key} delay={(k % 3) * 90} className={`flex flex-col rounded-[32px] p-6 md:p-8 ${tones[k]} ${k === 0 || k === 6 ? 'xl:col-span-2' : ''}`}>
                <span className="si-num si-display-cond text-[clamp(5rem,9vw,8rem)] leading-[.8]">{String(k + 1).padStart(2, '0')}</span>
                <h3 className="mt-6 text-[clamp(1.5rem,2.4vw,2.2rem)] font-black uppercase leading-[.95] tracking-[-0.01em] [font-stretch:118%]">{v.title}</h3>
                <p className={`mt-4 text-[15px] leading-relaxed ${k === 2 || k === 6 ? 'text-white/80' : 'text-si-ink/80'}`}>{v.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Expertise */}
      <section className="bg-si-cyan-soft py-20 md:py-28" aria-labelledby="expertise">
        <Container>
          <Eyebrow n="02">Expertise</Eyebrow>
          <h2 id="expertise" className="mt-5">
            <Reveal as="span" variant="left" className="si-display block text-[clamp(2.4rem,8vw,8rem)]">{stats.families} familles</Reveal>
            <Reveal as="span" variant="right" delay={80} className="si-display-cond block text-[clamp(2.6rem,9vw,9rem)] text-si-cyan">{stats.products} machines</Reveal>
          </h2>
          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {families.map((f, k) => (
              <Reveal as="li" key={f.slug} delay={(k % 5) * 70}>
                <Link href={familyHref(f.slug)} className="group flex h-full flex-col rounded-[28px] bg-white p-5 transition-shadow hover:shadow-[0_20px_50px_-24px_rgba(10,10,10,.4)]">
                  <div className="flex items-start justify-between">
                    <span className="si-num text-[40px] font-black leading-none [font-stretch:120%]">{f.count}</span>
                    <ArrowRight className="si-arrow h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className="relative my-4 h-36">
                    <Image src={img.product(familyHero(f.slug))} alt="" fill sizes="(min-width: 1280px) 16vw, 40vw" className="si-cut object-contain" />
                  </div>
                  <h3 className="text-[18px] font-black uppercase leading-tight [font-stretch:110%]">{f.plural}</h3>
                  <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-si-ink/70">{familyIntro(f)}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Garantie */}
      <section className="py-20 md:py-28" aria-labelledby="garantie">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow n="03">Garantie</Eyebrow>
              <h2 id="garantie" className="mt-5">
                <Reveal as="span" variant="left" className="si-display block text-[clamp(2.4rem,5vw,4.6rem)]">Garantie</Reveal>
                <Reveal as="span" variant="left" delay={80} className="si-display-cond block text-[clamp(2.8rem,6vw,5.6rem)] text-si-cyan">& service</Reveal>
              </h2>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-si-ink/75">
                Les principes de garantie présentés dans le catalogue. La durée est précisée produit par produit.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Btn href={quoteHref()} tone="cyan">Demander un devis</Btn>
                <Btn href={img.catalogue} tone="outline" download arrow={false}>Catalogue PDF</Btn>
              </div>
            </div>
            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
              {warranty.map(([k, v], i) => (
                <Reveal as="li" key={k} delay={(i % 2) * 80} className="rounded-[24px] p-5 ring-2 ring-inset ring-si-ink">
                  <div className="flex items-center justify-between">
                    <Pill tone={i === 0 ? 'yellow' : 'soft'}>{k}</Pill>
                    <span className="si-num text-[13px] font-bold text-si-grey">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="mt-4 text-[20px] font-extrabold leading-snug [font-stretch:105%]">{v}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <SqueegeeEdge fill="#0A0A0A" lip="#1FB8CC" />
      <section className="-mt-px bg-si-ink py-16 text-white md:py-20">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <p className="max-w-3xl text-[clamp(1.6rem,3.2vw,3rem)] font-black uppercase leading-[.95] [font-stretch:112%]">{brand.backCover}</p>
          <Btn href={quoteHref()} tone="cyan" size="lg">Parlons de votre projet</Btn>
        </Container>
      </section>
    </>
  );
}
