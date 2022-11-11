import clsx from 'clsx';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { addSubreddit, getSubreddits, removeSubreddit, setLoading } from '../app/reducers/subredditsSlice';
import { Subreddit } from '../types';
import './SearchResults.css';
import { Sub } from './sub/Sub';

interface SearchResultsProps {
  inSearch: boolean;
  searchQuery: string;
  searchInput: string;
}

export const SearchResults = ({inSearch, searchQuery, searchInput}:SearchResultsProps) => {
  const dispatch = useAppDispatch();
  const {searchResults: results, searchStatus: status, subs: addedSubs} = useAppSelector((state) => state.subreddits);

  useEffect(() => {
    if (searchQuery.length < 3) {
      dispatch(setLoading('idle'));
      return;
    };

    dispatch(getSubreddits(searchQuery));
  }, [searchQuery, dispatch]);

  const onMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = e.target;
    if (!(element instanceof HTMLDivElement)) return;
    if (!element.id) return;

    const name = element.id.split('-')[1];

    if (addedSubs.find((sub) => sub.name === name)) {
      dispatch(removeSubreddit(name));
    } else {
      dispatch(addSubreddit(results.find((sub) => sub.name === name)!));
    }
  }, [addedSubs, dispatch, results]);

  return (
    <>
      {inSearch && (
        <div className="search-results" onMouseUp={(onMouseUp)}>
          {
          searchInput.length < 3 
            ? <p>Enter a search of at least 3 characters.</p>
            : status === 'idle' && results.length
              ? results.map((result: Subreddit) => 
                (<div key={`sub-${result.name}`} id={`result-${result.name}`} style={{width: '100%'}} className={clsx('sub', {'add': !(addedSubs.some((sub) => sub.name === result.name))}, result.name)}>
                  <Sub key={result.name} sub={result} clicked={false} />
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