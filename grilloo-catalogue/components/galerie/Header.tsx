'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSitePath } from '@/lib/use-site-path';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { nav, site } from '@/lib/site';
import { img } from '@/lib/assets';
import { to, quoteHref, pad } from './links';
import { ArrowRight, Close } from './icons';

export function Header() {
  const pathname = useSitePath();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname.startsWith(to(href)) || pathname === `/galerie${href}`;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const first = panelRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); }
      if (e.key === 'Tab' && panelRef.current) {
        const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a, button'));
        if (!f.length) return;
        const [a, z] = [f[0], f[f.length - 1]];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <header className={`sticky top-0 z-40 bg-ga-paper/95 transition-[border-color] duration-700 ${scrolled ? 'border-b border-ga-line' : 'border-b border-transparent'}`}>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:bg-ga-paper focus:px-3 focus:py-2 focus:text-sm">Aller au contenu</a>
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[84px] lg:px-14">
        <Link href={to()} className="flex items-center gap-4" aria-label="GRILLOO — accueil Galerie">
          <Image src={img.logo('ink')} alt="GRILLOO" width={799} height={293} priority className="h-[22px] w-auto lg:h-[26px]" />
          <span className="ga-caps ga-text-stone hidden border-l border-ga-line pl-4 xl:inline">{site.tagline}</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[13.5px]">
            {nav.map((n) => {
              const active = isActive(n.href);
              return (
                <li key={n.href}>
                  <Link href={to(n.href)} aria-current={active ? 'page' : undefined} className="relative py-2">
                    <span className={`ga-link ${active ? 'ga-text-stone' : ''}`} data-active={active}>{n.label}</span>
                    {active && <span className="absolute -bottom-[3px] left-0 right-0 h-px bg-[#49B5BF]" aria-hidden />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <Link href={quoteHref()} className="ga-btn ga-btn--line hidden !min-h-[40px] !px-5 text-[12.5px] sm:inline-flex">
            Demander un devis
          </Link>
          <button
            ref={btnRef}
            type="button"
            className="ga-caps flex h-11 items-center gap-3 lg:hidden"
            aria-expanded={open}
            aria-controls="ga-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span>{open ? 'Fermer' : 'Menu'}</span>
            <span className="relative block h-[9px] w-6" aria-hidden>
              <span className={`absolute left-0 right-0 top-0 h-px bg-ga-ink transition-transform duration-500 ${open ? 'translate-y-[4px] rotate-45' : ''}`} />
              <span className={`absolute bottom-0 left-0 right-0 h-px bg-ga-ink transition-transform duration-500 ${open ? '-translate-y-[4px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div id="ga-menu" ref={panelRef} role="dialog" aria-modal="true" aria-label="Menu" className="ga-menu fixed inset-0 top-[72px] z-40 overflow-y-auto bg-ga-paper lg:hidden">
          <nav aria-label="Navigation mobile" className="px-5 pb-10 pt-6 sm:px-8">
            <ul className="border-t border-ga-line">
              <li style={{ '--i': 0 } as CSSProperties} className="border-b border-ga-line">
                <Link href={to()} className="flex items-baseline gap-5 py-5">
                  <span className="ga-caps ga-text-stone w-8">00</span>
                  <span className="ga-display text-[34px] leading-none">Accueil</span>
                </Link>
              </li>
              {nav.map((n, i) => (
                <li key={n.href} style={{ '--i': i + 1 } as CSSProperties} className="border-b border-ga-line">
                  <Link href={to(n.href)} aria-current={isActive(n.href) ? 'page' : undefined} className="flex items-baseline gap-5 py-5">
                    <span className="ga-caps ga-text-stone w-8">{pad(i + 1)}</span>
                    <span className={`ga-display text-[34px] leading-none ${isActive(n.href) ? 'italic' : ''}`}>{n.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={quoteHref()} className="ga-btn ga-btn--ink mt-10 w-full">
              Demander un devis <ArrowRight className="h-[9px] w-[20px]" />
            </Link>
            <button type="button" onClick={() => { setOpen(false); btnRef.current?.focus(); }} className="ga-caps ga-text-stone mx-auto mt-8 flex items-center gap-2">
              <Close className="h-3.5 w-3.5" /> Fermer le menu
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
