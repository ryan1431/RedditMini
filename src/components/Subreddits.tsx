import './Subreddits.css';

import { useAppSelector } from '../app/hooks/hooks';
import { Sub } from './sub/Sub';
import { Search } from './Search';
import React, { MutableRefObject, useCallback, useEffect, useRef } from 'react';

interface SubredditsProps {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  navBarRef: MutableRefObject<HTMLDivElement>,
}

export const Subreddits = ({open, setOpen, navBarRef}: SubredditsProps) => {
  const subs = useAppSelector((state) => state.subreddits.subs);

  let width = open ? '' : '0';
  const wrapper = useRef<HTMLDivElement>(undefined!);

  const onClick = useCallback((e: any) => {
    if (!wrapper.current.contains(e.target) 
    && !navBarRef.current.contains(e.target)
    && !(e.target.classList.contains('save-results'))) {
      setOpen(false);
    } 
  }, [navBarRef, setOpen]);

  useEffect(() => {
    window.addEventListener('click', onClick);
    return () => { window.removeEventListener('click', onClick) }
  }, [onClick]);

  return (
    <div id="subreddits" ref={wrapper} style={{width: width, maxWidth: '100vw', border: open ? '' : 'none'}}>
      <div className='subs-results-container'> 
        <div id='search-bar'  >
          <Search />
        </div>

        <div id="selected-subs">
          {subs.map((sub) =>
            <Sub sub={sub} key={'selected-' + sub.name}/>
          )}
        </div>
      </div>
    </div>
  )
}
