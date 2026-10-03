import { playSound } from './sounds';

type OrbitPose = { x: number; y: number; scale: number };

class TechnologyOrbit extends HTMLElement {
  private dispose?: () => void;

  connectedCallback() {
    if (this.dispose) return;

    const stage = this.querySelector<HTMLElement>('[data-orbit-stage]');
    const cards = Array.from(this.querySelectorAll<HTMLElement>('[data-orbit-card]'));
    const selectors = Array.from(this.querySelectorAll<HTMLButtonElement>('[data-orbit-select]'));
    const dots = Array.from(this.querySelectorAll<HTMLButtonElement>('[data-orbit-index]'));
    const controls = this.querySelector<HTMLElement>('.orbit-controls');
    const picker = this.querySelector<HTMLElement>('.orbit-picker');
    const motion = this.querySelector<HTMLButtonElement>('[data-orbit-motion]');
    const status = this.querySelector<HTMLElement>('[data-orbit-status]');
    if (!stage || !controls || !picker || !motion || !status || cards.length < 2) return;

    const events = new AbortController();
    const options = { signal: events.signal };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const poses: OrbitPose[] = cards.map(() => ({ x: 0, y: 0, scale: 1 }));
    let selected = -1;
    let playing = !reducedMotion.matches;
    let visible = false;
    let disposed = false;
    let frame = 0;
    let focusTimeout: number | undefined;
    let lastTime = 0;
    let phase = -Math.PI / 2;
    let elapsed = 0;
    let radiusX = 0;
    let radiusY = 0;
    let measuredWidth = 0;
    let measuredHeight = 0;

    const syncMotionControl = () => {
      motion.disabled = reducedMotion.matches;
      motion.textContent = reducedMotion.matches
        ? 'Movimiento reducido'
        : playing ? 'Pausar órbita' : 'Reanudar órbita';
    };

    const requestRender = () => {
      if (!frame && !disposed && visible && !document.hidden) {
        frame = requestAnimationFrame(render);
      }
    };

    // Measurements are cached by ResizeObserver; this loop only writes transforms.
    const render = (time: number, snap = false) => {
      frame = 0;
      const delta = lastTime ? Math.min(time - lastTime, 64) : 16;
      lastTime = time;
      const moving = playing && !reducedMotion.matches && visible && !document.hidden;
      if (moving) {
        phase += delta * 0.000075;
        elapsed += delta / 1000;
      }
      const blend = snap || reducedMotion.matches ? 1 : 1 - Math.exp(-delta / 105);
      let settling = false;

      cards.forEach((card, index) => {
        const active = index === selected;
        const slot = selected === -1 ? index : (index - selected - 1 + cards.length) % cards.length;
        const orbitingCount = selected === -1 ? cards.length : cards.length - 1;
        const angle = phase + (slot / orbitingCount) * Math.PI * 2;
        const depth = Math.sin(angle);
        const float = moving ? Math.sin(elapsed * 1.15 + index * 1.4) : 0;
        const target: OrbitPose = active
          ? { x: 0, y: float * 3, scale: 1 }
          : {
              x: Math.cos(angle) * radiusX,
              y: depth * radiusY + float * 8,
              scale: 0.62 + depth * 0.07,
            };
        const pose = poses[index];
        for (const key of ['x', 'y', 'scale'] as const) {
          const distance = target[key] - pose[key];
          if (Math.abs(distance) > 0.001) settling = true;
          pose[key] = Math.abs(distance) < 0.001 ? target[key] : pose[key] + distance * blend;
        }
        card.style.transform = `translate(-50%, -50%) translate3d(${pose.x.toFixed(2)}px, ${pose.y.toFixed(2)}px, 0) scale(${pose.scale.toFixed(4)})`;
        card.style.zIndex = active ? '30' : String(2 + Math.round((depth + 1) * 5));
      });

      if (!reducedMotion.matches && (moving || settling)) requestRender();
    };

    const select = (index: number, audible = false) => {
      if (audible) playSound('select', { direction: index < selected ? 'back' : 'forward' });
      window.clearTimeout(focusTimeout);
      selected = (index + cards.length) % cards.length;
      playing = false;
      cards.forEach((card, cardIndex) => {
        const active = cardIndex === selected;
        card.toggleAttribute('data-selected', active);
        selectors[cardIndex]?.setAttribute('aria-pressed', String(active));
        dots[cardIndex]?.setAttribute('aria-pressed', String(active));
      });
      status.textContent = `${String(selected + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')} · ${cards[selected].dataset.orbitTitle}`;
      syncMotionControl();
      requestRender();
      focusTimeout = window.setTimeout(() => {
        selected = -1;
        playing = !reducedMotion.matches;
        cards.forEach((card, cardIndex) => {
          card.removeAttribute('data-selected');
          selectors[cardIndex]?.setAttribute('aria-pressed', 'false');
          dots[cardIndex]?.setAttribute('aria-pressed', 'false');
        });
        status.textContent = 'Selecciona una especialidad';
        syncMotionControl();
        requestRender();
      }, 10_000);
    };

    const measure = () => {
      if (disposed) return;
      const width = stage.clientWidth;
      const tallest = Math.max(...cards.map((card) => card.offsetHeight));
      if (width === measuredWidth && tallest === measuredHeight) return;
      measuredWidth = width;
      measuredHeight = tallest;
      const compact = width < 640;
      const height = Math.max(compact ? 460 : 560, tallest + (compact ? 140 : 220));
      stage.style.height = `${height}px`;
      radiusX = compact ? width * 0.61 : Math.max(170, (width - cards[0].offsetWidth * 0.75) / 2 - 20);
      radiusY = Math.min(compact ? 105 : 155, height * 0.24);
      // Avoid an entrance animation from a collapsed pile of cards.
      if (frame) cancelAnimationFrame(frame);
      render(performance.now(), true);
    };

    const stopFrame = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    };

    this.addEventListener('click', (event) => {
      const button = (event.target as Element).closest<HTMLButtonElement>('button');
      if (!button || button.disabled || !this.contains(button)) return;
      if (button === motion) {
        playing = !playing && !reducedMotion.matches;
        playSound('toggle', { direction: playing ? 'forward' : 'back' });
        syncMotionControl();
        requestRender();
      } else if (button.hasAttribute('data-orbit-previous')) {
        select(selected === -1 ? cards.length - 1 : selected - 1, true);
      } else if (button.hasAttribute('data-orbit-next')) {
        select(selected === -1 ? 0 : selected + 1, true);
      } else if (button.hasAttribute('data-orbit-index')) {
        select(Number(button.dataset.orbitIndex), true);
      } else if (button.hasAttribute('data-orbit-select')) {
        select(selectors.indexOf(button), true);
      }
    }, options);

    this.addEventListener('focusin', (event) => {
      const target = event.target as HTMLElement;
      if (target === motion) return;
      playing = false;
      const index = selectors.indexOf(target as HTMLButtonElement);
      if (index !== -1) select(index);
      syncMotionControl();
      requestRender();
    }, options);

    this.addEventListener('keydown', (event) => {
      if (!(event.target instanceof HTMLButtonElement)) return;
      const destinations: Record<string, number> = {
        ArrowLeft: selected === -1 ? cards.length - 1 : selected - 1,
        ArrowRight: selected === -1 ? 0 : selected + 1,
        Home: 0,
        End: cards.length - 1,
      };
      if (!(event.key in destinations)) return;
      event.preventDefault();
      select(destinations[event.key], true);
      selectors[selected].focus({ preventScroll: true });
    }, options);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopFrame();
      else requestRender();
    }, options);

    reducedMotion.addEventListener('change', () => {
      playing = false;
      syncMotionControl();
      stopFrame();
      render(performance.now(), true);
    }, options);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestRender();
      else stopFrame();
    }, { threshold: 0.05 });
    const resize = new ResizeObserver(measure);

    this.dataset.enhanced = '';
    this.setAttribute('role', 'region');
    this.setAttribute('aria-roledescription', 'carrusel');
    controls.hidden = false;
    picker.hidden = false;
    selectors.forEach((button) => { button.hidden = false; });
    status.textContent = 'Selecciona una especialidad';
    syncMotionControl();
    measure();
    resize.observe(stage);
    cards.forEach((card) => resize.observe(card));
    intersection.observe(stage);
    void document.fonts.ready.then(measure);

    this.dispose = () => {
      disposed = true;
      window.clearTimeout(focusTimeout);
      stopFrame();
      events.abort();
      intersection.disconnect();
      resize.disconnect();
      delete this.dataset.enhanced;
      this.removeAttribute('role');
      this.removeAttribute('aria-roledescription');
      stage.style.removeProperty('height');
      controls.hidden = true;
      picker.hidden = true;
      selectors.forEach((button) => { button.hidden = true; });
      cards.forEach((card) => {
        card.style.removeProperty('transform');
        card.style.removeProperty('z-index');
        card.removeAttribute('data-selected');
      });
    };
  }

  disconnectedCallback() {
    this.dispose?.();
    this.dispose = undefined;
  }
}

if (!customElements.get('technology-orbit')) {
  customElements.define('technology-orbit', TechnologyOrbit);
}
