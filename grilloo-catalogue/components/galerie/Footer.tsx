import Link from 'next/link';
import Image from 'next/image';
import { brand, families, stats } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { nav, site } from '@/lib/site';
import { to, familyHref } from './links';
import { ArrowLeft, Download } from './icons';

export function Footer() {
  return (
    <footer className="border-t border-ga-line bg-ga-paper">
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-10 pt-16 sm:px-8 lg:px-14 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image src={img.logo('ink', true)} alt="GRILLOO — Leader des solutions de nettoyage" width={799} height={396} className="h-auto w-[150px]" />
            <p className="ga-display mt-8 max-w-sm text-[26px] italic leading-[1.15]">{brand.backCover}</p>
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed ga-text-stone">
              Catalogue 2024 — {stats.products} machines réparties en {stats.families} familles.
            </p>
            <a href={img.catalogue} target="_blank" rel="noopener" className="group mt-6 inline-flex items-center gap-3 text-[13.5px]">
              <Download className="h-4 w-4" />
              <span className="ga-link">Catalogue 2024 (PDF)</span>
            </a>
          </div>

          <nav aria-label="Familles" className="lg:col-span-3">
            <p className="ga-caps ga-text-stone">Familles</p>
            <ul className="mt-5 grid grid-cols-1 gap-2.5 text-[13.5px] sm:grid-cols-2 lg:grid-cols-1">
              {families.map((f) => (
                <li key={f.slug}><Link href={familyHref(f.slug)} className="ga-link">{f.plural}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Pages" className="lg:col-span-2">
            <p className="ga-caps ga-text-stone">Pages</p>
            <ul className="mt-5 space-y-2.5 text-[13.5px]">
              <li><Link href={to()} className="ga-link">Accueil</Link></li>
              {nav.map((n) => (<li key={n.href}><Link href={to(n.href)} className="ga-link">{n.label}</Link></li>))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="ga-caps ga-text-stone">Contact</p>
            <dl className="mt-5 space-y-3 text-[13.5px]">
              <div><dt className="sr-only">Téléphone</dt><dd>Téléphone — <span className="ga-text-stone">{site.phone}</span></dd></div>
              <div><dt className="sr-only">E-mail</dt><dd>E-mail — <span className="ga-text-stone">{site.email}</span></dd></div>
              <div><dt className="sr-only">Adresse</dt><dd>Adresse — <span className="ga-text-stone">{site.address.line1}</span></dd></div>
              <div><dt className="sr-only">Site</dt><dd><a href={site.url} className="ga-link">{site.domain}</a></dd></div>
            </dl>
            <p className="ga-caps ga-text-stone mt-8">Réseaux</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px]">
              {site.social.map((s) => (<li key={s.name}><a href={s.href} className="ga-link">{s.name}</a></li>))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ga-line pt-6 text-[12px] ga-text-stone sm:flex-row sm:items-center sm:justify-between">
          <p>© GRILLOO — {site.tagline}. Maquette « Galerie » : photos d’ambiance provisoires.</p>
          <Link href="/" className="group inline-flex items-center gap-3 text-ga-ink">
            <ArrowLeft className="h-[9px] w-[20px]" />
            <span className="ga-link">Autres orientations</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
