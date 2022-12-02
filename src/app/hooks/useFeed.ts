import { useCallback, useEffect, useRef, useState } from "react";
import { clearCachedPosts, fetchFeed, setFeedPosts, setLastRequest, SetQuery, setQuery } from "../reducers/querySlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { base } from "../../utility/data";
import { Subreddit } from "../../types";
import { useDebounce } from "./useDebounce";
import { Sort } from "../../types/querySliceTypes";

export type SortField = 'best' | 'hot' | 'new' | 'top' | 'rising';
export type FeedField = 'home' | 'custom' | 'saved';

export const useFeed = (isVisible: boolean) => {
  const dispatch = useAppDispatch();

  const savedPosts = useAppSelector((state) => state.saved.savedPosts);
  const { feed, sort } = useAppSelector((state) => state.query);
  const subs = useAppSelector((state) => state.subreddits.in_storage.subs);
  const cachedPosts = useAppSelector(s => s.query.cachedPosts);

  const currentUrl = useRef<string>('');
  const subsRef = useRef<Subreddit[]>(subs);
  const canLoadCached = useRef<boolean>(true);

  const [subsDebounced, setSubsDebounced] = useState<Subreddit[]>([...subs]);

  useDebounce(() => {
    setSubsDebounced([...subs]);
  }, 500, [subs])

  // Clear cache when changing feed or followed subs
  useEffect(() => {
    dispatch(clearCachedPosts());
  }, [dispatch, feed, subs]);

  // Prevent loading from cache for 1s after changing feed 
  const cacheTimeoutRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    clearTimeout(cacheTimeoutRef.current);
    canLoadCached.current = false;
    cacheTimeoutRef.current = setTimeout(() => {
      canLoadCached.current = true;
    }, 1000);
  }, [feed])

  // Load from cache if valid
  const feedRef = useRef<string>(feed);
  const loadedCache = useRef<boolean>(false);
  useEffect(() => {
    loadedCache.current = false;
    if (feed !== feedRef.current) {
      feedRef.current = feed;
      return;
    }

    if (canLoadCached.current) {
      const cache = cachedPosts[sort as Sort];
      if (cache.after) {
        loadedCache.current = true;
        dispatch(setQuery(['after', cache.after]));
        dispatch(setFeedPosts(cache.posts));
        return;
      }  
    }
  }, [cachedPosts, dispatch, feed, sort]);
  
  // Fetch feed
  useEffect(() => {
    dispatch(setLastRequest(true));
    
    if (subsDebounced.length !== subsRef.current.length && feed !== 'custom') {
      subsRef.current = subsDebounced;
      return;
    };
    if (feed === 'saved') return;
    if (feed === 'custom') {
      subsRef.current = subsDebounced;
      dispatch(setQuery(['after', '']));
      if (!subsDebounced.length) {
        dispatch(setFeedPosts([]));
        return;
      }
    }
    if (loadedCache.current) return;
    let url = base;
    if (feed === 'custom') {
      url += `r/${subsDebounced.map((s) => s.name).join('+')}/`;
    } 
    currentUrl.current = url + sort;

    console.log('fetching');
    dispatch(fetchFeed({url: currentUrl.current, feed, sort}));
    return () => {
      dispatch(setLastRequest(false))
    }
  }, [dispatch, feed, sort, subsDebounced]);

  // Load saved posts
  useEffect(() => {
    if (feed === 'saved') {
      dispatch(setFeedPosts(savedPosts));
    }
  }, [savedPosts, dispatch, feed]);

  // Infinite scroll
  useEffect(() => {
    if (isVisible) {
      dispatch(fetchFeed({url: currentUrl.current, feed, sort}));
    }
  }, [isVisible, dispatch, feed, sort]);

  // Clear feed and after query when changing feed / sort
  const sortBy = useCallback(([target, value]:[string, string]) => {
    if (value === sort || value === feed) return;

    dispatch(setFeedPosts([]));
    dispatch(setQuery(['after', '']));
    dispatch(setQuery([target as SetQuery, value]))
  }, [sort, feed, dispatch]);

  return {
    sortBy,
    savedPosts,
  }
}