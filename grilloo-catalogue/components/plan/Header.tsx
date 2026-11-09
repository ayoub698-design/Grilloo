'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSitePath } from '@/lib/use-site-path';
import { useEffect, useRef, useState } from 'react';
import { img } from '@/lib/assets';
import { nav } from '@/lib/site';
import { IArrow, IClose, IMenu } from './icons';
import { href, P, quoteHref } from './ui';

export function Header() {
  const pathname = useSitePath();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname.startsWith(`${P}${path}`);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLElement>('a')?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-[2px] transition-shadow duration-300 ${scrolled ? 'shadow-[0_1px_0_#0D5560]' : 'shadow-[0_1px_0_#DDE5E6]'}`}>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-pl-teal focus:px-3 focus:py-2 focus:text-white">Aller au contenu</a>
      <div className="mx-auto flex h-16 w-full max-w-[1376px] items-center gap-6 px-4 sm:px-6 lg:px-10">
        <Link href={href('')} className="flex shrink-0 items-center gap-3" aria-label="GRILLOO — accueil">
          <Image src={img.logo('ink')} alt="" width={92} height={34} className="h-[22px] w-auto" priority />
          <span className="hidden border-l border-pl-line pl-3 font-pl-mono text-[10px] uppercase leading-[1.25] tracking-[0.1em] text-pl-ink/60 xl:block">Catalogue 2024<br />Dossier technique</span>
        </Link>

        <nav aria-label="Navigation principale" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-7">
            {nav.map((n, i) => (
              <li key={n.href}>
                <Link href={href(n.href)} aria-current={isActive(n.href) ? 'page' : undefined}
                  className={`pl-navlink flex items-baseline gap-1.5 text-[14px] tracking-[-0.005em] transition-colors ${isActive(n.href) ? 'text-pl-teal' : 'text-pl-ink/80 hover:text-pl-ink'}`}>
                  <span className="font-pl-mono text-[9.5px] text-pl-ink/45">0{i + 1}</span>{n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href={quoteHref()} className="pl-btn ml-auto hidden h-10 items-center gap-3 bg-pl-teal px-4 text-[13.5px] font-medium text-white [--pl-btn-hover:#12262A] sm:inline-flex lg:ml-2">
          Demander un devis <span className="pl-btn-arrow"><IArrow /></span>
        </Link>
        <button ref={btn} type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="pl-menu"
          className="ml-auto flex h-10 items-center gap-2 border border-pl-line px-3 font-pl-mono text-[11px] uppercase tracking-[0.08em] text-pl-ink sm:ml-0 lg:hidden">
          {open ? <IClose /> : <IMenu />} {open ? 'Fermer' : 'Menu'}
        </button>
      </div>

      {open && (
        <div id="pl-menu" ref={panel} className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-white pl-grid8 lg:hidden">
          <nav aria-label="Navigation mobile" className="px-4 pb-10 pt-4 sm:px-6">
            <ul className="border-t border-pl-teal">
              <li>
                <Link href={href('')} aria-current={pathname === `${P}/` || pathname === P ? 'page' : undefined} className="flex items-baseline gap-4 border-b border-pl-line bg-white py-4 text-[22px] font-light tracking-[-0.02em] text-pl-ink">
                  <span className="w-6 font-pl-mono text-[11px] text-pl-ink/50">00</span>Accueil
                </Link>
              </li>
              {nav.map((n, i) => (
                <li key={n.href}>
                  <Link href={href(n.href)} aria-current={isActive(n.href) ? 'page' : undefined}
                    className={`flex items-baseline gap-4 border-b border-pl-line bg-white py-4 text-[22px] font-light tracking-[-0.02em] ${isActive(n.href) ? 'text-pl-teal' : 'text-pl-ink'}`}>
                    <span className="w-6 font-pl-mono text-[11px] text-pl-ink/50">0{i + 1}</span>{n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={quoteHref()} className="mt-6 flex h-12 items-center justify-between bg-pl-teal px-5 text-[15px] font-medium text-white">
              Demander un devis <IArrow />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
