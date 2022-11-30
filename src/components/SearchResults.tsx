import React, { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { setQuery } from '../app/reducers/querySlice';
import { selectTheme } from '../app/reducers/savedSlice';
import { clearToggleQueue, getSubreddits, toggleInSearch, toggleSubreddit } from '../app/reducers/subredditsSlice';
import { Subreddit } from '../types';
import { getRGBA } from '../utility/getRGBA';
import './SearchResults.css';
import { Sub } from './sub/Sub';

interface SearchResultsProps {
  /**
   * Represents whether or not the search results are currently showing
   */
  inSearch: boolean,
  /**
   * Actual query used to fetch after a one second debounce
   */
  searchQuery: string,
  /**
   * Text in the input field, to be queried
   */
  searchInput: string,
}

export const SearchResults = ({inSearch, searchQuery, searchInput}:SearchResultsProps) => {
  const dispatch = useAppDispatch();

  const {searchResults: results, searchStatus} = useAppSelector((state) => state.subreddits);
  const toggled = useAppSelector((s) => s.subreddits.toggleQueue);
  const blocked = useAppSelector(s => s.subreddits.in_storage.blocked);
  const theme = useAppSelector(selectTheme);
  const background = getRGBA(theme.front);
  const borderColor = getRGBA(theme.border);

  const style = useMemo(() => {
    return toggled.length 
      ? {
        height: '2.5rem',
        margin: '8px',
      } : {
        height: '0',
        margin: '0',
      };
  }, [toggled]);

  // Search subreddits
  useEffect(() => {
    dispatch(getSubreddits(searchQuery));
  }, [searchQuery, dispatch]);

  // Reset selected subs when closing search results or changing searchquery
  useEffect(() => {
    dispatch(clearToggleQueue());
  }, [dispatch, searchQuery]);

  // Submit / save new subs
  const setSubs = useCallback(() => {
    toggled.forEach((sub) => {
      dispatch(toggleSubreddit(sub));
    });

    dispatch(toggleInSearch(false));
    dispatch(setQuery(['feed', 'custom']))
    dispatch(clearToggleQueue());
  }, [dispatch, toggled]);

  return (
    <>
      {inSearch && (
        <div style={{background, borderColor}} className="search-results">
          { (searchInput.length < 3)
            ? <p>Enter a search of at least 3 characters</p>
            : (searchStatus === 'idle' && results.length)
              ? <div style={{height: 'fit-content', maxWidth: '100%'}}>
                <div className='results-wrapper hidescrollbar'>
                  {results.map((sub: Subreddit) => 
                    (!blocked.find(sr => sr.name === sub.name)) && <Sub key={'result-' + sub.name} sub={sub} result />
                  )}
                </div>
                <div className='save-wrapper' style={style}>
                  <input type='button' onClick={setSubs} className='save-results' value='Save'></input>
                </div>
              </div>
              : (searchStatus === 'loading')
                ? <p>Loading...</p>
                : <p>No results found.</p> 
          }
        </div>
      )}
    </>
    
  )
}