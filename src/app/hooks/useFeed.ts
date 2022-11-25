import { useCallback, useEffect, useRef, useState } from "react";
import { fetchFeed, setFeedPosts, setLastRequest, SetQuery, setQuery } from "../reducers/querySlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { base } from "../../utility/data";
import { Subreddit } from "../../types";
import { useDebounce } from "./useDebounce";

export type SortField = 'best' | 'hot' | 'new' | 'top' | 'rising';
export type FeedField = 'home' | 'custom' | 'saved';

export const useFeed = (isVisible: boolean) => {
  const dispatch = useAppDispatch();

  const savedPosts = useAppSelector((state) => state.saved.savedPosts);
  const { feed, sort } = useAppSelector((state) => state.query);
  const subs = useAppSelector((state) => state.subreddits.in_storage.subs);
  // const feedPosts = useAppSelector((state) => state.query.feedPosts);

  const currentUrl = useRef<string>('');
  const subsRef = useRef<Subreddit[]>(subs);

  const [subsDebounced, setSubsDebounced] = useState<Subreddit[]>([...subs]);
  useDebounce(() => {
    setSubsDebounced([...subs]);
  }, 500, [subs])

  // Main feed fetch
  useEffect(() => {
    dispatch(setLastRequest(true));
    
    console.log('fetch effect')
    if (subsDebounced.length !== subsRef.current.length && feed !== 'custom') {
      subsRef.current = subsDebounced;
      return;
    };
    if (feed === 'saved') return;
    if (feed === 'custom') {
      subsRef.current = subsDebounced;
      dispatch(setQuery(['after', '']));
      console.log('feed is custom');
      if (!subsDebounced.length) {
        console.log('clearing feedposts');
        dispatch(setFeedPosts([]));
        return;
      }
    }

    let url = base;
    if (feed === 'custom') {
      url += `r/${subsDebounced.map((s) => s.name).join('+')}/`;
    } 
    currentUrl.current = url + sort;

    dispatch(fetchFeed(currentUrl.current));

    return () => {
      dispatch(setLastRequest(false))
    }
  }, [dispatch, feed, sort, subsDebounced]);

  // Set feed to saved posts
  useEffect(() => {
    if (feed === 'saved') {
      dispatch(setFeedPosts(savedPosts));
    }
  }, [savedPosts, dispatch, feed]);

  // Infinite scroll
  useEffect(() => {
    if (isVisible) {
      dispatch(fetchFeed(currentUrl.current));
    }
  }, [isVisible, dispatch]);

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