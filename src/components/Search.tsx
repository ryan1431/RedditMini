import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from '../app/hooks/useDebounce';
import './Search.css';
import { SearchResults } from './SearchResults';

export const Search = () => {

  const [query, setQuery] = useState<string>('');
  const [inSearch, setInSearch] = useState<boolean>(false);
  
  const wrapper = useRef<HTMLDivElement>(undefined!);

  const onDebounce = () => {
    console.log(query);
    // Query reddit subs
    
  }
  useDebounce(onDebounce, 1000, [query]);

  const onChange = useCallback((e:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setInSearch(true);

  }, []);

  const onClick = useCallback((e: MouseEvent) => {
    let element = e.target;

    if (!(element instanceof HTMLElement)) return;
    if(wrapper.current.contains(element)) {
      if (!inSearch) setInSearch(true);
      return;
    };

    setInSearch(false);
  }, [inSearch]);

  useEffect(() => { 
    window.addEventListener('click', onClick);
    return () => { window.removeEventListener('click', onClick) }
  }, [onClick]);

  return (
    <div style={{position: 'relative'}} className='search-wrapper' ref={wrapper}>
      <input placeholder="Search Subreddits" className="search" type="text" value={query} onChange={onChange}  />
      <SearchResults inSearch={inSearch}/>
    </div>
  )
}