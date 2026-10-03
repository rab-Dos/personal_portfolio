import { play, setEnabled, setTheme, setVolume, type SoundName, type PlayOptions } from 'cuelume';

const preferenceKey = 'portfolio-sound-enabled';
let enabled = true;
try {
  enabled = localStorage.getItem(preferenceKey) !== 'false';
} catch {
  // Sound remains available when storage is blocked.
}
setTheme('default');
setVolume(0.28);
setEnabled(enabled);

/** Only call for deliberate actions; animations and passive scrolling stay silent. */
export function playSound(cue: SoundName, options: PlayOptions = {}) {
  play(cue, { emphasis: 'subtle', ...options });
}

const soundButtons = document.querySelectorAll<HTMLButtonElement>('[data-sound-toggle]');
const syncControl = () => {
  soundButtons.forEach((button) => {
    button.hidden = false;
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', enabled ? 'Desactivar sonidos' : 'Activar sonidos');
    button.title = enabled ? 'Desactivar sonidos' : 'Activar sonidos';
    const status = button.querySelector('[data-sound-status]');
    if (status) status.textContent = enabled ? 'activados' : 'desactivados';
  });
};
syncControl();
soundButtons.forEach((button) => button.addEventListener('click', () => {
  enabled = !enabled;
  setEnabled(enabled);
  try { localStorage.setItem(preferenceKey, String(enabled)); } catch {}
  syncControl();
  if (enabled) playSound('toggle');
}));

// Shared link feedback covers the hero, navigation, contact and footer.
// State-changing controls use playSound at the point their action succeeds.
document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element) || event.defaultPrevented) return;
  const link = event.target.closest<HTMLAnchorElement>('a[href]');
  if (link && link.getAttribute('aria-disabled') !== 'true') {
    const href = link.getAttribute('href') ?? '';
    if (href.startsWith('#')) {
      const section = document.getElementById(href.slice(1));
      if (section) playSound('navigate', {
        direction: section.getBoundingClientRect().top < 0 ? 'back' : 'forward',
      });
    } else {
      const input = event.detail === 0 ? 'keyboard'
        : event instanceof PointerEvent && event.pointerType === 'touch' ? 'touch'
        : event instanceof PointerEvent && event.pointerType === 'pen' ? 'pen' : 'mouse';
      playSound('tap', { input });
    }
    return;
  }
});

// Keep open tabs in sync with the visitor's saved sound preference.
window.addEventListener('storage', (event) => {
  if (event.key !== preferenceKey) return;
  enabled = event.newValue !== 'false';
  setEnabled(enabled);
  syncControl();
});
