import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { setQuery } from "../reducers/querySlice";
import { getFeedPosts, PostType } from "../../utility";
import { useAppDispatch, useAppSelector } from "./hooks";
import { base } from "../../utility/data";

export type SortField = 'best' | 'hot' | 'new' | 'top' | 'rising';
export type FeedField = 'home' | 'custom' | 'saved';

export const useFeed = (setFeedPosts: React.Dispatch<React.SetStateAction<PostType[]>>, isVisible: boolean) => {
  const dispatch = useAppDispatch();

  const searchQueries = useAppSelector((s) => s.query);
  const savedPosts = useAppSelector((state) => state.saved.savedPosts);
  const {after, feed, sort} = useAppSelector((state) => state.query);
  const subs = useAppSelector((state) => state.subreddits.subs);

  const [loading, setLoading] = useState<boolean>(true);
  const [sortField, setSortField] = useState<SortField>(searchQueries.sort as SortField);
  const [feedField, setFeedField] = useState<FeedField>(searchQueries.feed as FeedField);
  const [adding, setAdding] = useState<boolean>(false);

  // Prevent useEffect loop
  const srNames = useMemo<string[]>(() => subs.map((s) => s.name), [subs]);

  const currentUrl = useRef<string>('');
  const timeoutQueue = useRef<NodeJS.Timeout[]>([]);
  
  
  // Change sort/feed state
  const sortBy = useCallback(({target}:any) => {
    let type = target.classList[0];

    // Button is already clicked
    if ((type === 'sort' && target.value === sortField) || 
       (type === 'feed' && target.value === feedField)) return;

    setFeedPosts([]);
    timeoutQueue.current.forEach((t) => clearTimeout(t));
    timeoutQueue.current = [];

    (type === 'sort')
      ? setSortField(target.value)
      : setFeedField(target.value);
      
    dispatch(setQuery([target.value, type]));
    setLoading(true);
  }, [sortField, feedField, setFeedPosts, timeoutQueue, dispatch]);

  useEffect(() => {
    if (adding || !loading) return;
    if (feed === 'saved') {
      setFeedPosts(savedPosts);
      setLoading(false);
      return;
    } else if (feed === 'custom' && !srNames.length) {
      setLoading(false);
      return;
    }

    let url = base + ((feed === 'custom' && `r/${srNames.join('+')}/`) || '');
    currentUrl.current = url + sort;

    // Fetch posts
    getFeedPosts(`${currentUrl.current}?limit=10`)
    .then((res) => {
      setFeedPosts(res.posts);
      if (res.after) {
        dispatch(setQuery([res.after, 'after']));
      }
      timeoutQueue.current.push(setTimeout(() => {
        setLoading(false);
      }, 3000));
    });
  }, [adding, dispatch, feed, loading, savedPosts, setFeedPosts, sort, srNames]);

  // Infinite scroll
  useEffect(() => {
    if (isVisible) {
      setLoading(true);
      setAdding(true);
      getFeedPosts(`${currentUrl.current}?limit=10&after=${after}`)
        .then((res) => {
          setFeedPosts((prev) => [...prev, ...res.posts]);
          if (res.after) {
            dispatch(setQuery([res.after, 'after']));
          }
          timeoutQueue.current.push(setTimeout(() => {
            setLoading(false);
            setAdding(false);
          }, 3000))
      })
    }
  }, [isVisible, after, dispatch, setFeedPosts]);

  return {
    sortBy,
    savedPosts,
    loading,
    feed,
    feedField,
    sortField,
  }
}