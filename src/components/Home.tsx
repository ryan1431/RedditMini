import './Home.css';

import { Feed } from "./feed/Feed";
import { Navbar } from "./Navbar";

export const Home = () => {

  return (
    <div id='page'>
      <Navbar />
      <div id='feed-wrapper'>
        <Feed />
      </div>
    </div>
  )
}