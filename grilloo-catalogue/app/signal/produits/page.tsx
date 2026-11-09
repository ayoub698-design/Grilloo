import { stats } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { Container, Eyebrow } from '@/components/signal/ui';
import CatalogueClient from '@/components/signal/CatalogueClient';
import { Download } from '@/components/signal/icons';

export const metadata = {
  title: 'Nos produits',
  description: `Les ${stats.products} machines du catalogue GRILLOO 2024 : recherche, filtres par famille et par énergie, fiches techniques et demande de devis.`,
};

export default function SignalProduits() {
  return (
    <section className="pb-24 pt-8 md:pt-12">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Catalogue 2024</Eyebrow>
            <h1 className="mt-4 flex flex-wrap items-baseline gap-x-5">
              <span className="si-display si-enter-x text-[clamp(3rem,11vw,10.5rem)]">Nos</span>
              <span className="si-display-cond si-enter-x text-[clamp(3.6rem,13vw,12.5rem)] text-si-cyan" style={{ '--d': '80ms' } as React.CSSProperties}>produits</span>
            </h1>
          </div>
          <a href={img.catalogue} download className="si-btn mb-3 inline-flex h-12 items-center gap-2 rounded-full px-5 text-[14px] font-bold ring-2 ring-inset ring-si-ink hover:bg-si-yellow">
            <Download className="h-4 w-4" /> Catalogue PDF
          </a>
        </div>
        <div className="mt-8 md:mt-10">
          <CatalogueClient />
        </div>
      </Container>
    </section>
  );
}
