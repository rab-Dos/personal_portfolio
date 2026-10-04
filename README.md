# Portafolio de Jesus Arellano

Sitio web personal estático orientado a comunicar experiencia en desarrollo de software, inteligencia artificial, arquitectura y datos. La interfaz prioriza accesibilidad, rendimiento, diseño responsive y una presentación visual premium.

## Stack

- Astro 7
- Tailwind CSS 4 mediante su integración con Vite
- HTML y CSS como base de la interfaz
- JavaScript únicamente para interacciones y la animación del hero
- DM Sans Variable como tipografía principal

El proyecto genera un sitio estático. Si una sección futura necesita estado o interacción compleja, Vue es el framework previsto para sus componentes.

## Requisitos

- Node.js 22.12 o posterior
- pnpm 11.21 o compatible

Las versiones principales también están declaradas en `.nvmrc` y `package.json`.

## Desarrollo local

Instala las dependencias:

```bash
pnpm install
```

Inicia el servidor de desarrollo:

```bash
pnpm dev
```

Astro mostrará en la terminal la dirección local disponible. El puerto puede variar si el puerto predeterminado ya está ocupado.

## Variables de entorno

Copia `.env.example` como `.env` si necesitas sobrescribir la URL pública predeterminada:

```env
SITE_URL=https://alexandriastudio.cloud/jesusarellano
```

`SITE_URL` configura la URL usada por Astro y el sitemap. De forma predeterminada, el proyecto usa `https://alexandriastudio.cloud/jesusarellano`.

## Estructura principal

```text
src/
  components/
    layout/       Componentes de navegación y estructura compartida
    sections/     Secciones visibles de la página
  layouts/        Plantilla HTML principal y configuración del tema
  pages/          Rutas del sitio
  styles/         Tokens, estilos globales y transición de tema
public/
  images/         Recursos públicos de marca y redes sociales
  media/          Vídeos y datos de la animación del hero
  scripts/        Lógica JavaScript de la animación
resources/        Archivos fuente proporcionados para el proyecto
agents/           Reglas de construcción y sistema de diseño
```

## Sistema visual y accesibilidad

Las decisiones de interfaz deben seguir `agents/AGENTS.md` y `agents/DESIGN.md`. Entre los criterios principales se encuentran:

- Soporte completo para temas claro y oscuro.
- Colores consumidos mediante tokens semánticos.
- Contraste conforme a WCAG 2.2 AA.
- Navegación utilizable con teclado y estados de foco visibles.
- Compatibilidad con `prefers-reduced-motion`.
- Diseño responsive con unidades dinámicas y áreas seguras del dispositivo.
- Contenido esencial disponible aunque JavaScript o WebGL no estén activos.

## Hero y animación

El hero combina un vídeo fuente con una máscara tipográfica WebGL, conexiones vectoriales y una cuadrícula de fondo. En escritorio se presenta una composición dividida; en móvil se conserva únicamente la máscara animada para mantener claridad y rendimiento.

La implementación se encuentra en:

- `src/components/sections/HeroSection.astro`
- `public/scripts/mandrill-hero.js`
- `public/media/mandrill/`

## Recursos y atribuciones

Los recursos adaptados, referencias visuales y dependencias externas se documentan en `THIRD_PARTY_NOTICES.md`.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm start` | Alias del servidor de desarrollo |
| `pnpm build` | Genera la versión estática de producción |
| `pnpm preview` | Sirve localmente una compilación existente |

## Sonidos de interacción

Cuelume genera señales suaves con Web Audio al navegar, cambiar el tema, usar el menú móvil, abrir o cerrar detalles, cambiar la galería y seleccionar tecnologías. El control de sonido permite silenciarlas y guarda la preferencia en este navegador: aparece en la cabecera de escritorio y dentro del menú de hamburguesa en móvil. No hay reproducción automática al cargar, al pasar el cursor ni al desplazar la página. La integración compartida está en `src/scripts/sounds.ts`.

## Metadatos y recursos sociales

`BaseLayout.astro` genera los metadatos HTML, Open Graph y X con la cuenta pública `@Maiden_AF`. La portada declara la imagen remota `cdn/opengraph.webp` (1200 × 630, WebP) y datos JSON-LD de `Person`, `WebSite` y `WebPage`. El bloque HTML resultante se entrega como referencia en `docs/seo-head.html`.

`public/apple-touch-icon.png` es una copia del recurso original `resources/apple-touch-icon.png` (180 × 180). `public/site.webmanifest` reutiliza ese icono y el favicon SVG; mantiene las rutas bajo `/jesusarellano/` y abre el sitio en el navegador. El manifiesto no añade soporte sin conexión.

## Publicación

El sitio está configurado para servirse desde `/jesusarellano/`. Después de `pnpm build`, publica el contenido de `dist` dentro de la carpeta del servidor que corresponde a esa ruta, de modo que `index.html`, `_astro/`, `images/`, `media/` y `scripts/` queden directamente dentro de ella.

## Convenciones de trabajo

- Priorizar HTML y CSS antes de incorporar JavaScript.
- Usar Vue si un componente requiere un framework del lado del cliente.
- Comentar las secciones para explicar su propósito y alcance.
- Mantener los recursos optimizados y preferir AVIF, después WebP y finalmente PNG cuando existan alternativas.
- No sustituir los tokens del sistema de diseño por colores arbitrarios.
- Preservar la experiencia responsive, el contraste y la navegación accesible en cada cambio.
