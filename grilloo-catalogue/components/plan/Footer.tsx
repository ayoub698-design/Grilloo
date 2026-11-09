import Image from 'next/image';
import Link from 'next/link';
import { img } from '@/lib/assets';
import { families, stats } from '@/lib/catalog';
import { nav, site } from '@/lib/site';
import { IArrowLeft, IDownload } from './icons';
import { Container, href, Mono, pad } from './ui';

export function Footer() {
  const col = 'border-pl-line py-8 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0';
  return (
    <footer className="border-t border-pl-teal bg-white text-pl-ink">
      <Container>
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.8fr_1fr]">
          <div className={`${col} border-b sm:col-span-2 lg:col-span-1 lg:border-b-0`}>
            <Image src={img.logo('ink', true)} alt="GRILLOO — Leader des solutions de nettoyage" width={170} height={84} className="h-auto w-[150px]" />
            <p className="mt-6 max-w-xs text-[14px] leading-relaxed text-pl-ink/75">
              {stats.products} machines de nettoyage professionnelles en {stats.families} familles, présentées d’après le catalogue 2024.
            </p>
            <a href={img.catalogue} download className="mt-6 inline-flex items-center gap-2 border-b border-pl-teal pb-1 text-[14px] text-pl-teal hover:border-pl-cyan">
              <IDownload /> Catalogue 2024 (PDF)
            </a>
          </div>

          <div className={`${col} border-b sm:border-b-0`}>
            <Mono className="text-pl-ink/55">Familles</Mono>
            <ul className="mt-4 grid gap-1.5 text-[13.5px]">
              {families.map((f, i) => (
                <li key={f.slug}>
                  <Link href={`${href('/produits')}?famille=${f.slug}`} className="group flex items-baseline gap-2 text-pl-ink/80 hover:text-pl-teal">
                    <span className="font-pl-mono text-[10px] text-pl-ink/45">{pad(i + 1)}</span>{f.plural}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${col} border-b sm:border-b-0`}>
            <Mono className="text-pl-ink/55">Pages</Mono>
            <ul className="mt-4 grid gap-1.5 text-[13.5px]">
              <li><Link href={href('')} className="text-pl-ink/80 hover:text-pl-teal">Accueil</Link></li>
              {nav.map((n) => <li key={n.href}><Link href={href(n.href)} className="text-pl-ink/80 hover:text-pl-teal">{n.label}</Link></li>)}
            </ul>
            <Mono className="mt-8 block text-pl-ink/55">Réseaux</Mono>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13.5px]">
              {site.social.map((s) => <li key={s.name}><a href={s.href} className="text-pl-ink/80 hover:text-pl-teal">{s.name}</a></li>)}
            </ul>
          </div>

          <div className={col}>
            <Mono className="text-pl-ink/55">Contact</Mono>
            <dl className="mt-4 grid gap-3 text-[13.5px]">
              <div><dt className="font-pl-mono text-[10px] uppercase tracking-[0.08em] text-pl-ink/50">Téléphone</dt><dd className="text-pl-ink/85">{site.phone}</dd></div>
              <div><dt className="font-pl-mono text-[10px] uppercase tracking-[0.08em] text-pl-ink/50">E-mail</dt><dd className="text-pl-ink/85">{site.email}</dd></div>
              <div><dt className="font-pl-mono text-[10px] uppercase tracking-[0.08em] text-pl-ink/50">Adresse</dt><dd className="text-pl-ink/85">{site.address.line1}</dd></div>
              <div><dt className="font-pl-mono text-[10px] uppercase tracking-[0.08em] text-pl-ink/50">Site</dt><dd className="text-pl-ink/85">{site.domain}</dd></div>
            </dl>
          </div>
        </div>
      </Container>

      {/* Cartouche de bas de planche */}
      <div className="border-t border-pl-line">
        <Container className="grid grid-cols-2 font-pl-mono text-[10.5px] uppercase tracking-[0.08em] text-pl-ink/60 sm:grid-cols-4 lg:grid-cols-[1.3fr_1fr_0.8fr_1fr]">
          <p className="py-4">© GRILLOO · {site.tagline}</p>
          <p className="py-4 sm:border-l sm:border-pl-line sm:pl-4 lg:pl-8">Source : catalogue 2024</p>
          <p className="py-4 sm:border-l sm:border-pl-line sm:pl-4 lg:pl-8">Orientation C · Plan</p>
          <p className="py-4 sm:border-l sm:border-pl-line sm:pl-4 lg:pl-8">
            <Link href="/" className="inline-flex items-center gap-2 text-pl-teal hover:text-pl-ink"><IArrowLeft size={14} /> Autres orientations</Link>
          </p>
        </Container>
      </div>
    </footer>
  );
}
