import { useEffect, useRef } from 'react';

/** Stable pseudo-random in [0, 1) derived from a grid cell. */
function hashUnit(col, row) {
  const n = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Cursor-revealed dot grid.
 *
 * The canvas is fixed to the viewport rather than stretched over the whole
 * document. Previously it was `absolute inset-0` inside a page-height parent,
 * so on a ~7000px page it built and iterated ~8,500 dots every frame — most of
 * them thousands of pixels off screen. Viewport-sizing cuts that to ~1,700.
 *
 * The grid is anchored to the document (not the viewport) so dots slide past
 * as you scroll instead of feeling glued to the screen. That is what the
 * scroll offset below is for: we only draw the window of the lattice that is
 * currently visible.
 */
function SpotlightGrid({
  dotColor = 'rgba(247, 243, 233, 0.18)',
  dotSize = 2.5,
  spacing = dotSize * 10,
  impactRadius = 220,
  scaleOnHover = 1.35,
  spotlightIntensity = 0.9,
}) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const cursorRef = useRef({ x: -9999, y: -9999, active: false, fade: 0 });
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { width, height };
    };

    resize();
    window.addEventListener('resize', resize);

    const onMove = (event) => {
      const cursor = cursorRef.current;
      cursor.x = event.clientX;
      cursor.y = event.clientY;
      cursor.active = true;
      cursor.fade = 1;
    };

    const onLeave = () => {
      cursorRef.current.active = false;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    // Reduced motion: no rAF loop at all, nothing ever painted.
    if (reduceMotion) {
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerleave', onLeave);
      };
    }

    let lastTime = performance.now();

    const render = (time) => {
      frameRef.current = window.requestAnimationFrame(render);

      const { width, height } = sizeRef.current;
      const cursor = cursorRef.current;
      const delta = Math.min((time - lastTime) * 0.001, 0.05);
      lastTime = time;

      if (!cursor.active) {
        cursor.fade = Math.max(0, cursor.fade - delta * 1.5);
      }

      // Nothing to show until the pointer wakes the grid up.
      if (cursor.fade <= 0) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = dotColor;

      // Anchor the lattice to the document so it scrolls with the page, then
      // walk only the rows and columns inside the current viewport.
      const scrollX = window.scrollX % spacing;
      const scrollY = window.scrollY % spacing;

      const startCol = Math.floor(scrollX / spacing);
      const endCol = Math.ceil((width + scrollX) / spacing);
      const startRow = Math.floor(scrollY / spacing);
      const endRow = Math.ceil((height + scrollY) / spacing);

      const radiusSq = impactRadius * impactRadius;

      for (let col = startCol; col <= endCol; col += 1) {
        for (let row = startRow; row <= endRow; row += 1) {
          const baseX = col * spacing - scrollX;
          const baseY = row * spacing - scrollY;

          // Per-dot alpha jitter keeps the grid from looking mechanical. It
          // has to be a deterministic hash of the cell, not Math.random(),
          // or every dot would flicker on each frame.
          let alpha = (0.08 + hashUnit(col, row) * 0.09) * cursor.fade;
          let x = baseX;
          let y = baseY;
          let size = dotSize;

          const dx = baseX - cursor.x;
          const dy = baseY - cursor.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const effect = Math.pow(1 - dist / impactRadius, 1.8) * cursor.fade;

            alpha = Math.min(1, alpha + effect * spotlightIntensity);
            size *= 1 + effect * (scaleOnHover - 1);

            const move = effect * 10;
            if (dist > 0) {
              x += (dx / dist) * move;
              y += (dy / dist) * move;
            }
          }

          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.5, size / 2), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
    };

    // Don't burn frames while the tab is in the background.
    const onVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      } else if (!frameRef.current) {
        lastTime = performance.now();
        frameRef.current = window.requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    frameRef.current = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [dotColor, dotSize, spacing, impactRadius, scaleOnHover, spotlightIntensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 block h-full w-full"
    />
  );
}

export default SpotlightGrid;
