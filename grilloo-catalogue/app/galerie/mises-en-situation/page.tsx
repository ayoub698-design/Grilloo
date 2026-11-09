import type { Metadata } from 'next';
import { beforeAfter, gallery } from '@/lib/assets';
import { GalleryView } from '@/components/galerie/GalleryView';
import { BeforeAfter } from '@/components/galerie/BeforeAfter';
import { Reveal, Lines, Curve } from '@/components/galerie/motion';
import { Caption, Container, Button, TextLink } from '@/components/galerie/ui';
import { to, quoteHref } from '@/components/galerie/links';

export const metadata: Metadata = {
  title: 'Mises en situation — les machines par secteur',
  description: 'Les machines GRILLOO présentées dans leurs environnements d’usage : entrepôt, couloir hospitalier, parking, hall en marbre, moquette d’hôtel, atelier. Visuels d’illustration.',
};

export default function MisesEnSituationPage() {
  return (
    <>
      <Container className="pb-12 pt-12 lg:pb-16 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal variant="fade"><Caption rule>Mises en situation — {gallery.length} vues</Caption></Reveal>
            <Lines as="h1" className="ga-display mt-6 text-[clamp(50px,7.4vw,120px)] leading-[.93] tracking-[-0.03em]" lines={['Les machines', <em key="e">en situation</em>]} />
          </div>
          <Reveal delay={250} className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-[15px] leading-[1.75] ga-text-stone">
              Chaque machine replacée dans le type de lieu pour lequel elle est conçue. Ce sont des <strong className="font-medium text-ga-ink">visuels d’illustration</strong>, pas des chantiers clients : ils seront remplacés par les photos GRILLOO.
            </p>
          </Reveal>
        </div>
      </Container>

      <Container className="pb-20 lg:pb-28">
        <GalleryView />
      </Container>

      <Curve shape="rise" />

      <section aria-labelledby="ga-ba" className="pb-24 pt-12 lg:pb-32 lg:pt-16">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Caption rule>Avant / après</Caption>
            <Lines id="ga-ba" className="ga-display mt-6 text-[clamp(40px,4.6vw,72px)] leading-[.98]" lines={['Le même sol,', <em key="e">un passage plus tard.</em>]} />
            <p className="mt-8 max-w-sm text-[15px] leading-[1.75] ga-text-stone">
              Le principe d’une autolaveuse : la solution est déposée, le plateau de brosse décolle la salissure, l’aspiration récupère l’eau sale et le suceur laisse le sol sec derrière la machine.
            </p>
            <p className="mt-6 text-[12.5px] italic ga-text-stone">Comparaison d’illustration, sans valeur de mesure.</p>
          </div>
          <Reveal variant="img" className="lg:col-span-8">
            <BeforeAfter before={beforeAfter.before} after={beforeAfter.after} caption={beforeAfter.caption} />
          </Reveal>
        </Container>
      </section>

      <section aria-label="Demande de devis" className="bg-ga-ivory">
        <Container className="flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center lg:py-24">
          <p className="ga-display max-w-3xl text-[clamp(30px,3.8vw,56px)] leading-[1.05]">Une machine a retenu <em>votre attention ?</em></p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <Button href={quoteHref()}>Demander un devis</Button>
            <TextLink href={to('/produits')}>Voir la collection</TextLink>
          </div>
        </Container>
      </section>
    </>
  );
}
