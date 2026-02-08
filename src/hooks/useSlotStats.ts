import { useState, useEffect, useRef } from 'react';

export interface SlotStatConfig {
  end: number;
  suffix?: string;
}

interface UseSlotStatsOptions {
  stats: SlotStatConfig[];
  spinDuration?: number;
  tickInterval?: number;
}

interface UseSlotStatsReturn {
  values: string[];
  isSpinning: boolean;
  spinProgress: number;
}

function randomInRange(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function formatValue(n: number, suffix: string): string {
  return n.toLocaleString('en-US') + suffix;
}

export function useSlotStats({
  stats,
  spinDuration = 2800,
  tickInterval = 70,
}: UseSlotStatsOptions): UseSlotStatsReturn {
  const [displayValues, setDisplayValues] = useState<string[]>(() =>
    stats.map((s) => formatValue(0, s.suffix ?? ''))
  );
  const [isSpinning, setIsSpinning] = useState(true);
  const [spinProgress, setSpinProgress] = useState(1);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const landTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    startTimeRef.current = performance.now();
    const finalValues = stats.map((s) => formatValue(s.end, s.suffix ?? ''));

    intervalRef.current = setInterval(() => {
      const elapsed = performance.now() - (startTimeRef.current ?? 0);
      if (elapsed >= spinDuration) return;
      setSpinProgress(1 - elapsed / spinDuration);
      // Last ~200ms: show final values so "last rotation" displays the real numbers
      if (elapsed >= spinDuration - 220) {
        setDisplayValues(finalValues);
        return;
      }
      setDisplayValues(
        stats.map(({ end, suffix = '' }) => {
          const min = Math.max(0, Math.floor(end * 0.2));
          const max = Math.floor(end * 1.4);
          return formatValue(randomInRange(min, max), suffix);
        })
      );
    }, tickInterval);

    landTimeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setDisplayValues(finalValues);
      setSpinProgress(0);
      setIsSpinning(false);
    }, spinDuration);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (landTimeoutRef.current) clearTimeout(landTimeoutRef.current);
    };
  }, []);

  return { values: displayValues, isSpinning, spinProgress };
}
