import { useEffect, useState } from 'react';
import './Feed.css';

import { Post } from './feed/Post';


const samplePosts = [
  'https://www.reddit.com/r/interestingasfuck/comments/y41z91/shabani_the_gorilla_trying_to_approach_ai_one_of/',
  'https://www.reddit.com/r/suggestmeabook/comments/y3uhib/wellwritten_female_fantasy_characters/',
  'https://www.reddit.com/r/TooAfraidToAsk/comments/xybq61/what_does_it_mean_when_you_feel_like_you_are/',
  'https://www.reddit.com/r/buildapc/comments/xyd4kp/will_this_case_and_pc_run_too_hot/',
  'https://www.reddit.com/r/suggestmeabook/comments/xy102q/books_that_shifted_your_perspective_gave_you_a/',
  'https://www.reddit.com/r/NoStupidQuestions/comments/xybqbk/need_some_advice_on_my_indecisiveness_and/',
  'https://www.reddit.com/r/TooAfraidToAsk/comments/xybq61/what_does_it_mean_when_you_feel_like_you_are/',
  'https://www.reddit.com/r/buildapc/comments/xyd4kp/will_this_case_and_pc_run_too_hot/',
  'https://www.reddit.com/r/suggestmeabook/comments/xy102q/books_that_shifted_your_perspective_gave_you_a/',
];


export const Feed = () => {

  const [postUrls, setPostUrls] = useState<string[]>([]);

  useEffect(() => {
    setPostUrls(samplePosts);
  }, [])

  return (
    <div id="feed">
      {postUrls.map(post => {
        return <Post postUrl={post} key={post}/> 
      })}
    </div>
  )
}