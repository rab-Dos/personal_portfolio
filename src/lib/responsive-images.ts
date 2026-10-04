import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/** Build responsive, fingerprinted assets from preserved source images. */
export async function responsiveSources(src: ImageMetadata, widths: number[]) {
  const candidates = [...new Set(widths.filter((width) => width <= src.width))];
  const createSet = async (format: 'avif' | 'webp') => {
    const images = await Promise.all(candidates.map((width) => getImage({ src, width, format, quality: format === 'avif' ? 45 : 75 })));
    return images.map((image, index) => `${image.src} ${candidates[index]}w`).join(', ');
  };
  const [avif, webp, fallback] = await Promise.all([
    createSet('avif'), createSet('webp'),
    getImage({ src, width: candidates.at(-1) ?? src.width, format: 'webp', quality: 75 }),
  ]);
  return { avif, webp, src: fallback.src, width: src.width, height: src.height };
}
