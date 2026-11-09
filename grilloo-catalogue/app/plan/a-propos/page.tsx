import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { brand, families, familyHero, getProduct, stats, warranty } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { site } from '@/lib/site';
import { Reveal } from '@/components/plan/Reveal';
import { IArrow } from '@/components/plan/icons';
import { Angle15, Btn, Container, Crops, Mono, PageHead, SheetHead, Steps, href, pad, quoteHref } from '@/components/plan/ui';

export const metadata: Metadata = {
  title: 'À propos de nous — La marque GRILLOO',
  description: 'GRILLOO, leader des solutions de nettoyage : histoire, objectif, sept engagements, expertise sur 10 familles de machines et principes de garantie.',
};

export default function AProposPage() {
  return (
    <>
      <PageHead
        code="A-00"
        crumbs={[{ label: 'Accueil', href: href('') }, { label: 'À propos de nous' }]}
        title={<>À propos<br /><span className="text-pl-ink/45">de GRILLOO</span></>}
        lead={brand.intro}
        cells={[
          { k: 'Marque', v: brand.name },
          { k: 'Site', v: site.domain },
          { k: 'Signature', v: brand.tagline },
          { k: 'Gamme', v: `${stats.products} machines · ${stats.families} familles` },
        ]}
      />

      {/* 01 — Histoire */}
      <section aria-labelledby="pl-hist" className="bg-white py-16 lg:py-24">
        <Container>
          <SheetHead no="01" kicker="Histoire" sheet="Catalogue 2024 · introduction" />
          <div className="mt-10 grid gap-12 lg:grid-cols-8 lg:gap-0">
            <Reveal className="lg:col-span-4 lg:pr-12">
              <h2 id="pl-hist" className="pl-wipe text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1] tracking-[-0.045em]">{brand.cover.heading}</h2>
              <div className="pl-rise mt-8 space-y-5 text-[16px] leading-[1.7] text-pl-ink/80" style={{ ['--d' as string]: '150ms' }}>
                <p>{brand.cover.text}</p>
                <p>{brand.closing}</p>
              </div>
              <p className="pl-rise mt-8 border-l-2 border-pl-cyan pl-4 text-[19px] font-light leading-snug tracking-[-0.015em] text-pl-teal" style={{ ['--d' as string]: '250ms' }}>
                « {brand.backCover} »
              </p>
            </Reveal>
            <Reveal as="figure" className="lg:col-span-4">
              <div className="border border-pl-teal">
                <div className="flex items-center justify-between border-b border-pl-teal bg-white px-3 py-2">
                  <Mono className="text-pl-teal">Fig. A — Atelier</Mono>
                  <Mono className="text-pl-ink/55">Visuel provisoire</Mono>
                </div>
                <div className="pl-wipe relative aspect-[3/2] bg-pl-paper">
                  <Image src={img.scene('about-atelier')} alt="Établi avec brosses, bavettes de suceur et filtres de machines de nettoyage (visuel d’illustration)" fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
                </div>
              </div>
              <figcaption className="mt-3 font-pl-mono text-[11px] text-pl-ink/60">Pièces d’usure : brosses, bavettes, filtres. Photographie d’illustration, à remplacer par les visuels GRILLOO.</figcaption>
            </Reveal>
          </div>
        </Container>
      </section>

      <Steps from="#FFFFFF" to="#F6F8F8" />

      {/* 02 — Objectif */}
      <section aria-labelledby="pl-mission" className="bg-pl-paper py-16 lg:py-24">
        <Container>
          <SheetHead no="02" kicker="Objectif" sheet="Mission" />
          <Reveal className="mt-10 grid gap-10 lg:grid-cols-8 lg:gap-0">
            <h2 id="pl-mission" className="sr-only">Objectif de la marque</h2>
            <p className="pl-wipe text-[clamp(1.7rem,3.4vw,2.9rem)] font-light leading-[1.12] tracking-[-0.035em] text-pl-ink lg:col-span-6 lg:pr-10">
              {brand.mission}
            </p>
            <div className="pl-rise self-end border-t border-pl-teal pt-4 lg:col-span-2" style={{ ['--d' as string]: '250ms' }}>
              <Mono className="text-pl-ink/55">En résumé</Mono>
              <p className="mt-2 text-[14.5px] leading-relaxed text-pl-ink/80">{brand.summary}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      <Angle15 from="#F6F8F8" to="#FFFFFF" at="25%" />

      {/* 03 — Engagements */}
      <section aria-labelledby="pl-values" className="bg-white py-16 lg:py-24">
        <Container>
          <SheetHead no="03" kicker="Engagements" sheet={`${brand.values.length} spécifications`} />
          <div className="mt-10 grid gap-8 lg:grid-cols-8 lg:gap-0">
            <div className="lg:col-span-2 lg:pr-10">
              <h2 id="pl-values" className="text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1] tracking-[-0.045em]">{brand.values.length} engagements</h2>
              <p className="mt-4 text-[14px] leading-relaxed text-pl-ink/70">Les objectifs de la marque, tels qu’énoncés dans le catalogue.</p>
            </div>
            <ol className="border-t border-pl-teal lg:col-span-6">
              {brand.values.map((v, i) => (
                <Reveal as="li" key={v.key} className="grid gap-2 border-b border-pl-line py-5 sm:grid-cols-[4.5rem_14rem_1fr] sm:gap-6">
                  <span className="font-pl-mono text-[11px] text-pl-teal">E-{pad(i + 1)}</span>
                  <h3 className="pl-wipe text-[20px] font-normal leading-tight tracking-[-0.02em]">{v.title}</h3>
                  <p className="pl-rise text-[14.5px] leading-relaxed text-pl-ink/75" style={{ ['--d' as string]: '120ms' }}>{v.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* 04 — Expertise */}
      <section aria-labelledby="pl-exp" className="bg-white pb-16 lg:pb-24">
        <Container>
          <SheetHead no="04" kicker="Expertise" sheet={`${stats.families} familles`} />
          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <h2 id="pl-exp" className="text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1] tracking-[-0.045em]">
              {stats.families} familles,<br /><span className="text-pl-ink/45">du lavage au soufflage.</span>
            </h2>
            <Link href={href('/produits')} className="pl-navlink text-[14px] text-pl-teal">Tout le catalogue →</Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {families.map((f, i) => {
              const hero = getProduct(familyHero(f.slug) ?? '');
              return (
                <li key={f.slug}>
                  <Link href={`${href('/produits')}?famille=${f.slug}`} className="pl-plate group relative flex h-full flex-col bg-white outline outline-1 -outline-offset-[0.5px] outline-pl-line hover:z-[1] hover:outline-pl-teal">
                    <span className="flex items-center justify-between border-b border-pl-line px-3 py-2">
                      <Mono className="text-pl-teal">{pad(i + 1)}</Mono>
                      <Mono className="text-pl-ink/55">{pad(f.count)} mod.</Mono>
                    </span>
                    <span className="pl-graph relative block aspect-square">
                      <Crops />
                      {hero && <Image src={img.product(hero.img)} alt="" fill sizes="(min-width: 1024px) 240px, 45vw" className="pl-cut object-contain p-[16%]" />}
                    </span>
                    <span className="flex flex-1 items-center justify-between gap-2 border-t border-pl-line px-3 py-3 text-[14.5px] leading-tight text-pl-ink group-hover:text-pl-teal">
                      {f.plural} <IArrow size={13} className="shrink-0" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <Steps from="#FFFFFF" to="#F6F8F8" />

      {/* 05 — Garantie */}
      <section aria-labelledby="pl-warranty" className="bg-pl-paper py-16 lg:py-24">
        <Container>
          <SheetHead no="05" kicker="Garantie" sheet="Catalogue 2024 · p. 6" />
          <div className="mt-10 grid gap-10 lg:grid-cols-8 lg:gap-0">
            <div className="lg:col-span-3 lg:pr-12">
              <h2 id="pl-warranty" className="text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1] tracking-[-0.045em]">Garantie<br /><span className="text-pl-ink/45">et service client</span></h2>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-pl-ink/75">
                Le catalogue énonce les principes de la garantie GRILLOO ; sa durée est précisée produit par produit.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:max-w-xs">
                <Btn href={quoteHref()}>Contacter le service client</Btn>
              </div>
            </div>
            <dl className="border-t border-pl-teal bg-white lg:col-span-5">
              {warranty.map(([k, v], i) => (
                <div key={k} className="grid grid-cols-[3rem_1fr] gap-x-3 gap-y-1 border-b border-pl-line px-4 py-4 sm:grid-cols-[3rem_11rem_1fr]">
                  <span className="font-pl-mono text-[11px] text-pl-teal" aria-hidden="true">G-{pad(i + 1)}</span>
                  <dt className="text-[14px] text-pl-ink/65">{k}</dt>
                  <dd className="col-start-2 text-[15.5px] text-pl-ink sm:col-start-3">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>
    </>
  );
}
