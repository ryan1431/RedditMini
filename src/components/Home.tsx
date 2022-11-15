import './Home.css';

import { Feed } from "./feed/Feed";
import { Subreddits } from "./Subreddits";
import { Navbar } from "./Navbar";
import { useRef } from 'react';

export const Home = () => {
  const navBarRef = useRef<HTMLDivElement>(undefined!);

  return (
    <div id='page'>
      {/* Top navigation / header */}
      <div ref={navBarRef}>
        <Navbar />
      </div>

      {/* Subreddits & feed split */}
      <div id='splitfeed'>
        <Subreddits navBarRef={navBarRef}/>
        <Feed />
      </div>

    </div>
  )
}