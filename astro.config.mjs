import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || 'https://alexandriastudio.cloud/jesusarellano';

export default defineConfig({
  // Usa la URL pública real como valor predeterminado y permite sobrescribirla por entorno.
  output: 'static',
  site,
  base: '/jesusarellano',
  devToolbar: {
    enabled: false,
  },
  integrations: site ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
