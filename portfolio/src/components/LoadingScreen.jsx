import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Positioned as fractions of the 1.6s progress tween below so each line
// lands near the counter value it describes, not evenly spaced — "access
// granted" should land exactly as the counter hits 100, not before.
const BOOT_LOG = [
  { at: 0.1, text: 'mounting ./components' },
  { at: 0.42, text: 'linking profile.get(darwin)' },
  { at: 0.78, text: 'compiling frontend.jsx' },
  { at: 1, text: 'access granted' },
];

const PROGRESS_DURATION = 1.6;
const SESSION_KEY = 'ddjl-portfolio-booted';

/**
 * Full-screen preloader played once per tab session. Styled as a boot/auth
 * sequence — counter + progress rule + status log — to match the terminal
 * motif already established by TerminalPanel and TypewriterName, then exits
 * via a vault-door curtain split rather than a plain fade.
 */
function LoadingScreen() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.sessionStorage.getItem(SESSION_KEY) !== '1';
  });

  const contentRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const logRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  useEffect(() => {
    if (!visible) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const finish = () => {
      document.body.style.overflow = previousOverflow;
      window.sessionStorage.setItem(SESSION_KEY, '1');
      setVisible(false);
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      if (counterRef.current) counterRef.current.textContent = '100';
      if (barRef.current) barRef.current.style.width = '100%';
      if (logRef.current) logRef.current.textContent = 'access granted';
      const tl = gsap.timeline({ onComplete: finish });
      tl.to({}, { duration: 0.4 }).to(
        [leftPanelRef.current, rightPanelRef.current, contentRef.current],
        { opacity: 0, duration: 0.25 }
      );
      return () => tl.kill();
    }

    const progress = { value: 0 };
    const tl = gsap.timeline({ onComplete: finish });

    tl.from(contentRef.current, { opacity: 0, y: 8, duration: 0.4, ease: 'power2.out' }, 0);

    tl.to(
      progress,
      {
        value: 100,
        duration: PROGRESS_DURATION,
        ease: 'power2.inOut',
        onUpdate: () => {
          const value = Math.floor(progress.value);
          if (counterRef.current) counterRef.current.textContent = String(value).padStart(3, '0');
          if (barRef.current) barRef.current.style.width = `${progress.value}%`;
        },
      },
      0.3
    );

    BOOT_LOG.forEach(({ at, text }) => {
      tl.call(
        () => {
          if (logRef.current) logRef.current.textContent = text;
        },
        null,
        0.3 + at * PROGRESS_DURATION
      );
    });

    tl.to(contentRef.current, { opacity: 0, y: -8, duration: 0.35, ease: 'power2.in' }, '+=0.4');
    tl.to(
      leftPanelRef.current,
      { xPercent: -100, duration: 0.9, ease: 'power4.inOut' },
      '<'
    );
    tl.to(
      rightPanelRef.current,
      { xPercent: 100, duration: 0.9, ease: 'power4.inOut' },
      '<'
    );

    return () => tl.kill();
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="status" aria-live="polite" aria-label="Loading portfolio">
      <div ref={leftPanelRef} className="absolute inset-y-0 left-0 w-1/2 bg-navy" />
      <div ref={rightPanelRef} className="absolute inset-y-0 right-0 w-1/2 bg-navy" />

      <div
        ref={contentRef}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
      >
        <div
          className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-gold/10 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative font-mono text-[0.7rem] uppercase tracking-[0.42em] text-gold/60">
          DDJL — boot
        </div>

        <div
          ref={counterRef}
          className="relative mt-6 font-mono text-6xl font-semibold tabular-nums text-gold sm:text-7xl"
        >
          000
        </div>

        <div className="relative mt-7 h-px w-56 overflow-hidden bg-white/10 sm:w-64">
          <div ref={barRef} className="h-full w-0 bg-gold" />
        </div>

        <div className="relative mt-4 h-4 font-mono text-xs text-cream/50" ref={logRef} aria-hidden="true" />
      </div>
    </div>
  );
}

export default LoadingScreen;
