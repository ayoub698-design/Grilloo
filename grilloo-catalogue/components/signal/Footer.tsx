import Image from 'next/image';
import Link from 'next/link';
import { families, brand, stats } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { nav, site } from '@/lib/site';
import { Container, to, familyHref, quoteHref } from './ui';
import { ArrowLeft, Download, Social } from './icons';

export default function Footer() {
  return (
    <footer className="relative border-t-[6px] border-si-ink bg-white pt-16 text-si-ink md:pt-20">
      <Container>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Image src={img.logo('ink', true)} alt="GRILLOO — Leader des solutions de nettoyage" width={799} height={396} className="h-20 w-auto" />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-si-grey">{brand.backCover} {stats.products} machines professionnelles réparties en {stats.families} familles, catalogue 2024.</p>
            <a href={img.catalogue} download className="si-btn mt-6 inline-flex h-12 items-center gap-2.5 rounded-full bg-si-ink px-5 text-[14px] font-bold text-white [font-stretch:110%]">
              <Download className="h-4 w-4" /> Catalogue 2024 (PDF)
            </a>
          </div>

          <nav aria-label="Familles" className="md:col-span-3">
            <h2 className="si-label text-si-grey">Familles</h2>
            <ul className="mt-4 grid grid-cols-1 gap-y-2 text-[15px] font-semibold">
              {families.map((f) => (
                <li key={f.slug}><Link href={familyHref(f.slug)} className="hover:text-si-cyan">{f.plural} <span className="text-si-grey">· {f.count}</span></Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Pages" className="md:col-span-2">
            <h2 className="si-label text-si-grey">Pages</h2>
            <ul className="mt-4 space-y-2 text-[15px] font-semibold">
              <li><Link href={to('')} className="hover:text-si-cyan">Accueil</Link></li>
              {nav.map((n) => (<li key={n.href}><Link href={to(n.href)} className="hover:text-si-cyan">{n.label}</Link></li>))}
              <li><Link href={quoteHref()} className="hover:text-si-cyan">Demander un devis</Link></li>
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="si-label text-si-grey">Contact</h2>
            <dl className="mt-4 space-y-3 text-[15px]">
              <div><dt className="font-semibold">Téléphone</dt><dd className="text-si-grey">{site.phone}</dd></div>
              <div><dt className="font-semibold">E-mail</dt><dd className="text-si-grey">{site.email}</dd></div>
              <div><dt className="font-semibold">Adresse</dt><dd className="text-si-grey">{site.address.line1}</dd></div>
              <div><dt className="font-semibold">Site</dt><dd><a href={site.url} className="text-si-grey hover:text-si-cyan">{site.domain}</a></dd></div>
            </dl>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Réseaux sociaux">
              {site.social.map((s) => (
                <li key={s.name}>
                  <a href={s.href} aria-label={`${s.name} (lien à fournir)`} className="si-btn grid h-11 w-11 place-items-center rounded-full ring-2 ring-inset ring-si-ink hover:bg-si-cyan">
                    <Social name={s.name} className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p aria-hidden="true" className="si-display-cond mt-16 select-none overflow-hidden whitespace-nowrap text-[8.4vw] leading-[.8] text-si-cyan md:mt-20 2xl:text-[134px]">
          {brand.headline}
        </p>

        <div className="flex flex-col gap-4 border-t border-si-line py-6 text-[13px] text-si-grey md:flex-row md:items-center md:justify-between">
          <p>© GRILLOO · {site.tagline}. Maquette — orientation B « Signal ». Photos d’ambiance provisoires.</p>
          <Link href="/" className="si-btn inline-flex items-center gap-2 font-semibold text-si-ink">
            <ArrowLeft className="h-4 w-4" /> Autres orientations
          </Link>
        </div>
      </Container>
    </footer>
  );
}
