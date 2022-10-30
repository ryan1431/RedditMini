import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx'
import { useAppDispatch, useAppSelector, useOnScreen } from '../../app/hooks/hooks';
import { selectAfter, 
  selectFeed, 
  selectSort, 
  selectSubreddits,
  setQuery,
} from '../../features/querySlice';
import { selectSaved } from '../../features/savedSlice';
import { buildUrl, fetchData, formatPost, formatUrl, getFeedPosts, getSavedPosts, PostType } from '../../utility';
import { base, feedFields, sortFields } from '../../utility/data';
import './Feed.css';

import { Post } from './Post';

/* 
https://www.reddit.com/wiki/rss/

problem: link not available
https://www.reddit.com/r/worldnews/comments/yd5yiz/brittney_griner_lost_appeal_will_serve_9_years_in/

/r/wtf+home.json

r/subreddits/search?q=${query}&sort=hot
*/
type SortField = 'best' | 'hot' | 'new' | 'top' | 'rising';
type FeedField = 'home' | 'custom' | 'saved';

export const Feed = () => {

  const dispatch = useAppDispatch();

  const [feedPosts, setFeedPosts] = useState<PostType[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string>(base);
  const [loading, setLoading] = useState<boolean>(true);

  const visRef:any = useRef();
  const isVisible = useOnScreen(visRef)
  
  const after = useAppSelector(selectAfter);
  const feed = useAppSelector(selectFeed);
  const sort = useAppSelector(selectSort);
  const subs = useAppSelector(selectSubreddits);

  const saved = useAppSelector(selectSaved);

  const [sortField, setSortField] = useState<SortField>('best');
  const [feedField, setFeedField] = useState<FeedField>('home');

  // Change sort query (handler)
  const sortBy = useCallback(({target}:any) => {
    setFeedPosts([]);

    let type = target.classList[0];

    (type === 'sort')
      ? setSortField(target.value)
      : setFeedField(target.value);
    
    dispatch(setQuery([target.value, type]));
  }, []);

  const getPosts = async (url:string) => {
    return await getFeedPosts(url);
  }

  useEffect(() => {
    let url = base;

    // Structure url according to selected feed (home / custom / saved)
    if (feed === 'home') {
      url += `${sort}`
    } else if (feed === 'custom') {
      if (!subs.length) return;
      url += `r/${subs.join('+')}/${sort}`
    } else if (feed === 'saved') {
      // to be added
      saved.forEach((url) => {
        fetchData(formatUrl(url))
          .then((res) => {
            let post = formatPost(res);
            if (post) {
              setFeedPosts((p) => [...p, post]);
            }
          });
      })
      return; 
    }
    setCurrentUrl(url);

    // Fetch posts
    getPosts(`${url}?limit=10`)
      .then((res) => {
        setFeedPosts(res.posts);
        if (res.after) {
          dispatch(setQuery([res.after, 'after']));
        }
        setTimeout(() => {
          setLoading(false);
        }, 5000)
    })
  }, [feed, sort]);

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
  }, [isVisible]);

  return (
    <div id="feed">
      {/* First card (sort by, feed) */}
      <section className='post'>
        <div className="query-buttons">
          {sortFields.map(([field, title]) => (
            <button onClick={sortBy} key={title} className={clsx('sort', { active: sortField === field })} value={field}>{title}</button>
          ))}
        </div>
        <footer className='feed-buttons'>
          {feedFields.map(([field, title]) => (
            <button onClick={sortBy} key={title} className={clsx('feed', { active: feedField === field })} value={field}>{title}</button>
          ))}
        </footer>
      </section>

      {/* Reddit content */}
      {feedPosts.length ? feedPosts.map(post => {
        return <Post post={post} key={'' + post.title + post.score + post.subreddit} />;
      }) : <div className='post'><p style={{display: 'flex', justifyContent: 'center'}}>{loading ? 'Loading...' : 'There are no posts to display!'}</p></div>
      }
      <div ref={visRef} style={{
        opacity: '0', 
        display: `${!loading && feedPosts.length && feed !== 'saved' ? 'block' : 'none'}`}}>invisibletext</div>
    </div>
  )
}         