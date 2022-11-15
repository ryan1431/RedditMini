import './Home.css';

import { Feed } from "./feed/Feed";
import { Subreddits } from "./Subreddits";
import { Navbar } from "./Navbar";
import { useState } from 'react';


export const Home = () => {

  const [open, setOpen] = useState<boolean>(false);

  return (
    <div id='page'>
      {/* Top navigation / header */}
      <Navbar setOpen={setOpen}/>

      {/* Subreddits & feed split */}
      <div id='splitfeed'>
        <Subreddits open={open}/>
        <Feed />
      </div>

    </div>
  )
}