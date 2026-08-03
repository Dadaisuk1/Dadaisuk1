import { useEffect, useState } from 'react';

/**
 * Typed "whoami" terminal for the hero's right column, replacing the photo
 * card. Ties into the Kali/Metasploit angle that was otherwise buried at the
 * end of a flat skills list, and reads as a small demonstration of craft
 * rather than a static image.
 */
const TERMINAL_STEPS = [
  { type: 'command', text: 'whoami' },
  { type: 'output', lines: ['darwin darryl jean largoza'] },
  { type: 'command', text: 'cat current-focus.txt' },
  { type: 'output', lines: ['shipping Ally (capstone)', 'growing into backend development'] },
  { type: 'command', text: 'ls ./stack' },
  { type: 'output', lines: ['react · figma · aws · kali-linux'] },
];

const TYPE_MS = 34;
const PAUSE_AFTER_COMMAND_MS = 260;
const PAUSE_AFTER_OUTPUT_MS = 520;

function TerminalPanel() {
  // Reduced motion: skip the typing simulation entirely by starting in the
  // finished state, rather than animating then immediately setState-ing past
  // it from inside the effect.
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [completedSteps, setCompletedSteps] = useState(() => (reduceMotion ? TERMINAL_STEPS.length : 0));
  const [typingChar, setTypingChar] = useState(0);
  const [done, setDone] = useState(() => reduceMotion);

  useEffect(() => {
    if (reduceMotion) return undefined;

    let cancelled = false;
    let timer;

    function advance(index, typed) {
      if (cancelled) return;
      const step = TERMINAL_STEPS[index];
      if (!step) {
        setDone(true);
        return;
      }

      if (step.type === 'command' && typed < step.text.length) {
        setTypingChar(typed + 1);
        timer = setTimeout(() => advance(index, typed + 1), TYPE_MS);
        return;
      }

      const pause = step.type === 'command' ? PAUSE_AFTER_COMMAND_MS : PAUSE_AFTER_OUTPUT_MS;
      timer = setTimeout(() => {
        setCompletedSteps(index + 1);
        setTypingChar(0);
        advance(index + 1, 0);
      }, pause);
    }

    advance(0, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduceMotion]);

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/60 shadow-inner">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" aria-hidden="true" />
        <span className="ml-2 font-mono text-xs text-cream/40">darwin@portfolio — zsh</span>
      </div>

      <div className="min-h-[220px] px-5 py-5 font-mono text-sm leading-7 sm:text-[0.95rem]">
        {TERMINAL_STEPS.map((step, index) => {
          if (index > completedSteps) return null;

          if (step.type === 'command') {
            const isCurrent = index === completedSteps && !done;
            const text = isCurrent ? step.text.slice(0, typingChar) : step.text;
            return (
              <p key={step.text} className="text-gold">
                <span className="text-cream/40">$ </span>
                {text}
                {isCurrent ? <span className="terminal-cursor" aria-hidden="true" /> : null}
              </p>
            );
          }

          return step.lines.map((line) => (
            <p key={line} className="pl-4 text-cream/80">
              <span className="text-gold/60">→ </span>
              {line}
            </p>
          ));
        })}

        {done ? (
          <p className="text-gold">
            <span className="text-cream/40">$ </span>
            <span className="terminal-cursor" aria-hidden="true" />
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default TerminalPanel;
