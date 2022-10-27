import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector, useOnScreen } from '../../app/hooks/hooks';
import { selectAfter, 
  selectFeed, 
  selectSort, 
  selectSubreddits,
  setQuery,
} from '../../features/querySlice';
import { selectSaved } from '../../features/savedSlice';
import { buildUrl, getFeedPosts, PostType } from '../../utility';
import { base } from '../../utility/data';
import './Feed.css';

import { Post } from './Post';

/* 
https://www.reddit.com/wiki/rss/

problem: link not available
https://www.reddit.com/r/worldnews/comments/yd5yiz/brittney_griner_lost_appeal_will_serve_9_years_in/

/r/wtf+home.json

r/subreddits/search?q=${query}&sort=hot
*/


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

  // Change sort query (handler)
  const sortBy = useCallback(({target}:any) => {
    if (target.classList.contains('active')) return;
    setFeedPosts([])

    let type = target.classList[0];
    document.querySelector(`.${type}.active`)?.classList.toggle('active');
    target.classList.toggle('active');
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
      console.log(saved);
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
          <button onClick={sortBy} className='sort active' value='best'>Best</button>
          <button onClick={sortBy} className='sort' value='hot'>Hot</button>
          <button onClick={sortBy} className='sort' value='new'>New</button>
          <button onClick={sortBy} className='sort' value='top'>Top</button>
          <button onClick={sortBy} className='sort' value='rising'>Rising</button>
        </div>
        <footer className='feed-buttons'>
          <button onClick={sortBy} className='feed active' value='home'>Home</button>
          <button onClick={sortBy} className='feed' value='custom'>Custom</button>
          <button onClick={sortBy} className='feed' value='saved'>Saved</button>
        </footer>
      </section>

      {/* Reddit content */}
      {feedPosts.length ? feedPosts.map(post => {
        return <Post post={post} key={'' + post.title + post.score + post.subreddit} />;
      }) : <div className='post'><p style={{display: 'flex', justifyContent: 'center'}}>There are no posts to display! Add some subreddits in the subreddit pane.</p></div>
      }
      <div ref={visRef} style={{
        opacity: '0', 
        display: `${!loading && feedPosts.length && feed !== 'saved' ? 'block' : 'none'}`}}>text</div>
    </div>
  )
}         