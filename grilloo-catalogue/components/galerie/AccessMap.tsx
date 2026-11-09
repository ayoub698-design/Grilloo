/**
 * Plan d'accès stylisé (aucune adresse connue) : tracé imaginaire, clairement libellé comme emplacement.
 */
export function AccessMap({ address }: { address: string }) {
  return (
    <figure>
      <div className="relative overflow-hidden border border-ga-line bg-ga-ivory">
        <svg viewBox="0 0 640 440" className="block h-auto w-full" role="img" aria-label="Plan d’accès stylisé — adresse à fournir par GRILLOO">
          <defs>
            <pattern id="ga-map-dots" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r=".7" fill="#D6D0C5" />
            </pattern>
          </defs>
          <rect width="640" height="440" fill="#F1EEE8" />
          <rect width="640" height="440" fill="url(#ga-map-dots)" opacity=".6" />
          {/* îlots */}
          <g fill="#F7F5F1" stroke="#E2DDD3" strokeWidth="1">
            <path d="M40 40h150l-10 110H34z" />
            <path d="M214 36h132v96H206z" />
            <path d="M372 30h110l8 92H366z" />
            <path d="M516 28h96v120h-88z" />
            <path d="M30 186h140l6 104H38z" />
            <path d="M408 168h86l-6 92h-78z" />
            <path d="M520 180h92v112h-96z" />
            <path d="M42 330h120l-4 82H40z" />
            <path d="M196 322h120l6 92H190z" />
            <path d="M352 300h130l4 112H346z" />
            <path d="M512 326h100v86H508z" />
          </g>
          {/* parc */}
          <path d="M206 176c40-14 110-14 150 4 16 30 12 76-6 96-46 10-104 8-140-6-14-30-16-70-4-94z" fill="#ECE8E0" stroke="#DDD8CE" strokeWidth="1" />
          {/* voies */}
          <g fill="none" stroke="#FAF9F6" strokeWidth="9" strokeLinecap="round">
            <path d="M0 166 C 160 160, 260 150, 640 160" />
            <path d="M200 0 C 196 120, 190 300, 182 440" />
            <path d="M0 310 C 200 300, 420 286, 640 304" />
            <path d="M500 0 C 498 140, 502 300, 498 440" />
          </g>
          <g fill="none" stroke="#DCD6CB" strokeWidth="1">
            <path d="M0 166 C 160 160, 260 150, 640 160" />
            <path d="M200 0 C 196 120, 190 300, 182 440" />
            <path d="M0 310 C 200 300, 420 286, 640 304" />
            <path d="M500 0 C 498 140, 502 300, 498 440" />
            <path d="M360 0 C 362 100, 352 200, 340 440" strokeDasharray="2 4" />
          </g>
          {/* fleuve / filet cyan */}
          <path d="M-10 420 C 120 380, 220 430, 330 400 S 540 350, 650 380" fill="none" stroke="#49B5BF" strokeWidth="1" />
          {/* repère */}
          <g transform="translate(300 228)">
            <circle r="22" fill="none" stroke="#49B5BF" strokeWidth="1" className="ga-map-pulse" />
            <circle r="16" fill="#FAF9F6" stroke="#141414" strokeWidth="1" />
            <circle r="3.5" fill="#141414" />
          </g>
          {/* nord + échelle */}
          <g transform="translate(596 52)" fill="none" stroke="#141414" strokeWidth="1">
            <path d="M0 -18 L6 6 L0 2 L-6 6 Z" fill="#FAF9F6" />
            <text y="24" textAnchor="middle" fontSize="10" fill="#6E6A63" stroke="none" fontFamily="var(--font-inter)" letterSpacing="2">N</text>
          </g>
          <g transform="translate(32 404)" stroke="#141414" strokeWidth="1">
            <path d="M0 0h80M0 -4v8M40 -3v6M80 -4v8" />
          </g>
        </svg>
        <div className="pointer-events-none absolute left-1/2 top-[52%] mt-8 -translate-x-1/2 whitespace-nowrap bg-ga-paper px-3 py-2 text-center shadow-[0_10px_30px_-18px_rgba(40,34,26,.5)]">
          <p className="ga-caps text-ga-ink">GRILLOO</p>
          <p className="mt-0.5 text-[12px] ga-text-stone">{address}</p>
        </div>
      </div>
      <figcaption className="mt-3 flex justify-between gap-4">
        <span className="ga-caps ga-text-stone">Plan d’accès — adresse à fournir</span>
        <span className="text-[12px] italic ga-text-stone">Tracé illustratif</span>
      </figcaption>
    </figure>
  );
}
