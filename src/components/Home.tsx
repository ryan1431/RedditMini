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

  const getWindowWidth = () => {
    const { innerWidth: width } = window;
    return width;
  }

  const [width, setWidth] = useState<number>(getWindowWidth());
  const [css, setCss] = useState<CSS>({
    basis: width < 700 
      ? '99vw' 
      : '310px',
    border: '2px solid red',
  });

  useEffect(() => {
    const handleResize = () => {
      let currentWidth = getWindowWidth();
      setWidth(currentWidth);

      // Auto close (if open) when resizing under 700px
      if (currentWidth < 700) {
        if (css.border !== 'none') {
          setCss({
            basis: '0',
            border: 'none',
          })
        }
      } 
      // else if (currentWidth >= 700) {
      //   if (css.border === 'none') {
      //     setCss({
      //       basis: '310px',
      //       border: '2px solid red',
      //     })
      //   }
      // }
    }

    // set width whenever window size changes 
    window.addEventListener('resize', handleResize);
    // cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [])

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