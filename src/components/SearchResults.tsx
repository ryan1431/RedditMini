import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { getSubreddits, setLoading } from '../features/subredditsSlice';
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
  const {searchResults: results, searchStatus: status} = useAppSelector((state) => state.subreddits);

  useEffect(() => {
    if (query.length < 3) {
      dispatch(setLoading('idle'));
      return;
    };

    dispatch(getSubreddits(query));
  }, [query, dispatch]);

  return (
    <>
      {inSearch && (
        <div className="search-results">
          {
          searchInput.length < 3 
            ? <p>Start typing to begin search.</p>
            : status === 'idle' && results.length
              ? results.map((result: Subreddit) => <Sub key={result.name} sub={result.name} clicked={false} />)
              : status === 'loading'
                ? <p>Loading...</p>
                : <p>No results found.</p>
          }
        </div>
      )}
    </>
    
  )
}