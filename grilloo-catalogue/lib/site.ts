/**
 * Informations société. Tout ce qui est marqué TODO n'est pas dans le catalogue :
 * à fournir par GRILLOO avant la mise en ligne (affiché tel quel dans la maquette).
 */
export const TODO = 'À fournir par GRILLOO';

export const site = {
  name: 'GRILLOO',
  tagline: 'Leader des solutions de nettoyage',
  url: 'https://www.grilloo.net',
  domain: 'www.grilloo.net',
  email: TODO, // ex. contact@grilloo.net
  phone: TODO,
  address: { line1: TODO, city: '', country: '' },
  hours: [
    { days: 'Lundi – vendredi', time: TODO },
    { days: 'Samedi', time: TODO },
    { days: 'Dimanche', time: 'Fermé' }, // à confirmer
  ],
  /** Coordonnées GPS pour le plan d'accès (inconnues → plan illustratif). */
  geo: null as null | { lat: number; lng: number },
  social: [
    { name: 'Facebook', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'YouTube', href: '#' },
    { name: 'TikTok', href: '#' },
    { name: 'LinkedIn', href: '#' },
  ],
};

/** Arborescence commune aux 3 orientations (chemins relatifs à la racine de l'orientation). */
export const nav = [
  { href: '/produits', label: 'Nos produits' },
  { href: '/secteurs', label: 'Nos secteurs' },
  { href: '/mises-en-situation', label: 'Mises en situation' },
  { href: '/a-propos', label: 'À propos de nous' },
  { href: '/contact', label: 'Contact' },
];

export const requestTypes = ['Demande de devis', 'Démonstration', 'Conseil sur une machine', 'Service après-vente', 'Autre demande'];
export const floorTypes = ['Carrelage / pierre', 'Béton / résine', 'PVC / vinyle', 'Moquette / textile', 'Extérieur', 'Mixte'];
