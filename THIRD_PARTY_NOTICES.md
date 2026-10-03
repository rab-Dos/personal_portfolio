# Referencias y dependencias visuales

## Cuelume

- Repositorio: https://github.com/danielwh2/cuelume
- Licencia: MIT; incluida en la dependencia instalada.
- Uso: señales de interacción sintetizadas con Web Audio en navegación, tema, menú móvil, diálogos, galerías y tecnologías.
- Integración: `src/scripts/sounds.ts`; sonidos suaves, sin reproducción al cargar, con control de silencio persistente en la cabecera.

## Theme Toggle Effect

- Fuente: https://theme-toggle.rdsx.dev/
- Repositorio: https://github.com/rudrodip/theme-toggle-effect
- Uso: transición de tema `circle-blur-top-left` mediante la View Transitions API.
- Integración: CSS y JavaScript locales en `src/styles/theme-transition.css` y `src/layouts/BaseLayout.astro` porque el proyecto de referencia no distribuye un paquete instalable.

## Animación Mandrill WebGL

- Fuente local: `../mandrill-webgl-hero_v9/assets/source-pingpong.mp4`.
- Derivado público: `public/media/mandrill/source-pingpong.mp4`.
- Uso: video original del modo dividido de escritorio, conectado visualmente con la máscara tipográfica WebGL.

## Iconos de redes sociales

- Fuentes locales: `resources/linkedin_icon.svg` y `resources/github_icon.svg`.
- Derivados públicos: `public/images/social/linkedin.svg` y `public/images/social/github.svg`.
- Uso: iconos en los enlaces externos del resumen profesional, coloreados mediante los tokens del sistema visual.
