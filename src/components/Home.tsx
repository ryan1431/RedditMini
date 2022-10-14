import './Home.css';

import { Feed } from "./Feed";
import { Subreddits } from "./Subreddits";
import { Navbar } from "./Navbar";
import { useEffect, useState } from 'react';
import { getWindow } from '@testing-library/user-event/dist/types/utils';

export interface CSS {
  basis: string,
  border: string,
}

export const Home = () => {

  // Initializes width state & used in later calls
  const getWindowWidth = () => {
    const { innerWidth: width } = window;
    return width;
  }

  const [width, setWidth] = useState<number>(getWindowWidth());
  const [css, setCss] = useState<CSS>({ basis: '', border: ''});


  const handleResize = () => {
    let currentWidth = getWindowWidth();
    setWidth(currentWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [])

  // Calls on window resize
  useEffect(() => {
    // Uses css defaults when width > 900
    if (width > 900 && css.basis !== '') {
      setCss({
        basis: '',
        border: '',
      })
    }    
  }, [css, width])

  return (
    <div id='page'>
      {/* Top navigation / header */}
      <Navbar css={css} setCss={setCss} width={width}/>

      {/* Subreddits & feed split */}
      <div id='splitfeed'>
        <Subreddits basis={css.basis} border={css.border}/>
        <Feed />
      </div>
    </div>
  )
}