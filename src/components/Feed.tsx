import { useEffect, useState } from 'react';
import './Feed.css';

import { fetchData, formatJsonResponse, formatUrl } from '../utility';
import { Post } from './feed/Post';


const initialPosts = [
  'https://www.reddit.com/r/NoStupidQuestions/comments/xybqbk/need_some_advice_on_my_indecisiveness_and/',
  'https://www.reddit.com/r/AskReddit/comments/xybqbx/what_is_your_most_antsocial_history/',
  'https://www.reddit.com/r/TooAfraidToAsk/comments/xybq61/what_does_it_mean_when_you_feel_like_you_are/',
  'https://www.reddit.com/r/buildapc/comments/xyd4kp/will_this_case_and_pc_run_too_hot/',
];





export const Feed = () => {

  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchData(formatUrl(initialPosts[Math.floor(Math.random() * initialPosts.length)]))
      .then((res) => {
        const post = formatJsonResponse(res);
        setPosts([post.post]);
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <div id="feed">
      {posts.map(post => {
        return <Post post={post}/> 
      })}
    </div>
  )
}