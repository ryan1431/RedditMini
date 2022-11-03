import React, { useCallback, useState } from 'react';
import './Subreddits.css';

import type { CSS } from './Home';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { Sub } from './sub/Sub';
import { removeSubreddit } from '../features/querySlice';
import { Search } from './Search';

interface SubredditsProps extends CSS {}

export type size = '' | '0';

export const Subreddits = (props: SubredditsProps) => {
  const { basis, border } = props;
  const dispatch = useAppDispatch();

  const subs = useAppSelector((state) => state.query.subreddits);

  const [clicked, setClicked] = useState<string>('');

  const onMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = e.target;
    if (!(element instanceof HTMLDivElement)) return;
    setClicked(element.id);
    setTimeout(() => {
      dispatch(removeSubreddit(element.id));
    }, 150)
  }, [dispatch]);

  return (
    <>
      <div id="subreddits" style={{flexBasis: basis, maxWidth: basis, border: border}}>
        <div id='search-bar'  >
          <Search />
        </div>

        <div id="selected-subs" onMouseUp={onMouseUp}>
          {subs.map((sub) => (
            <div key={`sub-${sub}`} id={sub} className={`sub ${sub}`}>
              <Sub sub={sub} clicked={clicked === sub}  />
            </div>
          ))}
        </div>
      </div>
      
    </>
  )
}