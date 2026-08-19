import { useEffect, useState } from 'react';

type UseShowerTimerOptions = {
  enabled?: boolean;
  initialSeconds?: number;
  tickMs?: number;
};

export function useShowerTimer({
  enabled = true,
  initialSeconds = 0,
  tickMs = 1000,
}: UseShowerTimerOptions = {}) {
  const [elapsedSeconds, setElapsedSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, tickMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, tickMs]);

  return {
    elapsedSeconds,
    setElapsedSeconds,
  };
}

export function formatElapsedTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
