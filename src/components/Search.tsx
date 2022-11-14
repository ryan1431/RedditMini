import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../app/hooks/hooks';
import { useDebounce } from '../app/hooks/useDebounce';
import { setLoading } from '../app/reducers/subredditsSlice';
import './Search.css';
import { SearchResults } from './SearchResults';

export const Search = () => {
  const dispatch = useAppDispatch();

  const [searchInput, setSearchInput] = useState<string>('');
  const [inSearch, setInSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const wrapper = useRef<HTMLDivElement>(undefined!);

  useDebounce(() => { 
    // Prevent repeat fetch
    if (searchInput === searchQuery) return; 

    setSearchQuery(searchInput);
  }, 1000, [searchInput]);

  const onChange = useCallback((e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    dispatch(setLoading('loading'));

    // Show results already in state if input reverts to previous value
    if (e.target.value === searchQuery) {
      dispatch(setLoading('idle'));
    }
  }, [dispatch, searchQuery]);

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
      <input placeholder="Search Subreddits" className="search" type="text" value={searchInput} onChange={onChange}  />
      <SearchResults inSearch={inSearch} setInSearch={setInSearch} searchQuery={searchQuery} searchInput={searchInput}/>
    </div>
  )
}