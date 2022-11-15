import './Subreddits.css';

import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { Sub } from './sub/Sub';
import { Search } from './Search';
import React, { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { toggleOpen } from '../app/reducers/subredditsSlice';

interface SubredditsProps {
  open: boolean,
  navBarRef: MutableRefObject<HTMLDivElement>,
}

export const Subreddits = ({open, navBarRef}: SubredditsProps) => {
  const dispatch = useAppDispatch();
  const subs = useAppSelector((state) => state.subreddits.subs);

  let height = open ? '' : '0';
  const wrapper = useRef<HTMLDivElement>(undefined!);

  const onClick = useCallback((e: any) => {
    if (!wrapper.current.contains(e.target) 
    && !navBarRef.current.contains(e.target)
    && !(e.target.classList.contains('save-results'))) {
      dispatch(toggleOpen(false));
    } 
  }, [dispatch, navBarRef]);

  useEffect(() => {
    window.addEventListener('click', onClick);
    return () => { window.removeEventListener('click', onClick) }
  }, [onClick]);

  return (
    <div id="subreddits" ref={wrapper} style={{height: height, maxWidth: '100vw', border: open ? '' : 'none'}}>
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
