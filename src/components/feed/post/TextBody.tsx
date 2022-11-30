import React, { useEffect, useRef } from "react";

interface TextProps {
  selftext: string,
  selftext_html: string,
  setHeight: React.Dispatch<React.SetStateAction<number>>,
}

export const TextBody = ({selftext_html, setHeight}: TextProps) => {

  const textRef = useRef<HTMLDivElement>(undefined!);

  useEffect(() => {
    setHeight(textRef.current.getBoundingClientRect().height);
  }, [setHeight]);
  
  return (
    <div ref={textRef} dangerouslySetInnerHTML={{__html: selftext_html}} />
  )
}