import { useEffect, useRef } from 'react';

function SpotlightGrid({
  dotColor = 'rgba(247, 243, 233, 0.2)',
  dotSize = 2.5,
  spacing = 36,
  impactRadius = 220,
  scaleOnHover = 2.3,
  spotlightIntensity = 0.95, // How bright dots appear in spotlight
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
          baseAlpha: 0.05 + Math.random() * 0.05, // Very low base alpha for hidden effect
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
        cursor.fade = Math.max(0, cursor.fade - delta * 1.5);
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = dotColor;
      ctx.globalCompositeOperation = 'source-over';

      for (let i = 0; i < dots.length; i += 1) {
        const dot = dots[i];
        let x = dot.x;
        let y = dot.y;
        let radius = dot.baseRadius;
        let alpha = dot.baseAlpha; // Start with very low base alpha

        const dx = x - cursor.x;
        const dy = y - cursor.y;
        const dist = Math.hypot(dx, dy);

        // Spotlight effect: only reveal dots within impact radius
        if (dist < impactRadius && cursor.fade > 0) {
          const pull = 1 - dist / impactRadius;
          const effect = Math.pow(pull, 1.8) * cursor.fade;

          // Boost alpha significantly in spotlight
          alpha = dot.baseAlpha + effect * spotlightIntensity;
          radius = radius * (1 + effect * (scaleOnHover - 1));

          // Slight repel effect when cursor is present
          const repel = effect * 8;
          if (dist > 0) {
            x += (dx / dist) * repel;
            y += (dy / dist) * repel;
          }
        }

        ctx.globalAlpha = Math.min(1, alpha);
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
  }, [dotColor, impactRadius, scaleOnHover, spotlightIntensity]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

export default SpotlightGrid;
