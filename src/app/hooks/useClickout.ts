import { useCallback, useEffect } from "react"

export const useClickout = (
  onClickout: (...args: any) => any,
  wrapperRefs?: React.MutableRefObject<any>[],
  parentSelectors?: string[],
  forceClickoutSelectors?: string[],
  ) => {
    const onClick = useCallback((e: any) => {
      if (forceClickoutSelectors && forceClickoutSelectors.some(s => !!e.target.closest(s))) {
        onClickout();
        return;
      }
      
      if (wrapperRefs && wrapperRefs.some(ref => ref.current.contains(e.target))) return;
      if (parentSelectors && parentSelectors.some(s => !!e.target.closest(s))) return;

      onClickout();
    }, [forceClickoutSelectors, onClickout, parentSelectors, wrapperRefs]);

    useEffect(() => {
      window.addEventListener('click', onClick);
      return () => window.removeEventListener('click', onClick);
    }, [onClick]);
}