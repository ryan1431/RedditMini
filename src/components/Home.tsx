import './Home.css';

import { Feed } from "./feed/Feed";
import { Subreddits } from "./Subreddits";
import { Navbar } from "./Navbar";
import { useRef } from 'react';
import { useAppSelector } from '../app/hooks/hooks';


export const Home = () => {

  const open = useAppSelector(s => s.subreddits.open);

  const navBarRef = useRef<HTMLDivElement>(undefined!);

  return (
    <div id='page'>
      {/* Top navigation / header */}
      <div ref={navBarRef}>
        <Navbar />
      </div>

      {/* Subreddits & feed split */}
      <div id='splitfeed'>
        <Subreddits open={open} navBarRef={navBarRef}/>
        <Feed />
      </div>

    </div>
  )
}