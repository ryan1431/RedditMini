import { useCallback, useEffect, useRef, useState } from "react";



export const useDynamicTransition = (wrapperRef: React.MutableRefObject<HTMLDivElement>) => {
  const [showReplies, setShowReplies] = useState<boolean>(true);
  const [wrapperFullSize, setWrapperFullSize] = useState<number>();

  const maxHeightRef = useRef<string>('');

  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const onResize = useCallback(() => {
    clearTimeout(resizeTimeoutRef.current);
    setTimeout(() => {
      if (showReplies) {
        const h = wrapperRef.current.getBoundingClientRect().height;
        maxHeightRef.current = `${h}px`;
        setWrapperFullSize(h);
      } else {
        setWrapperFullSize(undefined);
      }
    }, 400);
  }, [showReplies, wrapperRef]);
  
  useEffect(() => {
    if (!wrapperRef.current) return;
    const h = wrapperRef.current.getBoundingClientRect().height;
    setWrapperFullSize(h);
    maxHeightRef.current = (h + 'px');

  }, [wrapperRef]);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [onResize])

  const resetHeightTimeoutRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    clearTimeout(resetHeightTimeoutRef.current);
    if (wrapperFullSize || !showReplies) return;

    resetHeightTimeoutRef.current = setTimeout(() => {
      const h = wrapperRef.current.getBoundingClientRect().height;
      maxHeightRef.current = `${h}px`;
      setWrapperFullSize(h);
    }, 350)
  }, [wrapperFullSize, showReplies, onResize, wrapperRef]);

  const onToggle = useCallback(() => {
    maxHeightRef.current = (showReplies ? '0px' : wrapperFullSize ? `${wrapperFullSize}px` : '');
    setShowReplies(p => !p);
  }, [wrapperFullSize, showReplies]);

  return { onToggle, maxHeightRef, showReplies }
}