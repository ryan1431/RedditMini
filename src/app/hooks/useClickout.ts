import { useEffect } from "react"

export const useClickout = (
  onClick: (...args: any) => any,
  ) => {
    useEffect(() => {
      window.addEventListener('click', onClick);
      return () => window.removeEventListener('click', onClick);
    }, [onClick]);
}