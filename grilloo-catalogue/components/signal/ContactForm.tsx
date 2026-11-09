'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useQuoteForm } from '@/lib/hooks';
import { requestTypes, floorTypes } from '@/lib/site';
import { families, productsOf, getProduct } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { productHref, to } from './ui';
import { ArrowRight, Check } from './icons';

export default function ContactForm() {
  const { data, set, errors, status, submit, reset } = useQuoteForm();
  const chosen = data.product ? getProduct(data.product) : undefined;

  if (status === 'sent') {
    return (
      <div className="si-swap rounded-[36px] bg-si-cyan p-8 md:p-12" role="status" aria-live="polite">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-si-ink text-si-cyan"><Check className="h-8 w-8" /></span>
        <p className="si-display mt-8 text-[clamp(2.4rem,6vw,5rem)]">Merci{data.name ? `, ${data.name.split(' ')[0]}` : ''} !</p>
        <p className="mt-4 max-w-xl text-[18px] leading-relaxed">
          Votre {data.type.toLowerCase()} {chosen ? <>pour la <strong>{chosen.name}</strong> </> : null}est prête. L’équipe GRILLOO vous recontactera à l’adresse <strong>{data.email}</strong>.
        </p>
        <p className="mt-3 text-[13px] text-si-ink/70">Maquette : aucune donnée n’est transmise pour l’instant.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="si-btn inline-flex h-12 items-center rounded-full bg-si-ink px-6 text-[14px] font-bold text-white">Nouvelle demande</button>
          <Link href={to('/produits')} className="si-btn inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[14px] font-bold">Retour au catalogue <ArrowRight className="si-arrow h-4 w-4" /></Link>
        </div>
      </div>
    );
  }

  const err = (k: keyof typeof errors) => errors[k] ? <p id={`e-${k}`} className="mt-2 text-[13px] font-bold text-[#B42318]">{errors[k]}</p> : null;
  const label = 'si-label block text-si-ink';

  return (
    <form onSubmit={submit} noValidate className="space-y-10">
      {/* Type */}
      <fieldset>
        <legend className={label}>Votre demande</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {requestTypes.map((t) => {
            const on = data.type === t;
            return (
              <label key={t} className={`si-btn flex h-12 cursor-pointer items-center gap-2 rounded-full px-4 text-[14px] sm:h-14 sm:px-5 sm:text-[15px] font-extrabold [font-stretch:108%] ring-2 ring-inset ring-si-ink has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 md:h-16 md:px-6 md:text-[17px] ${on ? 'bg-si-ink text-white' : 'bg-white hover:bg-si-cyan-soft'}`}>
                <input type="radio" name="type" value={t} checked={on} onChange={() => set('type', t)} className="sr-only" />
                {on && <Check className="h-4 w-4 text-si-cyan" />}
                {t}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Identité */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
        <div>
          <label htmlFor="f-company" className={label}>Société</label>
          <input id="f-company" className="si-field" autoComplete="organization" value={data.company} onChange={(e) => set('company', e.target.value)} placeholder="Nom de l’entreprise" />
        </div>
        <div>
          <label htmlFor="f-name" className={label}>Nom et prénom *</label>
          <input id="f-name" className="si-field" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Votre nom" />
          {err('name')}
        </div>
        <div>
          <label htmlFor="f-email" className={label}>E-mail *</label>
          <input id="f-email" type="email" className="si-field" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-email' : undefined} value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="vous@entreprise.fr" />
          {err('email')}
        </div>
        <div>
          <label htmlFor="f-phone" className={label}>Téléphone</label>
          <input id="f-phone" type="tel" className="si-field" autoComplete="tel" value={data.phone} onChange={(e) => set('phone', e.target.value)} placeholder="Pour être rappelé" />
        </div>
      </div>

      {/* Machine + surface */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-[1.4fr_1fr]">
        <div>
          <label htmlFor="f-product" className={label}>Machine concernée</label>
          <select id="f-product" className="si-field" value={data.product} onChange={(e) => set('product', e.target.value)}>
            <option value="">Je ne sais pas encore / conseil</option>
            {families.map((f) => (
              <optgroup key={f.slug} label={f.plural}>
                {productsOf(f.slug).map((p) => (<option key={p.slug} value={p.slug}>{p.name}</option>))}
              </optgroup>
            ))}
          </select>
          {chosen && (
            <Link href={productHref(chosen.slug)} className="mt-3 inline-flex items-center gap-3 rounded-full bg-si-cyan-soft py-1.5 pl-1.5 pr-4 text-[13px] font-bold hover:bg-si-cyan">
              <span className="relative h-9 w-9 overflow-hidden rounded-full bg-white"><Image src={img.product(chosen.img || chosen.slug)} alt="" fill sizes="36px" className="object-contain p-0.5" /></span>
              Fiche {chosen.name}
            </Link>
          )}
        </div>
        <div>
          <label htmlFor="f-surface" className={label}>Surface à nettoyer (m²)</label>
          <input id="f-surface" inputMode="numeric" className="si-field" value={data.surface} onChange={(e) => set('surface', e.target.value.replace(/[^\d\s]/g, ''))} placeholder="ex. 2 500" />
        </div>
      </div>

      {/* Sol */}
      <fieldset>
        <legend className={label}>Type de sol</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {floorTypes.map((t) => {
            const on = data.floor === t;
            return (
              <label key={t} className={`si-btn flex h-11 cursor-pointer items-center rounded-full px-4 text-[14px] font-bold ring-2 ring-inset has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 ${on ? 'bg-si-cyan ring-si-cyan' : 'ring-si-ink/20 hover:ring-si-ink'}`}>
                <input type="radio" name="floor" value={t} checked={on} onChange={() => set('floor', t)} className="sr-only" />
                {t}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="f-message" className={label}>Votre besoin</label>
        <textarea id="f-message" rows={4} className="si-field resize-y" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'e-message' : undefined} value={data.message} onChange={(e) => set('message', e.target.value)} placeholder="Locaux, fréquence de nettoyage, contraintes…" />
        {err('message')}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-snug">
          <input type="checkbox" checked={data.consent} onChange={(e) => set('consent', e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'e-consent' : undefined} className="mt-0.5 h-6 w-6 shrink-0 accent-[#0A0A0A]" />
          <span>J’accepte que GRILLOO utilise ces informations pour me recontacter au sujet de ma demande. *</span>
        </label>
        {err('consent')}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === 'sending'} className="si-btn inline-flex h-16 items-center gap-3 rounded-full bg-si-ink px-8 text-[17px] font-bold text-white [font-stretch:110%] disabled:opacity-60">
          {status === 'sending' ? 'Envoi…' : 'Envoyer la demande'} <ArrowRight className="si-arrow h-5 w-5" />
        </button>
        <p className="text-[13px] text-si-grey">* champs obligatoires</p>
      </div>
    </form>
  );
}
