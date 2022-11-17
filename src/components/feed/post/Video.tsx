import React from 'react';
import { useEffect, useState } from 'react';
import './Video.css';

interface VideoProps { 
  url: string,
}

export const Video = ({url}: VideoProps) => {
  const [videoUrl] = useState<string>(url);
  const videoRef = React.useRef() as React.RefObject<HTMLVideoElement>;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
    };
  }, [videoUrl])

  return (
    <>
      <video ref={videoRef} loop={true} controls>
        <source src={url}/>
      </video>
    </>
  )
}