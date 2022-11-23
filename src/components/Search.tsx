import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { useDebounce } from '../app/hooks/useDebounce';
import { setLoading, setSearchInput, toggleInSearch } from '../app/reducers/subredditsSlice';
import './Search.css';
import { SearchResults } from './SearchResults';

export const Search = () => {
  const dispatch = useAppDispatch();

  const searchInput = useAppSelector(s => s.subreddits.searchInput);
  const inSearch = useAppSelector(s => s.subreddits.inSearch);
  
  const [searchQuery, setSearchQuery] = useState<string>('');

  const wrapper = useRef<HTMLDivElement>(undefined!);

  useDebounce(() => { 
    // Prevent repeat fetch
    if (searchInput === searchQuery || searchInput.length < 3) return; 

    setSearchQuery(searchInput);
  }, 1000, [searchInput]);

  const onChange = useCallback((e:React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleInSearch(true));
    dispatch(setSearchInput(e.target.value));
    dispatch(setLoading('loading'));

    // Show results already in state if input reverts to previous value
    if (e.target.value === searchQuery) {
      dispatch(setLoading('idle'));
    }
  }, [dispatch, searchQuery]);

  const onClick = useCallback((e: any) => {
    console.log(e.target);
    console.log(wrapper.current.children);
    console.log(wrapper.current.contains(e.target));
    
    if(wrapper.current.contains(e.target)) {
      if (!inSearch) dispatch(toggleInSearch(true));
      return;
    };

    dispatch(toggleInSearch(false));
  }, [dispatch, inSearch]);

  useEffect(() => { 
    window.addEventListener('click', onClick);
    return () => { window.removeEventListener('click', onClick) }
  }, [onClick]);

  return (
    <div style={{position: 'relative',}} className='search-wrapper' ref={wrapper}>
      <input placeholder="Search Communities" className="search" type="text" value={searchInput} onChange={onChange}  />
      <SearchResults inSearch={inSearch} searchQuery={searchQuery} searchInput={searchInput}/>
    </div>
  )
}