import { useCallback, useEffect, useRef } from "react"

export const useDebounce = (callback: (...args: any) => any, delay: number, dependencies: any[]) => {
  setTimeout(() => {})
  const callbackRef = useRef(callback);
  const timeoutRef:any = useRef();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
  }, [delay]);

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);

  useEffect(() => {
    clear();
    set();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, clear, set]);
  
  useEffect(clear, [clear]);
}