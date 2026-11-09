import Link from 'next/link';
import Image from 'next/image';
import { fraunces, inter, archivo, geist, geistMono } from '@/lib/fonts';
import { img } from '@/lib/assets';
import { stats } from '@/lib/catalog';

export const metadata = { title: 'Trois orientations de design' };

const directions = [
  {
    href: '/galerie/', code: 'A', name: 'Galerie', tone: 'Minimaliste · luxe',
    text: 'Le catalogue comme une collection d’objets de design : blanc chaud, typographie à empattements, silence et lenteur.',
    product: 'm43', className: 'bg-ga-paper text-ga-ink', title: 'font-ga-display italic font-light',
  },
  {
    href: '/signal/', code: 'B', name: 'Signal', tone: 'Audacieux · bold',
    text: 'L’énergie de la marque : blanc éclatant, typographie géante, cyan GRILLOO en grands aplats, mouvement nerveux.',
    product: 'g9', className: 'bg-white text-si-ink', title: 'font-si font-black uppercase tracking-tight [font-stretch:120%]',
  },
  {
    href: '/plan/', code: 'C', name: 'Plan', tone: 'Technique · architectural',
    text: 'Le catalogue comme un dossier d’architecte : trait fin, cotes, cartouches et dessins axonométriques.',
    product: 'roboclean-g-plus', className: 'bg-pl-paper text-pl-ink', title: 'font-pl-sans font-light tracking-tight',
  },
];

export default function Home() {
  return (
    <main className={`${fraunces.variable} ${inter.variable} ${archivo.variable} ${geist.variable} ${geistMono.variable} min-h-screen bg-white font-[var(--font-inter)] text-neutral-900`}>
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-neutral-200 pb-8">
          <div>
            <Image src={img.logo('cyan', true)} alt="GRILLOO — Leader des solutions de nettoyage" width={180} height={89} priority />
            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">Site catalogue — trois orientations</h1>
            <p className="mt-3 max-w-2xl text-neutral-500">Le même site ({stats.products} machines, 7 pages) décliné en trois univers visuels. Contenu issu du catalogue 2024 ; photos d’ambiance provisoires en attente des visuels GRILLOO.</p>
          </div>
          <span className="font-[var(--font-geist-mono)] text-xs uppercase tracking-widest text-neutral-400">Maquettes · Next.js + Tailwind</span>
        </header>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {directions.map((d) => (
            <Link key={d.code} href={d.href} className={`group relative flex flex-col overflow-hidden rounded-2xl ring-1 ring-neutral-200 transition hover:-translate-y-1 hover:shadow-2xl ${d.className}`}>
              <div className="relative h-72">
                <Image src={img.product(d.product)} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-contain p-10 transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col gap-3 border-t border-black/5 p-6">
                <span className="text-xs font-medium uppercase tracking-widest opacity-60">{d.code} · {d.tone}</span>
                <h2 className={`text-4xl ${d.title}`}>{d.name}</h2>
                <p className="text-sm opacity-70">{d.text}</p>
                <span className="mt-auto pt-4 text-sm font-semibold">Ouvrir l’orientation →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
