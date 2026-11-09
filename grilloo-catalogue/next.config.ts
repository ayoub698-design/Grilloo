import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Export statique : `npm run build` produit `out/`, déployable tel quel sur Netlify ou Vercel.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Permet de lancer plusieurs serveurs de dev en parallèle (NEXT_DIST_DIR=.next-xyz).
  distDir: process.env.NEXT_DIST_DIR || '.next',
};

export default nextConfig;
