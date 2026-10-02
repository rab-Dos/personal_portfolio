class MandrillPulse extends HTMLElement {
  private dispose?: () => void;

  connectedCallback() {
    if (this.dispose) return;
    const sparks = Array.from(this.querySelectorAll<SVGGElement>('[data-mandrill-spark]'));
    const lines = Array.from(this.querySelectorAll<SVGPathElement>('[data-mandrill-line]'))
      .map((path) => ({ d: path.getAttribute('d')!, length: path.getTotalLength() }))
      .filter((path) => path.length > 18);
    if (!sparks.length || !lines.length) return;

    const events = new AbortController();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Map<SVGGElement, Animation>();
    const timers = new Map<SVGGElement, number>();
    const selected = new Map<SVGGElement, number>();
    let visible = false;
    let running = false;

    const schedule = (spark: SVGGElement, delay: number) => {
      timers.set(spark, window.setTimeout(() => {
        timers.delete(spark);
        if (!running) return;
        // Evita repetir el tramo anterior o superponer pulsos en la misma línea.
        const available = lines.map((_, index) => index)
          .filter((index) => !Array.from(selected.values()).includes(index));
        const index = available[Math.floor(Math.random() * available.length)];
        selected.set(spark, index);
        const line = lines[index];
        const trail = Math.min(36, line.length * 0.4);
        const reverse = Math.random() > 0.5;
        const segments = Array.from(spark.querySelectorAll<SVGPathElement>('[data-pulse-segment]'));
        const segmentLength = trail / segments.length;
        // El alfa crece hasta el centro y se desvanece en ambos extremos.
        // Todos los segmentos heredan el desplazamiento animado del grupo.
        segments.forEach((segment, segmentIndex) => {
          segment.setAttribute('d', line.d);
          segment.style.strokeDasharray = `0 ${segmentIndex * segmentLength} ${segmentLength} ${line.length + trail * 2}`;
        });
        const from = reverse ? -line.length : trail;
        const to = reverse ? trail : -line.length;
        const animation = spark.animate([
          { strokeDashoffset: String(from), opacity: 0, offset: 0 },
          { strokeDashoffset: String(from + (to - from) * 0.15), opacity: 0.95, offset: 0.15 },
          { strokeDashoffset: String(from + (to - from) * 0.8), opacity: 0.95, offset: 0.8 },
          { strokeDashoffset: String(to), opacity: 0, offset: 1 },
        ], { duration: 1500 + Math.random() * 1000 + line.length * 3, easing: 'linear' });
        animations.set(spark, animation);
        animation.onfinish = () => {
          animations.delete(spark);
          if (running) schedule(spark, 400 + Math.random() * 1000);
        };
      }, delay));
    };

    const stop = () => {
      running = false;
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      animations.forEach((animation) => { animation.onfinish = null; animation.cancel(); });
      animations.clear();
    };

    const sync = () => {
      const shouldRun = visible && !document.hidden && !reducedMotion.matches;
      if (shouldRun && !running) {
        running = true;
        sparks.forEach((spark, index) => schedule(spark, index * 450 + Math.random() * 500));
      } else if (!shouldRun) stop();
    };

    document.addEventListener('visibilitychange', sync, { signal: events.signal });
    reducedMotion.addEventListener('change', sync, { signal: events.signal });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio > 0;
      sync();
    }, { threshold: 0 });
    observer.observe(this);
    sync();
    this.dispose = () => { stop(); observer.disconnect(); events.abort(); };
  }

  disconnectedCallback() { this.dispose?.(); this.dispose = undefined; }
}

if (!customElements.get('mandrill-pulse')) customElements.define('mandrill-pulse', MandrillPulse);
