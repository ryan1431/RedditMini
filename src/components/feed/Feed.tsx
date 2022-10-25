import { useEffect, useState } from 'react';
import { getFeedPosts, PostType } from '../../utility';
import './Feed.css';

import { Post } from './Post';

/* outlier posts



t5_2qnwb
t5_2qhx4

https://www.reddit.com/wiki/rss/

/r/interestingasfuck+wtf+home.json

 r/subreddits/search?q=${query}&sort=hot
*/





const defaultUrl = 'https://www.reddit.com/.json';

export const Feed = () => {

  const [feedPosts, setFeedPosts] = useState<PostType[]>([]);
  

  const getPosts = async (url:string) => {
    return await getFeedPosts(url);
  }

  useEffect(() => {
    // setFeedPosts(samplePosts);
    getPosts(defaultUrl)
      .then((res) => {
        setFeedPosts(res);
      })
  }, [])

  return (
    <div id="feed">
      {feedPosts.map(post => {
        return <Post post={post} key={post.title} />;
      })}
    </div>
  )
}



// image post:
// * preview.images[0].source.url       // cleaning required

// is image if media is empty && preview is truthy


// video post:
// media.reddit_video.fallback_url      // no cleaning needed

// is video if media is not empty