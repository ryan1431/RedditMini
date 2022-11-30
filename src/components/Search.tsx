import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { useDebounce } from '../app/hooks/useDebounce';
import { selectTheme } from '../app/reducers/savedSlice';
import { setLoading, setSearchInput, toggleInSearch } from '../app/reducers/subredditsSlice';
import { getRGBA } from '../utility/getRGBA';
import './Search.css';
import { SearchResults } from './SearchResults';

export const Search = () => {
  const dispatch = useAppDispatch();

  const searchInput = useAppSelector(s => s.subreddits.searchInput);
  const inSearch = useAppSelector(s => s.subreddits.inSearch);
  
  const [searchQuery, setSearchQuery] = useState<string>('');

  const theme = useAppSelector(selectTheme);
  const background = getRGBA(theme.front_alt);

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
    if (e.target.classList.contains('search')) {
      dispatch(toggleInSearch(true));
      return;
    }
    if (e.target.closest('.search-results')) return;

    dispatch(toggleInSearch(false));
  }, [dispatch]);

  useEffect(() => { 
    window.addEventListener('click', onClick);
    return () => { window.removeEventListener('click', onClick) }
  }, [onClick]);

  return (
    <div style={{position: 'relative',}} className='search-wrapper' ref={wrapper}>
      <input style={{background}} placeholder="Search Communities" className="search" type="text" value={searchInput} onChange={onChange}  />
      <SearchResults inSearch={inSearch} searchQuery={searchQuery} searchInput={searchInput}/>
    </div>
  )
}