import { useCallback, useEffect, useRef, useState } from "react";


export const useDynamicTransition = (wrapperRef: React.MutableRefObject<HTMLDivElement>, duration: number = 300) => {
  const [showReplies, setShowReplies] = useState<boolean>(true);
  const [wrapperFullSize, setWrapperFullSize] = useState<number>();
  const [display, setDisplay] = useState<boolean>(true);

  const maxHeightRef = useRef<string>('');
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  const onResize = useCallback(() => {
    clearTimeout(resizeTimeoutRef.current);
    if (showReplies) {
      maxHeightRef.current = '';
    }
    resizeTimeoutRef.current = setTimeout(() => {
      if (showReplies) {
        const h = wrapperRef.current.getBoundingClientRect().height;
        maxHeightRef.current = `${h}px`;
        setWrapperFullSize(h);
      } else {
        setWrapperFullSize(undefined);
      }
    }, duration);
  }, [duration, showReplies, wrapperRef]);
  
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
    }, duration)
  }, [wrapperFullSize, showReplies, onResize, wrapperRef, duration]);


  const displayTimeoutRef = useRef<NodeJS.Timeout>();
  const onToggle = useCallback(() => {
    clearTimeout(displayTimeoutRef.current);
    if (showReplies) {
      displayTimeoutRef.current = setTimeout(() => {
        setDisplay(false);
      }, duration * 0.8);
    } else {
      setDisplay(true);
    }
    
    maxHeightRef.current = (showReplies ? '0px' : wrapperFullSize ? `${wrapperFullSize}px` : '');
    setShowReplies(p => !p);
  }, [showReplies, wrapperFullSize, duration]);

  return { onToggle, maxHeightRef, showReplies, display }
}