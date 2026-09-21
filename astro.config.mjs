import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL;

export default defineConfig({
  // Sitio estático: el sitemap y las URL canónicas se activan al definir SITE_URL.
  output: 'static',
  site,
  devToolbar: {
    enabled: false,
  },
  integrations: site ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
