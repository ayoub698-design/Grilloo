import { gallery } from '@/lib/assets';
import { Btn, Container, Eyebrow, quoteHref, to } from '@/components/signal/ui';
import { Gallery, BeforeAfter } from '@/components/signal/GalleryClient';
import { Reveal } from '@/components/signal/motion';
import { BristleEdge } from '@/components/signal/shapes';

export const metadata = {
  title: 'Mises en situation',
  description: 'Les machines GRILLOO en situation par secteur : logistique, santé, hôtellerie, industrie. Visuels d’illustration et comparaison avant / après.',
};

export default function SignalSituations() {
  return (
    <>
      <section className="pb-16 pt-8 md:pb-24 md:pt-12">
        <Container>
          <Eyebrow>Galerie · {gallery.length} visuels</Eyebrow>
          <h1 className="mt-4">
            <span className="si-display si-enter-x block text-[clamp(2.6rem,10vw,10rem)]">Mises en</span>
            <span className="si-display-cond si-enter-x block text-[clamp(3.2rem,12.4vw,12.4rem)] text-si-cyan" style={{ '--d': '80ms' } as React.CSSProperties}>situation</span>
          </h1>
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <p className="max-w-2xl text-[18px] leading-relaxed text-si-ink/75">
              Les machines du catalogue, secteur par secteur. Ce sont des <strong className="font-bold text-si-ink">visuels d’illustration</strong> (photos provisoires, en attente des photos GRILLOO) : ils ne représentent pas des chantiers réels.
            </p>
          </div>
          <div className="mt-10">
            <Gallery />
          </div>
        </Container>
      </section>

      <section className="relative" aria-labelledby="ba-title">
        <BristleEdge fill="#D9F3F6" down={false} />
        <div className="-mt-px bg-si-cyan-soft pb-20 pt-10 md:pb-28">
          <Container>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
              <h2 id="ba-title" className="lg:col-span-8">
                <Reveal as="span" variant="left" className="si-display block text-[clamp(2.4rem,8vw,8rem)]">Avant.</Reveal>
                <Reveal as="span" variant="left" delay={90} className="si-display-cond block text-[clamp(2.8rem,9.6vw,9.6rem)] text-si-cyan">Après.</Reveal>
              </h2>
              <p className="text-[17px] leading-relaxed text-si-ink/80 lg:col-span-4 lg:pb-3">
                Un même sol, cadré à l’identique, avant et après un passage d’autolaveuse : lavé, brossé, aspiré, séché.
              </p>
            </div>
            <div className="mt-10">
              <BeforeAfter />
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Btn href={to('/produits') + '?famille=autolaveuses'} tone="ink">Voir les autolaveuses</Btn>
              <Btn href={quoteHref()} tone="outline" arrow={false}>Demander une démonstration</Btn>
            </div>
          </Container>
        </div>
      </section>
    </>
  );
}
