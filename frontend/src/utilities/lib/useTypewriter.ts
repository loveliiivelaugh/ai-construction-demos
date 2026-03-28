import { useEffect, useRef, useState } from 'react';

type Options = {
  cps?: number;
  burst?: [number, number];
  punctPauseMs?: number;
};

export function useTypewriter({
  cps = 60,
  burst = [0, 2],
  punctPauseMs = 120,
}: Options = {}) {
  const [text, setText] = useState('');
  const isTypingRef = useRef(false);
  const targetRef = useRef('');
  const indexRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef(0);

  function stop() {
    isTypingRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = null;
  }

  function start(fullText: string, onDone?: () => void) {
    stop();
    targetRef.current = fullText || '';
    indexRef.current = 0;
    setText('');
    isTypingRef.current = true;
    lastTimestampRef.current = 0;

    const step = (timestamp: number) => {
      if (!isTypingRef.current) return;
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;

      const elapsed = timestamp - lastTimestampRef.current;
      const charsPerMs = cps / 1000;
      let advance = Math.max(1, Math.floor(elapsed * charsPerMs));
      const [burstMin, burstMax] = burst;
      advance += Math.floor(Math.random() * (burstMax - burstMin + 1)) + burstMin;

      const nextIndex = Math.min(targetRef.current.length, indexRef.current + advance);
      const output = targetRef.current.slice(0, nextIndex);
      setText(output);

      const lastChar = output.slice(-1);
      const isPunctuation = /[.,?!:]/.test(lastChar);
      lastTimestampRef.current = isPunctuation ? timestamp - punctPauseMs / 2 : timestamp;
      indexRef.current = nextIndex;

      if (nextIndex >= targetRef.current.length) {
        stop();
        onDone?.();
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }

  useEffect(() => () => stop(), []);

  return { isTyping: isTypingRef.current, text, start, stop };
}
