/** Primitives graphiques de l'orientation « Plan » (composants serveur, sans état). */
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import type { Product } from '@/lib/catalog';
import { Arrowhead, IArrow } from './icons';

/* ---------- Chemins ---------- */
export const P = '/plan';
export const href = (path = '') => `${P}${path.replace(/\/$/, '')}/`;
export const productHref = (slug: string) => `${P}/produits/${slug}/`;
export const quoteHref = (slug?: string) => `${P}/contact/${slug ? `?produit=${slug}` : ''}`;
export const pad = (n: number, w = 2) => String(n).padStart(w, '0');

/* ---------- Mise en page ---------- */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1376px] px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}

/** Étiquette mono (légendes, références). */
export function Mono({ children, className = '', as: Tag = 'span' }: { children: ReactNode; className?: string; as?: 'span' | 'p' | 'div' | 'dt' | 'dd' }) {
  return <Tag className={`font-pl-mono text-[11px] uppercase leading-[1.5] tracking-[0.08em] ${className}`}>{children}</Tag>;
}

/** En-tête de planche : filet sarcelle, numéro §, intitulé, n° de feuille. */
export function SheetHead({ no, kicker, sheet, className = '' }: { no: string; kicker: string; sheet?: string; className?: string }) {
  return (
    <div className={`relative flex items-center justify-between gap-4 border-t border-pl-teal pt-3 ${className}`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <Mono className="text-pl-teal">§ {no}</Mono>
        <span className="h-px w-6 bg-pl-teal/40" aria-hidden="true" />
        <Mono className="text-pl-ink/70">{kicker}</Mono>
      </div>
      {sheet && <Mono className="hidden text-pl-ink/60 sm:inline">{sheet}</Mono>}
    </div>
  );
}

/** En-tête de page intérieure : fil d'Ariane mono, titre, chapeau, cartouche. */
export function PageHead({ code, crumbs, title, lead, cells, children }: {
  code: string; crumbs: { label: string; href?: string }[]; title: ReactNode; lead?: ReactNode;
  cells?: { k: string; v: ReactNode }[]; children?: ReactNode;
}) {
  return (
    <section className="relative border-b border-pl-line bg-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Container className="h-full"><div className="pl-grid8 h-full border-r border-pl-line opacity-60" /></Container>
      </div>
      <Container className="relative pb-10 pt-8 lg:pb-14 lg:pt-10">
        <nav aria-label="Fil d’Ariane" className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Mono className="mr-2 bg-pl-teal px-1.5 py-0.5 text-white">{code}</Mono>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-pl-ink/30" aria-hidden="true">/</span>}
              {c.href ? <Link href={c.href} className="font-pl-mono text-[11px] uppercase tracking-[0.08em] text-pl-ink/60 hover:text-pl-teal">{c.label}</Link>
                : <Mono className="text-pl-ink" >{c.label}</Mono>}
            </span>
          ))}
        </nav>
        <div className="mt-10 grid gap-8 lg:grid-cols-8 lg:gap-0">
          <div className="lg:col-span-5 lg:pr-10">
            <h1 className="text-[clamp(2.5rem,6vw,5.2rem)] font-light leading-[0.95] tracking-[-0.05em] text-pl-ink">{title}</h1>
            {lead && <div className="mt-6 max-w-[38rem] text-[16px] leading-[1.65] text-pl-ink/75">{lead}</div>}
          </div>
          {(cells || children) && (
            <div className="self-end lg:col-span-3">
              {children}
              {cells && <Cartouche cols={2} cells={cells} className={children ? 'mt-6' : ''} />}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

/* ---------- Boutons ---------- */
type BtnProps = { href: string; children: ReactNode; variant?: 'solid' | 'line' | 'ghost'; className?: string; download?: boolean; external?: boolean; icon?: ReactNode };
export function Btn({ href: to, children, variant = 'solid', className = '', download, external, icon }: BtnProps) {
  const styles = {
    solid: 'bg-pl-teal text-white [--pl-btn-hover:#12262A]',
    line: 'border border-pl-teal text-pl-teal hover:text-white [--pl-btn-hover:#0D5560]',
    ghost: 'text-pl-teal [--pl-btn-hover:#EEF2F3] px-0',
  }[variant];
  const cls = `pl-btn inline-flex min-h-11 items-center justify-between gap-6 px-5 text-[14px] font-medium tracking-[-0.005em] transition-colors duration-300 ${styles} ${className}`;
  const inner = (<><span>{children}</span><span className="pl-btn-arrow">{icon ?? <IArrow />}</span></>);
  if (download || external) return <a href={to} className={cls} {...(download ? { download: '' } : { target: '_blank', rel: 'noopener' })}>{inner}</a>;
  return <Link href={to} className={cls}>{inner}</Link>;
}

/* ---------- Repères & cotes ---------- */
export function Crops() {
  return (<><span className="pl-crop tl" aria-hidden="true" /><span className="pl-crop tr" aria-hidden="true" /><span className="pl-crop bl" aria-hidden="true" /><span className="pl-crop br" aria-hidden="true" /></>);
}

/** Ligne de cote horizontale (s'étend quand un ancêtre a data-in="true"). */
export function DimH({ label, className = '', style, labelBg }: { label: ReactNode; className?: string; style?: CSSProperties; labelBg?: string }) {
  return (
    <div className={`pl-dim pl-dim-h ${className}`} style={{ ...style, ...(labelBg ? { ['--pl-label-bg' as string]: labelBg } : {}) }} aria-hidden="true">
      <span className="pl-dim-ext a" /><span className="pl-dim-ext b" />
      <span className="pl-dim-line" />
      <Arrowhead className="pl-arrow a" /><Arrowhead className="pl-arrow b" />
      <span className="pl-dim-label font-pl-mono text-[10.5px] tracking-[0.04em]">{label}</span>
    </div>
  );
}
export function DimV({ label, className = '', style, labelBg }: { label: ReactNode; className?: string; style?: CSSProperties; labelBg?: string }) {
  return (
    <div className={`pl-dim pl-dim-v ${className}`} style={{ ...style, ...(labelBg ? { ['--pl-label-bg' as string]: labelBg } : {}) }} aria-hidden="true">
      <span className="pl-dim-ext a" /><span className="pl-dim-ext b" />
      <span className="pl-dim-line" />
      <Arrowhead className="pl-arrow a" /><Arrowhead className="pl-arrow b" />
      <span className="pl-dim-label font-pl-mono text-[10.5px] tracking-[0.04em]">{label}</span>
    </div>
  );
}

/** Chiffre clé avec marque de cote |<—>| au-dessus. */
export function Figure({ value, unit, label, className = '', big = false }: { value: string; unit?: string; label: string; className?: string; big?: boolean }) {
  return (
    <div className={className}>
      <span className="pl-mark" aria-hidden="true" />
      <p className={`mt-2 font-pl-sans font-light tracking-[-0.03em] text-pl-ink pl-tnum ${big ? 'text-[28px] sm:text-[34px]' : 'text-[19px]'}`}>
        {value}{unit && <span className={`ml-1 font-pl-mono tracking-normal text-pl-teal ${big ? 'text-[13px]' : 'text-[11px]'}`}>{unit}</span>}
      </p>
      <Mono className="mt-0.5 block text-pl-ink/65 normal-case tracking-[0.02em]">{label}</Mono>
    </div>
  );
}

/** Cartouche de plan (bloc-titre) : cellules étiquette / valeur. */
export function Cartouche({ cells, className = '', cols = 4 }: { cells: { k: string; v: ReactNode; span?: number }[]; className?: string; cols?: 2 | 3 | 4 | 6 }) {
  const gc = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4', 6: 'grid-cols-3 sm:grid-cols-6' }[cols];
  return (
    <dl className={`grid ${gc} border-l border-t border-pl-teal/70 bg-white ${className}`}>
      {cells.map((c, i) => (
        <div key={i} className="min-w-0 border-b border-r border-pl-teal/70 px-3 py-2" style={c.span ? { gridColumn: `span ${c.span} / span ${c.span}` } : undefined}>
          <dt className="font-pl-mono text-[9.5px] uppercase tracking-[0.1em] text-pl-ink/55">{c.k}</dt>
          <dd className="mt-0.5 font-pl-mono text-[11.5px] text-pl-ink [overflow-wrap:anywhere]">{c.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- Séparateurs architecturaux ---------- */
/** Ligne de coupe pointillée avec repères A—A. */
export function CutLine({ letter = 'A', className = '', tone = 'white' }: { letter?: string; className?: string; tone?: 'white' | 'paper' }) {
  const bg = tone === 'paper' ? 'bg-pl-paper' : 'bg-white';
  const marker = (
    <svg width="30" height="40" viewBox="0 0 30 40" className="shrink-0 text-pl-teal" aria-hidden="true">
      <circle cx="15" cy="13" r="11.5" fill="#fff" stroke="currentColor" />
      <text x="15" y="17.2" textAnchor="middle" className="font-pl-mono" fontSize="12" fill="currentColor">{letter}</text>
      <path d="M9 28h12l-6 9z" fill="currentColor" />
    </svg>
  );
  return (
    <div className={`${bg} ${className}`} role="separator" aria-label={`Coupe ${letter}–${letter}`}>
      <Container className="flex items-start gap-3 py-6">
        {marker}
        <div className="mt-[13px] flex-1 border-t border-dashed border-pl-teal/60 [border-top-width:1px]" style={{ borderImage: 'repeating-linear-gradient(to right, #0D5560 0 14px, transparent 14px 20px, #0D5560 20px 23px, transparent 23px 29px) 1' }} />
        {marker}
      </Container>
    </div>
  );
}

/** Découpe en gradins (escalier architectural) entre deux fonds. */
export function Steps({ from = '#FFFFFF', to = '#F6F8F8', className = '' }: { from?: string; to?: string; className?: string }) {
  return (
    <div className={className} style={{ background: from }} aria-hidden="true">
      <svg viewBox="0 0 800 56" preserveAspectRatio="none" className="block h-10 w-full sm:h-14">
        <path d="M0 56V42H400V28H500V14H600V0H800V56Z" fill={to} />
        <path d="M0 42.5H400.5V28.5H500.5V14.5H600.5V0.5H800" fill="none" stroke="#0D5560" strokeOpacity=".55" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

/** Coupe biaise à 15° (vraie valeur d'angle, indépendante de la largeur). */
export function Angle15({ from = '#F6F8F8', to = '#FFFFFF', at = '50%', className = '' }: { from?: string; to?: string; at?: string; className?: string }) {
  const H = 64, run = Math.round(H / Math.tan((15 * Math.PI) / 180)); // ≈ 239 px
  return (
    <div className={`relative h-16 ${className}`} style={{ background: to }} aria-hidden="true">
      <div className="absolute inset-0" style={{ background: from, clipPath: `polygon(0 0, 100% 0, 100% 0, calc(${at} + ${run}px) 0, ${at} 100%, 0 100%)` }} />
      <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <line x1="0" y1={H - 0.5} x2={at} y2={H - 0.5} stroke="#0D5560" strokeOpacity=".55" />
        <svg x={at} y="0" overflow="visible">
          <line x1="0" y1={H - 0.5} x2={run} y2="0.5" stroke="#0D5560" strokeOpacity=".55" />
          <line x1={run} y1="0.5" x2="4000" y2="0.5" stroke="#0D5560" strokeOpacity=".55" />
          <path d={`M60 ${H - 0.5} A 60 60 0 0 0 ${60 * Math.cos(Math.PI / 12) - 2} ${H - 60 * Math.sin(Math.PI / 12) - 0.5}`} fill="none" stroke="#49B5BF" />
          <text x="68" y={H - 8} fontSize="10.5" fill="#0D5560" className="font-pl-mono">15°</text>
        </svg>
      </svg>
    </div>
  );
}

/* ---------- Données de planche ---------- */
/** Cotes lisibles sur une fiche (uniquement ce que la fiche indique). */
export function productDims(p: Product): { h?: string; w?: string; full?: [string, string] } {
  const dim = p.specs.find(([k, v]) => /dimension|taille de la machine|taille du produit|^taille$/i.test(k) && /×/.test(v) && !/emballage/i.test(k));
  const out: { h?: string; w?: string; full?: [string, string] } = {};
  if (dim) {
    out.full = dim;
    const m = dim[1].match(/^([\d\s,]+)\s*×\s*([\d\s,]+)\s*×\s*([\d\s,]+)\s*(mm|cm)?/);
    if (m && /L\s*×\s*l\s*×\s*H/i.test(dim[0])) {
      const u = m[4] ?? 'mm';
      out.h = `H ${m[3].trim()} ${u}`;
      out.w = `L × l  ${m[1].trim()} × ${m[2].trim()} ${u}`;
    }
  }
  const hauteur = p.specs.find(([k]) => /^hauteur$/i.test(k));
  if (!out.h && hauteur) out.h = `H ${hauteur[1]}`;
  if (!out.w && p.key.width) out.w = `Largeur de travail ${p.key.width.toLocaleString('fr-FR')} mm`;
  return out;
}
