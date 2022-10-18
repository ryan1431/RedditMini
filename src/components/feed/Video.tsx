import { useRef } from 'react';
import './Video.css';

export const Video = (url: any) => {

  const vidRef: any = useRef(null);
  const handlePlayVideo = () => {
    vidRef.current.play();
  }

  return (
    <>
    <p>{url}</p>
      <video ref={vidRef} loop={true} controls>
        <source src={url}/>
      </video>
    </>
  )
}