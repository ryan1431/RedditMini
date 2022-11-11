import { useEffect, useState } from "react"


export const useOnScreen = (ref:any) => {

  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting)
    )

    if (ref.current) {
      observer.observe(ref.current);
    }
    
    // Remove the observer as soon as the component is unmounted
    return () => { observer.disconnect() }
  }, [ref])

  return isIntersecting
}