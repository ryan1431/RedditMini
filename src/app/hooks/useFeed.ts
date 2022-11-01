import React, { useCallback, useEffect, useState } from "react";
import { setQuery } from "../../features/querySlice";
import { getFeedPosts, fetchData, formatUrl, formatPost, PostType } from "../../utility";
import { base } from "../../utility/data";
import { useAppDispatch, useAppSelector } from "./hooks";

type SortField = 'best' | 'hot' | 'new' | 'top' | 'rising';
type FeedField = 'home' | 'custom' | 'saved';

export const useFeed = (setFeedPosts: React.Dispatch<React.SetStateAction<PostType[]>>, isVisible: boolean) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(true);
  const [currentUrl, setCurrentUrl] = useState<string>(base);

  const [sortField, setSortField] = useState<SortField>('best');
  const [feedField, setFeedField] = useState<FeedField>('home');

  const savedPosts = useAppSelector((state) => state.saved.refUrls);
  
  const {after, feed, sort, subreddits: subs} = useAppSelector((state) => state.query);

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

  const getPosts = async (url:string) => {
    return await getFeedPosts(url);
  }

  const setSaved = useCallback(() => {
    savedPosts.forEach((url) => {
      fetchData(formatUrl(url))
        .then((res) => {
          let post = formatPost(res);
          if (post) {
            setFeedPosts((p) => [...p, post]);
          }
        });
    })
  }, [savedPosts, setFeedPosts]);

  useEffect(() => {
    let url = base;

    // Structure url according to selected feed (home / custom / saved)
    switch (feed) {
      case 'home':
        url += sort;
        break;
      case 'custom':
        if (!subs.length) {
          setLoading(false);
          return;
        };
        url += `r/${subs.join('+')}/${sort}`;
        break;
      case 'saved':
        if (loading) {
          setSaved();
        }
        return;
    }
    setCurrentUrl(url);

    // Fetch posts
    if (loading) {
      getPosts(`${url}?limit=10`)
      .then((res) => {
        setFeedPosts(res.posts);
        if (res.after) {
          dispatch(setQuery([res.after, 'after']));
        }
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      });
    }
  }, [feed, sort, dispatch, subs, loading, setSaved, setFeedPosts]);

  // Infinite scroll
  useEffect(() => {
    if (isVisible) {
      setLoading(true);
      getPosts(`${currentUrl}?limit=10&after=${after}`)
        .then((res) => {
          setFeedPosts((prev) => [...prev, ...res.posts]);
          console.log(res);
          if (res.after) {
            dispatch(setQuery([res.after, 'after']));
          }
          setTimeout(() => {
            setLoading(false);
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