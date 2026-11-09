'use client';
/**
 * Logique partagée (sans aucun style) : filtrage du catalogue, révélation au scroll,
 * formulaire de devis. Chaque orientation construit sa propre interface par-dessus.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { products, searchProducts, type Energy, type Product } from './catalog';

/* ---------- Catalogue : recherche + filtres, synchronisés avec l'URL (?q=&famille=&energie=) ---------- */
export function useCatalogFilter() {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState<string>('');
  const [energy, setEnergy] = useState<Energy | ''>('');
  const [sort, setSort] = useState<'catalogue' | 'rendement' | 'capacite' | 'nom'>('catalogue');

  // lecture initiale de l'URL (export statique : pas de useSearchParams côté serveur)
  useEffect(() => {
    const u = new URLSearchParams(window.location.search);
    setQuery(u.get('q') ?? '');
    setFamily(u.get('famille') ?? '');
    setEnergy((u.get('energie') as Energy) ?? '');
  }, []);
  useEffect(() => {
    const u = new URLSearchParams();
    if (query) u.set('q', query);
    if (family) u.set('famille', family);
    if (energy) u.set('energie', energy);
    const s = u.toString();
    window.history.replaceState(null, '', s ? `?${s}` : window.location.pathname);
  }, [query, family, energy]);

  const results: Product[] = useMemo(() => {
    let l = searchProducts(query, products);
    if (family) l = l.filter((p) => p.family === family);
    if (energy) l = l.filter((p) => p.key.energy === energy);
    const by = (k: 'productivity' | 'tank') => (a: Product, b: Product) => (b.key[k] ?? -1) - (a.key[k] ?? -1);
    if (sort === 'rendement') l = [...l].sort(by('productivity'));
    if (sort === 'capacite') l = [...l].sort(by('tank'));
    if (sort === 'nom') l = [...l].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    return l;
  }, [query, family, energy, sort]);

  const reset = () => { setQuery(''); setFamily(''); setEnergy(''); };
  return { query, setQuery, family, setFamily, energy, setEnergy, sort, setSort, results, reset, total: products.length };
}

/* ---------- Révélation au scroll : ajoute data-in="true" quand l'élément entre dans la vue ---------- */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options: IntersectionObserverInit = { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, options);
    io.observe(el);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return { ref, inView };
}

/* ---------- Formulaire de contact / devis (maquette : aucune donnée n'est envoyée) ---------- */
export interface QuoteData {
  type: string; company: string; name: string; email: string; phone: string;
  product: string; surface: string; floor: string; message: string; consent: boolean;
}
export function useQuoteForm(initialProduct = '') {
  const [data, setData] = useState<QuoteData>({ type: 'Demande de devis', company: '', name: '', email: '', phone: '', product: initialProduct, surface: '', floor: '', message: '', consent: false });
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteData, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('produit');
    if (p) setData((d) => ({ ...d, product: p }));
  }, []);

  const set = <K extends keyof QuoteData>(k: K, v: QuoteData[K]) => { setData((d) => ({ ...d, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };
  const validate = () => {
    const e: typeof errors = {};
    if (!data.name.trim()) e.name = 'Indiquez votre nom.';
    if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = 'Adresse e-mail invalide.';
    if (!data.message.trim() && !data.product) e.message = 'Décrivez votre besoin ou choisissez une machine.';
    if (!data.consent) e.consent = 'Merci d’accepter d’être recontacté.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const submit = (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    // TODO : brancher Netlify Forms, Formspree ou une API route avant la mise en ligne.
    setTimeout(() => setStatus('sent'), 900);
  };
  return { data, set, errors, status, submit, reset: () => setStatus('idle') };
}
