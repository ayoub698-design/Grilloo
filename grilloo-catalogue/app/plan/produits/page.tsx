import type { Metadata } from 'next';
import { stats } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { CatalogueClient } from '@/components/plan/CatalogueClient';
import { IDownload } from '@/components/plan/icons';
import { Container, PageHead, href } from '@/components/plan/ui';

export const metadata: Metadata = {
  title: 'Nos produits — Catalogue des machines',
  description: `Les ${stats.products} machines de nettoyage GRILLOO : recherche, filtres par famille et énergie, fiches techniques complètes et demande de devis.`,
};

export default function ProduitsPage() {
  return (
    <>
      <PageHead
        code="P-00"
        crumbs={[{ label: 'Accueil', href: href('') }, { label: 'Nos produits' }]}
        title={<>Catalogue<br /><span className="text-pl-ink/45">des machines</span></>}
        lead={<>Les {stats.products} machines du catalogue 2024, classées en {stats.families} familles. Recherchez un modèle, filtrez par famille ou par énergie, comparez en vue tableau.</>}
        cells={[
          { k: 'Fiches', v: `${stats.products}` },
          { k: 'Familles', v: `${stats.families}` },
          { k: 'Édition', v: 'Catalogue 2024' },
          { k: 'Document', v: <a href={img.catalogue} download className="inline-flex items-center gap-1.5 text-pl-teal hover:underline"><IDownload size={12} /> PDF</a> },
        ]}
      />
      <section aria-label="Catalogue filtrable" className="bg-white pb-24 pt-10">
        <Container>
          <CatalogueClient />
        </Container>
      </section>
    </>
  );
}
