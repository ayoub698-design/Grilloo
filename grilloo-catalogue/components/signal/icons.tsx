/* Icônes dessinées à la main pour « Signal » : trait épais, terminaisons carrées. */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.6, strokeLinecap: 'square' as const, strokeLinejoin: 'miter' as const, 'aria-hidden': true, ...p });

export const ArrowRight = (p: P) => (<svg {...base(p)}><path d="M3 12h16M13 5l7 7-7 7" /></svg>);
export const ArrowLeft = (p: P) => (<svg {...base(p)}><path d="M21 12H5M11 5l-7 7 7 7" /></svg>);
export const ArrowUpRight = (p: P) => (<svg {...base(p)}><path d="M6 18L18 6M8 6h10v10" /></svg>);
export const ArrowDown = (p: P) => (<svg {...base(p)}><path d="M12 3v16M5 13l7 7 7-7" /></svg>);
export const Search = (p: P) => (<svg {...base(p)}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>);
export const Close = (p: P) => (<svg {...base(p)}><path d="M5 5l14 14M19 5L5 19" /></svg>);
export const Menu = (p: P) => (<svg {...base(p)}><path d="M3 7h18M3 17h12" /></svg>);
export const Plus = (p: P) => (<svg {...base(p)}><path d="M12 4v16M4 12h16" /></svg>);
export const Check = (p: P) => (<svg {...base(p)}><path d="M4 12.5l5 5L20 6.5" /></svg>);
export const Download = (p: P) => (<svg {...base(p)}><path d="M12 3v12M6 10l6 6 6-6M4 21h16" /></svg>);
export const Expand = (p: P) => (<svg {...base(p)}><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" /></svg>);
export const Phone = (p: P) => (<svg {...base(p)}><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" /></svg>);
export const Mail = (p: P) => (<svg {...base(p)}><rect x="3" y="5" width="18" height="14" /><path d="M3 6l9 7 9-7" /></svg>);
export const Pin = (p: P) => (<svg {...base(p)}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>);
export const Clock = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>);
export const File = (p: P) => (<svg {...base(p)}><path d="M6 2h8l5 5v15H6z" /><path d="M14 2v5h5M9 13h7M9 17h7" /></svg>);

/* Réseaux sociaux — pictogrammes simplifiés */
const soc = (p: P) => ({ viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true, ...p });
export const Social = ({ name, ...p }: P & { name: string }) => {
  switch (name) {
    case 'Facebook': return (<svg {...soc(p)}><path d="M13.5 21v-7.5H16l.5-3h-3V8.6c0-.9.3-1.6 1.6-1.6h1.6V4.3c-.3 0-1.3-.1-2.4-.1-2.4 0-3.9 1.4-3.9 4.1v2.2H8v3h2.4V21z" /></svg>);
    case 'Instagram': return (<svg {...base(p)} strokeWidth={2.2}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></svg>);
    case 'YouTube': return (<svg {...soc(p)}><path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8zM10 15V9l5.2 3z" /></svg>);
    case 'TikTok': return (<svg {...soc(p)}><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z" /></svg>);
    case 'LinkedIn': return (<svg {...soc(p)}><path d="M4.5 9h3v11h-3zM6 3.8a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10 9h2.9v1.5c.4-.8 1.4-1.7 3-1.7 3.1 0 3.6 2 3.6 4.7V20h-3v-5.8c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V20h-3z" /></svg>);
    default: return null;
  }
};
