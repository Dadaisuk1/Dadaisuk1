import { useEffect, useRef } from 'react';

function DotGridBackground({
  dotColor = 'rgba(247, 243, 233, 0.2)',
  dotSize = 2.5,
  spacing = 36,
  enableOrbit = true,
  orbitSpeed = 0.72,
  impactRadius = 220,
  scaleOnHover = 2.3,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const dotsRef = useRef([]);
  const frameRef = useRef(0);
  const cursorRef = useRef({ x: -9999, y: -9999, active: false, fade: 0 });

  const buildDots = (width, height) => {
    const cols = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;
    const dots = [];

    for (let col = 0; col < cols; col += 1) {
      for (let row = 0; row < rows; row += 1) {
        const x = col * spacing + (Math.random() - 0.5) * spacing * 0.35;
        const y = row * spacing + (Math.random() - 0.5) * spacing * 0.35;

        dots.push({
          x,
          y,
          baseRadius: dotSize * (0.8 + Math.random() * 0.4),
          alpha: 0.12 + Math.random() * 0.28,
          inclination: (Math.random() * 0.6 + 0.25) * (Math.random() < 0.5 ? 1 : -1),
          ascension: Math.random() * Math.PI * 2,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    dotsRef.current = dots;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots(rect.width, rect.height);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [spacing, dotSize]);

  useEffect(() => {
    const onMove = (event) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;

      cursorRef.current.x = x;
      cursorRef.current.y = y;
      cursorRef.current.active = inside;
      cursorRef.current.fade = 1;
    };

    const onLeave = () => {
      cursorRef.current.active = false;
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let lastTime = performance.now();

    const render = (time) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dots = dotsRef.current;
      const cursor = cursorRef.current;
      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      if (!cursor.active) {
        cursor.fade = Math.max(0, cursor.fade - delta * 2.4);
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = dotColor;
      ctx.globalCompositeOperation = 'source-over';

      const orbitalTime = time * 0.001 * orbitSpeed;
      const shouldOrbit = enableOrbit && cursor.fade > 0.01;

      for (let i = 0; i < dots.length; i += 1) {
        const dot = dots[i];
        let x = dot.x;
        let y = dot.y;
        let radius = dot.baseRadius;
        let alpha = dot.alpha;

        const dx = x - cursor.x;
        const dy = y - cursor.y;
        const dist = Math.hypot(dx, dy);
        if (dist < impactRadius && cursor.fade > 0) {
          const pull = 1 - dist / impactRadius;
          const effect = Math.pow(pull, 1.8) * cursor.fade;
          alpha = Math.min(1, alpha + effect * 0.85);
          radius = radius * (1 + effect * (scaleOnHover - 1));

          if (shouldOrbit) {
            const orbitRadius = effect * 24;
            x += Math.cos(dot.phase + orbitalTime + dot.ascension) * orbitRadius;
            y += Math.sin(dot.phase + orbitalTime + dot.inclination) * orbitRadius;
          } else {
            const repel = effect * 10;
            if (dist > 0) {
              x += (dx / dist) * repel;
              y += (dy / dist) * repel;
            }
          }
        }

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current = window.requestAnimationFrame(render);
    };

    frameRef.current = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [dotColor, enableOrbit, orbitSpeed, impactRadius, scaleOnHover]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

export default DotGridBackground;
