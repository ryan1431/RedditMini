import { useCallback, useEffect, useRef } from "react";
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

  useEffect(() => {
    if (feed === 'custom') {
      dispatch(setQuery(['after', '']));
    }
  }, [subs, feed, dispatch]);

  useEffect(() => {
    if (feed === 'saved') return;
    if (feed === 'custom' && !subs.length) {
      dispatch(setFeedPosts([]));
      return;
    }

    let url = base;
    if (feed === 'custom') {
      url += `r/${subs.map((s) => s.name).join('+')}/`;
    } 
    currentUrl.current = url + sort;
    
    dispatch(fetchFeed(currentUrl.current));
  }, [dispatch, feed, sort, subs]);

  // Set feed to saved posts
  useEffect(() => {
    if (feed === 'saved') {
      dispatch(setFeedPosts(savedPosts));
    }
  }, [savedPosts, feed, dispatch]);

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