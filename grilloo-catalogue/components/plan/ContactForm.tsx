'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { families, getProduct, productsOf } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { useQuoteForm, type QuoteData } from '@/lib/hooks';
import { floorTypes, requestTypes } from '@/lib/site';
import { IArrow, ICheck } from './icons';
import { Mono, pad, productHref } from './ui';

const input = 'w-full border border-pl-line bg-white px-3 py-2.5 text-[15px] text-pl-ink placeholder:text-pl-ink/40 transition-colors focus:border-pl-teal focus:outline-none aria-[invalid=true]:border-[#B4412F]';

function Row({ n, label, htmlFor, required, error, children, id }: { n: number; label: string; htmlFor?: string; required?: boolean; error?: string; children: ReactNode; id?: string }) {
  const L = htmlFor ? 'label' : 'span';
  return (
    <div className="grid gap-2 border-b border-pl-line py-5 sm:grid-cols-[2.5rem_10rem_1fr] sm:gap-4" role={htmlFor ? undefined : 'group'} aria-labelledby={htmlFor ? undefined : id}>
      <span className="font-pl-mono text-[11px] text-pl-teal sm:pt-3" aria-hidden="true">{pad(n)}</span>
      <L {...(htmlFor ? { htmlFor } : { id })} className="text-[14.5px] text-pl-ink sm:pt-2.5">
        {label}{required && <span className="ml-1 text-pl-teal" aria-hidden="true">*</span>}{required && <span className="sr-only"> (obligatoire)</span>}
      </L>
      <div className="min-w-0">
        {children}
        {error && <p id={`${htmlFor ?? id}-err`} className="mt-1.5 font-pl-mono text-[11px] text-[#B4412F]">{error}</p>}
      </div>
    </div>
  );
}

export function ContactForm() {
  const { data, set, errors, status, submit, reset } = useQuoteForm();
  const product = data.product ? getProduct(data.product) : undefined;
  const err = (k: keyof QuoteData) => (errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `pl-f-${k}-err` } : {});

  if (status === 'sent') {
    return (
      <div className="border border-pl-teal bg-white" role="status" aria-live="polite">
        <div className="flex items-center justify-between border-b border-pl-teal px-4 py-2">
          <Mono className="text-pl-teal">Formulaire DP-01 · Enregistré</Mono>
          <Mono className="text-pl-ink/55">Maquette</Mono>
        </div>
        <div className="pl-graph px-6 py-12 text-center sm:px-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center border border-pl-teal bg-white text-pl-teal"><ICheck size={22} /></span>
          <p className="mt-6 text-[clamp(1.8rem,3vw,2.4rem)] font-light tracking-[-0.035em]">Demande enregistrée.</p>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-pl-ink/75">
            Merci {data.name.split(' ')[0]}. Dans cette maquette, aucune donnée n’est transmise : l’envoi sera branché avant la mise en ligne.
          </p>
        </div>
        <dl className="grid grid-cols-2 border-t border-pl-teal sm:grid-cols-4">
          {[['Type', data.type], ['Machine', product?.name ?? '—'], ['Surface', data.surface ? `${data.surface} m²` : '—'], ['Sol', data.floor || '—']].map(([k, v], i) => (
            <div key={k} className={`border-pl-line px-4 py-3 ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t sm:border-t-0' : ''} ${i === 2 ? 'sm:border-l' : ''}`}>
              <dt className="font-pl-mono text-[9.5px] uppercase tracking-[0.1em] text-pl-ink/55">{k}</dt>
              <dd className="mt-0.5 truncate font-pl-mono text-[12px]">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-pl-line p-4">
          <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-3 border border-pl-teal px-5 text-[14px] text-pl-teal hover:bg-pl-teal hover:text-white">Nouvelle demande <IArrow /></button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="border border-pl-teal bg-white" aria-labelledby="pl-form-title">
      <div className="flex items-center justify-between border-b border-pl-teal px-4 py-2">
        <Mono className="text-pl-teal">Formulaire DP-01</Mono>
        <Mono className="text-pl-ink/55"><span className="text-pl-teal">*</span> obligatoire</Mono>
      </div>
      <div className="px-4 sm:px-6">
        <h2 id="pl-form-title" className="pt-6 text-[clamp(1.6rem,2.6vw,2.2rem)] font-light tracking-[-0.035em]">Demande de devis ou de contact</h2>

        <Row n={1} label="Type de demande" id="pl-f-type-l">
          <div className="flex flex-wrap gap-1.5">
            {requestTypes.map((t) => {
              const on = data.type === t;
              return (
                <label key={t} className={`cursor-pointer border px-3 py-2 text-[13.5px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pl-cyan ${on ? 'border-pl-teal bg-pl-teal text-white' : 'border-pl-line text-pl-ink/80 hover:border-pl-teal'}`}>
                  <input type="radio" name="type" value={t} checked={on} onChange={() => set('type', t)} className="sr-only" />{t}
                </label>
              );
            })}
          </div>
        </Row>

        <Row n={2} label="Société" htmlFor="pl-f-company">
          <input id="pl-f-company" className={input} value={data.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" />
        </Row>
        <Row n={3} label="Nom" htmlFor="pl-f-name" required error={errors.name}>
          <input id="pl-f-name" className={input} value={data.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" required {...err('name')} />
        </Row>
        <Row n={4} label="E-mail" htmlFor="pl-f-email" required error={errors.email}>
          <input id="pl-f-email" type="email" className={input} value={data.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" required {...err('email')} />
        </Row>
        <Row n={5} label="Téléphone" htmlFor="pl-f-phone">
          <input id="pl-f-phone" type="tel" className={input} value={data.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" />
        </Row>

        <Row n={6} label="Machine" htmlFor="pl-f-product">
          <select id="pl-f-product" className={input} value={data.product} onChange={(e) => set('product', e.target.value)}>
            <option value="">— Pas de machine en particulier —</option>
            {families.map((f) => (
              <optgroup key={f.slug} label={f.plural}>
                {productsOf(f.slug).map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
              </optgroup>
            ))}
          </select>
          {product && (
            <div className="mt-3 flex items-center gap-3 border border-pl-line bg-pl-paper p-2">
              <span className="pl-graph relative block h-14 w-14 shrink-0 border border-pl-line">
                <Image src={img.product(product.img)} alt="" fill sizes="56px" className="object-contain p-1" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14.5px]">{product.name}</span>
                <span className="font-pl-mono text-[10.5px] text-pl-ink/60">{product.kind} · catalogue p. {product.page}</span>
              </span>
              <Link href={productHref(product.slug)} className="shrink-0 px-2 text-[13px] text-pl-teal hover:underline">Fiche</Link>
            </div>
          )}
        </Row>

        <Row n={7} label="Surface à traiter" htmlFor="pl-f-surface">
          <div className="flex max-w-[16rem] items-stretch">
            <input id="pl-f-surface" type="number" inputMode="numeric" min={0} className={`${input} pl-tnum`} value={data.surface} onChange={(e) => set('surface', e.target.value)} placeholder="ex. 1 500" />
            <span className="flex items-center border border-l-0 border-pl-line bg-pl-paper px-3 font-pl-mono text-[12px] text-pl-teal">m²</span>
          </div>
        </Row>

        <Row n={8} label="Type de sol" id="pl-f-floor-l">
          <div className="flex flex-wrap gap-1.5">
            {floorTypes.map((t) => {
              const on = data.floor === t;
              return (
                <label key={t} className={`cursor-pointer border px-3 py-2 font-pl-mono text-[11.5px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pl-cyan ${on ? 'border-pl-teal bg-pl-teal text-white' : 'border-pl-line text-pl-ink/80 hover:border-pl-teal'}`}>
                  <input type="radio" name="floor" value={t} checked={on} onChange={() => set('floor', t)} className="sr-only" />{t}
                </label>
              );
            })}
          </div>
        </Row>

        <Row n={9} label="Message" htmlFor="pl-f-message" error={errors.message}>
          <textarea id="pl-f-message" rows={5} className={`${input} resize-y`} value={data.message} onChange={(e) => set('message', e.target.value)}
            placeholder="Surfaces, fréquence de nettoyage, contraintes d’accès…" {...err('message')} />
        </Row>

        <div className="py-5">
          <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-snug text-pl-ink/80">
            <input type="checkbox" checked={data.consent} onChange={(e) => set('consent', e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-pl-teal" {...err('consent')} />
            <span>J’accepte d’être recontacté par GRILLOO au sujet de cette demande. <span className="text-pl-teal" aria-hidden="true">*</span></span>
          </label>
          {errors.consent && <p id="pl-f-consent-err" className="mt-1.5 pl-7 font-pl-mono text-[11px] text-[#B4412F]">{errors.consent}</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-pl-teal px-4 py-4 sm:px-6">
        <p className="font-pl-mono text-[10.5px] text-pl-ink/55">Maquette : aucune donnée n’est transmise.</p>
        <button type="submit" disabled={status === 'sending'} className="pl-btn inline-flex min-h-12 items-center gap-6 bg-pl-teal px-6 text-[15px] font-medium text-white [--pl-btn-hover:#12262A] disabled:opacity-70">
          {status === 'sending' ? 'Envoi…' : 'Envoyer la demande'} <span className="pl-btn-arrow"><IArrow /></span>
        </button>
      </div>
    </form>
  );
}
