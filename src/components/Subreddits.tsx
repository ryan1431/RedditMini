import React, { useCallback, useState } from 'react';
import './Subreddits.css';

import type { CSS } from './Home';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { Sub } from './sub/Sub';
import { Search } from './Search';
import { removeSubreddit } from '../app/reducers/subredditsSlice';

interface SubredditsProps extends CSS {}

export type size = '' | '0';

export const Subreddits = (props: SubredditsProps) => {
  const { basis, border } = props;
  const dispatch = useAppDispatch();

  const subs = useAppSelector((state) => state.subreddits.subs);

  const [clicked, setClicked] = useState<string>('');

  const onMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = e.target;
    if (!(element instanceof HTMLDivElement)) return;
    const name = element.id.split('-')[1];
    setClicked(name);
    setTimeout(() => {
      dispatch(removeSubreddit(name));
      setClicked('');
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
            <div key={`sub-${sub.name}`} id={`added-${sub.name}`} className={`sub ${sub.name}`}>
              <Sub sub={sub} clicked={clicked === sub.name}  />
            </div>
          ))}
        </div>
      </div>
      
    </>
  )
}