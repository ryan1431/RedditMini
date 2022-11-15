import './Home.css';

import { Feed } from "./feed/Feed";
import { Subreddits } from "./Subreddits";
import { Navbar } from "./Navbar";
import { useRef, useState } from 'react';


export const Home = () => {

  const [open, setOpen] = useState<boolean>(false);
  const navBarRef = useRef<HTMLDivElement>(undefined!);

  return (
    <div id='page'>
      {/* Top navigation / header */}
      <div ref={navBarRef}>
        <Navbar setOpen={setOpen}/>
      </div>

      {/* Subreddits & feed split */}
      <div id='splitfeed'>
        <Subreddits open={open} setOpen={setOpen} navBarRef={navBarRef}/>
        <Feed />
      </div>

    </div>
  )
}