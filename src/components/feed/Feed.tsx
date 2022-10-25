import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAfter, 
  selectFeed, 
  selectSort, 
  selectSubreddits,
  setQuery,
} from '../../features/querySlice';
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
  
  const after = useAppSelector(selectAfter);
  const feed = useAppSelector(selectFeed);
  const sort = useAppSelector(selectSort);
  const subs = useAppSelector(selectSubreddits);


  // Change sort query
  const sortBy = useCallback(({target}:any) => {
    if (target.classList.contains('active')) return;
    setFeedPosts([])

    let type = target.classList[0];
    document.querySelector(`.${type}.active`)?.classList.toggle('active');
    target.classList.toggle('active');
    dispatch(setQuery([target.value, type]));

    if (type === 'feed') {
      // cause rerender
    }
  }, []);

  const getPosts = async (url:string) => {
    return await getFeedPosts(url);
  }

  useEffect(() => {
    if (feed === 'saved') {
      // to be implemented
      return;
    }

    try {
      setCurrentUrl(buildUrl(feed, subs, after, sort));
    } catch(e) {
      if (e instanceof Error) {
        if (e.message === 'nosub') {
          return setFeedPosts([]);
        }
      } 
      console.log(e);
    }
    
    getPosts(currentUrl)
      .then((res) => {
        setFeedPosts(res.posts);
        dispatch(setQuery([res.after, 'after']));
    })
  }, [feed, sort])

  useEffect(() => {
    let scroll = (ev: Event) => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // at bottom
      }
    };  

    window.addEventListener('scroll', scroll)
    
    return () => {
      window.removeEventListener('scroll', scroll);
    }
  }, [])

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
        return <Post post={post} key={post.title} />;
      }) : <div className='post'><p style={{display: 'flex', justifyContent: 'center'}}>There are no posts to display! Add some subreddits in the subreddit pane.</p></div>
      }
    </div>
  )
}