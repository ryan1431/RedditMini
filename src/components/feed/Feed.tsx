import { useEffect, useState } from 'react';
import { getFeedPosts, PostType } from '../../utility';
import './Feed.css';

import { Post } from './Post';

/* 
https://www.reddit.com/wiki/rss/

problem: link not available
https://www.reddit.com/r/worldnews/comments/yd5yiz/brittney_griner_lost_appeal_will_serve_9_years_in/


/r/interestingasfuck+wtf+home.json

r/subreddits/search?q=${query}&sort=hot

structure: 
/r/todayilearned+wtf/new?limit=10&after=
default home ---> `${base}.json
customized ---> `${base}/r/${subs}/${type}?limit=10&after=${after}
*/


const base = 'https://www.reddit.com';

export const Feed = () => {

  const [feedPosts, setFeedPosts] = useState<PostType[]>([]);
  const [after, setAfter] = useState<string>('');
  const [feedType, setFeedType] = useState<string>('home');
  const [sort, setSort] = useState<string>('hot');
  const [subs, setSubs] = useState<string[]>(['askreddit']);

  const getPosts = async (url:string) => {
    return await getFeedPosts(url);
  }

  useEffect(() => {
    let url = base;
    // Home feed url
    if (feedType === 'home') {
      url += `/${sort}`

    // Custom (subreddits) mixed feed
    } else if (feedType === 'custom') {
      if (!subs.length) return setFeedPosts([]);
      url += `/r/${subs.join('+')}/${sort}`

    // Show saved posts
    } else if (feedType === 'saved') {
      // tbd
    }

    getPosts(`${url}?limit=10&after=${after}`)
      .then((res) => {
        setFeedPosts(res.posts);
        setAfter(res.after);
      })
    
  }, [feedType])

  return (
    <div id="feed">
      {feedPosts.length ? feedPosts.map(post => {
        return <Post post={post} key={post.title} />;
      }) : <div className='post'><p style={{display: 'flex', justifyContent: 'center'}}>There are no posts to display! Add some subreddits in the subreddit pane.</p></div>
      }
    </div>
  )
}