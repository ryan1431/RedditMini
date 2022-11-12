import React, { useCallback, useEffect, useMemo, useState } from "react";
import { setQuery } from "../reducers/querySlice";
import { getFeedPosts, PostType } from "../../utility";
import { base } from "../../utility/data";
import { useAppDispatch, useAppSelector } from "./hooks";

export type SortField = 'best' | 'hot' | 'new' | 'top' | 'rising';
export type FeedField = 'home' | 'custom' | 'saved';

export const useFeed = (setFeedPosts: React.Dispatch<React.SetStateAction<PostType[]>>, isVisible: boolean) => {
  const dispatch = useAppDispatch();

  const searchQueries = useAppSelector((s) => s.query);
  const savedPosts = useAppSelector((state) => state.saved.savedPosts);
  const {after, feed, sort} = useAppSelector((state) => state.query);
  const subs = useAppSelector((state) => state.subreddits.subs);

  const [loading, setLoading] = useState<boolean>(true);
  const [currentUrl, setCurrentUrl] = useState<string>(base);
  const [sortField, setSortField] = useState<SortField>(searchQueries.sort as SortField);
  const [feedField, setFeedField] = useState<FeedField>(searchQueries.feed as FeedField);
  const [adding, setAdding] = useState<boolean>(false);
  
  const srNames = useMemo<string[]>(() => {
    return subs.map((sub) => sub.name);
  }, [subs])

  // Change sort query (handler)
  const sortBy = useCallback(({target}:any) => {
    let type = target.classList[0];

    // Don't update when clicking already active button
    if ((type === 'sort' && target.value === sortField) || 
       (type === 'feed' && target.value === feedField)) return;

    // Clear feed & set respective field
    setFeedPosts([]);
    (type === 'sort')
      ? setSortField(target.value)
      : setFeedField(target.value);
      
    dispatch(setQuery([target.value, type]));
    setLoading(true);
  }, [dispatch, feedField, sortField, setFeedPosts]);

  useEffect(() => {
    let url = base;

    // Build url
    switch (feed) {
      case 'home':
        url += sort;
        break;
      case 'custom':
        if (!srNames.length) {
          setLoading(false);
          return;
        };
        url += `r/${srNames.join('+')}/${sort}`;
        break;
      case 'saved':
        if (loading) {
          setFeedPosts(savedPosts);
          setLoading(false);
        }
        return;
    }
    setCurrentUrl(url);

    if (!loading || adding) return;

    // Fetch posts
    getFeedPosts(`${url}?limit=10`)
    .then((res) => {
      setFeedPosts(res.posts);
      if (res.after) {
        dispatch(setQuery([res.after, 'after']));
      }
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    });
  }, [adding, dispatch, feed, loading, savedPosts, setFeedPosts, sort, srNames]);

  // Infinite scroll
  useEffect(() => {
    if (isVisible) {
      setLoading(true);
      setAdding(true);
      getFeedPosts(`${currentUrl}?limit=10&after=${after}`)
        .then((res) => {
          setFeedPosts((prev) => [...prev, ...res.posts]);
          if (res.after) {
            dispatch(setQuery([res.after, 'after']));
          }
          setTimeout(() => {
            setLoading(false);
            setAdding(false);
          }, 5000)
      })
    }
  }, [isVisible, after, dispatch, currentUrl, setFeedPosts]);

  return {
    sortBy,
    savedPosts,
    loading,
    feed,
    feedField,
    sortField,
  }
}