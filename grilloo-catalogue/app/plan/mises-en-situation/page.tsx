import type { Metadata } from 'next';
import { gallery } from '@/lib/assets';
import { BeforeAfter, GalleryClient } from '@/components/plan/GalleryClient';
import { Container, CutLine, PageHead, SheetHead, href } from '@/components/plan/ui';

export const metadata: Metadata = {
  title: 'Mises en situation — Machines par secteur',
  description: 'Les machines GRILLOO présentées en situation, par secteur : entrepôt, couloir hospitalier, parking, hall en marbre, couloir d’hôtel, atelier. Visuels d’illustration.',
};

export default function MisesEnSituationPage() {
  return (
    <>
      <PageHead
        code="M-00"
        crumbs={[{ label: 'Accueil', href: href('') }, { label: 'Mises en situation' }]}
        title={<>Mises en<br /><span className="text-pl-ink/45">situation</span></>}
        lead="Les machines du catalogue replacées dans les lieux auxquels elles sont destinées. Cliquez sur une planche pour l’agrandir et accéder à la fiche de la machine."
        cells={[
          { k: 'Planches', v: String(gallery.length) },
          { k: 'Statut', v: 'Visuels d’illustration' },
        ]}
      >
        <p className="border border-dashed border-pl-teal/60 bg-pl-paper px-4 py-3 text-[13.5px] leading-relaxed text-pl-ink/80">
          <span className="mb-1 block font-pl-mono text-[10px] uppercase tracking-[0.1em] text-pl-teal">Note</span>
          Ces visuels sont provisoires et illustratifs : ils montrent les machines par secteur, sans représenter de chantiers ni de clients réels.
        </p>
      </PageHead>

      <section aria-labelledby="pl-gal" className="bg-white pb-20 pt-10">
        <Container>
          <SheetHead no="01" kicker="Galerie" sheet={`${gallery.length} planches`} className="mb-6" />
          <h2 id="pl-gal" className="sr-only">Galerie des mises en situation</h2>
          <GalleryClient />
        </Container>
      </section>

      <CutLine letter="C" />

      <section aria-labelledby="pl-ba-title" className="bg-white pb-24 pt-4">
        <Container>
          <SheetHead no="02" kicker="Comparaison" sheet="Avant / après" />
          <div className="mt-10 grid gap-6 lg:grid-cols-8">
            <h2 id="pl-ba-title" className="text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1] tracking-[-0.045em] lg:col-span-5">
              Le même sol,<br /><span className="text-pl-ink/45">avant et après.</span>
            </h2>
            <p className="max-w-md self-end text-[15px] leading-relaxed text-pl-ink/75 lg:col-span-3">
              Faites glisser la ligne de coupe (ou utilisez les flèches du clavier) pour comparer les deux états du même cadrage.
            </p>
          </div>
          <div className="mt-10">
            <BeforeAfter />
          </div>
        </Container>
      </section>
    </>
  );
}
