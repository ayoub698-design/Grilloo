'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSitePath } from '@/lib/use-site-path';
import { useEffect, useRef, useState } from 'react';
import { nav } from '@/lib/site';
import { img } from '@/lib/assets';
import { stats } from '@/lib/catalog';
import { to, quoteHref } from './ui';
import { ArrowRight, Close, Menu } from './icons';

export default function Header() {
  const pathname = useSitePath();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const isCurrent = (href: string) => pathname.startsWith(`/signal${href}`);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('keydown', key);
    document.documentElement.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLElement>('a')?.focus();
    return () => { document.removeEventListener('keydown', key); document.documentElement.style.overflow = ''; };
  }, [open]);

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? 'shadow-[0_1px_0_#E8E8E8]' : ''}`}>
      <a href="#contenu" className="si-label sr-only rounded-full bg-si-yellow px-4 py-2 focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60]">Aller au contenu</a>
      <div className="mx-auto flex h-[68px] w-full max-w-[1600px] items-center gap-4 px-5 md:h-[76px] md:px-10">
        <Link href={to('')} className="flex shrink-0 items-center gap-3" aria-label="GRILLOO — accueil">
          <Image src={img.logo('ink')} alt="GRILLOO" width={799} height={293} priority className="h-7 w-auto md:h-8" />
          <span className="si-label hidden rounded-full bg-si-cyan-soft px-2.5 py-1 text-[10px] xl:inline-flex">Catalogue 2024 · {stats.products} machines</span>
        </Link>

        <nav aria-label="Navigation principale" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => {
              const cur = isCurrent(n.href);
              return (
                <li key={n.href}>
                  <Link
                    href={to(n.href)}
                    aria-current={cur ? 'page' : undefined}
                    className={`si-btn inline-flex h-10 items-center rounded-full px-4 text-[14px] font-semibold [font-stretch:108%] ${cur ? 'bg-si-ink text-white' : 'text-si-ink hover:bg-si-cyan-soft'}`}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link href={quoteHref()} className="si-btn ml-auto hidden h-11 items-center gap-2 rounded-full bg-si-cyan px-5 text-[14px] font-bold text-si-ink [font-stretch:110%] hover:bg-[#35c6d8] sm:inline-flex lg:ml-3">
          Demander un devis <ArrowRight className="si-arrow h-4 w-4" />
        </Link>

        <button
          ref={btn}
          type="button"
          className="si-btn ml-auto grid h-11 w-11 place-items-center rounded-full bg-si-ink text-white sm:ml-0 lg:hidden"
          aria-expanded={open}
          aria-controls="si-menu"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="si-menu"
        ref={panel}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[68px] z-40 overflow-y-auto bg-si-cyan md:top-[76px] lg:hidden"
      >
        <nav aria-label="Navigation mobile" className="flex min-h-full flex-col px-5 pb-10 pt-6 md:px-10">
          <ul className="flex flex-col">
            {[{ href: '', label: 'Accueil' }, ...nav].map((n, i) => {
              const cur = n.href ? isCurrent(n.href) : pathname === '/signal/' || pathname === '/signal';
              return (
                <li key={n.href} className="border-b-2 border-si-ink/15">
                  <Link href={to(n.href)} aria-current={cur ? 'page' : undefined} className="flex items-baseline gap-4 py-4 text-si-ink">
                    <span className="si-label w-6 text-si-ink/60">{String(i).padStart(2, '0')}</span>
                    <span className={`si-display text-[clamp(1.8rem,8.5vw,3.5rem)] ${cur ? 'underline decoration-4 underline-offset-8' : ''}`}>{n.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href={quoteHref()} className="si-btn mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-si-ink px-6 text-base font-bold text-white">
            Demander un devis <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="si-label mt-auto pt-10 text-si-ink/70">Leader des solutions de nettoyage</p>
        </nav>
      </div>
    </header>
  );
}
