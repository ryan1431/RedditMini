import React, { useCallback, useState } from 'react';
import './Subreddits.css';

import type { CSS } from './Home';
import { useDebounce } from '../app/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { Sub } from './sub/Sub';
import { removeSubreddit } from '../features/querySlice';

interface SubredditsProps extends CSS {}

export type size = '' | '0';

export const Subreddits = (props: SubredditsProps) => {
  const { basis, border } = props;
  const dispatch = useAppDispatch();

  const subs = useAppSelector((state) => state.query.subreddits);

  const [clicked, setClicked] = useState<string>('');

  const [query, setQuery] = useState<string>('');
  const [inSearch, setInSearch] = useState<boolean>(false);

  const onDebounce = () => {
    console.log(query);
    // Query reddit subs
    
  }
  useDebounce(onDebounce, 1000, [query]);

  const onChange = useCallback((e:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setInSearch(true);
  }, []);

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
        <div id='search-bar'>
          <input placeholder="Search Subreddits" id="search-subs" type="text" value={query} onChange={onChange} />
        </div>

        <div id="search-results" style={{display: `${inSearch ? 'block' : 'none'}`}}>
          <p>Test</p>
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