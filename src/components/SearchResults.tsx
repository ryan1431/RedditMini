import clsx from 'clsx';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { addSubreddit, getSubreddits, removeSubreddit, setLoading } from '../features/subredditsSlice';
import { Subreddit } from '../types';
import './SearchResults.css';
import { Sub } from './sub/Sub';

interface SearchResultsProps {
  inSearch: boolean;
  query: string;
  searchInput: string;
}

export const SearchResults = ({inSearch, query, searchInput}:SearchResultsProps) => {
  const dispatch = useAppDispatch();
  const {searchResults: results, searchStatus: status, subs: addedSubs} = useAppSelector((state) => state.subreddits);

  useEffect(() => {
    if (query.length < 3) {
      dispatch(setLoading('idle'));
      return;
    };

    dispatch(getSubreddits(query));
  }, [query, dispatch]);

  const onMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = e.target;
    if (!(element instanceof HTMLDivElement)) return;

    const name = element.id.split('-')[1];

    if (addedSubs.includes(name)) {
      dispatch(removeSubreddit(name));
    } else {
      dispatch(addSubreddit(name));
    }
  }, [addedSubs, dispatch]);

  return (
    <>
      {inSearch && (
        <div className="search-results" onMouseUp={(onMouseUp)}>
          {
          searchInput.length < 3 
            ? <p>Start typing to begin search.</p>
            : status === 'idle' && results.length
              ? results.map((result: Subreddit) => 
                (<div key={`sub-${result.name}`} id={`result-${result.name}`} style={{width: '100%'}} className={clsx('sub', {'add': !addedSubs.includes(result.name)}, result.name)}>
                  <Sub key={result.name} sub={result.name} clicked={false} />
                </div>))
              : status === 'loading'
                ? <p>Loading...</p>
                : <p>No results found.</p>
          }
        </div>
      )}
    </>
    
  )
}