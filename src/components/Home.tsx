import './Home.css';

import { Feed } from "./Feed";
import { Subreddits } from "./Subreddits";
import { Navbar } from "./Navbar";

export const Home = () => {

  return (
    <>
      <Navbar />
      <div id='splitfeed'>
        <div>
          <Feed />
          <p>worigjrwgoiwrgj</p>
        </div> 
        <div>
          <Subreddits />
          <p>wefjweoifjwe</p>
        </div>
               
      </div>
      
    </>
  )
}