import { useCallback, useEffect, useMemo, useRef } from "react";
import { fetchFeed, setFeedPosts, setQuery } from "../reducers/querySlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { base } from "../../utility/data";

export type SortField = 'best' | 'hot' | 'new' | 'top' | 'rising';
export type FeedField = 'home' | 'custom' | 'saved';

export const useFeed = (isVisible: boolean) => {
  const dispatch = useAppDispatch();

  const savedPosts = useAppSelector((state) => state.saved.savedPosts);
  const { feed, sort } = useAppSelector((state) => state.query);
  const subs = useAppSelector((state) => state.subreddits.subs);

  const currentUrl = useRef<string>('');

  const srNames = useMemo<string[]>(() => subs.map((s) => s.name), [subs]);

  useEffect(() => {
    if (feed === 'saved') {
      dispatch(setFeedPosts(savedPosts));
      return;
    } else if (feed === 'custom' && !srNames.length) {
      dispatch(setFeedPosts([]));
      return;
    }
    let url = base + ((feed === 'custom' && `r/${srNames.join('+')}/`) || '');
    currentUrl.current = url + sort;
    
    dispatch(fetchFeed(currentUrl.current));
  }, [dispatch, feed, savedPosts, sort, srNames]);

  // Infinite scroll
  useEffect(() => {
    if (isVisible) dispatch(fetchFeed(currentUrl.current));
  }, [isVisible, dispatch]);

  const sortBy = useCallback(({target}:any) => {
    if (target.value === sort || target.value === feed) return;

    dispatch(setQuery(['after', '']));
    dispatch(setFeedPosts([]));
    dispatch(setQuery([target.classList[0], target.value]));
  }, [sort, feed, dispatch]);

  return {
    sortBy,
    savedPosts,
    feed,
  }
}