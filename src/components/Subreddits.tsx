import React, { useCallback, useState } from 'react';
import './Subreddits.css';

import type { CSS } from './Home';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { Sub } from './sub/Sub';
import { Search } from './Search';
import { Subreddit } from '../types';
import { toggleSubreddit } from '../app/reducers/subredditsSlice';

interface SubredditsProps extends CSS {}

export type size = '' | '0';

export const Subreddits = (props: SubredditsProps) => {
  const { basis, border } = props;
  const dispatch = useAppDispatch();

  const subs = useAppSelector((state) => state.subreddits.subs);

  const [clicked, setClicked] = useState<string>('');

  const onClick = useCallback((sub: Subreddit) => {
    setClicked(sub.name);
    setTimeout(() => {
      dispatch(toggleSubreddit(sub));
      setClicked('');
    }, 150)
  }, [dispatch]);

  return (
    <>
      <div id="subreddits" style={{flexBasis: basis, maxWidth: basis, border: border}}>
        <div id='search-bar'  >
          <Search />
        </div>

        <div id="selected-subs">
          {subs.map((sub) => (
            <div key={`sub-${sub.name}`} onClick={() => onClick(sub)} className={`sub ${sub.name}`}>
              <Sub sub={sub} clicked={clicked === sub.name}  />
            </div>
          ))}
        </div>
      </div>
      
    </>
  )
}
