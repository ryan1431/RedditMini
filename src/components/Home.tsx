import './Home.css';

import { Feed } from "./Feed";
import { Subreddits } from "./Subreddits";
import { Navbar } from "./Navbar";


export const Home = () => {

  return (
    <div id='page'>
      {/* Top navigation / header */}
      <Navbar />

      {/* Subreddits & feed split */}
      <div id='splitfeed'>
        <Subreddits />
        <Feed />
      </div>
    </div>
  )
}