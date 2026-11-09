import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { brand, families, familyHero, productsOf, stats, warranty } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { Reveal, Lines, Parallax, Curve } from '@/components/galerie/motion';
import { Plinth } from '@/components/galerie/Plinth';
import { Caption, Container, Button, TextLink, ArchCut } from '@/components/galerie/ui';
import { to, familyHref, no, pad } from '@/components/galerie/links';

export const metadata: Metadata = {
  title: 'À propos de nous — histoire, objectif et engagements',
  description: `${brand.mission} Sept engagements, ${stats.families} familles de machines et une garantie définie produit par produit.`,
};

export default function AProposPage() {
  return (
    <>
      {/* Ouverture */}
      <Container className="grid gap-12 pb-16 pt-12 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-20">
        <div className="lg:col-span-7">
          <Reveal variant="fade"><Caption rule>À propos de nous</Caption></Reveal>
          <Lines as="h1" className="ga-display mt-6 text-[clamp(50px,7.4vw,120px)] leading-[.93] tracking-[-0.03em]" lines={['Découvrez', <em key="e">l’excellence</em>, 'GRILLOO']} />
        </div>
        <Reveal delay={250} className="self-end lg:col-span-4 lg:col-start-9">
          <p className="ga-display text-[24px] italic leading-[1.3]">{brand.tagline}.</p>
          <p className="mt-4 text-[15px] leading-[1.75] ga-text-stone">{brand.cover.text}</p>
        </Reveal>
      </Container>

      {/* Histoire */}
      <section aria-labelledby="ga-histoire" className="pb-20 lg:pb-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal variant="img" className="lg:col-span-7">
            <div className="relative aspect-[16/11] overflow-hidden bg-ga-ivory">
              <Parallax speed={0.04} className="absolute -inset-y-8 inset-x-0">
                <Image src={img.scene('about-atelier')} alt="Atelier GRILLOO (visuel d’illustration provisoire)" fill sizes="(min-width: 1024px) 56vw, 92vw" className="object-cover" priority />
              </Parallax>
            </div>
            <p className="ga-caps ga-text-stone mt-3">Visuel d’illustration — photo GRILLOO à venir</p>
          </Reveal>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-10">
            <Caption>N°01 — Histoire</Caption>
            <h2 id="ga-histoire" className="ga-display mt-5 text-[clamp(34px,3.4vw,48px)] leading-[1.02]">L’univers <em>GRILLOO</em></h2>
            <Reveal as="p" className="mt-6 text-[15.5px] leading-[1.8]">{brand.intro}</Reveal>
          </div>
        </Container>
      </section>

      {/* Objectif */}
      <section aria-labelledby="ga-objectif" className="relative bg-ga-ivory">
        <ArchCut />
        <Container className="grid gap-12 pb-20 pt-12 lg:grid-cols-12 lg:gap-8 lg:pb-28 lg:pt-16">
          <div className="lg:col-span-3">
            <Caption rule>N°02 — Objectif</Caption>
            <h2 id="ga-objectif" className="sr-only">Objectif de la marque</h2>
          </div>
          <div className="lg:col-span-8 lg:col-start-5">
            <Reveal as="blockquote" className="ga-display text-[clamp(28px,3.4vw,50px)] leading-[1.18]">
              « {brand.mission} »
            </Reveal>
            <Reveal as="p" delay={200} className="mt-10 max-w-2xl border-t border-ga-line pt-6 text-[15.5px] leading-[1.8] ga-text-stone">{brand.summary}</Reveal>
          </div>
        </Container>
      </section>

      {/* Engagements */}
      <section aria-labelledby="ga-valeurs" className="py-24 lg:py-36">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Caption rule>N°03 — Engagements</Caption>
              <Lines id="ga-valeurs" className="ga-display mt-6 text-[clamp(42px,5.4vw,84px)] leading-[.98]" lines={['Sept', <em key="e">engagements.</em>]} />
            </div>
            <p className="self-end text-[15px] leading-[1.75] ga-text-stone lg:col-span-4 lg:col-start-9">Les objectifs de la marque, tels que le catalogue 2024 les énonce.</p>
          </div>
          <ol className="mt-16 border-t border-ga-ink/80 lg:mt-24">
            {brand.values.map((v, i) => (
              <Reveal as="li" key={v.key} variant="fade" className="grid gap-4 border-b border-ga-line py-10 md:grid-cols-12 md:gap-8 lg:py-12">
                <span className="ga-caps ga-text-stone md:col-span-2 md:pt-3">{no(i + 1)}</span>
                <h3 className={`ga-display text-[clamp(30px,3.2vw,46px)] leading-[1.02] md:col-span-5 ${i % 2 ? 'italic' : ''}`}>{v.title}</h3>
                <p className="max-w-xl text-[15px] leading-[1.8] ga-text-stone md:col-span-5 md:pt-2">{v.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <Curve shape="swell" />

      {/* Expertise */}
      <section aria-labelledby="ga-expertise" className="pb-24 pt-16 lg:pb-36 lg:pt-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Caption rule>N°04 — Expertise</Caption>
              <Lines id="ga-expertise" className="ga-display mt-6 text-[clamp(42px,5.4vw,84px)] leading-[.98]" lines={[`${stats.families} familles,`, <em key="e">{stats.products} machines.</em>]} />
            </div>
            <div className="self-end lg:col-span-4 lg:col-start-9">
              <p className="text-[15px] leading-[1.75] ga-text-stone">Du lavage au balayage, de la moquette à l’escalator : chaque famille a son principe et ses modèles.</p>
              <TextLink href={to('/produits')} className="mt-5">Parcourir la collection</TextLink>
            </div>
          </div>
          <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 lg:mt-24 lg:grid-cols-5 lg:gap-x-8">
            {families.map((f, i) => (
              <Reveal as="li" key={f.slug} delay={(i % 5) * 90}>
                <Link href={familyHref(f.slug)} className="ga-lift group block">
                  <Plinth slug={familyHero(f.slug)} alt="" ratio="4 / 5" base={0.22} inset={8} top={8} sizes="(min-width: 1024px) 18vw, 45vw" />
                  <span className="ga-caps ga-text-stone mt-4 block">{pad(i + 1)} · {productsOf(f.slug).length} modèles</span>
                  <span className="ga-display mt-2 block text-[21px] leading-[1.1]"><span className="ga-link">{f.plural}</span></span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Garantie */}
      <section aria-labelledby="ga-garantie" className="border-t border-ga-line py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Caption rule>N°05 — Garantie</Caption>
            <h2 id="ga-garantie" className="ga-display mt-6 text-[clamp(38px,4.4vw,64px)] leading-[1]">Une garantie <em>produit par produit</em></h2>
            <p className="mt-6 max-w-md text-[15px] leading-[1.75] ga-text-stone">Le catalogue ne fixe pas de durée unique : elle est définie pour chaque machine. Voici les principes qui s’appliquent à toutes.</p>
            <Reveal variant="img" className="mt-10 hidden lg:block">
              <div className="relative aspect-[4/3] overflow-hidden bg-ga-ivory">
                <Image src={img.scene('about-stock')} alt="Entrepôt de stockage (visuel d’illustration provisoire)" fill sizes="36vw" className="object-cover" />
              </div>
              <p className="ga-caps ga-text-stone mt-3">Visuel d’illustration</p>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <dl className="border-t border-ga-ink/80">
              {warranty.map(([k, v], i) => (
                <div key={k} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-ga-line py-6 sm:grid-cols-[3rem_11rem_1fr]">
                  <span className="ga-num pt-1 italic ga-text-stone" aria-hidden>{pad(i + 1)}</span>
                  <dt className="ga-caps ga-text-stone pt-1.5">{k}</dt>
                  <dd className="ga-display col-start-2 mt-2 text-[22px] leading-snug sm:col-start-3 sm:mt-0">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* Clôture */}
      <section aria-label="Engagement GRILLOO" className="bg-ga-ivory">
        <ArchCut />
        <Container className="pb-24 pt-12 text-center lg:pb-32 lg:pt-16">
          <Reveal as="p" className="ga-display mx-auto max-w-4xl text-[clamp(26px,3vw,42px)] italic leading-[1.3]">{brand.closing}</Reveal>
          <Reveal delay={250} className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            <Button href={to('/contact')}>Nous contacter</Button>
            <TextLink href={to('/secteurs')}>Les secteurs d’application</TextLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
