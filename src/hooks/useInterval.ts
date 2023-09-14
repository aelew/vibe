import { useEffect, useRef } from 'react';

type Callback = (...args: any[]) => void;

export function useInterval(callback: Callback, delay: number | null) {
  const callbackRef = useRef<Callback>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (...args: any[]) => callbackRef.current!(...args);
    if (delay !== null) {
      const intervalId = setInterval(handler, delay);
      return () => clearInterval(intervalId);
    }
  }, [delay]);
}
