import React, { useCallback, useState } from 'react';
import './Subreddits.css';

import type { CSS } from './Home';
import { useDebounce } from '../app/hooks/useDebounce';
import { useAppSelector } from '../app/hooks/hooks';
import { Sub } from './sub/Sub';

interface SubredditsProps extends CSS {}

export const Subreddits = (props: SubredditsProps) => {
  const { basis, border } = props;

  const subs = useAppSelector((state) => state.query.subreddits);

  const [query, setQuery] = useState<string>('');
  const [inSearch, setInSearch] = useState<boolean>(false);

  const onDebounce = () => {
    console.log(query);
  }
  useDebounce(onDebounce, 1000, [query]);

  const onChange = useCallback((e:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setInSearch(true);
  }, []);

  const onMouseOver = useCallback((e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.persist();

    console.log(e);
  }, []);

  return (
    <>
      <div id="subreddits" style={{flexBasis: basis, maxWidth: basis, border: border}}>
        <div id='search-bar'>
          <input placeholder="Search Subreddits" id="search-subs" type="text" value={query} onChange={onChange} />
        </div>

        <div id="search-results" style={{display: `${inSearch ? 'block' : 'none'}`}}>
          <p>Test</p>
        </div>  

        <div id="selected-subs" onMouseOver={onMouseOver}>
          {subs.map((sub) => {
            return <Sub sub={sub} key={`sub-${sub}`}/>
          })}
        </div>
      </div>
      
    </>
  )
}