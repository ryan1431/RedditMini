import { useCallback, useEffect, useRef, useState } from "react";
import { fetchFeed, setFeedPosts, setFetching, setQuery } from "../reducers/querySlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { base } from "../../utility/data";
import { Subreddit } from "../../types";
import { useDebounce } from "./useDebounce";
import { PostType } from "../../utility";

export type SortField = 'best' | 'hot' | 'new' | 'top' | 'rising';
export type FeedField = 'home' | 'custom' | 'saved';

export const useFeed = (isVisible: boolean) => {
  const dispatch = useAppDispatch();

  const savedPosts = useAppSelector((state) => state.saved.savedPosts);
  const { feed, sort } = useAppSelector((state) => state.query);
  const subs = useAppSelector((state) => state.subreddits.subs);
  const feedPosts = useAppSelector((state) => state.query.feedPosts);

  const currentUrl = useRef<string>('');
  const subsRef = useRef<Subreddit[]>(subs);

  const [userFeed, setUserFeed] = useState<PostType[]>(feedPosts);

  // Use debounce to lower amount of unneccessary fetch requests
  const [subsDebounced, setSubsDebounced] = useState<Subreddit[]>([...subs]);
  const [feedDebounced, setFeedDebounced] = useState<string>(feed);
  const [sortDebounced, setSortDebounced] = useState<string>(sort);

  useDebounce(() => {
    setSubsDebounced([...subs]);
  }, 500, [subs])
  useDebounce(() => {
    if (feed === feedDebounced && sort === sortDebounced) return;
    setFeedDebounced(feed);
    setSortDebounced(sort);
    dispatch(setFeedPosts([]));
  }, 200, [feed, sort]);

  useEffect(() => {
    if (feedDebounced === feed && sortDebounced === sort) {
      setUserFeed(feedPosts);
    }
  }, [feed, feedDebounced, feedPosts, sort, sortDebounced]);

  useEffect(() => {
    setUserFeed(feedPosts);
  }, [feedPosts]);

  useEffect(() => {
    if (feedDebounced === 'custom') {
      dispatch(setQuery(['after', '']));
    }
  }, [subs, dispatch, feedDebounced]);

  useEffect(() => {
    if (subsDebounced.length !== subsRef.current.length && feedDebounced !== 'custom') {
      subsRef.current = subsDebounced;
      return;
    };
    if (feedDebounced === 'saved') return;
    if (feedDebounced === 'custom') {
      subsRef.current = subsDebounced;
      if (!subsDebounced.length) {
        dispatch(setFeedPosts([]));
        return;
      }
    }

    let url = base;
    if (feedDebounced === 'custom') {
      url += `r/${subsDebounced.map((s) => s.name).join('+')}/`;
    } 
    currentUrl.current = url + sortDebounced;

    dispatch(fetchFeed(currentUrl.current));
  }, [dispatch, feedDebounced, sortDebounced, subsDebounced]);

  // Set feed to saved posts
  useEffect(() => {
    if (feedDebounced === 'saved') {
      dispatch(setFeedPosts(savedPosts));
    }
  }, [savedPosts, feedDebounced, dispatch]);

  // Infinite scroll
  useEffect(() => {
    if (isVisible) {
      dispatch(setFetching(true));
      dispatch(fetchFeed(currentUrl.current));
    }
  }, [isVisible, dispatch]);

  const sortBy = useCallback(({target}:any) => {
    if (target.value === sort || target.value === feed) return;

    setUserFeed([]);
    dispatch(setQuery(['after', '']));
    dispatch(setQuery([target.classList[0], target.value]));
  }, [sort, feed, dispatch]);

  return {
    sortBy,
    savedPosts,
    userFeed,
  }
}