import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { sectors, sectorProducts, isCited } from '@/lib/sectors';
import { getFamily } from '@/lib/catalog';
import { Reveal, Lines, Curve } from '@/components/galerie/motion';
import { Plinth } from '@/components/galerie/Plinth';
import { Caption, Container, Button, TextLink } from '@/components/galerie/ui';
import { to, productHref, familyHref, quoteHref, no, pad } from '@/components/galerie/links';

export const metadata: Metadata = {
  title: 'Nos secteurs — domaines d’application',
  description: 'Santé, logistique, industrie, commerce, hôtellerie, bureaux, collectivités, sociétés de propreté, prescripteurs : les machines GRILLOO citées pour chaque secteur.',
};

export default function SecteursPage() {
  return (
    <>
      <Container className="pb-12 pt-12 lg:pb-16 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal variant="fade"><Caption rule>Nos secteurs</Caption></Reveal>
            <Lines as="h1" className="ga-display mt-6 text-[clamp(50px,7.4vw,120px)] leading-[.93] tracking-[-0.03em]" lines={['Domaines', <em key="e">d’application</em>]} />
          </div>
          <Reveal delay={250} className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-[15px] leading-[1.75] ga-text-stone">
              Neuf secteurs, leurs surfaces et les machines du catalogue qui y répondent. Lorsque les fiches citent nommément un lieu, ce sont ces machines qui sont présentées ; sinon, les familles adaptées au besoin.
            </p>
          </Reveal>
        </div>

        <nav aria-label="Sommaire des secteurs" className="mt-16 border-t border-ga-ink/80 lg:mt-20">
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((s, i) => (
              <li key={s.slug} className="border-b border-ga-line">
                <a href={`#${s.slug}`} className="group flex items-baseline gap-4 py-4 pr-6">
                  <span className="ga-caps ga-text-stone w-7 shrink-0">{pad(i + 1)}</span>
                  <span className="ga-display text-[19px] leading-snug"><span className="ga-link">{s.name}</span></span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Container>

      <Curve shape="descend" tone="line" />

      <div className="pb-16 lg:pb-24">
        {sectors.map((s, i) => {
          const list = sectorProducts(s);
          const cited = isCited(s);
          const shown = list.slice(0, 4);
          const more = list.slice(4);
          const flip = i % 2 === 1;
          const illustration = s.image.endsWith('.png');
          return (
            <section key={s.slug} id={s.slug} aria-labelledby={`ga-s-${s.slug}`} className="scroll-mt-24 py-16 lg:py-24">
              <Container>
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                  <Reveal variant="img" className={`lg:col-span-7 ${flip ? 'lg:order-2 lg:col-start-6' : ''}`}>
                    <div className={`relative aspect-[3/2] overflow-hidden ${illustration ? 'bg-ga-ivory' : 'bg-ga-ivory'}`}>
                      <Image
                        src={s.image}
                        alt={`${s.name} — visuel d’illustration`}
                        fill
                        sizes="(min-width: 1024px) 56vw, 92vw"
                        className={illustration ? 'object-contain p-8 mix-blend-multiply sm:p-12' : 'object-cover'}
                      />
                    </div>
                    <p className="ga-caps ga-text-stone mt-3">Visuel d’illustration</p>
                  </Reveal>
                  <div className={`lg:col-span-4 ${flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-9'}`}>
                    <Caption rule>{no(i + 1)} — {s.short}</Caption>
                    <h2 id={`ga-s-${s.slug}`} className="ga-display mt-5 text-[clamp(32px,3.2vw,46px)] leading-[1.04]">{s.name}</h2>
                    <Reveal as="p" className="ga-display mt-6 text-[20px] italic leading-[1.45]">{s.need}</Reveal>
                    <dl className="mt-8 border-t border-ga-line text-[14px]">
                      <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-ga-line py-3">
                        <dt className="ga-caps ga-text-stone pt-0.5">Surfaces</dt>
                        <dd>{s.surfaces.join(' · ')}</dd>
                      </div>
                      <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-ga-line py-3">
                        <dt className="ga-caps ga-text-stone pt-0.5">Familles</dt>
                        <dd>
                          {s.families.map((f, k) => (
                            <span key={f}><Link href={familyHref(f)} className="ga-link">{getFamily(f)?.plural ?? f}</Link>{k < s.families.length - 1 ? ', ' : ''}</span>
                          ))}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="mt-14 lg:mt-16">
                  <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ga-ink/80 pb-3">
                    <p className="ga-caps ga-text-stone">
                      {cited ? `${list.length} ${list.length > 1 ? 'machines dont la fiche cite ce type de lieu' : 'machine dont la fiche cite ce type de lieu'}` : `${list.length} machines des familles adaptées`}
                    </p>
                    <TextLink href={quoteHref()} className="!text-[13px]">Conseil pour ce secteur</TextLink>
                  </div>
                  <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:gap-x-10">
                    {shown.map((p, k) => (
                      <Reveal as="li" key={p.slug} delay={k * 100}>
                        <Link href={productHref(p.slug)} className="ga-lift group block">
                          <Plinth slug={p.slug} alt={`${p.name}, ${p.kind.toLowerCase()}`} ratio="1 / 1" base={0.2} inset={10} top={6} sizes="(min-width: 768px) 22vw, 45vw" />
                          <span className="mt-4 flex items-baseline justify-between gap-3">
                            <span className="ga-display text-[22px] leading-tight"><span className="ga-link">{p.name}</span></span>
                          </span>
                          <span className="mt-0.5 block text-[13px] ga-text-stone">{p.kind}</span>
                        </Link>
                      </Reveal>
                    ))}
                  </ul>
                  {more.length > 0 && (
                    <p className="mt-10 text-[14px] leading-[1.9]">
                      <span className="ga-caps ga-text-stone mr-3">Également</span>
                      {more.map((p, k) => (
                        <span key={p.slug}>
                          <Link href={productHref(p.slug)} className="ga-link">{p.name}</Link>
                          {k < more.length - 1 && <span className="ga-text-stone"> · </span>}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      <section aria-label="Demande de conseil" className="border-t border-ga-line">
        <Container className="flex flex-col items-start justify-between gap-8 py-20 md:flex-row md:items-center lg:py-28">
          <p className="ga-display max-w-3xl text-[clamp(30px,3.8vw,56px)] leading-[1.05]">Votre secteur, vos sols, <em>votre machine.</em></p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <Button href={quoteHref()}>Demander un devis</Button>
            <TextLink href={to('/mises-en-situation')}>Mises en situation</TextLink>
          </div>
        </Container>
      </section>
    </>
  );
}
