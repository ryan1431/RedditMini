import { useEffect, useState } from 'react';
import { getFeedPosts, PostType } from '../../utility';
import './Feed.css';

import { Post } from './Post';

/* outlier posts
https://www.reddit.com/r/leagueoflegends/comments/ybzh2z/drx_vs_edward_gaming_2022_world_championship/


t5_2qnwb
t5_2qhx4

https://www.reddit.com/wiki/rss/

/r/interestingasfuck+wtf+home.json

 r/subreddits/search?q=${query}&sort=hot
*/


const samplePosts = [
  'https://www.reddit.com/r/interestingasfuck/comments/y41z91/shabani_the_gorilla_trying_to_approach_ai_one_of/',
  'https://www.reddit.com/r/suggestmeabook/comments/y3uhib/wellwritten_female_fantasy_characters/',
  'https://www.reddit.com/r/TooAfraidToAsk/comments/xybq61/what_does_it_mean_when_you_feel_like_you_are/',
  'https://www.reddit.com/r/MadeMeSmile/comments/y9ph5o/today_i_celebrate_one_thousand_days_sober_they/',
  'https://www.reddit.com/r/simpleliving/comments/y9njjm/if_you_could_go_back_in_time_and_not_change_a/',
];


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