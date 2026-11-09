'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useQuoteForm } from '@/lib/hooks';
import { families, productsOf, getProduct } from '@/lib/catalog';
import { requestTypes, floorTypes } from '@/lib/site';
import { img } from '@/lib/assets';
import { ArrowRight } from './icons';
import { productHref } from './links';

function Err({ id, msg }: { id: string; msg?: string }) {
  return msg ? <p id={id} className="mt-2 text-[12.5px] text-[#9B3B2E]">{msg}</p> : null;
}

export function ContactForm() {
  const { data, set, errors, status, submit, reset } = useQuoteForm();
  const selected = data.product ? getProduct(data.product) : undefined;

  if (status === 'sent') {
    return (
      <div className="ga-lightbox border-t border-ga-ink/80 pt-10" role="status">
        <p className="ga-caps ga-text-stone">Demande enregistrée</p>
        <p className="ga-display mt-5 text-[clamp(34px,4vw,54px)] leading-[1.02]">Merci{data.name ? `, ${data.name.split(' ')[0]}` : ''}. <em>Votre demande est prête.</em></p>
        <dl className="mt-10 border-t border-ga-line text-[14px]">
          {[
            ['Type', data.type],
            ['Machine', selected?.name ?? 'Non précisée'],
            ['Surface', data.surface ? `${data.surface} m²` : 'Non précisée'],
            ['Sol', data.floor || 'Non précisé'],
            ['Réponse à', data.email],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-ga-line py-3">
              <dt className="ga-caps ga-text-stone pt-0.5">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[13px] italic ga-text-stone">Maquette : aucune donnée n’est transmise tant que le formulaire n’est pas branché à un service d’envoi.</p>
        <button type="button" onClick={reset} className="ga-btn ga-btn--line mt-8">Nouvelle demande</button>
      </div>
    );
  }

  const field = 'ga-caps ga-text-stone block';
  return (
    <form onSubmit={submit} noValidate className="border-t border-ga-ink/80 pt-10">
      <fieldset>
        <legend className={field}>Votre demande</legend>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {requestTypes.map((t) => (
            <label key={t} className="flex cursor-pointer items-center gap-2.5 py-1 text-[14.5px]">
              <input type="radio" name="type" value={t} checked={data.type === t} onChange={() => set('type', t)} className="peer sr-only" />
              <span className={`inline-block h-[9px] w-[9px] rounded-full border transition-colors duration-500 peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 ${data.type === t ? 'border-ga-ink bg-ga-ink' : 'border-[#B9B4AA]'}`} aria-hidden />
              <span className={data.type === t ? 'ga-display text-[17px] italic' : 'ga-text-stone'}>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2">
        <label className="ga-field">
          <span className={field}>Société</span>
          <input className="ga-input" autoComplete="organization" value={data.company} onChange={(e) => set('company', e.target.value)} />
        </label>
        <label className="ga-field">
          <span className={field}>Nom et prénom <span aria-hidden>*</span></span>
          <input className="ga-input" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} value={data.name} onChange={(e) => set('name', e.target.value)} />
          <Err id="err-name" msg={errors.name} />
        </label>
        <label className="ga-field">
          <span className={field}>E-mail <span aria-hidden>*</span></span>
          <input className="ga-input" type="email" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} value={data.email} onChange={(e) => set('email', e.target.value)} />
          <Err id="err-email" msg={errors.email} />
        </label>
        <label className="ga-field">
          <span className={field}>Téléphone</span>
          <input className="ga-input" type="tel" autoComplete="tel" value={data.phone} onChange={(e) => set('phone', e.target.value)} />
        </label>
      </div>

      <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-[1fr_auto]">
        <label className="ga-field">
          <span className={field}>Machine concernée</span>
          <select className="ga-input" value={data.product} onChange={(e) => set('product', e.target.value)}>
            <option value="">Je ne sais pas encore</option>
            {families.map((f) => (
              <optgroup key={f.slug} label={f.plural}>
                {productsOf(f.slug).map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-4 sm:w-48">
          {selected ? (
            <Link href={productHref(selected.slug)} className="flex items-center gap-3 text-[13px]" aria-label={`Voir la fiche ${selected.name}`}>
              <span className="relative block h-16 w-16 shrink-0 bg-ga-ivory">
                <Image src={img.product(selected.img)} alt="" fill sizes="64px" className="object-contain p-1.5 mix-blend-multiply" />
              </span>
              <span className="ga-link">Voir la fiche</span>
            </Link>
          ) : (
            <span className="pb-3 text-[12.5px] italic ga-text-stone">Aucune machine choisie</span>
          )}
        </div>
      </div>

      <div className="mt-9 grid gap-x-10 gap-y-9 sm:grid-cols-2">
        <label className="ga-field">
          <span className={field}>Surface à traiter (m²)</span>
          <input className="ga-input" inputMode="numeric" placeholder="ex. 1 200" value={data.surface} onChange={(e) => set('surface', e.target.value)} />
        </label>
        <label className="ga-field">
          <span className={field}>Type de sol</span>
          <select className="ga-input" value={data.floor} onChange={(e) => set('floor', e.target.value)}>
            <option value="">Choisir</option>
            {floorTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
      </div>

      <label className="ga-field mt-9">
        <span className={field}>Message</span>
        <textarea className="ga-input" rows={4} placeholder="Votre besoin, vos contraintes, vos délais…" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'err-message' : undefined} value={data.message} onChange={(e) => set('message', e.target.value)} />
        <Err id="err-message" msg={errors.message} />
      </label>

      <div className="mt-9">
        <label className="flex cursor-pointer items-start gap-3 text-[13.5px] leading-relaxed">
          <input type="checkbox" className="ga-check" checked={data.consent} onChange={(e) => set('consent', e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'err-consent' : undefined} />
          <span className="ga-text-stone">J’accepte d’être recontacté par GRILLOO au sujet de cette demande. <span aria-hidden>*</span></span>
        </label>
        <Err id="err-consent" msg={errors.consent} />
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-ga-line pt-8">
        <p className="text-[12px] ga-text-stone">* Champs obligatoires</p>
        <button type="submit" disabled={status === 'sending'} className="ga-btn ga-btn--ink min-w-[220px] disabled:opacity-60">
          <span>{status === 'sending' ? 'Envoi…' : 'Envoyer la demande'}</span>
          <ArrowRight className="ga-arrow h-[9px] w-[20px]" />
        </button>
      </div>
    </form>
  );
}
