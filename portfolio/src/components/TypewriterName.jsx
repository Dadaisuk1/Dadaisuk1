import { useEffect, useRef, useState } from 'react';

const DWELL_MS = 10000;
const PAUSE_POLL_MS = 150;
// Total cascade length is fixed regardless of name length — otherwise
// "Darwin" snaps by while "Largoza" crawls, since both used to take
// length * flips * flip-interval. Per-character reveal speed is derived
// from this instead. Flicker rate is a separate, constant knob so it always
// reads as a glitch rather than slowing down with the sweep.
const TOTAL_TRANSITION_MS = 1500;
const FLICKER_MS = 60;
const SCRAMBLE_CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

function randomChar() {
  return SCRAMBLE_CHARSET[Math.floor(Math.random() * SCRAMBLE_CHARSET.length)];
}

// Real characters lock in left-to-right as `revealCount` grows; everything
// past it re-rolls to a random glyph each flip (spaces stay spaces so word
// gaps don't scramble into garbage).
function scrambleFrom(target, revealCount) {
  return target
    .split('')
    .map((char, index) => (char === ' ' || index < revealCount ? char : randomChar()));
}

/**
 * Cycles through `names`, decrypting each one in from scrambled characters —
 * a nod to the Kali Linux / security-tooling background in the résumé rather
 * than a generic reveal animation.
 *
 * No cursor glyph, for the same reason a typewriter caret was rejected here
 * before: impeccable's anti-pattern detector flags a decorative blinking
 * cursor in a hero/landing section as simulating typing where no real input
 * exists — the scramble-to-reveal motion carries the attention on its own.
 *
 * `names[0]` renders fully decrypted on first mount rather than scrambling
 * in, so the hero doesn't look unfinished during first paint.
 */
function TypewriterName({ names, paused = false, className, encryptedClassName = 'text-gold/35' }) {
  const [display, setDisplay] = useState(() => ({
    target: names[0],
    revealCount: names[0].length,
    scramble: names[0].split(''),
  }));
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancelled = false;
    let timer;

    const wait = (ms) =>
      new Promise((resolve) => {
        timer = setTimeout(resolve, ms);
      });

    const waitWhilePaused = async () => {
      while (pausedRef.current && !cancelled) {
        await wait(PAUSE_POLL_MS);
      }
    };

    async function loop() {
      let index = 0;
      while (!cancelled) {
        await wait(DWELL_MS);
        await waitWhilePaused();
        if (cancelled) return;

        const next = names[(index + 1) % names.length];

        if (reduceMotion) {
          setDisplay({ target: next, revealCount: next.length, scramble: next.split('') });
        } else {
          const msPerChar = TOTAL_TRANSITION_MS / next.length;
          let elapsed = 0;

          while (elapsed < TOTAL_TRANSITION_MS && !cancelled) {
            await waitWhilePaused();
            if (cancelled) return;

            const revealCount = Math.min(next.length, Math.floor(elapsed / msPerChar));
            setDisplay({ target: next, revealCount, scramble: scrambleFrom(next, revealCount) });

            await wait(FLICKER_MS);
            elapsed += FLICKER_MS;
          }

          await waitWhilePaused();
          if (cancelled) return;
          setDisplay({ target: next, revealCount: next.length, scramble: next.split('') });
        }

        index = (index + 1) % names.length;
      }
    }

    loop();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // `paused` is read via pausedRef so toggling hover/focus freezes the loop
    // in place instead of restarting it — intentionally not a dependency.
  }, [names]);

  return (
    <span aria-hidden="true">
      {display.scramble.map((char, index) => (
        <span key={index} className={index < display.revealCount ? className : encryptedClassName}>
          {char}
        </span>
      ))}
    </span>
  );
}

export default TypewriterName;
